const mtrlStockListRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { logger, infoLogger, errorLogger } = require("../../helpers/logger");

// Check if stock is available by RV_No
mtrlStockListRouter.get("/checkStockAvailable", async (req, res, next) => {
  try {
    const { rvno } = req.query;

    infoLogger.info("Requested stock availability by RV_No", {
      endpoint: "/checkStockAvailable",
      method: req.method,
      RV_No: rvno,
    });

    const selectQuery = `SELECT * FROM magodmis.mtrlstocklist WHERE RV_No = ?`;

    misQueryMod(selectQuery, [rvno], (err, data) => {
      if (err) {
        errorLogger.error("Error fetching stock from mtrlstocklist", err, {
          RV_No: rvno,
        });
        return next(err);
      }

      infoLogger.info("Successfully fetched stock data", {
        RV_No: rvno,
        records: data.length,
      });

      res.json(data);
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /checkStockAvailable", error, {
      RV_No: req.query.rvno,
    });
    next(error);
  }
});

// Insert multiple rows into mtrlstocklist based on accepted quantity
mtrlStockListRouter.post("/insertMtrlStockList", async (req, res, next) => {
  try {
    let {
      mtrlStockId,
      mtrlRvId,
      custCode,
      customer,
      rvNo,
      custDocuNo,
      mtrlCode,
      shape,
      shapeID,
      material,
      dynamicPara1,
      dynamicPara2,
      dynamicPara3,
      dynamicPara4,
      locked,
      scrap,
      issue,
      weight,
      scrapWeight,
      ivNo,
      ncProgramNo,
      locationNo,
      srl,
      accepted,
    } = req.body;

    infoLogger.info("Requested insertion into mtrlstocklist", {
      endpoint: "/insertMtrlStockList",
      method: req.method,
      Mtrl_Rv_id: mtrlRvId,
      acceptedQty: accepted,
    });

    // Find shape by ShapeID
    misQueryMod(
      "SELECT * FROM shapes WHERE ShapeID = ?",
      [shapeID],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching shape by ShapeID", err, {
            endpoint: "/insertMtrlStockList",
            ShapeID: shapeID,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully fetched shape", {
          endpoint: "/insertMtrlStockList",
          ShapeID: shapeID,
          recordsFetched: data.length,
        });

        if (data && data.length > 0 && data[0].Shape) {
          shape = data[0].Shape;

          for (let i = 0; i < accepted; i++) {
            mtrlStockId = `${rvNo}/${srl}/${i + 1}`;

            const insertQuery = `
              INSERT INTO mtrlstocklist 
              (MtrlStockID,Mtrl_Rv_id,Cust_Code,Customer,RV_No,Cust_Docu_No,Mtrl_Code,Shape,Material,
               DynamicPara1,DynamicPara2,DynamicPara3,DynamicPara4,Locked,Scrap,Issue,Weight,ScrapWeight,IV_No,NCProgramNo,LocationNo)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
              mtrlStockId,
              mtrlRvId,
              custCode,
              customer,
              rvNo,
              custDocuNo,
              mtrlCode,
              shape,
              material,
              dynamicPara1,
              dynamicPara2,
              dynamicPara3,
              dynamicPara4,
              locked,
              scrap,
              issue,
              weight,
              scrapWeight,
              ivNo,
              ncProgramNo,
              locationNo,
            ];

            misQueryMod(insertQuery, values, (insertErr, insertData) => {
              if (insertErr) {
                errorLogger.error(
                  "Error inserting into mtrlstocklist",
                  insertErr,
                  {
                    endpoint: "/insertMtrlStockList",
                    MtrlStockID: mtrlStockId,
                  }
                );
              } else {
                infoLogger.info("Successfully inserted into mtrlstocklist", {
                  endpoint: "/insertMtrlStockList",
                  MtrlStockID: mtrlStockId,
                });
              }
            });
          }
        }

        res.json({ affectedRows: accepted });
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /insertMtrlStockList", error, {
      endpoint: "/insertMtrlStockList",
    });
    next(error);
  }
});

// Delete material stock by RV number after validation checks
mtrlStockListRouter.post("/deleteMtrlStockByRVNo", async (req, res, next) => {
  try {
    const { Mtrl_Rv_id, Accepted } = req.body;

    infoLogger.info("Requested deletion of material stock by RV number", {
      endpoint: "/deleteMtrlStockByRVNo",
      method: req.method,
      Mtrl_Rv_id,
      Accepted,
    });

    // Query to check count of material stock
    const countQuery = `SELECT COUNT(*) AS count FROM magodmis.mtrlstocklist WHERE Mtrl_Rv_id = ?`;
    misQueryMod(countQuery, [Mtrl_Rv_id], (err, countResult) => {
      if (err) {
        errorLogger.error("Error fetching count from mtrlstocklist", err, {
          endpoint: "/deleteMtrlStockByRVNo",
          Mtrl_Rv_id,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Fetched count from mtrlstocklist", {
        endpoint: "/deleteMtrlStockByRVNo",
        Mtrl_Rv_id,
        count: countResult[0].count,
      });

      // Query to check if material is in use for production
      const inUseQuery = `SELECT COUNT(*) AS inUseCount FROM magodmis.mtrlstocklist WHERE Mtrl_Rv_id = ? AND (Locked OR Scrap OR Issue)`;
      misQueryMod(inUseQuery, [Mtrl_Rv_id], (err, inUseResult) => {
        if (err) {
          errorLogger.error(
            "Error fetching in-use count from mtrlstocklist",
            err,
            {
              endpoint: "/deleteMtrlStockByRVNo",
              Mtrl_Rv_id,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched in-use count from mtrlstocklist", {
          endpoint: "/deleteMtrlStockByRVNo",
          Mtrl_Rv_id,
          inUseCount: inUseResult[0].inUseCount,
        });

        // Validation checks
        if (countResult[0].count < parseFloat(Accepted)) {
          return res.json({
            error:
              "Received Material Already used, to return create an Issue Voucher",
          });
        } else if (inUseResult[0].inUseCount > 0) {
          return res.json({
            error:
              "Material already in use for production, cannot take out from stock",
          });
        }

        // Delete query
        const deleteQuery = `DELETE FROM magodmis.mtrlstocklist WHERE Mtrl_Rv_id = ?`;
        misQueryMod(deleteQuery, [Mtrl_Rv_id], (err, deletionResult) => {
          if (err) {
            errorLogger.error("Error deleting material stock", err, {
              endpoint: "/deleteMtrlStockByRVNo",
              Mtrl_Rv_id,
            });
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Successfully deleted material stock", {
            endpoint: "/deleteMtrlStockByRVNo",
            Mtrl_Rv_id,
          });

          return res.json({
            countResult,
            inUseResult,
            deletionResult,
          });
        });
      });
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /deleteMtrlStockByRVNo", error, {
      endpoint: "/deleteMtrlStockByRVNo",
    });
    return res
      .status(500)
      .json({ Status: "Error", Message: "Internal server error" });
  }
});

// Update material sales or return register after removing stock
mtrlStockListRouter.post("/updateAfterRemoveStock", (req, res, next) => {
  try {
    const { rvId, custCode } = req.body;

    infoLogger.info("Requested updateAfterRemoveStock", {
      endpoint: "/updateAfterRemoveStock",
      method: req.method,
      rvId,
      custCode,
    });

    if (custCode === "0000") {
      // Delete existing records from magod_material_sales_register
      const deleteQuery = `DELETE FROM magodmis.magod_material_sales_register WHERE RvID = ?`;
      misQueryMod(deleteQuery, [rvId], (deleteErr, deleteData) => {
        if (deleteErr) {
          errorLogger.error(
            "Error deleting from magod_material_sales_register",
            deleteErr,
            { rvId }
          );
        } else {
          infoLogger.info("Deleted data from magod_material_sales_register", {
            rvId,
          });
        }

        // Insert updated summary data
        const insertQuery = `
          INSERT INTO magodmis.magod_Material_Sales_Register
          (Cust_Code, Cust_Name, MDate, Mtrl_Type, Weight, Rv_No, RvID, Cust_Dc_No, txnType)
          SELECT m.Cust_Code, m.Customer, m.RV_Date, m.Material, ROUND(SUM(m.TotalWeightCalculated), 2) as tw,
                 m.Rv_no, m.RvID, m.Cust_Docu_No, 'Receive'
          FROM magodmis.mtrlreceiptdetails m
          WHERE m.RvID = ? AND m.UpDated
          GROUP BY m.Cust_Code, m.Customer, m.RV_Date, m.Material, m.Rv_no, m.RvID, m.Cust_Docu_No
        `;
        misQueryMod(insertQuery, [rvId], (insertErr, insertData) => {
          if (insertErr) {
            errorLogger.error(
              "Error inserting into magod_material_sales_register",
              insertErr,
              { rvId }
            );
            return next(insertErr);
          }
          infoLogger.info("Inserted data into magod_material_sales_register", {
            rvId,
          });
          res.json(insertData);
        });
      });
    } else {
      // Delete existing records from customer_material_return_register
      const deleteQuery = `DELETE FROM magodmis.customer_material_return_register WHERE RvID = ?`;
      misQueryMod(deleteQuery, [rvId], (deleteErr, deleteData) => {
        if (deleteErr) {
          errorLogger.error(
            "Error deleting from customer_material_return_register",
            deleteErr,
            { rvId }
          );
          return next(deleteErr);
        }
        infoLogger.info("Deleted data from customer_material_return_register", {
          rvId,
        });

        // Insert updated summary data
        const insertQuery = `
          INSERT INTO magodmis.customer_material_return_register
          (Cust_Code, Cust_Name, MDate, Mtrl_Type, Weight, Rv_No, RvID, Cust_Dc_No, txnType)
          SELECT m.Cust_Code, m.Customer, m.RV_Date, m.Material, ROUND(SUM(m.TotalWeightCalculated), 2) as tw,
                 m.Rv_no, m.RvID, m.Cust_Docu_No, 'Receive'
          FROM magodmis.mtrlreceiptdetails m
          WHERE m.RvID = ? AND m.UpDated
          GROUP BY m.Cust_Code, m.Customer, m.RV_Date, m.Material, m.Rv_no, m.RvID, m.Cust_Docu_No
        `;
        misQueryMod(insertQuery, [rvId], (insertErr, insertData) => {
          if (insertErr) {
            errorLogger.error(
              "Error inserting into customer_material_return_register",
              insertErr,
              { rvId }
            );
            return next(insertErr);
          }
          infoLogger.info(
            "Inserted data into customer_material_return_register",
            { rvId }
          );
          res.json(insertData);
        });
      });
    }
  } catch (error) {
    errorLogger.error("Unexpected error in /updateAfterRemoveStock", error, {
      rvId,
      custCode,
    });
    next(error);
  }
});

mtrlStockListRouter.post("/deleteMtrlStockByIVNo", async (req, res, next) => {
  try {
    let { IV_No } = req.body;
    misQueryMod(
      `delete from magodmis.mtrlstocklist where IV_No =  "${IV_No}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateIssueIVNo", async (req, res, next) => {
  try {
    let { Issue, Iv_No, MtrlStockID } = req.body;

    misQueryMod(
      `update magodmis.mtrlstocklist set Issue="${Issue}", Iv_No = "${Iv_No}" where MtrlStockID =  "${MtrlStockID}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateIVNoNULL", async (req, res, next) => {
  try {
    let { IV_No } = req.body;

    misQueryMod(
      `update magodmis.mtrlstocklist set Iv_No= null where Iv_No = "${IV_No}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateMtrlStockLock", async (req, res, next) => {
  try {
    let { id } = req.body;
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist SET Locked=1 WHERE MtrlStockID='${id}'`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully updated mtrlstocklist for MtrlStockID='${id}'`
        );
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateMtrlStockLock1", async (req, res, next) => {
  try {
    let { DynamicPara1, DynamicPara2, LocationNo, Weight, MtrlStockID } =
      req.body;
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist m 
      SET  m.Locked=0, m.DynamicPara1=${DynamicPara1},
      m.DynamicPara2=${DynamicPara2}, m.LocationNo ='${LocationNo}', m.Weight =${Weight} 
      WHERE m.MtrlStockID='${MtrlStockID}'`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully updated mtrlstocklist for MtrlStockID='${MtrlStockID}'`
        );
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateMtrlStockLock2", async (req, res, next) => {
  try {
    let { ScrapWeight, LocationNo, MtrlStockID } = req.body;
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist m 
      SET m.DynamicPara1=0,m.DynamicPara2=0,m.Weight=0, m.Scrap=-1, 
      m.Locked=-1,m.ScrapWeight=${ScrapWeight}, m.LocationNo ='${LocationNo}' 
      WHERE m.MtrlStockID='${MtrlStockID}'`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully updated mtrlstocklist for MtrlStockID='${MtrlStockID}'`
        );
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateMtrlStockLock3", async (req, res, next) => {
  try {
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist
          SET
              DynamicPara1 = '0.00',
              DynamicPara2 = '0.00',
              Scrap = -1,
              Locked = -1,
              Weight = '0.000',
              ScrapWeight = '0.000',
              LocationNo = '${req.body.LocationNo}'
          WHERE
              MtrlStockID = '${req.body.MtrlStockID}'`,

      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully updated mtrlstocklist for MtrlStockID = '${req.body.MtrlStockID}'`
        );

        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/insertByReturnDetails", async (req, res, next) => {
  try {
    let { Iv_Id, IV_No } = req.body;
    misQueryMod(
      `INSERT INTO  mtrlstocklist(MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No, Mtrl_Code, Shape, Material, DynamicPara1,
        DynamicPara2, DynamicPara3, DynamicPara4, Locked, Scrap, Issue, Weight, ScrapWeight,  NCProgramNo, LocationNo) 
        SELECT MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No,Mtrl_Code, Shape, Material, DynamicPara1, DynamicPara2, DynamicPara3,
        DynamicPara4, Locked, Scrap, Issue, Weight, ScrapWeight,  NCProgramNo, LocationNo FROM materialreturneddetails WHERE IV_No = '${IV_No}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/insertByMtrlStockID", async (req, res, next) => {
  try {
    let {
      DynamicPara1,
      DynamicPara2,
      DynamicPara3,
      LocationNo,
      Weight,
      MtrlStockID,
      MtrlStockIDNew,
    } = req.body;
    misQueryMod(
      `INSERT INTO magodmis.mtrlstocklist (MtrlStockID,Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No, Mtrl_Code, Shape, 
      Material, DynamicPara1, DynamicPara2, DynamicPara3, LocationNo, Weight) 
      SELECT  ${MtrlStockIDNew}, m.Mtrl_Rv_id, m.Cust_Code, m.Customer, m.RV_No, m.Cust_Docu_No, m.Mtrl_Code, m.Shape, m.Material, 
      ${DynamicPara1}, ${DynamicPara2},${DynamicPara3}, '${LocationNo}', ${Weight} FROM magodmis.mtrlstocklist m 
      WHERE m.MtrlStockID= '${MtrlStockID}' `,
      (err, data) => {
        if (err) logger.error(err);
        logger.info("successfully inserted data into mtrlstocklist");
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.get(
  "/getDataByMtrlStockIdResize",
  async (req, res, next) => {
    try {
      misQueryMod(
        `
        SELECT * FROM magodmis.mtrlstocklist WHERE MtrlStockID = '${req.query.MtrlStockID}'`,

        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully fetched data from mtrlstocklist for MtrlStockID = '${req.query.MtrlStockID}'`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlStockListRouter.post(
  "/insertByMtrlStockIDResize",
  async (req, res, next) => {
    try {
      misQueryMod(
        `INSERT INTO magodmis.mtrlstocklist(MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Mtrl_Code, Shape, Material, DynamicPara1, DynamicPara2, DynamicPara3, DynamicPara4, Locked, Scrap, Issue, Weight, ScrapWeight, IV_No, LocationNo) VALUES ('${req.body.MtrlStockID}', ${req.body.Mtrl_Rv_id}, '${req.body.Cust_Code}', '${req.body.Customer}','${req.body.RV_No}','${req.body.Mtrl_Code}', '${req.body.Shape}', '${req.body.Material}', '${req.body.DynamicPara1}', '${req.body.DynamicPara2}', '${req.body.DynamicPara3}', '${req.body.DynamicPara4}', ${req.body.Locked}, ${req.body.Scrap}, ${req.body.Issue}, '${req.body.Weight}', '${req.body.ScrapWeight}', '${req.body.IV_No}', '${req.body.LocationNo}')`,

        (err, data) => {
          if (err) logger.error(err);
          logger.info("successfully inserted data into mtrlstocklist");

          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlStockListRouter.get("/getCustomerDetails", async (req, res, next) => {
  try {
    await misQueryMod(
      "SELECT Customer,Cust_Code FROM magodmis.mtrlstocklist group by Customer,Cust_Code order by Cust_Code not like 0000 ",
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = mtrlStockListRouter;
