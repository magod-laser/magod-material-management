/** @format */

const runningNoRouter = require("express").Router();
const { setupQueryMod } = require("../../helpers/dbconn");
const { logger, infoLogger, errorLogger } = require("../../helpers/logger");

runningNoRouter.get("/getRunningNoBySrlType", async (req, res, next) => {
  try {
    let SrlType = req.query.SrlType;
    let Period = req.query.Period;

    setupQueryMod(
      `Select * from magod_setup.magod_runningno where SrlType = "${SrlType}" and Period = "${Period}"`,

      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/updateRunningNoBySrlType", async (req, res, next) => {
  try {
    let { SrlType, Period, RunningNo } = req.body;
    setupQueryMod(
      `update magod_runningno set Running_No = "${RunningNo}" where  SrlType = "${SrlType}" and Period = "${Period}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

// New APIs getNewRunningNo, updateRunNo
runningNoRouter.get("/getNewRunningNo", async (req, res, next) => {
  let SrlType = req.query.SrlType;
  let Period = req.query.Period;
  let VoucherNoLength = req.query.VoucherNoLength;
  let ResetValue = req.query.ResetValue;
  let UnitName = req.query.UnitName;
  let ResetPeriod = req.query.ResetPeriod;

  const date = new Date();
  const year = date.getFullYear();
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const formattedStartDate = startDate.toISOString().slice(0, 10);
  const formattedEndDate = endDate.toISOString().slice(0, 10);

  try {
    const selectQuery = `
      SELECT COUNT(Id) FROM magod_setup.magod_runningno
      WHERE SrlType='${SrlType}' AND UnitName='${UnitName}' AND Period='${Period}'
    `;

    setupQueryMod(selectQuery, (selectError, selectResult) => {
      if (selectError) {
        logger.error(selectError);
        return next(selectError);
      }

      const count = selectResult[0]["COUNT(Id)"];

      if (count === 0) {
        // If no record exists, fetch prefix and suffix
        const selectPrefixQuery = `
          SELECT * FROM magod_setup.year_prefix_suffix
          WHERE SrlType='${SrlType}' AND UnitName='${UnitName}'
        `;

        setupQueryMod(selectPrefixQuery, (prefixError, prefixResult) => {
          if (prefixError) {
            logger.error(prefixError);
            return next(prefixError); // Returning actual error
          }

          const prefix = prefixResult[0]?.Prefix || "";
          const suffix = prefixResult[0]?.Suffix || "";

          // Insert the new record if count is 0
          const insertQuery = `
            INSERT INTO magod_setup.magod_runningno
            (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, Prefix, Suffix, Length, Period, Running_EffectiveDate)
            VALUES ('${UnitName}', '${SrlType}', '${ResetPeriod}', ${ResetValue}, '${formattedStartDate}', '${formattedEndDate}', ${ResetValue}, '${prefix}', '${suffix}', ${VoucherNoLength}, '${year}', CURDATE());
          `;

          setupQueryMod(insertQuery, (insertError, insertResult) => {
            if (insertError) {
              logger.error(insertError);
              return next(insertError);
            }

            // Fetch the newly inserted Running_No
            const selectRunningNoQuery = `
              SELECT * FROM magod_setup.magod_runningno
              WHERE SrlType='${SrlType}' AND UnitName='${UnitName}'
              ORDER BY Id DESC LIMIT 1;
            `;

            setupQueryMod(
              selectRunningNoQuery,
              (runningNoError, runningNoResult) => {
                if (runningNoError) {
                  logger.error(runningNoError);
                  return next(runningNoError);
                }

                // Return the newly inserted Running_No
                const runningNo = runningNoResult[0]?.Running_No || null;
                res.json({
                  message: "Record inserted successfully.",
                  runningNo: runningNo,
                  runningNoResult: runningNoResult,
                });
              }
            );
          });
        });
      } else {
        // If record already exists, fetch the latest Running_No
        const selectRunningNoQuery = `
          SELECT * FROM magod_setup.magod_runningno
          WHERE SrlType='${SrlType}' AND UnitName='${UnitName}'
          ORDER BY Id DESC LIMIT 1;
        `;

        setupQueryMod(
          selectRunningNoQuery,
          (runningNoError, runningNoResult) => {
            if (runningNoError) {
              logger.error(runningNoError);
              return next(runningNoError);
            }

            // Return the existing Running_No from the query
            const runningNo = runningNoResult[0]?.Running_No || null;

            res.json({
              message: "Record already exists.",
              runningNo: runningNo,
              runningNoResult: runningNoResult,
            });
          }
        );
      }
    });
  } catch (error) {
    logger.error(error);
    next(error);
  }
});

runningNoRouter.post("/updateRunNo", async (req, res, next) => {
  try {
    let { SrlType, Period, RunningNo, UnitName } = req.body;

    const prefixQuery = `
      SELECT Prefix, Suffix FROM magod_setup.year_prefix_suffix
      WHERE SrlType='${SrlType}' AND UnitName='${UnitName}'
    `;

    setupQueryMod(prefixQuery, async (prefixError, prefixResult) => {
      if (prefixError) {
        logger.error(prefixError);
        return next(prefixError);
      }

      const prefix =
        prefixResult[0]?.Prefix !== null ? prefixResult[0]?.Prefix : "";
      const suffix =
        prefixResult[0]?.Suffix !== null ? prefixResult[0]?.Suffix : "";

      // Once prefix and suffix are fetched, update the running number
      const updateQuery = `
        UPDATE magod_runningno
        SET Running_No = "${RunningNo}", Prefix = "${prefix}", Suffix = "${suffix}"
        WHERE SrlType = "${SrlType}" AND Period = "${Period}"
      `;

      setupQueryMod(updateQuery, (err, data) => {
        if (err) {
          logger.error(err);
          return next(err);
        }

        res.send(data);
      });
    });
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/insertRunningNo", async (req, res, next) => {
  try {
    setupQueryMod(
      `INSERT INTO magod_setup.magod_runningno
        (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, UnitIntial, Prefix, Suffix, Length, DerivedFrom, Period, Running_EffectiveDate)
      VALUES
      ('${req.body.UnitName}', '${req.body.SrlType}', '${
        req.body.ResetPeriod
      }', '${req.body.ResetValue || 0}', '${req.body.EffectiveFrom_date}', '${
        req.body.Reset_date
      }', '${req.body.Running_No}', '${req.body.UnitIntial}', '${
        req.body.Prefix || ""
      }', '${req.body.Suffix || ""}', '${req.body.Length || 4}', '${
        req.body.DerivedFrom || 0
      }', '${req.body.Period || ""}', now())`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/getAndInsertRunningNo", async (req, res, next) => {
  try {
    setupQueryMod(
      `Select * from magod_setup.magod_runningno where SrlType = "${req.body.SrlType}" and Period = "${req.body.Period}" and UnitName="${req.body.UnitName}"`,
      (err, data) => {
        if (err) {
          logger.error(err);
        } else {
          if (data.length > 0) {
            res.send(data);
          } else {
            try {
              setupQueryMod(
                `INSERT INTO magod_setup.magod_runningno
                  (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, UnitIntial, Prefix, Suffix, Length, DerivedFrom, Period, Running_EffectiveDate)
                VALUES
                ('${req.body.UnitName}', '${req.body.SrlType}', '${
                  req.body.ResetPeriod || "Year"
                }', '${req.body.ResetValue || 0}', '${
                  req.body.EffectiveFrom_date
                }', '${req.body.Reset_date}', '${req.body.Running_No || 0}', '${
                  req.body.UnitIntial || 0
                }', '${req.body.Prefix || ""}', '${req.body.Suffix || ""}', '${
                  req.body.Length || 4
                }', '${req.body.DerivedFrom || 0}', '${
                  req.body.Period || 0
                }', now())`,
                (err, insertData) => {
                  if (err) {
                    logger.error(err);
                  } else {
                    try {
                      setupQueryMod(
                        `Select * from magod_setup.magod_runningno where Id = '${insertData.insertId}'`,
                        (err, selectData) => {
                          if (err) {
                            logger.error(err);
                          } else {
                            res.send(selectData);
                          }
                        }
                      );
                    } catch (error) {
                      next(error);
                    }
                  }
                }
              );
            } catch (error) {
              next(error);
            }
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

// Insert a running number row
runningNoRouter.post("/insertRunNoRow", async (req, res, next) => {
  const { unit, srlType, ResetPeriod, ResetValue, VoucherNoLength } = req.body;

  const date = new Date();
  const year = date.getFullYear();

  const YearStartDate = new Date(`${year}-01-01`);
  const YearEndDate = new Date(`${year}-12-31`);

  const formattedStartDate = YearStartDate.toISOString().slice(0, 10);
  const formattedEndDate = YearEndDate.toISOString().slice(0, 10);

  infoLogger.info("Requested insert for running number row", {
    endpoint: "/insertRunNoRow",
    method: req.method,
    unit,
    srlType,
    year,
  });

  try {
    const selectQuery = `
      SELECT COUNT(Id) AS count
      FROM magod_setup.magod_runningno
      WHERE SrlType = ? AND UnitName = ? AND Period = ?
    `;

    const selectValues = [srlType, unit, year];

    setupQueryMod(selectQuery, selectValues, (selectError, selectResult) => {
      if (selectError) {
        errorLogger.error("Error selecting running number row", selectError, {
          endpoint: "/insertRunNoRow",
          unit,
          srlType,
          year,
        });
        return next(selectError);
      }

      const count = selectResult[0].count;

      if (count === 0) {
        const insertQuery = `
          INSERT INTO magod_setup.magod_runningno
          (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, Length, Period, Running_EffectiveDate)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
        `;

        const insertValues = [
          unit,
          srlType,
          ResetPeriod,
          ResetValue,
          formattedStartDate,
          formattedEndDate,
          ResetValue,
          VoucherNoLength,
          year,
        ];

        setupQueryMod(
          insertQuery,
          insertValues,
          (insertError, insertResult) => {
            if (insertError) {
              errorLogger.error(
                "Error inserting running number row",
                insertError,
                {
                  endpoint: "/insertRunNoRow",
                  unit,
                  srlType,
                  year,
                }
              );
              return next(insertError);
            }

            infoLogger.info("Successfully inserted running number row", {
              endpoint: "/insertRunNoRow",
              unit,
              srlType,
              year,
              recordsAffected: insertResult.affectedRows,
            });

            res.json({ message: "Record inserted successfully." });
          }
        );
      } else {
        infoLogger.info("Running number row already exists", {
          endpoint: "/insertRunNoRow",
          unit,
          srlType,
          year,
        });
        res.json({ message: "Record already exists." });
      }
    });
  } catch (error) {
    errorLogger.error("Unexpected error in insertRunNoRow", error, {
      endpoint: "/insertRunNoRow",
      unit,
      srlType,
      year,
    });
    next(error);
  }
});

runningNoRouter.post("/insertAndGetRunningNo", async (req, res, next) => {
  let Running_No = 0;

  const todayDate = new Date();

  let finYear = `${
    (todayDate.getMonth() + 1 < 4
      ? todayDate.getFullYear() - 1
      : todayDate.getFullYear()
    )
      .toString()
      .slice(-2) +
    "/" +
    (todayDate.getMonth() + 1 < 4
      ? todayDate.getFullYear()
      : todayDate.getFullYear() + 1
    )
      .toString()
      .slice(-2)
  }`;

  let Period = `${todayDate.getFullYear()}`;

  try {
    setupQueryMod(
      `SELECT 
            *
          FROM
            magod_setup.magod_runningno
          WHERE
            UnitName = '${req.body.unitName}' AND SrlType = '${req.body.srlType}'
            AND ResetPeriod = '${req.body.ResetPeriod}'
            AND Period = '${req.body.Period}'`,
      (err, selectRN1) => {
        if (err) {
          logger.error(err);
        } else {
          if (selectRN1.length === 0) {
            try {
              setupQueryMod(
                `SELECT 
                      *
                    FROM
                        magod_setup.year_prefix_suffix
                    WHERE
                        UnitName = '${req.body.unitName}' AND SrlType = '${req.body.srlType}'`,
                (err, selectYearPrefixSuffix) => {
                  if (err) {
                    logger.error(err);
                  } else {
                    setupQueryMod(
                      `INSERT INTO magod_setup.magod_runningno
                            (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, Prefix, Suffix, Length, Period, Running_EffectiveDate)
                          VALUES
                            ('${selectYearPrefixSuffix[0].UnitName || ""}', '${
                        selectYearPrefixSuffix[0].SrlType || ""
                      }', '${req.body.ResetPeriod || ""}', '${
                        req.body.ResetValue || 0
                      }', '${req.body.EffectiveFrom_date}', '${
                        req.body.Reset_date
                      }', '${Running_No}', '${
                        selectYearPrefixSuffix[0].Prefix || ""
                      }', '${selectYearPrefixSuffix[0].Suffix || ""}', '${
                        req.body.Length || 5
                      }', '${req.body.Period || ""}', now())`,
                      (err, insertRunningNo) => {
                        if (err) {
                          logger.error(err);
                        } else {
                          setupQueryMod(
                            `SELECT * FROM magod_setup.magod_runningno WHERE Id = ${insertRunningNo.insertId}`,
                            (err, selectRunningNo) => {
                              if (err) {
                                logger.error(err);
                              } else {
                                res.send({
                                  runningNoData: selectRunningNo[0],
                                  message: "running no inserted",
                                });
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            } catch (error) {
              next(error);
            }
          } else {
            res.send({
              runningNoData: selectRN1[0],
              message: "fechted running no",
            });
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/getAndUpdateRunningNo", async (req, res, next) => {
  try {
    setupQueryMod(
      `SELECT 
          *
        FROM
          magod_setup.year_prefix_suffix
        WHERE
          UnitName = '${req.body.runningNoData.UnitName}' AND SrlType = '${req.body.runningNoData.SrlType}'`,
      (err, yearPrefixSuffixData) => {
        if (err) {
          logger.error(err);
        } else {
          setupQueryMod(
            `UPDATE magod_setup.magod_runningno SET Running_No = '${parseInt(
              req.body.newRunningNo
            )}', Prefix = '${
              yearPrefixSuffixData[0].Prefix || ""
            }', Suffix = '${
              yearPrefixSuffixData[0].Suffix || ""
            }' WHERE (Id = '${req.body.runningNoData.Id}')`,
            (err, updateRunningNo) => {
              if (err) {
                logger.error(err);
              } else {
                res.send({
                  flag: true,
                  message: "running updated",
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = runningNoRouter;
