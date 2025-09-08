const reportRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

/* 1. daily report */
// Fetch daily material receipt report
reportRouter.get("/getDailyReportMaterialReceipt1", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested daily material receipt report", {
    endpoint: "/getDailyReportMaterialReceipt1",
    method: req.method,
    date,
  });

  try {
    misQueryMod(
      `SELECT 
          A.*, 
          s.Shape,
          m.Mtrl_Rv_id,
          m.mtrl_code,
          m.material, 
          m.qty, 
          m.totalWeight, 
          m.totalweightcalculated 
       FROM 
          (SELECT 
              m.RV_No, 
              m.RV_Date, 
              m.Customer, 
              m.CustDocuNo,
              m.RvID, 
              m.Cust_Code 
           FROM 
              magodmis.material_receipt_register m 
           WHERE 
              m.RV_Date = ? OR m.RV_No = 'Draft') AS A
       LEFT JOIN 
          magodmis.mtrlreceiptdetails m ON A.RvID = m.RvID
       LEFT JOIN 
          magodmis.shapes s ON s.shapeid = m.shapeid
       ORDER BY 
          A.RV_No`,
      [date],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching daily material receipt report",
            err,
            {
              endpoint: "/getDailyReportMaterialReceipt1",
              date,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched daily material receipt report successfully", {
          endpoint: "/getDailyReportMaterialReceipt1",
          date,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error in daily material receipt report",
      error,
      {
        endpoint: "/getDailyReportMaterialReceipt1",
        date,
      }
    );
    next(error);
  }
});

// Fetch daily material receipt report (Sheets, Units, Parts)
reportRouter.get("/getDailyReportMaterialReceipt2", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested daily material receipt report 2", {
    endpoint: "/getDailyReportMaterialReceipt2",
    method: req.method,
    date,
  });

  try {
    const query = `
      SELECT B.*
      FROM
        (SELECT 
            A.*, s.Shape, m.Mtrl_Rv_id, m.mtrl_code, m.material, m.qty, m.totalWeight, m.totalweightcalculated
         FROM
            (SELECT m.Type, m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, m.CustDocuNo, m.RvID
             FROM magodmis.material_receipt_register m
             WHERE m.RV_Date = ? AND (m.Type = 'Sheets' OR m.Type = 'Units')
            ) AS A
         LEFT JOIN magodmis.mtrlreceiptdetails m ON A.RvID = m.RvID
         LEFT JOIN magodmis.shapes s ON s.shapeid = m.shapeid

         UNION

         SELECT 
            A.*, 'Parts' AS Shape, m.Id AS Mtrl_Rv_id, m.PartId AS mtrl_code, c.material AS material,
            m.qtyreceived AS qty, m.qtyreceived * m.unitwt AS totalWeight, m.qtyreceived * m.unitwt AS totalweightcalculated
         FROM
            (SELECT m.Type, m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, m.CustDocuNo, m.RvID
             FROM magodmis.material_receipt_register m
             WHERE m.RV_Date = ? AND m.Type = 'Parts'
            ) AS A
         LEFT JOIN magodmis.mtrl_part_receipt_details m ON A.RvID = m.RvID
         LEFT JOIN magodmis.cust_bomlist c ON c.id = m.CustBOM_Id
        ) AS B
      ORDER BY B.RV_No
    `;

    misQueryMod(query, [date, date], (err, data) => {
      if (err) {
        errorLogger.error(
          "Error fetching daily material receipt report 2",
          err,
          {
            endpoint: "/getDailyReportMaterialReceipt2",
            date,
          }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Fetched daily material receipt report 2 successfully", {
        endpoint: "/getDailyReportMaterialReceipt2",
        date,
        records: data.length,
      });

      res.send(data);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error in daily material receipt report 2",
      error,
      {
        endpoint: "/getDailyReportMaterialReceipt2",
        date,
      }
    );
    next(error);
  }
});

