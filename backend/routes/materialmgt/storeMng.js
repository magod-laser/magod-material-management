const storeRouter = require("express").Router();
const { misQueryMod, mtrlQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

/* 1. Resize Form */

// Fetch resize material stock list for a specific customer
storeRouter.get("/getResizeMtrlStockList", async (req, res, next) => {
  const { code: Cust_Code } = req.query;

  infoLogger.info("Requested resize material stock list", {
    endpoint: "/getResizeMtrlStockList",
    method: req.method,
    Cust_Code,
  });

  try {
    const query = `
      SELECT *
      FROM magodmis.mtrlstocklist
      WHERE Cust_Code LIKE ?
        AND Issue = 0
        AND Locked = 0
        AND Scrap = 0
      ORDER BY Mtrl_Rv_id DESC, Mtrl_Code, MtrlStockID
    `;

    // Add % for LIKE matching
    const likeCode = `%${Cust_Code}%`;

    misQueryMod(query, [likeCode], (err, data) => {
      if (err) {
        errorLogger.error("Error fetching resize material stock list", err, {
          endpoint: "/getResizeMtrlStockList",
          Cust_Code,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Fetched resize material stock list successfully", {
        endpoint: "/getResizeMtrlStockList",
        Cust_Code,
        records: data.length,
      });

      res.send(data);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching resize material stock list",
      error,
      {
        endpoint: "/getResizeMtrlStockList",
        Cust_Code,
      }
    );
    next(error);
  }
});

/*2. Move Store */
// Fetch movable store material stock by customer code
storeRouter.get("/getMoveStoreMtrlStockByCustomer", async (req, res, next) => {
  const { code: Cust_Code } = req.query;

  infoLogger.info("Requested movable store material stock", {
    endpoint: "/getMoveStoreMtrlStockByCustomer",
    method: req.method,
    Cust_Code,
  });

  try {
    misQueryMod(
      `SELECT * 
       FROM magodmis.MtrlStocklist 
       WHERE cust_code = ? 
         AND (NOT Locked OR Scrap)`,
      [Cust_Code],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching movable store material stock",
            err,
            {
              endpoint: "/getMoveStoreMtrlStockByCustomer",
              Cust_Code,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched movable store material stock successfully", {
          endpoint: "/getMoveStoreMtrlStockByCustomer",
          Cust_Code,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching movable store material stock",
      error,
      {
        endpoint: "/getMoveStoreMtrlStockByCustomer",
        Cust_Code,
      }
    );
    next(error);
  }
});

// Fetch movable store material stock by location
storeRouter.get("/getMoveStoreMtrlStockByLocation", async (req, res, next) => {
  const { location: LocationNo } = req.query;

  infoLogger.info("Requested movable store material stock by location", {
    endpoint: "/getMoveStoreMtrlStockByLocation",
    method: req.method,
    LocationNo,
  });

  try {
    misQueryMod(
      `SELECT * 
       FROM magodmis.MtrlStocklist 
       WHERE LocationNo = ? 
         AND (NOT Locked OR Scrap)`,
      [LocationNo],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching movable store material stock by location",
            err,
            {
              endpoint: "/getMoveStoreMtrlStockByLocation",
              LocationNo,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Fetched movable store material stock by location successfully",
          {
            endpoint: "/getMoveStoreMtrlStockByLocation",
            LocationNo,
            records: data.length,
          }
        );

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching movable store material stock by location",
      error,
      {
        endpoint: "/getMoveStoreMtrlStockByLocation",
        LocationNo,
      }
    );
    next(error);
  }
});

// Fetch movable store customer material stock by location
storeRouter.get(
  "/getMoveStoreCustomerMtrlStockByLocation",
  async (req, res, next) => {
    const { location: LocationNo } = req.query;

    infoLogger.info(
      "Requested movable store customer material stock by location",
      {
        endpoint: "/getMoveStoreCustomerMtrlStockByLocation",
        method: req.method,
        LocationNo,
      }
    );

    try {
      // First, disable ONLY_FULL_GROUP_BY for this session
      misQueryMod(
        `SET @@sql_mode = REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', '')`,
        (err) => {
          if (err) {
            errorLogger.error("Error disabling ONLY_FULL_GROUP_BY mode", err, {
              endpoint: "/getMoveStoreCustomerMtrlStockByLocation",
              LocationNo,
            });
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          // Then, run the main query
          misQueryMod(
            `SELECT * 
             FROM magodmis.MtrlStocklist 
             WHERE LocationNo = ? 
               AND (NOT Locked OR Scrap)
             GROUP BY Cust_Code`,
            [LocationNo],
            (err, data) => {
              if (err) {
                errorLogger.error(
                  "Error fetching movable store customer material stock by location",
                  err,
                  {
                    endpoint: "/getMoveStoreCustomerMtrlStockByLocation",
                    LocationNo,
                  }
                );
                return res
                  .status(500)
                  .json({ Status: "Error", Message: "Database error" });
              }

              infoLogger.info(
                "Fetched movable store customer material stock by location successfully",
                {
                  endpoint: "/getMoveStoreCustomerMtrlStockByLocation",
                  LocationNo,
                  records: data.length,
                }
              );

              res.send(data);
            }
          );
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching movable store customer material stock by location",
        error,
        {
          endpoint: "/getMoveStoreCustomerMtrlStockByLocation",
          LocationNo,
        }
      );
      next(error);
    }
  }
);

// Fetch latest 500 movable store material stock records
storeRouter.get("/getMoveStoreMtrlStockByAll", async (req, res, next) => {
  infoLogger.info("Requested all movable store material stock", {
    endpoint: "/getMoveStoreMtrlStockByAll",
    method: req.method,
  });

  try {
    misQueryMod(
      `SELECT * 
       FROM magodmis.MtrlStocklist 
       WHERE (NOT Locked OR Scrap) 
       ORDER BY MtrlStockID DESC 
       `,
      [],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching movable store material stock",
            err,
            {
              endpoint: "/getMoveStoreMtrlStockByAll",
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched movable store material stock successfully", {
          endpoint: "/getMoveStoreMtrlStockByAll",
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching movable store material stock",
      error,
      {
        endpoint: "/getMoveStoreMtrlStockByAll",
      }
    );
    next(error);
  }
});

// Update material stock location by MtrlStockID
storeRouter.post(
  "/updateMtrlstockLocationByMtrlStockId",
  async (req, res, next) => {
    const { LocationNo, MtrlStockID } = req.body;

    infoLogger.info("Requested update of material stock location", {
      endpoint: "/updateMtrlstockLocationByMtrlStockId",
      method: req.method,
      LocationNo,
      MtrlStockID,
    });

    try {
      misQueryMod(
        `UPDATE magodmis.MtrlStocklist 
         SET LocationNo = ? 
         WHERE MtrlStockID = ?`,
        [LocationNo, MtrlStockID],
        (err, data) => {
          if (err) {
            errorLogger.error("Error updating material stock location", err, {
              endpoint: "/updateMtrlstockLocationByMtrlStockId",
              LocationNo,
              MtrlStockID,
            });
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Material stock location updated successfully", {
            endpoint: "/updateMtrlstockLocationByMtrlStockId",
            LocationNo,
            MtrlStockID,
            affectedRows: data.affectedRows,
          });

          res.send({
            Status: "Success",
            Message: "Location updated successfully",
            Updated: data.affectedRows,
          });
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating material stock location",
        error,
        {
          endpoint: "/updateMtrlstockLocationByMtrlStockId",
          LocationNo,
          MtrlStockID,
        }
      );
      next(error);
    }
  }
);

/* 3. Location List */

// Get material stock count for a specific location
storeRouter.get("/getLocationListMtrlStockCount", async (req, res, next) => {
  const { location } = req.query;

  infoLogger.info("Requested material stock count by location", {
    endpoint: "/getLocationListMtrlStockCount",
    method: req.method,
    location,
  });

  try {
    misQueryMod(
      `SELECT COUNT(m.MtrlStockID) AS count 
       FROM magodmis.mtrlstocklist m 
       WHERE m.LocationNo LIKE ?`,
      [location],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching material stock count", err, {
            endpoint: "/getLocationListMtrlStockCount",
            location,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        const count = data.length > 0 ? data[0].count : 0;

        infoLogger.info("Fetched material stock count successfully", {
          endpoint: "/getLocationListMtrlStockCount",
          location,
          count,
        });

        res.json({
          Status: "Success",
          Location: location,
          Count: count,
        });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching material stock count", error, {
      endpoint: "/getLocationListMtrlStockCount",
      location,
    });
    next(error);
  }
});

/* stock List */
// Fetch stock list summary by customer code (grouped by Material)
storeRouter.get("/getStockListByCustCodeFirst", async (req, res, next) => {
  const { code } = req.query;

  infoLogger.info("Requested stock list summary", {
    endpoint: "/getStockListByCustCodeFirst",
    method: req.method,
    code,
  });

  try {
    misQueryMod(
      `SELECT 
        m.Cust_Code,
        m1.Material,
        COUNT(m.MtrlStockID) AS Qty,
        SUM(m.Weight) AS Weight,
        SUM(m.ScrapWeight) AS ScrapWeight
       FROM
        magodmis.mtrlstocklist m,
        magodmis.mtrlgrades m1,
        magodmis.mtrl_data m2
       WHERE
        m.Cust_Code = ?
        AND (m.IV_No IS NULL OR m.IV_No = '')
        AND m2.Mtrl_Code = m.Mtrl_Code
        AND m1.MtrlGradeID = m2.MtrlGradeID
       GROUP BY m1.Material
       ORDER BY m1.Material`,
      [code],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching stock list summary", err, {
            endpoint: "/getStockListByCustCodeFirst",
            code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched stock list summary successfully", {
          endpoint: "/getStockListByCustCodeFirst",
          code,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching stock list summary", error, {
      endpoint: "/getStockListByCustCodeFirst",
      code,
    });
    next(error);
  }
});

// Fetch stock list details by customer code (grouped by Material and Mtrl_Code)
storeRouter.get("/getStockListByCustCodeSecond", async (req, res, next) => {
  const { code } = req.query;

  infoLogger.info("Requested stock list details", {
    endpoint: "/getStockListByCustCodeSecond",
    method: req.method,
    code,
  });

  try {
    misQueryMod(
      `SELECT 
        m.Cust_Code,
        m.Mtrl_Code,
        m1.Material,
        COUNT(m.MtrlStockID) AS Qty,
        SUM(m.Weight) AS Weight,
        SUM(m.ScrapWeight) AS ScrapWeight
       FROM
        magodmis.mtrlstocklist m,
        magodmis.mtrlgrades m1,
        magodmis.mtrl_data m2
       WHERE
        m.Cust_Code = ?
        AND (m.IV_No IS NULL OR m.IV_No = '')
        AND m2.Mtrl_Code = m.Mtrl_Code
        AND m1.MtrlGradeID = m2.MtrlGradeID
       GROUP BY m1.Material , m.Mtrl_Code
       ORDER BY m.Mtrl_Code`,
      [code],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching stock list details", err, {
            endpoint: "/getStockListByCustCodeSecond",
            code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched stock list details successfully", {
          endpoint: "/getStockListByCustCodeSecond",
          code,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching stock list details", error, {
      endpoint: "/getStockListByCustCodeSecond",
      code,
    });
    next(error);
  }
});

// Fetch detailed stock list by customer code (grouped by Mtrl_Code and dynamic params)
storeRouter.get("/getStockListByCustCodeThird", async (req, res, next) => {
  const { code } = req.query;

  infoLogger.info("Requested detailed stock list", {
    endpoint: "/getStockListByCustCodeThird",
    method: req.method,
    code,
  });

  try {
    misQueryMod(
      `SELECT 
        m.Cust_Code,
        m.Mtrl_Code,
        m.DynamicPara1,
        m.DynamicPara2,
        m.DynamicPara3,
        m.Locked,
        m.Scrap,
        m1.Material,
        COUNT(m.MtrlStockID) AS Qty,
        SUM(m.Weight) AS Weight,
        SUM(m.ScrapWeight) AS ScrapWeight
       FROM
        magodmis.mtrlstocklist m,
        magodmis.mtrlgrades m1,
        magodmis.mtrl_data m2
       WHERE
        m.Cust_Code = ?
        AND (m.IV_No IS NULL OR m.IV_No = '')
        AND m2.Mtrl_Code = m.Mtrl_Code
        AND m1.MtrlGradeID = m2.MtrlGradeID
       GROUP BY m.Mtrl_Code, m.DynamicPara1, m.DynamicPara2, m.DynamicPara3, m.Locked, m.Scrap
       ORDER BY m.Scrap DESC, m.Mtrl_Code`,
      [code],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching detailed stock list", err, {
            endpoint: "/getStockListByCustCodeThird",
            code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched detailed stock list successfully", {
          endpoint: "/getStockListByCustCodeThird",
          code,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching detailed stock list", error, {
      endpoint: "/getStockListByCustCodeThird",
      code,
    });
    next(error);
  }
});

/* Stock Arrival */

// Fetch stock arrival details for a given date (first table)
storeRouter.get("/getStockArrivalFirstTable", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested stock arrival first table", {
    endpoint: "/getStockArrivalFirstTable",
    method: req.method,
    date,
  });

  try {
    misQueryMod(
      `SELECT  
        m.RV_No, 
        m1.Material, 
        SUM(m1.TotalWeightCalculated) AS TotalWeightCalculated,
        SUM(m1.TotalWeight) AS TotalWeight,  
        m.CustDocuNo 
       FROM 
        magodmis.material_receipt_register m,
        magodmis.mtrlreceiptdetails m1 
       WHERE 
        m.RV_No <> 'Draft' 
        AND m.Rv_date = ? 
        AND m1.RvID = m.RvID 
        AND m.Cust_Code = '0000' 
       GROUP BY  
        m.RV_No, m1.Material, m.CustDocuNo`,
      [date],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching stock arrival first table", err, {
            endpoint: "/getStockArrivalFirstTable",
            date,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched stock arrival first table successfully", {
          endpoint: "/getStockArrivalFirstTable",
          date,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching stock arrival first table",
      error,
      {
        endpoint: "/getStockArrivalFirstTable",
        date,
      }
    );
    next(error);
  }
});

