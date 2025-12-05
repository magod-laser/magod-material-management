const mtrlStockListRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

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

// Delete material stock by IV_No
mtrlStockListRouter.post("/deleteMtrlStockByIVNo", async (req, res, next) => {
  const { IV_No } = req.body;

  infoLogger.info("Requested deletion of material stock by IV_No", {
    endpoint: "/deleteMtrlStockByIVNo",
    method: req.method,
    IV_No,
  });

  try {
    misQueryMod(
      `DELETE FROM magodmis.mtrlstocklist WHERE IV_No = ?`,
      [IV_No],
      (err, data) => {
        if (err) {
          errorLogger.error("Error deleting material stock by IV_No", err, {
            endpoint: "/deleteMtrlStockByIVNo",
            IV_No,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Deleted material stock successfully", {
          endpoint: "/deleteMtrlStockByIVNo",
          IV_No,
          affectedRows: data.affectedRows,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error deleting material stock by IV_No",
      error,
      {
        endpoint: "/deleteMtrlStockByIVNo",
        IV_No,
      }
    );
    next(error);
  }
});

// Update Issue and Iv_No for a given MtrlStockID
mtrlStockListRouter.post("/updateIssueIVNo", async (req, res, next) => {
  const { Issue, Iv_No, MtrlStockID } = req.body;

  infoLogger.info("Requested update of Issue and Iv_No for MtrlStockID", {
    endpoint: "/updateIssueIVNo",
    method: "POST",
    MtrlStockID,
    Issue,
    Iv_No,
  });

  try {
    const query = `
      UPDATE magodmis.mtrlstocklist
      SET Issue = ?, Iv_No = ?
      WHERE MtrlStockID = ?
    `;

    const values = [Issue, Iv_No, MtrlStockID];

    misQueryMod(query, values, (err, data) => {
      if (err) {
        errorLogger.error("Error updating mtrlstocklist Issue and Iv_No", err, {
          endpoint: "/updateIssueIVNo",
          MtrlStockID,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully updated Issue and Iv_No for MtrlStockID", {
        endpoint: "/updateIssueIVNo",
        MtrlStockID,
      });

      res.send(data);
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /updateIssueIVNo", error, {
      endpoint: "/updateIssueIVNo",
      MtrlStockID,
    });
    next(error);
  }
});

// Update IV_No to NULL in mtrlstocklist
mtrlStockListRouter.post("/updateIVNoNULL", async (req, res, next) => {
  const { IV_No } = req.body;

  infoLogger.info("Requested to set IV_No to NULL", {
    endpoint: "/updateIVNoNULL",
    method: req.method,
    IV_No,
  });

  try {
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist SET Iv_No = NULL WHERE Iv_No = ?`,
      [IV_No],
      (err, data) => {
        if (err) {
          errorLogger.error("Error updating IV_No to NULL", err, {
            endpoint: "/updateIVNoNULL",
            IV_No,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("IV_No updated to NULL successfully", {
          endpoint: "/updateIVNoNULL",
          IV_No,
          affectedRows: data.affectedRows,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error updating IV_No to NULL", error, {
      endpoint: "/updateIVNoNULL",
      IV_No,
    });
    next(error);
  }
});

// Lock material stock by MtrlStockID
mtrlStockListRouter.post("/updateMtrlStockLock", async (req, res, next) => {
  const { id } = req.body;

  infoLogger.info("Requested to lock material stock", {
    endpoint: "/updateMtrlStockLock",
    method: req.method,
    MtrlStockID: id,
  });

  try {
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist SET Locked = 1 WHERE MtrlStockID = ?`,
      [id],
      (err, data) => {
        if (err) {
          errorLogger.error("Error locking material stock", err, {
            endpoint: "/updateMtrlStockLock",
            MtrlStockID: id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Material stock locked successfully", {
          endpoint: "/updateMtrlStockLock",
          MtrlStockID: id,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error locking material stock", error, {
      endpoint: "/updateMtrlStockLock",
      MtrlStockID: id,
    });
    next(error);
  }
});

// Unlock and update material stock details by MtrlStockID
mtrlStockListRouter.post("/updateMtrlStockLock1", async (req, res, next) => {
  const { DynamicPara1, DynamicPara2, LocationNo, Weight, MtrlStockID } =
    req.body;

  infoLogger.info("Requested to unlock and update material stock", {
    endpoint: "/updateMtrlStockLock1",
    method: req.method,
    MtrlStockID,
    DynamicPara1,
    DynamicPara2,
    LocationNo,
    Weight,
  });

  try {
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist m 
         SET m.Locked = 0, m.DynamicPara1 = ?, m.DynamicPara2 = ?, m.LocationNo = ?, m.Weight = ? 
         WHERE m.MtrlStockID = ?`,
      [DynamicPara1, DynamicPara2, LocationNo, Weight, MtrlStockID],
      (err, data) => {
        if (err) {
          errorLogger.error("Error updating material stock", err, {
            endpoint: "/updateMtrlStockLock1",
            MtrlStockID,
            DynamicPara1,
            DynamicPara2,
            LocationNo,
            Weight,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Material stock updated successfully", {
          endpoint: "/updateMtrlStockLock1",
          MtrlStockID,
          DynamicPara1,
          DynamicPara2,
          LocationNo,
          Weight,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error updating material stock", error, {
      endpoint: "/updateMtrlStockLock1",
      MtrlStockID,
      DynamicPara1,
      DynamicPara2,
      LocationNo,
      Weight,
    });
    next(error);
  }
});

// Mark material stock as scrap and update details by MtrlStockID
mtrlStockListRouter.post("/updateMtrlStockLock2", async (req, res, next) => {
  const { ScrapWeight, LocationNo, MtrlStockID } = req.body;

  infoLogger.info(
    "Requested to mark material stock as scrap and update details",
    {
      endpoint: "/updateMtrlStockLock2",
      method: req.method,
      MtrlStockID,
      ScrapWeight,
      LocationNo,
    }
  );

  try {
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist m 
         SET m.DynamicPara1 = 0,
             m.DynamicPara2 = 0,
             m.Weight = 0,
             m.Scrap = -1, 
             m.Locked = -1,
             m.ScrapWeight = ?,
             m.LocationNo = ?
         WHERE m.MtrlStockID = ?`,
      [ScrapWeight, LocationNo, MtrlStockID],
      (err, data) => {
        if (err) {
          errorLogger.error("Error updating material stock as scrap", err, {
            endpoint: "/updateMtrlStockLock2",
            MtrlStockID,
            ScrapWeight,
            LocationNo,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Material stock updated as scrap successfully", {
          endpoint: "/updateMtrlStockLock2",
          MtrlStockID,
          ScrapWeight,
          LocationNo,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error updating material stock as scrap",
      error,
      {
        endpoint: "/updateMtrlStockLock2",
        MtrlStockID,
        ScrapWeight,
        LocationNo,
      }
    );
    next(error);
  }
});

// Mark material stock as scrap and reset details by MtrlStockID
mtrlStockListRouter.post("/updateMtrlStockLock3", async (req, res, next) => {
  const { LocationNo, MtrlStockID } = req.body;

  infoLogger.info("Requested to reset and mark material stock as scrap", {
    endpoint: "/updateMtrlStockLock3",
    method: req.method,
    MtrlStockID,
    LocationNo,
  });

  try {
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist
         SET DynamicPara1 = '0.00',
             DynamicPara2 = '0.00',
             Scrap = -1,
             Locked = -1,
             Weight = '0.000',
             ScrapWeight = '0.000',
             LocationNo = ?
         WHERE MtrlStockID = ?`,
      [LocationNo, MtrlStockID],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error updating material stock as scrap and resetting details",
            err,
            {
              endpoint: "/updateMtrlStockLock3",
              MtrlStockID,
              LocationNo,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Material stock reset and marked as scrap successfully",
          {
            endpoint: "/updateMtrlStockLock3",
            MtrlStockID,
            LocationNo,
          }
        );

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error updating material stock as scrap and resetting details",
      error,
      {
        endpoint: "/updateMtrlStockLock3",
        MtrlStockID,
        LocationNo,
      }
    );
    next(error);
  }
});

// Insert records into mtrlstocklist from materialreturneddetails based on IV_No
mtrlStockListRouter.post("/insertByReturnDetails", async (req, res, next) => {
  const { IV_No } = req.body;

  infoLogger.info("Requested to insert stock from return details", {
    endpoint: "/insertByReturnDetails",
    method: req.method,
    IV_No,
  });

  try {
    misQueryMod(
      `INSERT INTO mtrlstocklist 
        (MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No, Mtrl_Code, Shape, Material, DynamicPara1,
        DynamicPara2, DynamicPara3, DynamicPara4, Locked, Scrap, Issue, Weight, ScrapWeight, NCProgramNo, LocationNo)
       SELECT MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No, Mtrl_Code, Shape, Material, DynamicPara1,
        DynamicPara2, DynamicPara3, DynamicPara4, Locked, Scrap, Issue, Weight, ScrapWeight, NCProgramNo, LocationNo
       FROM materialreturneddetails
       WHERE IV_No = ?`,
      [IV_No],
      (err, data) => {
        if (err) {
          errorLogger.error("Error inserting stock from return details", err, {
            endpoint: "/insertByReturnDetails",
            IV_No,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Inserted stock from return details successfully", {
          endpoint: "/insertByReturnDetails",
          IV_No,
          affectedRows: data.affectedRows,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error inserting stock from return details",
      error,
      {
        endpoint: "/insertByReturnDetails",
        IV_No,
      }
    );
    next(error);
  }
});

// Insert a new material stock record by copying from an existing MtrlStockID
mtrlStockListRouter.post("/insertByMtrlStockID", async (req, res, next) => {
  const {
    DynamicPara1,
    DynamicPara2,
    DynamicPara3,
    LocationNo,
    Weight,
    MtrlStockID,
    MtrlStockIDNew,
  } = req.body;

  infoLogger.info(
    "Requested to insert material stock by copying from existing record",
    {
      endpoint: "/insertByMtrlStockID",
      method: req.method,
      MtrlStockID,
      MtrlStockIDNew,
      DynamicPara1,
      DynamicPara2,
      DynamicPara3,
      LocationNo,
      Weight,
    }
  );

  try {
    misQueryMod(
      `INSERT INTO magodmis.mtrlstocklist 
         (MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No, Mtrl_Code, Shape, 
          Material, DynamicPara1, DynamicPara2, DynamicPara3, LocationNo, Weight)
         SELECT ?, m.Mtrl_Rv_id, m.Cust_Code, m.Customer, m.RV_No, m.Cust_Docu_No, m.Mtrl_Code, m.Shape, m.Material, 
                ?, ?, ?, ?, ? 
         FROM magodmis.mtrlstocklist m 
         WHERE m.MtrlStockID = ?`,
      [
        MtrlStockIDNew,
        DynamicPara1,
        DynamicPara2,
        DynamicPara3,
        LocationNo,
        Weight,
        MtrlStockID,
      ],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error inserting material stock by copying existing record",
            err,
            {
              endpoint: "/insertByMtrlStockID",
              MtrlStockID,
              MtrlStockIDNew,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Inserted material stock successfully", {
          endpoint: "/insertByMtrlStockID",
          MtrlStockID,
          MtrlStockIDNew,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error inserting material stock", error, {
      endpoint: "/insertByMtrlStockID",
      MtrlStockID,
      MtrlStockIDNew,
    });
    next(error);
  }
});

// Fetch material stock data by MtrlStockID for resize
mtrlStockListRouter.get(
  "/getDataByMtrlStockIdResize",
  async (req, res, next) => {
    const { MtrlStockID } = req.query;

    infoLogger.info("Requested material stock data for resize", {
      endpoint: "/getDataByMtrlStockIdResize",
      method: req.method,
      MtrlStockID,
    });

    try {
      misQueryMod(
        `SELECT * FROM magodmis.mtrlstocklist WHERE MtrlStockID = ?`,
        [MtrlStockID],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching material stock data for resize",
              err,
              {
                endpoint: "/getDataByMtrlStockIdResize",
                MtrlStockID,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Fetched material stock data successfully", {
            endpoint: "/getDataByMtrlStockIdResize",
            MtrlStockID,
            records: data.length,
          });

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching material stock data for resize",
        error,
        {
          endpoint: "/getDataByMtrlStockIdResize",
          MtrlStockID,
        }
      );
      next(error);
    }
  }
);

// Insert new material stock record for resize
mtrlStockListRouter.post(
  "/insertByMtrlStockIDResize",
  async (req, res, next) => {
    const {
      MtrlStockID,
      Mtrl_Rv_id,
      Cust_Code,
      Customer,
      RV_No,
      Mtrl_Code,
      Shape,
      Material,
      DynamicPara1,
      DynamicPara2,
      DynamicPara3,
      DynamicPara4,
      Locked,
      Scrap,
      Issue,
      Weight,
      ScrapWeight,
      IV_No,
      LocationNo,
    } = req.body;

    infoLogger.info("Insert request for material stock (resize)", {
      endpoint: "/insertByMtrlStockIDResize",
      method: req.method,
      MtrlStockID,
    });

    try {
      misQueryMod(
        `INSERT INTO magodmis.mtrlstocklist
          (MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Mtrl_Code, Shape, Material,
           DynamicPara1, DynamicPara2, DynamicPara3, DynamicPara4, Locked, Scrap, Issue,
           Weight, ScrapWeight, IV_No, LocationNo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          MtrlStockID,
          Mtrl_Rv_id,
          Cust_Code,
          Customer,
          RV_No,
          Mtrl_Code,
          Shape,
          Material,
          DynamicPara1,
          DynamicPara2,
          DynamicPara3,
          DynamicPara4,
          Locked,
          Scrap,
          Issue,
          Weight,
          ScrapWeight,
          IV_No,
          LocationNo,
        ],
        (err, data) => {
          if (err) {
            errorLogger.error("Error inserting material stock (resize)", err, {
              endpoint: "/insertByMtrlStockIDResize",
              MtrlStockID,
            });
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database insert error" });
          }

          infoLogger.info(
            "Successfully inserted material stock record (resize)",
            {
              endpoint: "/insertByMtrlStockIDResize",
              MtrlStockID,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error inserting material stock (resize)",
        error,
        {
          endpoint: "/insertByMtrlStockIDResize",
          MtrlStockID,
        }
      );
      next(error);
    }
  }
);

// Fetch distinct customer details from mtrlstocklist
mtrlStockListRouter.get("/getCustomerDetails", async (req, res, next) => {
  infoLogger.info("Requested customer details", {
    endpoint: "/getCustomerDetails",
    method: "GET",
  });

  try {
    misQueryMod(
      `SELECT Customer, Cust_Code 
       FROM magodmis.mtrlstocklist 
       GROUP BY Customer, Cust_Code 
       ORDER BY Cust_Code NOT LIKE '0000'`,
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching customer details", err, {
            endpoint: "/getCustomerDetails",
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched customer details successfully", {
          endpoint: "/getCustomerDetails",
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching customer details", error, {
      endpoint: "/getCustomerDetails",
    });
    next(error);
  }
});

module.exports = mtrlStockListRouter;