// Fetch daily material dispatch report
reportRouter.get("/getDailyReportMaterialDispatch", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested daily material dispatch report", {
    endpoint: "/getDailyReportMaterialDispatch",
    method: req.method,
    date,
  });

  try {
    const query = `
      SELECT A.*, d.Mtrl, d.Material, d.SrlWt, d.SummarySrl
      FROM
        (SELECT d.Inv_No, d.Inv_Date, d.DC_InvType, d.Cust_Name, d.Dc_Inv_No
         FROM magodmis.draft_dc_inv_register d
         WHERE d.Inv_Date = ? AND NOT d.DC_InvType LIKE 'Combined'
        ) AS A,
        magodmis.dc_inv_summary d
      WHERE A.DC_Inv_No = d.DC_Inv_No
      ORDER BY A.Inv_No, A.DC_InvType
    `;

    misQueryMod(query, [date], (err, data) => {
      if (err) {
        errorLogger.error(
          "Error fetching daily material dispatch report",
          err,
          {
            endpoint: "/getDailyReportMaterialDispatch",
            date,
          }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Fetched daily material dispatch report successfully", {
        endpoint: "/getDailyReportMaterialDispatch",
        date,
        records: data.length,
      });

      res.send(data);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error in daily material dispatch report",
      error,
      {
        endpoint: "/getDailyReportMaterialDispatch",
        date,
      }
    );
    next(error);
  }
});

// Update serial weight in material dispatch
reportRouter.post("/updateSrlWghtMaterialDispatch", async (req, res, next) => {
  const { tableData } = req.body;

  infoLogger.info("Requested update of serial weight in material dispatch", {
    endpoint: "/updateSrlWghtMaterialDispatch",
    method: req.method,
    records: tableData.length,
  });

  try {
    for (let i = 0; i < tableData.length; i++) {
      const element = tableData[i];

      const query = `
        UPDATE magodmis.dc_inv_summary
        SET SrlWt = ?
        WHERE DC_Inv_No = ? AND SummarySrl = ?
      `;

      misQueryMod(
        query,
        [element.SrlWt, element.Dc_Inv_No, element.SummarySrl],
        (err, data) => {
          if (err) {
            errorLogger.error("Error updating serial weight", err, {
              endpoint: "/updateSrlWghtMaterialDispatch",
              Dc_Inv_No: element.Dc_Inv_No,
              SummarySrl: element.SummarySrl,
            });
          } else {
            infoLogger.info("Updated serial weight successfully", {
              endpoint: "/updateSrlWghtMaterialDispatch",
              Dc_Inv_No: element.Dc_Inv_No,
              SummarySrl: element.SummarySrl,
            });
          }
        }
      );
    }

    res.send({
      flag: 1,
      message: "Updated Successfully",
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error updating serial weight in material dispatch",
      error,
      { endpoint: "/updateSrlWghtMaterialDispatch" }
    );
    next(error);
  }
});

// Fetch daily material sales report
reportRouter.get("/getDailyReportMaterialSales", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested daily material sales report", {
    endpoint: "/getDailyReportMaterialSales",
    method: req.method,
    date,
  });

  try {
    const query = `
      SELECT A.Inv_No, A.dc_invType, A.SrlWt, A.Material, B.Cust_Name
      FROM 
        (SELECT c.Inv_No, d.dc_invType, SUM(d.SrlWt) AS SrlWt, d.Material
         FROM magodmis.draft_dc_inv_register c, magodmis.dc_inv_summary d
         WHERE c.DC_Inv_No = d.DC_Inv_No
           AND c.Inv_Date = ?
           AND (c.DC_InvType = 'Sales' OR c.DC_InvType LIKE 'Material%')
         GROUP BY c.Inv_No, d.dc_invType, d.material
        ) AS A,
        (SELECT d.DC_InvType, d.Cust_Code, d.Cust_Name, d.Dc_Inv_No, d.Inv_No, d.Inv_Date
         FROM magodmis.draft_dc_inv_register d
         WHERE d.Inv_Date = ?
           AND (d.DC_InvType = 'Sales' OR d.DC_InvType LIKE 'Material%')
        ) AS B
      WHERE A.Inv_No = B.Inv_No
    `;

    misQueryMod(query, [date, date], (err, data) => {
      if (err) {
        errorLogger.error("Error fetching daily material sales report", err, {
          endpoint: "/getDailyReportMaterialSales",
          date,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Fetched daily material sales report successfully", {
        endpoint: "/getDailyReportMaterialSales",
        date,
        records: data.length,
      });

      res.send(data);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error in daily material sales report",
      error,
      {
        endpoint: "/getDailyReportMaterialSales",
        date,
      }
    );
    next(error);
  }
});