// Fetch stock arrival details for a given date (second table)
storeRouter.get("/getStockArrivalSecondTable", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested stock arrival second table", {
    endpoint: "/getStockArrivalSecondTable",
    method: req.method,
    date,
  });

  try {
    misQueryMod(
      `SELECT 
         m1.Mtrl_Rv_id,
         m.Rv_date, 
         m.RV_No, 
         m1.Material, 
         m1.TotalWeightCalculated,
         m1.TotalWeight, 
         m.CustDocuNo, 
         m1.Srl 
       FROM 
         magodmis.material_receipt_register m,
         magodmis.mtrlreceiptdetails m1 
       WHERE 
         m.RV_No <> 'Draft' 
         AND m.Rv_date = ? 
         AND m1.RvID = m.RvID 
         AND m.Cust_Code = '0000'`,
      [date],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching stock arrival second table", err, {
            endpoint: "/getStockArrivalSecondTable",
            date,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched stock arrival second table successfully", {
          endpoint: "/getStockArrivalSecondTable",
          date,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching stock arrival second table",
      error,
      {
        endpoint: "/getStockArrivalSecondTable",
        date,
      }
    );
    next(error);
  }
});

// Fetch stock arrival details for a given date (third table)
storeRouter.get("/getStockArrivalThirdTable", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested stock arrival third table", {
    endpoint: "/getStockArrivalThirdTable",
    method: req.method,
    date,
  });

  try {
    mtrlQueryMod(
      `SELECT * FROM magod_Mtrl.mtrl_receipt_list m WHERE m.Rv_Date = ?`,
      [date],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching stock arrival third table", err, {
            endpoint: "/getStockArrivalThirdTable",
            date,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched stock arrival third table successfully", {
          endpoint: "/getStockArrivalThirdTable",
          date,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching stock arrival third table",
      error,
      {
        endpoint: "/getStockArrivalThirdTable",
        date,
      }
    );
    next(error);
  }
});

