const customStockList = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch limited material stock list for a customer by Cust_Code
customStockList.get("/materialStockList1", async (req, res, next) => {
  const Cust_Code = req.query.Cust_Code;

  infoLogger.info("Requested material stock list", {
    endpoint: "/materialStockList1",
    method: req.method,
    queryParams: { Cust_Code },
  });

  try {
    const sql = `
      SELECT m.Cust_Code, m1.Material, m.Customer, 
             COUNT(m.MtrlStockID) AS Qty, 
             SUM(m.Weight) AS Weight, 
             SUM(m.ScrapWeight) AS ScrapWeight
      FROM magodmis.mtrlstocklist m
      JOIN magodmis.mtrl_data m2 ON m2.Mtrl_Code = m.Mtrl_Code
      JOIN magodmis.mtrlgrades m1 ON m1.MtrlGradeID = m2.MtrlGradeID 
      WHERE m.Cust_Code = ? 
        AND m.IV_No IS NULL
        AND m1.Material = m.Material
      GROUP BY m.Material, m.Customer 
      ORDER BY m.Material 
      LIMIT 20
    `;

    await misQueryMod(sql, [Cust_Code], (err, data) => {
      if (err) {
        errorLogger.error("Error fetching material stock list", err, {
          endpoint: "/materialStockList1",
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Fetched material stock list successfully", {
        endpoint: "/materialStockList1",
      });
      res.send(data);
    });
  } catch (error) {
    errorLogger.error("Unexpected error fetching material stock list", error, {
      endpoint: "/materialStockList1",
    });
    next(error);
  }
});

// Fetch limited material stock list (detailed) for a customer by Cust_Code
customStockList.get("/materialStockList2", async (req, res, next) => {
  const Cust_Code = req.query.Cust_Code;

  infoLogger.info("Requested material stock list (detailed)", {
    endpoint: "/materialStockList2",
    method: req.method,
    queryParams: { Cust_Code },
  });

  try {
    const sql = `
      SELECT m.Cust_Code, m.Mtrl_Code, m.Customer, m1.Material,
             COUNT(m.MtrlStockID) AS Qty, 
             SUM(m.Weight) AS Weight, 
             SUM(m.ScrapWeight) AS ScrapWeight
      FROM magodmis.mtrlstocklist m
      JOIN magodmis.mtrl_data m2 ON m2.Mtrl_Code = m.Mtrl_Code
      JOIN magodmis.mtrlgrades m1 ON m1.MtrlGradeID = m2.MtrlGradeID
      WHERE m.Cust_Code = ?
        AND m.IV_No IS NULL
      GROUP BY m1.Material, m.Mtrl_Code, m.Customer
      ORDER BY m.Mtrl_Code
      LIMIT 20
    `;

    await misQueryMod(sql, [Cust_Code], (err, data) => {
      if (err) {
        errorLogger.error(
          "Error fetching material stock list (detailed)",
          err,
          { endpoint: "/materialStockList2" }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Fetched material stock list (detailed) successfully", {
        endpoint: "/materialStockList2",
      });
      res.send(data);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching material stock list (detailed)",
      error,
      { endpoint: "/materialStockList2" }
    );
    next(error);
  }
});

// Fetch limited detailed material stock list with dynamic parameters for a customer by Cust_Code
customStockList.get("/materialStockList3", async (req, res, next) => {
  const Cust_Code = req.query.Cust_Code;

  infoLogger.info("Requested material stock list (with dynamic params)", {
    endpoint: "/materialStockList3",
    method: req.method,
    queryParams: { Cust_Code },
  });

  try {
    const sql = `
      SELECT m.Cust_Code, m.Mtrl_Code, m.DynamicPara1, m.Customer,
             m.DynamicPara2, m.DynamicPara3, m.Locked, m.Scrap,
             m1.Material, COUNT(m.MtrlStockID) AS Qty,
             SUM(m.Weight) AS Weight, SUM(m.ScrapWeight) AS ScrapWeight
      FROM magodmis.mtrlstocklist m
      JOIN magodmis.mtrl_data m2 ON m2.Mtrl_Code = m.Mtrl_Code
      JOIN magodmis.mtrlgrades m1 ON m1.MtrlGradeID = m2.MtrlGradeID
      WHERE m.Cust_Code = ?
        AND m.IV_No IS NULL
      GROUP BY m.Mtrl_Code, m.DynamicPara1, m.DynamicPara2, m.Locked,
               m.Scrap, m1.Material, m.DynamicPara3, m.Customer
      ORDER BY m.Scrap DESC, m.Mtrl_Code
      LIMIT 20
    `;

    await misQueryMod(sql, [Cust_Code], (err, data) => {
      if (err) {
        errorLogger.error(
          "Error fetching material stock list (with dynamic params)",
          err,
          { endpoint: "/materialStockList3" }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info(
        "Fetched material stock list (with dynamic params) successfully",
        { endpoint: "/materialStockList3" }
      );
      res.send(data);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching material stock list (with dynamic params)",
      error,
      { endpoint: "/materialStockList3" }
    );
    next(error);
  }
});

module.exports = customStockList;