// Fetch daily material purchase report
reportRouter.get("/getDailyReportMaterialPurchase", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested daily material purchase report", {
    endpoint: "/getDailyReportMaterialPurchase",
    method: req.method,
    date,
  });

  try {
    const query = `
      SELECT 
        m.RV_No,
        m.RV_Date,
        m.Cust_Code,
        m.Customer,
        m.CustDocuNo,
        m1.Material,
        SUM(m1.TotalWeightCalculated) AS TotalWeightCalculated,
        SUM(m1.TotalWeight) AS TotalWeight,
        SUM(m1.Qty) AS qty
      FROM magodmis.material_receipt_register m
      INNER JOIN magodmis.mtrlreceiptdetails m1 ON m.RvID = m1.RvID
      WHERE m.RV_No NOT LIKE 'Draft'
        AND m.RV_Date = ?
        AND m.Cust_Code = '0000'
      GROUP BY m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, m.CustDocuNo, m1.Material
      ORDER BY m1.Material
    `;

    misQueryMod(query, [date], (err, data) => {
      if (err) {
        errorLogger.error(
          "Error fetching daily material purchase report",
          err,
          {
            endpoint: "/getDailyReportMaterialPurchase",
            date,
          }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Fetched daily material purchase report successfully", {
        endpoint: "/getDailyReportMaterialPurchase",
        date,
        records: data.length,
      });

      res.send(data);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error in daily material purchase report",
      error,
      {
        endpoint: "/getDailyReportMaterialPurchase",
        date,
      }
    );
    next(error);
  }
});