// Insert or update stock arrival material receipt
storeRouter.post(
  "/insertStockArrivalMtrlReceiptList",
  async (req, res, next) => {
    const { Rv_Date, RV_No, CustDocuNo, Material, WeightIN } = req.body;

    infoLogger.info("Requested to insert/update stock arrival material", {
      endpoint: "/insertStockArrivalMtrlReceiptList",
      method: req.method,
      body: req.body,
    });

    try {
      mtrlQueryMod(
        `INSERT INTO magod_mtrl.mtrl_receipt_list 
       (Rv_Date, RV_No, CustDocuNo, Material, WeightIN)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE WeightIN = ?`,
        [Rv_Date, RV_No, CustDocuNo, Material, WeightIN, WeightIN],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error inserting/updating stock arrival material",
              err,
              {
                endpoint: "/insertStockArrivalMtrlReceiptList",
                body: req.body,
              }
            );
          }
          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error in insertStockArrivalMtrlReceiptList",
        error,
        {
          endpoint: "/insertStockArrivalMtrlReceiptList",
          body: req.body,
        }
      );
      next(error);
    }
  }
);

/* Stock Dispatch */

// Fetch stock dispatch first table for a given date
storeRouter.get("/getStockDispatchFirstTable", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested stock dispatch first table", {
    endpoint: "/getStockDispatchFirstTable",
    method: req.method,
    date,
  });

  try {
    mtrlQueryMod(
      `SELECT d.DC_Inv_No, d.Inv_No, d.DC_No, d.Inv_Date, d.Cust_Name, d.DC_InvType, 
              d1.Material, SUM(d1.DC_Srl_Wt) AS DC_Srl_Wt
       FROM magodmis.draft_dc_inv_register d
       JOIN magodmis.draft_dc_inv_details d1 ON d.DC_Inv_No = d1.DC_Inv_No
       WHERE d.DC_InvType LIKE '%sales%' 
         AND NOT (d.Inv_No IS NULL OR d.Inv_No LIKE 'Ca%' OR d.Inv_No LIKE 'no%')
         AND d.Inv_Date = ?
       GROUP BY d.DC_Inv_No, d1.Material`,
      [date],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching stock dispatch first table", err, {
            endpoint: "/getStockDispatchFirstTable",
            date,
          });
        }
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in getStockDispatchFirstTable", error, {
      endpoint: "/getStockDispatchFirstTable",
      date,
    });
    next(error);
  }
});

