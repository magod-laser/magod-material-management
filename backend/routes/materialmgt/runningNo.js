const runningNoRouter = require("express").Router();
const { setupQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch running number by SrlType and Period
runningNoRouter.get("/getRunningNoBySrlType", async (req, res, next) => {
  const { SrlType, Period } = req.query;

  infoLogger.info("Requested running number by SrlType and Period", {
    endpoint: "/getRunningNoBySrlType",
    method: "GET",
    SrlType,
    Period,
  });

  try {
    setupQueryMod(
      `SELECT * FROM magod_setup.magod_runningno WHERE SrlType = ? AND Period = ?`,
      [SrlType, Period],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching running number", err, {
            endpoint: "/getRunningNoBySrlType",
            SrlType,
            Period,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched running number successfully", {
          endpoint: "/getRunningNoBySrlType",
          SrlType,
          Period,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching running number", error, {
      endpoint: "/getRunningNoBySrlType",
      SrlType,
      Period,
    });
    next(error);
  }
});

// Update running number by SrlType and Period
runningNoRouter.post("/updateRunningNoBySrlType", async (req, res, next) => {
  const { SrlType, Period, RunningNo } = req.body;

  infoLogger.info("Requested update of running number", {
    endpoint: "/updateRunningNoBySrlType",
    method: "POST",
    SrlType,
    Period,
    RunningNo,
  });

  try {
    setupQueryMod(
      `UPDATE magod_setup.magod_runningno SET Running_No = ? WHERE SrlType = ? AND Period = ?`,
      [RunningNo, SrlType, Period],
      (err, data) => {
        if (err) {
          errorLogger.error("Error updating running number", err, {
            endpoint: "/updateRunningNoBySrlType",
            SrlType,
            Period,
            RunningNo,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Updated running number successfully", {
          endpoint: "/updateRunningNoBySrlType",
          SrlType,
          Period,
          RunningNo,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error updating running number", error, {
      endpoint: "/updateRunningNoBySrlType",
      SrlType,
      Period,
      RunningNo,
    });
    next(error);
  }
});

// New APIs getNewRunningNo, updateRunNo
// Fetch or create a new running number (with parameterized queries)
runningNoRouter.get("/getNewRunningNo", async (req, res, next) => {
  const {
    SrlType,
    Period,
    VoucherNoLength,
    ResetValue,
    UnitName,
    ResetPeriod,
  } = req.query;

  infoLogger.info("Request received for new running number", {
    endpoint: "/getNewRunningNo",
    method: "GET",
    SrlType,
    Period,
    VoucherNoLength,
    ResetValue,
    UnitName,
    ResetPeriod,
  });

  const date = new Date();
  const year = date.getFullYear();
  const formattedStartDate = new Date(`${year}-01-01`)
    .toISOString()
    .slice(0, 10);
  const formattedEndDate = new Date(`${year}-12-31`).toISOString().slice(0, 10);

  try {
    const selectQuery = `
      SELECT COUNT(Id) AS count
      FROM magod_setup.magod_runningno
      WHERE SrlType = ? AND UnitName = ? AND Period = ?
    `;

    setupQueryMod(
      selectQuery,
      [SrlType, UnitName, Period],
      (selectError, selectResult) => {
        if (selectError) {
          errorLogger.error("Error counting running numbers", selectError, {
            endpoint: "/getNewRunningNo",
            SrlType,
            UnitName,
            Period,
          });
          return next(selectError);
        }

        const count = selectResult[0]?.count || 0;

        if (count === 0) {
          // Fetch prefix and suffix
          const selectPrefixQuery = `
          SELECT * FROM magod_setup.year_prefix_suffix
          WHERE SrlType = ? AND UnitName = ?
        `;

          setupQueryMod(
            selectPrefixQuery,
            [SrlType, UnitName],
            (prefixError, prefixResult) => {
              if (prefixError) {
                errorLogger.error(
                  "Error fetching prefix and suffix",
                  prefixError,
                  { endpoint: "/getNewRunningNo", SrlType, UnitName }
                );
                return next(prefixError);
              }

              const prefix = prefixResult[0]?.Prefix || "";
              const suffix = prefixResult[0]?.Suffix || "";

              // Insert new record
              const insertQuery = `
            INSERT INTO magod_setup.magod_runningno
            (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, Prefix, Suffix, Length, Period, Running_EffectiveDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())
          `;
              const insertValues = [
                UnitName,
                SrlType,
                ResetPeriod,
                ResetValue,
                formattedStartDate,
                formattedEndDate,
                ResetValue,
                prefix,
                suffix,
                VoucherNoLength,
                year,
              ];

              setupQueryMod(insertQuery, insertValues, (insertError) => {
                if (insertError) {
                  errorLogger.error(
                    "Error inserting new running number",
                    insertError,
                    { endpoint: "/getNewRunningNo", SrlType, UnitName }
                  );
                  return next(insertError);
                }

                // Fetch the newly inserted running number
                const selectRunningNoQuery = `
              SELECT * FROM magod_setup.magod_runningno
              WHERE SrlType = ? AND UnitName = ?
              ORDER BY Id DESC LIMIT 1
            `;

                setupQueryMod(
                  selectRunningNoQuery,
                  [SrlType, UnitName],
                  (runningNoError, runningNoResult) => {
                    if (runningNoError) {
                      errorLogger.error(
                        "Error fetching new running number",
                        runningNoError,
                        { endpoint: "/getNewRunningNo", SrlType, UnitName }
                      );
                      return next(runningNoError);
                    }

                    const runningNo = runningNoResult[0]?.Running_No || null;

                    infoLogger.info("New running number created successfully", {
                      endpoint: "/getNewRunningNo",
                      SrlType,
                      UnitName,
                      RunningNo: runningNo,
                    });

                    res.json({
                      message: "Record inserted successfully.",
                      runningNo,
                      runningNoResult,
                    });
                  }
                );
              });
            }
          );
        } else {
          // Fetch existing running number
          const selectRunningNoQuery = `
          SELECT * FROM magod_setup.magod_runningno
          WHERE SrlType = ? AND UnitName = ?
          ORDER BY Id DESC LIMIT 1
        `;

          setupQueryMod(
            selectRunningNoQuery,
            [SrlType, UnitName],
            (runningNoError, runningNoResult) => {
              if (runningNoError) {
                errorLogger.error(
                  "Error fetching existing running number",
                  runningNoError,
                  { endpoint: "/getNewRunningNo", SrlType, UnitName }
                );
                return next(runningNoError);
              }

              const runningNo = runningNoResult[0]?.Running_No || null;

              infoLogger.info("Existing running number fetched successfully", {
                endpoint: "/getNewRunningNo",
                SrlType,
                UnitName,
                RunningNo: runningNo,
              });

              res.json({
                message: "Record already exists.",
                runningNo,
                runningNoResult,
              });
            }
          );
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in getNewRunningNo", error, {
      endpoint: "/getNewRunningNo",
      SrlType,
      UnitName,
    });
    next(error);
  }
});

// Update Running_No in magod_runningno with prefix and suffix
runningNoRouter.post("/updateRunNo", async (req, res, next) => {
  const { SrlType, Period, RunningNo, UnitName } = req.body;

  infoLogger.info("Request received to update running number", {
    endpoint: "/updateRunNo",
    method: req.method,
    payload: { SrlType, Period, RunningNo, UnitName },
  });

  try {
    const prefixQuery = `
      SELECT Prefix, Suffix 
      FROM magod_setup.year_prefix_suffix
      WHERE SrlType = ? AND UnitName = ?
    `;

    setupQueryMod(
      prefixQuery,
      [SrlType, UnitName],
      (prefixError, prefixResult) => {
        if (prefixError) {
          errorLogger.error("Error fetching prefix and suffix", prefixError, {
            endpoint: "/updateRunNo",
            payload: { SrlType, UnitName },
          });
          return next(prefixError);
        }

        const prefix = prefixResult[0]?.Prefix ?? "";
        const suffix = prefixResult[0]?.Suffix ?? "";

        const updateQuery = `
        UPDATE magod_setup.magod_runningno
        SET Running_No = ?, Prefix = ?, Suffix = ?
        WHERE SrlType = ? AND Period = ?
      `;
        const updateValues = [RunningNo, prefix, suffix, SrlType, Period];

        setupQueryMod(updateQuery, updateValues, (err, data) => {
          if (err) {
            errorLogger.error("Error updating running number", err, {
              endpoint: "/updateRunNo",
              payload: { SrlType, Period, RunningNo, UnitName },
            });
            return next(err);
          }

          infoLogger.info("Successfully updated running number", {
            endpoint: "/updateRunNo",
            payload: { SrlType, Period, RunningNo, UnitName },
            recordsAffected: data?.affectedRows || 0,
          });

          res.send(data);
        });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in updateRunNo", error, {
      endpoint: "/updateRunNo",
      payload: { SrlType, Period, RunningNo, UnitName },
    });
    next(error);
  }
});

// Insert a new running number record
runningNoRouter.post("/insertRunningNo", async (req, res, next) => {
  const {
    UnitName,
    SrlType,
    ResetPeriod,
    ResetValue = 0,
    EffectiveFrom_date,
    Reset_date,
    Running_No,
    UnitIntial,
    Prefix = "",
    Suffix = "",
    Length = 4,
    DerivedFrom = 0,
    Period = "",
  } = req.body;

  infoLogger.info("Requested insert of running number", {
    endpoint: "/insertRunningNo",
    method: "POST",
    UnitName,
    SrlType,
    Period,
  });

  try {
    setupQueryMod(
      `INSERT INTO magod_setup.magod_runningno
        (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, UnitIntial, Prefix, Suffix, Length, DerivedFrom, Period, Running_EffectiveDate)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`,
      [
        UnitName,
        SrlType,
        ResetPeriod,
        ResetValue,
        EffectiveFrom_date,
        Reset_date,
        Running_No,
        UnitIntial,
        Prefix,
        Suffix,
        Length,
        DerivedFrom,
        Period,
      ],
      (err, data) => {
        if (err) {
          errorLogger.error("Error inserting running number", err, {
            endpoint: "/insertRunningNo",
            UnitName,
            SrlType,
            Period,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Inserted running number successfully", {
          endpoint: "/insertRunningNo",
          UnitName,
          SrlType,
          Period,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error inserting running number", error, {
      endpoint: "/insertRunningNo",
      UnitName,
      SrlType,
      Period,
    });
    next(error);
  }
});

// Get running number by SrlType, or insert if not exists
runningNoRouter.post("/getAndInsertRunningNo", async (req, res, next) => {
  const {
    UnitName,
    SrlType,
    Period = "",
    ResetPeriod = "Year",
    ResetValue = 0,
    EffectiveFrom_date,
    Reset_date,
    Running_No = 0,
    UnitIntial = 0,
    Prefix = "",
    Suffix = "",
    Length = 4,
    DerivedFrom = 0,
  } = req.body;

  infoLogger.info("Requested get or insert running number", {
    endpoint: "/getAndInsertRunningNo",
    method: "POST",
    UnitName,
    SrlType,
    Period,
  });

  try {
    // Check if record exists
    setupQueryMod(
      `SELECT * FROM magod_setup.magod_runningno WHERE SrlType = ? AND Period = ? AND UnitName = ?`,
      [SrlType, Period, UnitName],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching running number", err, {
            endpoint: "/getAndInsertRunningNo",
            UnitName,
            SrlType,
            Period,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        if (data.length > 0) {
          infoLogger.info("Running number found", { records: data.length });
          return res.send(data);
        }

        // Insert new record if not exists
        setupQueryMod(
          `INSERT INTO magod_setup.magod_runningno
          (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, UnitIntial, Prefix, Suffix, Length, DerivedFrom, Period, Running_EffectiveDate)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())`,
          [
            UnitName,
            SrlType,
            ResetPeriod,
            ResetValue,
            EffectiveFrom_date,
            Reset_date,
            Running_No,
            UnitIntial,
            Prefix,
            Suffix,
            Length,
            DerivedFrom,
            Period,
          ],
          (err, insertData) => {
            if (err) {
              errorLogger.error("Error inserting running number", err, {
                endpoint: "/getAndInsertRunningNo",
                UnitName,
                SrlType,
                Period,
              });
              return res
                .status(500)
                .json({ Status: "Error", Message: "Database error" });
            }

            // Fetch newly inserted record
            setupQueryMod(
              `SELECT * FROM magod_setup.magod_runningno WHERE Id = ?`,
              [insertData.insertId],
              (err, selectData) => {
                if (err) {
                  errorLogger.error(
                    "Error fetching newly inserted running number",
                    err,
                    {
                      endpoint: "/getAndInsertRunningNo",
                      UnitName,
                      SrlType,
                      Period,
                    }
                  );
                  return res
                    .status(500)
                    .json({ Status: "Error", Message: "Database error" });
                }

                infoLogger.info("Inserted and fetched new running number", {
                  endpoint: "/getAndInsertRunningNo",
                  UnitName,
                  SrlType,
                  Period,
                });

                res.send(selectData);
              }
            );
          }
        );
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in getAndInsertRunningNo", error, {
      endpoint: "/getAndInsertRunningNo",
      UnitName,
      SrlType,
      Period,
    });
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

// Insert or fetch running number for a unit and serial type
runningNoRouter.post("/insertAndGetRunningNo", async (req, res, next) => {
  const {
    unitName,
    srlType,
    ResetPeriod,
    ResetValue,
    EffectiveFrom_date,
    Reset_date,
    Length,
    Period,
  } = req.body;

  infoLogger.info("Requested insert or fetch running number", {
    endpoint: "/insertAndGetRunningNo",
    method: "POST",
    unitName,
    srlType,
    ResetPeriod,
    Period,
  });

  let Running_No = 0;

  try {
    const selectQuery = `
      SELECT *
      FROM magod_setup.magod_runningno
      WHERE UnitName = ? AND SrlType = ? AND ResetPeriod = ? AND Period = ?
    `;
    const selectValues = [unitName, srlType, ResetPeriod, Period];

    setupQueryMod(selectQuery, selectValues, (err, selectRN1) => {
      if (err) {
        errorLogger.error("Error selecting running number", err, {
          endpoint: "/insertAndGetRunningNo",
          unitName,
          srlType,
          ResetPeriod,
          Period,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      if (selectRN1.length === 0) {
        // No existing running number, insert new one
        const yearPrefixQuery = `
          SELECT *
          FROM magod_setup.year_prefix_suffix
          WHERE UnitName = ? AND SrlType = ?
        `;
        const yearPrefixValues = [unitName, srlType];

        setupQueryMod(
          yearPrefixQuery,
          yearPrefixValues,
          (err, selectYearPrefixSuffix) => {
            if (err) {
              errorLogger.error("Error fetching year prefix/suffix", err, {
                endpoint: "/insertAndGetRunningNo",
                unitName,
                srlType,
              });
              return res
                .status(500)
                .json({ Status: "Error", Message: "Database error" });
            }

            const insertQuery = `
            INSERT INTO magod_setup.magod_runningno
              (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, Prefix, Suffix, Length, Period, Running_EffectiveDate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
          `;
            const insertValues = [
              selectYearPrefixSuffix[0]?.UnitName || "",
              selectYearPrefixSuffix[0]?.SrlType || "",
              ResetPeriod || "",
              ResetValue || 0,
              EffectiveFrom_date || null,
              Reset_date || null,
              Running_No,
              selectYearPrefixSuffix[0]?.Prefix || "",
              selectYearPrefixSuffix[0]?.Suffix || "",
              Length || 5,
              Period || "",
            ];

            setupQueryMod(insertQuery, insertValues, (err, insertRunningNo) => {
              if (err) {
                errorLogger.error("Error inserting running number", err, {
                  endpoint: "/insertAndGetRunningNo",
                  unitName,
                  srlType,
                });
                return res
                  .status(500)
                  .json({ Status: "Error", Message: "Database error" });
              }

              const fetchInsertedQuery = `SELECT * FROM magod_setup.magod_runningno WHERE Id = ?`;
              setupQueryMod(
                fetchInsertedQuery,
                [insertRunningNo.insertId],
                (err, selectRunningNo) => {
                  if (err) {
                    errorLogger.error(
                      "Error fetching inserted running number",
                      err,
                      {
                        endpoint: "/insertAndGetRunningNo",
                        unitName,
                        srlType,
                      }
                    );
                    return res
                      .status(500)
                      .json({ Status: "Error", Message: "Database error" });
                  }

                  infoLogger.info("Successfully inserted running number", {
                    endpoint: "/insertAndGetRunningNo",
                    unitName,
                    srlType,
                    runningNoId: insertRunningNo.insertId,
                  });

                  res.send({
                    runningNoData: selectRunningNo[0],
                    message: "Running number inserted",
                  });
                }
              );
            });
          }
        );
      } else {
        // Running number already exists
        infoLogger.info("Fetched existing running number", {
          endpoint: "/insertAndGetRunningNo",
          unitName,
          srlType,
          runningNoId: selectRN1[0].Id,
        });
        res.send({
          runningNoData: selectRN1[0],
          message: "Fetched running number",
        });
      }
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /insertAndGetRunningNo", error, {
      endpoint: "/insertAndGetRunningNo",
      unitName,
      srlType,
    });
    next(error);
  }
});

// Fetch year prefix/suffix and update running number
runningNoRouter.post("/getAndUpdateRunningNo", async (req, res, next) => {
  const { runningNoData, newRunningNo } = req.body;

  infoLogger.info("Requested update of running number", {
    endpoint: "/getAndUpdateRunningNo",
    method: "POST",
    runningNoId: runningNoData?.Id,
    newRunningNo,
  });

  try {
    const selectQuery = `
      SELECT *
      FROM magod_setup.year_prefix_suffix
      WHERE UnitName = ? AND SrlType = ?
    `;
    const selectValues = [runningNoData.UnitName, runningNoData.SrlType];

    setupQueryMod(selectQuery, selectValues, (err, yearPrefixSuffixData) => {
      if (err) {
        errorLogger.error("Error fetching year prefix/suffix", err, {
          endpoint: "/getAndUpdateRunningNo",
          runningNoId: runningNoData?.Id,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      const updateQuery = `
        UPDATE magod_setup.magod_runningno
        SET Running_No = ?, Prefix = ?, Suffix = ?
        WHERE Id = ?
      `;
      const updateValues = [
        parseInt(newRunningNo),
        yearPrefixSuffixData[0].Prefix || "",
        yearPrefixSuffixData[0].Suffix || "",
        runningNoData.Id,
      ];

      setupQueryMod(updateQuery, updateValues, (err, updateResult) => {
        if (err) {
          errorLogger.error("Error updating running number", err, {
            endpoint: "/getAndUpdateRunningNo",
            runningNoId: runningNoData?.Id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully updated running number", {
          endpoint: "/getAndUpdateRunningNo",
          runningNoId: runningNoData?.Id,
          newRunningNo,
        });

        res.send({
          flag: true,
          message: "Running number updated successfully",
        });
      });
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /getAndUpdateRunningNo", error, {
      endpoint: "/getAndUpdateRunningNo",
      runningNoId: runningNoData?.Id,
    });
    next(error);
  }
});

module.exports = runningNoRouter;
