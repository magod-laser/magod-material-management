const returnRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch profile material first records by Cust_Code
returnRouter.get("/profileMaterialFirst", async (req, res, next) => {
  const { Cust_Code } = req.query;

  infoLogger.info("Requested profile material first records", {
    endpoint: "/profileMaterialFirst",
    method: req.method,
    Cust_Code,
  });

  try {
    // Disable ONLY_FULL_GROUP_BY mode
    misQueryMod(
      `SET @@sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '')`,
      (err) => {
        if (err) {
          errorLogger.error("Error disabling ONLY_FULL_GROUP_BY", err, {
            endpoint: "/profileMaterialFirst",
            Cust_Code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        const query = `
          SELECT 
            m1.Rv_date,
            m.Mtrl_Rv_id,
            m1.Cust_Code,
            m1.RV_No,
            m1.CustDocuNo AS Cust_Docu_No,
            m.Mtrl_Code,
            m.DynamicPara1,
            m.DynamicPara2,
            m.DynamicPara3,
            m.Scrap,
            SUM(m.Weight) AS Weight,
            SUM(m.ScrapWeight) AS ScrapWeight,
            COUNT(m.MtrlStockID) AS InStock
          FROM magodmis.mtrlstocklist m
          INNER JOIN magodmis.material_receipt_register m1 
            ON m1.Rv_No = m.rv_No
          WHERE
            m.Issue = 0
            AND m.Cust_Code = ?
            AND m1.RVStatus = 'Received'
          GROUP BY m.Mtrl_Rv_id, m.Mtrl_Code, m.DynamicPara1, m.DynamicPara2, m.Scrap
          ORDER BY m.Mtrl_Rv_id DESC
        `;

        const values = [Cust_Code];

        misQueryMod(query, values, (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching profile material first records",
              err,
              { endpoint: "/profileMaterialFirst", Cust_Code }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Successfully fetched profile material first records",
            {
              endpoint: "/profileMaterialFirst",
              Cust_Code,
              recordsFetched: data.length,
            }
          );

          res.send(data || []);
        });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /profileMaterialFirst", error, {
      endpoint: "/profileMaterialFirst",
      Cust_Code,
    });
    next(error);
  }
});

// Fetch profile material second records by Cust_Code
returnRouter.get("/profileMaterialSecond", async (req, res, next) => {
  const { Cust_Code } = req.query;

  infoLogger.info("Requested profile material second records", {
    endpoint: "/profileMaterialSecond",
    method: req.method,
    Cust_Code,
  });

  try {
    const query = `
      SELECT 
        m1.RVId,
        m1.Cust_Code,
        m1.RV_No,
        m1.CustDocuNo AS Cust_Docu_No,
        m1.Type,
        m.Mtrl_Rv_id,
        m.Mtrl_Code,
        m.Material,
        m.DynamicPara1,
        m.DynamicPara2,
        m.DynamicPara3,
        m.Scrap,
        m.Weight,
        m.ScrapWeight,
        m.MtrlStockID
      FROM magodmis.mtrlstocklist m
      INNER JOIN magodmis.material_receipt_register m1 
        ON m1.Rv_No = m.rv_No
      WHERE
        m.Issue = 0
        AND m.Cust_Code = ?
        AND m1.RVStatus = 'Received'
      ORDER BY m.MtrlStockID
    `;

    const values = [Cust_Code];

    misQueryMod(query, values, (err, data) => {
      if (err) {
        errorLogger.error(
          "Error fetching profile material second records",
          err,
          { endpoint: "/profileMaterialSecond", Cust_Code }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully fetched profile material second records", {
        endpoint: "/profileMaterialSecond",
        Cust_Code,
        recordsFetched: data.length,
      });

      res.send(data || []);
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /profileMaterialSecond", error, {
      endpoint: "/profileMaterialSecond",
      Cust_Code,
    });
    next(error);
  }
});

// Fetch Part material receipt register for a specific customer
returnRouter.get("/partFirst", async (req, res, next) => {
  const { Cust_Code } = req.query;

  infoLogger.info("Requested Part material receipt register", {
    endpoint: "/partFirst",
    method: "GET",
    Cust_Code,
  });

  try {
    misQueryMod(
      `SELECT *,
          DATE_FORMAT(RV_Date, '%d/%m/%Y') AS RV_Date,
          DATE_FORMAT(ReceiptDate, '%d/%m/%Y') AS ReceiptDate
       FROM magodmis.material_receipt_register
       WHERE Type = 'Parts' AND RVStatus = 'Received' AND Cust_Code = ?`,
      [Cust_Code],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching Part material receipt register",
            err,
            {
              endpoint: "/partFirst",
              Cust_Code,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched Part material receipt register successfully", {
          endpoint: "/partFirst",
          Cust_Code,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching Part material receipt register",
      error,
      {
        endpoint: "/partFirst",
        Cust_Code,
      }
    );
    next(error);
  }
});

// Fetch Part material receipt details for a specific customer
returnRouter.get("/partSecond", async (req, res, next) => {
  const { Cust_Code } = req.query;

  infoLogger.info("Requested Part material receipt details", {
    endpoint: "/partSecond",
    method: "GET",
    Cust_Code,
  });

  try {
    misQueryMod(
      `SELECT m1.*, m.*
       FROM magodmis.material_receipt_register m
       JOIN magodmis.mtrl_part_receipt_details m1 ON m1.RVId = m.RvID
       WHERE m.Type = 'Parts' AND m.RVStatus = 'Received' AND m.Cust_Code = ?`,
      [Cust_Code],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching Part material receipt details",
            err,
            {
              endpoint: "/partSecond",
              Cust_Code,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched Part material receipt details successfully", {
          endpoint: "/partSecond",
          Cust_Code,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching Part material receipt details",
      error,
      {
        endpoint: "/partSecond",
        Cust_Code,
      }
    );
    next(error);
  }
});

module.exports = returnRouter;