// Fetch stock dispatch second table for a given date
storeRouter.get("/getStockDispatchSecondTable", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested stock dispatch second table", {
    endpoint: "/getStockDispatchSecondTable",
    method: req.method,
    date,
  });

  try {
    mtrlQueryMod(
      `SELECT d.DC_Inv_No, d.Inv_No, d.Inv_Date, d.Cust_Name, d.DC_InvType, 
              d1.Material, d1.Qty, d1.Unit_Wt, d1.DC_Srl_Wt, 
              d1.Draft_dc_inv_DetailsID, d1.DC_Inv_Srl
       FROM magodmis.draft_dc_inv_register d
       JOIN magodmis.draft_dc_inv_details d1 ON d.DC_Inv_No = d1.DC_Inv_No
       WHERE d.DC_InvType LIKE '%sales%' 
         AND NOT (d.Inv_No IS NULL OR d.Inv_No LIKE 'Ca%' OR d.Inv_No LIKE 'no%')
         AND d.Inv_Date = ?`,
      [date],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching stock dispatch second table", err, {
            endpoint: "/getStockDispatchSecondTable",
            date,
          });
        }
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error in getStockDispatchSecondTable",
      error,
      {
        endpoint: "/getStockDispatchSecondTable",
        date,
      }
    );
    next(error);
  }
});