// Fetch monthly report of material purchase details
reportRouter.get(
  "/getMonthlyReportMaterialPurchaseDetails",
  async (req, res, next) => {
    const { month, year } = req.query;

    infoLogger.info("Requested monthly material purchase report", {
      endpoint: "/getMonthlyReportMaterialPurchaseDetails",
      method: req.method,
      month,
      year,
    });

    try {
      const query = `
      SELECT 
        m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, m.CustDocuNo, 
        m1.Material, 
        SUM(m1.TotalWeightCalculated) AS TotalWeightCalculated,
        SUM(m1.TotalWeight) AS TotalWeight, 
        SUM(m1.Qty) AS qty
      FROM magodmis.material_receipt_register m, magodmis.mtrlreceiptdetails m1
      WHERE m.RV_No NOT LIKE 'Draft' 
        AND m.RvID = m1.RvID
        AND m1.TotalWeightCalculated IS NOT NULL
        AND m1.Cust_Code = '0000'
        AND EXTRACT(YEAR FROM m.RV_Date) = ?
        AND EXTRACT(MONTH FROM m.RV_Date) = ?
      GROUP BY m1.Material, m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, m.CustDocuNo
      ORDER BY m1.Material
    `;

      misQueryMod(query, [year, month], (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching monthly material purchase report",
            err,
            {
              endpoint: "/getMonthlyReportMaterialPurchaseDetails",
              month,
              year,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Fetched monthly material purchase report successfully",
          {
            endpoint: "/getMonthlyReportMaterialPurchaseDetails",
            month,
            year,
            records: data.length,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching monthly material purchase report",
        error,
        {
          endpoint: "/getMonthlyReportMaterialPurchaseDetails",
          month,
          year,
        }
      );
      next(error);
    }
  }
);

// Fetch monthly material sales summary
reportRouter.get(
  "/getMonthlyReportMaterialSalesSummary",
  async (req, res, next) => {
    const { month, year } = req.query;

    infoLogger.info("Requested monthly material sales summary", {
      endpoint: "/getMonthlyReportMaterialSalesSummary",
      method: req.method,
      month,
      year,
    });

    try {
      const query = `
      SELECT 
        d.Material, SUM(d.SrlWt) AS SrlWt, f.DC_InvType
      FROM 
        magodmis.dc_inv_summary d, magodmis.draft_dc_inv_register f
      WHERE 
        d.dc_Inv_No = f.dc_Inv_no
        AND EXTRACT(YEAR FROM f.Inv_Date) = ?
        AND EXTRACT(MONTH FROM f.Inv_Date) = ?
        AND (f.DC_InvType = 'Sales' OR f.DC_InvType LIKE 'Material%')
      GROUP BY d.Material, f.DC_InvType
    `;

      misQueryMod(query, [year, month], (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching monthly material sales summary",
            err,
            {
              endpoint: "/getMonthlyReportMaterialSalesSummary",
              month,
              year,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched monthly material sales summary successfully", {
          endpoint: "/getMonthlyReportMaterialSalesSummary",
          month,
          year,
          records: data.length,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching monthly material sales summary",
        error,
        {
          endpoint: "/getMonthlyReportMaterialSalesSummary",
          month,
          year,
        }
      );
      next(error);
    }
  }
);

// Fetch monthly material purchase summary
reportRouter.get(
  "/getMonthlyReportMaterialPurchaseSummary",
  async (req, res, next) => {
    const { month, year } = req.query;

    infoLogger.info("Requested monthly material purchase summary", {
      endpoint: "/getMonthlyReportMaterialPurchaseSummary",
      method: req.method,
      month,
      year,
    });

    try {
      const query = `
      SELECT 
        m1.Material, 
        SUM(m1.TotalWeightCalculated) AS TotalWeightCalculated,
        SUM(m1.TotalWeight) AS TotalWeight, 
        SUM(m1.Qty) AS qty
      FROM 
        magodmis.material_receipt_register m,
        magodmis.mtrlreceiptdetails m1
      WHERE 
        m.RV_No NOT LIKE 'Draft' 
        AND m.RvID = m1.RvID
        AND m1.TotalWeightCalculated IS NOT NULL
        AND m1.Cust_Code = '0000'
        AND EXTRACT(YEAR FROM m.RV_Date) = ?
        AND EXTRACT(MONTH FROM m.RV_Date) = ?
      GROUP BY m1.Material
      ORDER BY Material
    `;

      misQueryMod(query, [year, month], (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching monthly material purchase summary",
            err,
            {
              endpoint: "/getMonthlyReportMaterialPurchaseSummary",
              month,
              year,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Fetched monthly material purchase summary successfully",
          {
            endpoint: "/getMonthlyReportMaterialPurchaseSummary",
            month,
            year,
            records: data.length,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching monthly material purchase summary",
        error,
        {
          endpoint: "/getMonthlyReportMaterialPurchaseSummary",
          month,
          year,
        }
      );
      next(error);
    }
  }
);

// Fetch monthly report of material sales details
reportRouter.get(
  "/getMonthlyReportMaterialSalesDetails",
  async (req, res, next) => {
    const { month, year } = req.query;

    infoLogger.info("Requested monthly material sales report", {
      endpoint: "/getMonthlyReportMaterialSalesDetails",
      method: req.method,
      month,
      year,
    });

    try {
      const query = `
      SELECT 
        b.Cust_Name, b.Inv_Date, b.Inv_No, b.material, SUM(b.srlWt) AS SrlWt, b.DC_InvType
      FROM 
        (
          SELECT 
            A.*, d.Mtrl, d.Material, d.SrlWt
          FROM 
            (
              SELECT 
                d.DC_InvType, d.Cust_Name, d.Dc_Inv_No, d.Inv_No, d.Inv_Date
              FROM magodmis.draft_dc_inv_register d
              WHERE EXTRACT(YEAR FROM d.Inv_Date) = ? 
                AND EXTRACT(MONTH FROM d.Inv_Date) = ?
                AND (d.DC_InvType LIKE 'Sales' OR d.DC_InvType LIKE 'Material%')
            ) AS A,
            magodmis.dc_inv_summary d
          WHERE A.dc_Inv_No = d.dc_Inv_no
          ORDER BY A.DC_InvType
        ) AS B
      GROUP BY b.Cust_Name, b.Inv_Date, b.Inv_No, b.material, b.DC_InvType
      ORDER BY b.Cust_Name
    `;

      misQueryMod(query, [year, month], (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching monthly material sales report",
            err,
            {
              endpoint: "/getMonthlyReportMaterialSalesDetails",
              month,
              year,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched monthly material sales report successfully", {
          endpoint: "/getMonthlyReportMaterialSalesDetails",
          month,
          year,
          records: data.length,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching monthly material sales report",
        error,
        {
          endpoint: "/getMonthlyReportMaterialSalesDetails",
          month,
          year,
        }
      );
      next(error);
    }
  }
);

// Fetch monthly material handling summary (Receipts & Dispatch)
reportRouter.get(
  "/getMonthlyReportMaterialHandlingSummary",
  async (req, res, next) => {
    const { month, year } = req.query;

    infoLogger.info("Requested monthly material handling summary", {
      endpoint: "/getMonthlyReportMaterialHandlingSummary",
      method: req.method,
      month,
      year,
    });

    try {
      const query = `
      SELECT 
        'Receipts' AS Type,
        m1.Material,
        SUM(m1.TotalWeightCalculated) AS TotalWeightCalculated, 
        SUM(m1.TotalWeight) AS TotalWeight,
        SUM(m1.Qty) AS qty
      FROM 
        magodmis.material_receipt_register m,
        magodmis.mtrlreceiptdetails m1
      WHERE 
        m.RV_No NOT LIKE 'Draft' 
        AND m.RvID = m1.RvID
        AND m1.TotalWeightCalculated IS NOT NULL
        AND EXTRACT(YEAR FROM m.RV_Date) = ?
        AND EXTRACT(MONTH FROM m.RV_Date) = ?
      GROUP BY m1.Material

      UNION

      SELECT
        'Despatch' AS Type,
        d.Material,
        SUM(d.SrlWt) AS TotalWeightCalculated,
        SUM(d.SrlWt) AS TotalWeight,
        SUM(d.TotQty) AS Qty
      FROM
        (SELECT d.DC_InvType, d.Dc_Inv_No 
         FROM magodmis.draft_dc_inv_register d 
         WHERE EXTRACT(YEAR FROM d.Inv_Date) = ? 
           AND EXTRACT(MONTH FROM d.Inv_Date) = ? 
           AND (d.Inv_No IS NOT NULL AND d.Inv_No NOT LIKE 'C%')
        ) AS A,
        magodmis.dc_inv_summary d
      WHERE A.dc_Inv_No = d.dc_Inv_no
      GROUP BY d.Material
    `;

      misQueryMod(query, [year, month, year, month], (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching monthly material handling summary",
            err,
            {
              endpoint: "/getMonthlyReportMaterialHandlingSummary",
              month,
              year,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Fetched monthly material handling summary successfully",
          {
            endpoint: "/getMonthlyReportMaterialHandlingSummary",
            month,
            year,
            records: data.length,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching monthly material handling summary",
        error,
        {
          endpoint: "/getMonthlyReportMaterialHandlingSummary",
          month,
          year,
        }
      );
      next(error);
    }
  }
);

//Part List
// Fetch list of parts in stock and in process by customer code
reportRouter.get("/getPartListInStockAndProcess", async (req, res, next) => {
  const { code } = req.query;

  infoLogger.info("Requested part list in stock and process", {
    endpoint: "/getPartListInStockAndProcess",
    method: req.method,
    code,
  });

  try {
    misQueryMod(
      `SELECT 
        m.*, 
        m1.RV_No, 
        m1.RV_Date 
       FROM 
        magodmis.mtrl_part_receipt_details m,
        magodmis.material_receipt_register m1 
       WHERE 
        m.QtyAccepted > m.QtyUsed + m.QtyReturned 
        AND m1.Cust_Code = ? 
        AND m1.RvID = m.RVId`,
      [code],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching part list", err, {
            endpoint: "/getPartListInStockAndProcess",
            code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched part list successfully", {
          endpoint: "/getPartListInStockAndProcess",
          code,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching part list", error, {
      endpoint: "/getPartListInStockAndProcess",
      code,
    });
    next(error);
  }
});

// Fetch part receipt and usage (first view) by customer code
reportRouter.get("/getPartListReceiptAndUsageFirst", async (req, res, next) => {
  const { code } = req.query;

  infoLogger.info("Requested part receipt and usage (first)", {
    endpoint: "/getPartListReceiptAndUsageFirst",
    method: req.method,
    code,
  });

  try {
    misQueryMod(
      `SELECT 
        m.* 
       FROM 
        magodmis.material_receipt_register m
       WHERE 
        m.Type = 'Parts' 
        AND m.Cust_Code = ? 
       ORDER BY 
        m.RV_Date DESC`,
      [code],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching part receipt and usage", err, {
            endpoint: "/getPartListReceiptAndUsageFirst",
            code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched part receipt and usage successfully", {
          endpoint: "/getPartListReceiptAndUsageFirst",
          code,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching part receipt and usage",
      error,
      {
        endpoint: "/getPartListReceiptAndUsageFirst",
        code,
      }
    );
    next(error);
  }
});

// Fetch part receipt and usage (second view) by RVId
reportRouter.get(
  "/getPartListReceiptAndUsageSecond",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Requested part receipt and usage (second)", {
      endpoint: "/getPartListReceiptAndUsageSecond",
      method: req.method,
      id,
    });

    try {
      misQueryMod(
        `SELECT 
        m.* 
       FROM 
        magodmis.mtrl_part_receipt_details m 
       WHERE 
        m.RVId = ?`,
        [id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching part receipt and usage (second)",
              err,
              {
                endpoint: "/getPartListReceiptAndUsageSecond",
                id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Fetched part receipt and usage (second) successfully",
            {
              endpoint: "/getPartListReceiptAndUsageSecond",
              id,
              records: data.length,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error in part receipt and usage (second)",
        error,
        {
          endpoint: "/getPartListReceiptAndUsageSecond",
          id,
        }
      );
      next(error);
    }
  }
);

// Fetch aggregated usage info for a given Part Receipt (Third view)
reportRouter.get("/getPartListReceiptAndUsageThird", async (req, res, next) => {
  const { id } = req.query;

  infoLogger.info("Requested part receipt and usage (third)", {
    endpoint: "/getPartListReceiptAndUsageThird",
    method: req.method,
    id,
  });

  try {
    misQueryMod(
      `SELECT 
          SUM(s.QtyIssued) AS QtyIssued, 
          SUM(s.QtyUsed) AS QtyUsed, 
          SUM(s.QtyReturned) AS QtyReturned, 
          s1.NC_ProgramNo AS NCProgramNo
       FROM 
          magodmis.mtrl_part_receipt_details m
       JOIN 
          magodmis.shopfloor_bom_issuedetails s ON s.PartReceipt_DetailsID = m.Id
       JOIN 
          magodmis.shopfloor_part_issueregister s1 ON s1.IssueID = s.IV_ID
       WHERE 
          m.Id = ?
       GROUP BY 
          s1.NC_ProgramNo`,
      [id],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching part receipt and usage (third)",
            err,
            {
              endpoint: "/getPartListReceiptAndUsageThird",
              id,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched part receipt and usage (third) successfully", {
          endpoint: "/getPartListReceiptAndUsageThird",
          id,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error in part receipt and usage (third)",
      error,
      {
        endpoint: "/getPartListReceiptAndUsageThird",
        id,
      }
    );
    next(error);
  }
});

// Fetch issue details for a given NC Program No and Part Receipt (Fourth view)
reportRouter.get(
  "/getPartListReceiptAndUsageFourth",
  async (req, res, next) => {
    const { id1: ncno, id2: partid } = req.query;

    infoLogger.info("Requested part receipt and usage (fourth)", {
      endpoint: "/getPartListReceiptAndUsageFourth",
      method: req.method,
      ncno,
      partid,
    });

    try {
      misQueryMod(
        `SELECT 
          s.IV_No,
          s.Issue_date,
          s1.QtyIssued,
          s1.QtyUsed,
          s1.QtyReturned,
          s.Remarks 
       FROM 
          magodmis.shopfloor_part_issueregister s
       JOIN 
          magodmis.shopfloor_bom_issuedetails s1 ON s.IssueID = s1.IV_ID
       WHERE 
          s.NC_ProgramNo = ? 
          AND s1.PartReceipt_DetailsID = ?`,
        [ncno, partid],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching part receipt and usage (fourth)",
              err,
              {
                endpoint: "/getPartListReceiptAndUsageFourth",
                ncno,
                partid,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Fetched part receipt and usage (fourth) successfully",
            {
              endpoint: "/getPartListReceiptAndUsageFourth",
              ncno,
              partid,
              records: data.length,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error in part receipt and usage (fourth)",
        error,
        {
          endpoint: "/getPartListReceiptAndUsageFourth",
          ncno,
          partid,
        }
      );
      next(error);
    }
  }
);

module.exports = reportRouter;