// Fetch stock dispatch third table for a given date
storeRouter.get("/getStockDispatchThirdTable", async (req, res, next) => {
  const { date } = req.query;

  infoLogger.info("Requested stock dispatch third table", {
    endpoint: "/getStockDispatchThirdTable",
    method: req.method,
    date,
  });

  try {
    mtrlQueryMod(
      `SELECT m.*
       FROM magod_mtrl.mtrl_sales m
       WHERE m.InvDate = ?`,
      [date],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching stock dispatch third table", err, {
            endpoint: "/getStockDispatchThirdTable",
            date,
          });
        }
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in getStockDispatchThirdTable", error, {
      endpoint: "/getStockDispatchThirdTable",
      date,
    });
    next(error);
  }
});

// Insert or update stock dispatch material sales
storeRouter.post("/insertStockDispatchMtrlSales", async (req, res, next) => {
  const { InvDate, Inv_No, Cust_Name, Material, DC_InvType, Dc_no, WeightOut } =
    req.body;

  infoLogger.info("Insert or update stock dispatch material sales request", {
    endpoint: "/insertStockDispatchMtrlSales",
    method: req.method,
    payload: req.body,
  });

  try {
    mtrlQueryMod(
      `INSERT INTO magod_mtrl.mtrl_sales 
       (InvDate, Inv_No, Cust_Name, Material, DC_InvType, Dc_no, WeightOut)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE WeightOut = ?`,
      [
        InvDate,
        Inv_No,
        Cust_Name,
        Material,
        DC_InvType,
        Dc_no,
        WeightOut,
        WeightOut,
      ],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error inserting/updating stock dispatch material sales",
            err,
            {
              endpoint: "/insertStockDispatchMtrlSales",
              payload: req.body,
            }
          );
        }
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error in insertStockDispatchMtrlSales",
      error,
      {
        endpoint: "/insertStockDispatchMtrlSales",
        payload: req.body,
      }
    );
    next(error);
  }
});

//Location Stock

// Fetch stock summary by location
storeRouter.get("/getLocationStockSecond", async (req, res, next) => {
  const { location } = req.query;

  infoLogger.info("Requested location stock summary", {
    endpoint: "/getLocationStockSecond",
    method: req.method,
    location,
  });

  try {
    mtrlQueryMod(
      `SELECT m.Cust_Code, m.Customer, m.Mtrl_Code, m.DynamicPara1,
       m.DynamicPara2, m.Scrap, SUM(m.Weight) AS Weight, SUM(m.ScrapWeight) AS SWeight,
       m.LocationNo, COUNT(m.MtrlStockID) AS Quantity
       FROM magodmis.mtrlstocklist m
       WHERE m.LocationNo = ?
       GROUP BY m.Mtrl_Code, m.Cust_Code, m.Customer, m.Scrap, m.DynamicPara1, m.DynamicPara2
       ORDER BY m.Mtrl_Code`,
      [location],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching location stock summary", err, {
            endpoint: "/getLocationStockSecond",
            location,
          });
        }
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching location stock summary",
      error,
      {
        endpoint: "/getLocationStockSecond",
        location,
      }
    );
    next(error);
  }
});

// Fetch detailed stock by location, material, parameters, customer, and scrap flag
storeRouter.get("/getLocationStockThird", async (req, res, next) => {
  const { location, mtrlcode, para1, para2, custcode, scrap } = req.query;

  infoLogger.info("Requested detailed location stock", {
    endpoint: "/getLocationStockThird",
    method: req.method,
    location,
    mtrlcode,
    para1,
    para2,
    custcode,
    scrap,
  });

  try {
    mtrlQueryMod(
      `SELECT * 
       FROM magodmis.mtrlstocklist m
       WHERE m.Mtrl_Code = ? 
         AND m.DynamicPara1 = ? 
         AND m.DynamicPara2 = ? 
         AND m.Cust_Code = ? 
         AND (CASE WHEN ? THEN m.Scrap ELSE NOT m.Scrap END) 
         AND m.LocationNo = ?`,
      [mtrlcode, para1, para2, custcode, scrap, location],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching detailed location stock", err, {
            endpoint: "/getLocationStockThird",
            location,
            mtrlcode,
            para1,
            para2,
            custcode,
            scrap,
          });
        }
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching detailed location stock",
      error,
      {
        endpoint: "/getLocationStockThird",
        location,
        mtrlcode,
        para1,
        para2,
        custcode,
        scrap,
      }
    );
    next(error);
  }
});

module.exports = storeRouter;
