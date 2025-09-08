const materialIssueRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert a new record into material_issue_register
materialIssueRegisterRouter.post("/insert", async (req, res, next) => {
  const {
    IV_No,
    IV_Date,
    Cust_code,
    Customer,
    CustCSTNo,
    CustTINNo,
    CustECCNo,
    CustGSTNo,
    EMail,
    PkngDcNo,
    PkngDCDate,
    TotalWeight,
    TotalCalculatedWeight,
    UpDated,
    IVStatus,
    Dc_ID,
    Type,
  } = req.body;

  infoLogger.info("Requested insert into material_issue_register", {
    endpoint: "/insert",
    method: "POST",
    IV_No,
    Cust_code,
  });

  try {
    const query = `
      INSERT INTO material_issue_register
        (IV_No, IV_Date, Cust_code, Customer, CustCSTNo, CustTINNo, CustECCNo, CustGSTNo, EMail, PkngDcNo, PkngDCDate, TotalWeight, TotalCalculatedWeight, UpDated, IVStatus, Dc_ID, Type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      IV_No,
      IV_Date,
      Cust_code,
      Customer,
      CustCSTNo,
      CustTINNo,
      CustECCNo,
      CustGSTNo,
      EMail,
      PkngDcNo,
      PkngDCDate,
      TotalWeight,
      TotalCalculatedWeight,
      UpDated,
      IVStatus,
      Dc_ID,
      Type,
    ];

    misQueryMod(query, values, (err, data) => {
      if (err) {
        errorLogger.error("Error inserting into material_issue_register", err, {
          endpoint: "/insert",
          IV_No,
          Cust_code,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info(
        "Successfully inserted record into material_issue_register",
        {
          endpoint: "/insert",
          IV_No,
          Cust_code,
          insertedId: data.insertId,
        }
      );

      res.send(data);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error in /insert material_issue_register",
      error,
      {
        endpoint: "/insert",
        IV_No,
        Cust_code,
      }
    );
    next(error);
  }
});

// Update DC weight and remarks for material or part issue
materialIssueRegisterRouter.post("/updateDCWeight", async (req, res, next) => {
  const { formHeader, outData, type } = req.body;

  infoLogger.info("Requested updateDCWeight", {
    endpoint: "/updateDCWeight",
    method: req.method,
    Iv_Id: formHeader.Iv_Id,
    type,
  });

  try {
    const updateRegisterQuery = `
      UPDATE material_issue_register 
      SET 
        RV_Remarks = ?,
        TotalWeight = ?,
        TotalCalculatedWeight = ?
      WHERE Iv_Id = ?
    `;
    const updateRegisterValues = [
      formHeader.RV_Remarks || "",
      parseFloat(formHeader.TotalWeight || 0).toFixed(3),
      parseFloat(formHeader.TotalCalculatedWeight || 0).toFixed(3),
      formHeader.Iv_Id,
    ];

    misQueryMod(
      updateRegisterQuery,
      updateRegisterValues,
      async (err, data1) => {
        if (err) {
          errorLogger.error("Error updating material_issue_register", err, {
            endpoint: "/updateDCWeight",
            Iv_Id: formHeader.Iv_Id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        if (data1.affectedRows === 0) {
          return res.status(400).json({
            Status: "Error",
            Message: "No rows updated in material_issue_register",
          });
        }

        try {
          if (type === "material") {
            for (const element of outData) {
              const updateMaterialQuery = `
              UPDATE magodmis.mtrlissuedetails
              SET TotalWeightCalculated = ?, TotalWeight = ?, UpDated = ?
              WHERE Iv_Mtrl_Id = ?
            `;
              const values = [
                parseFloat(element.TotalWeightCalculated || 0).toFixed(3),
                parseFloat(element.TotalWeight || 0).toFixed(3),
                element.UpDated || 0,
                element.Iv_Mtrl_Id,
              ];

              await misQueryMod(updateMaterialQuery, values, (err) => {
                if (err) {
                  errorLogger.error("Error updating mtrlissuedetails", err, {
                    Iv_Mtrl_Id: element.Iv_Mtrl_Id,
                  });
                }
              });
            }
          } else if (type === "part") {
            for (const element of outData) {
              const updatePartQuery = `
              UPDATE magodmis.mtrl_part_issue_details
              SET UnitWt = ?, TotalWeight = ?, Remarks = ?
              WHERE Id = ?
            `;
              const values = [
                parseFloat(element.UnitWt || 0).toFixed(3),
                parseFloat(element.TotalWeight || 0).toFixed(3),
                element.Remarks || "",
                element.Id,
              ];

              await misQueryMod(updatePartQuery, values, (err) => {
                if (err) {
                  errorLogger.error(
                    "Error updating mtrl_part_issue_details",
                    err,
                    { Id: element.Id }
                  );
                }
              });
            }
          }

          infoLogger.info("Successfully updated DC weight and details", {
            endpoint: "/updateDCWeight",
            Iv_Id: formHeader.Iv_Id,
            type,
            updatedRows: outData.length,
          });

          res.send(data1);
        } catch (innerError) {
          errorLogger.error(
            "Unexpected error updating issue details",
            innerError,
            {
              endpoint: "/updateDCWeight",
              Iv_Id: formHeader.Iv_Id,
              type,
            }
          );
          next(innerError);
        }
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error in /updateDCWeight", error, {
      endpoint: "/updateDCWeight",
      Iv_Id: formHeader.Iv_Id,
      type,
    });
    next(error);
  }
});

// Update material issue register status to 'Cancelled'
materialIssueRegisterRouter.post(
  "/updateStatusCancel",
  async (req, res, next) => {
    const { Iv_Id } = req.body;

    infoLogger.info("Requested to cancel material issue", {
      endpoint: "/updateStatusCancel",
      method: req.method,
      Iv_Id,
    });

    try {
      misQueryMod(
        `UPDATE material_issue_register SET IVStatus='Cancelled' WHERE Iv_Id = ?`,
        [Iv_Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating material issue status to Cancelled",
              err,
              {
                endpoint: "/updateStatusCancel",
                Iv_Id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Material issue status updated to Cancelled", {
            endpoint: "/updateStatusCancel",
            Iv_Id,
          });

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating material issue status",
        error,
        {
          endpoint: "/updateStatusCancel",
          Iv_Id,
        }
      );
      next(error);
    }
  }
);

// Update material issue register status, DC number and DC ID
materialIssueRegisterRouter.post(
  "/updateStatusDCNoDCID",
  async (req, res, next) => {
    const { Iv_Id, PkngDcNo, Dc_ID } = req.body;

    infoLogger.info("Requested to update material issue with DC details", {
      endpoint: "/updateStatusDCNoDCID",
      method: req.method,
      Iv_Id,
      PkngDcNo,
      Dc_ID,
    });

    try {
      misQueryMod(
        `UPDATE material_issue_register 
       SET IVStatus='Returned', PkngDcNo = ?, PkngDCDate = NOW(), Dc_ID = ? 
       WHERE Iv_Id = ?`,
        [PkngDcNo, Dc_ID, Iv_Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating material issue with DC details",
              err,
              {
                endpoint: "/updateStatusDCNoDCID",
                Iv_Id,
                PkngDcNo,
                Dc_ID,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Material issue updated with DC details successfully",
            {
              endpoint: "/updateStatusDCNoDCID",
              Iv_Id,
              PkngDcNo,
              Dc_ID,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating material issue with DC details",
        error,
        {
          endpoint: "/updateStatusDCNoDCID",
          Iv_Id,
          PkngDcNo,
          Dc_ID,
        }
      );
      next(error);
    }
  }
);

// Fetch material issue register record by Iv_Id
materialIssueRegisterRouter.get(
  "/getMaterialIssueRegisterRouterByIVID",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Requested material issue register record by Iv_Id", {
      endpoint: "/getMaterialIssueRegisterRouterByIVID",
      method: req.method,
      Iv_Id: id,
    });

    try {
      const query = `
        SELECT *,
          DATE_FORMAT(PkngDCDate, '%d/%m/%Y') AS PkngDCDate,
          DATE_FORMAT(IV_Date, '%d/%m/%Y') AS IV_Date
        FROM magodmis.material_issue_register
        WHERE Iv_Id = ?
      `;
      const values = [id];

      await misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching material issue register record",
            err,
            {
              endpoint: "/getMaterialIssueRegisterRouterByIVID",
              Iv_Id: id,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully fetched material issue register record", {
          endpoint: "/getMaterialIssueRegisterRouterByIVID",
          Iv_Id: id,
          recordsFetched: data.length,
        });

        res.send(data[0] || null);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in /getMaterialIssueRegisterRouterByIVID",
        error,
        { endpoint: "/getMaterialIssueRegisterRouterByIVID", Iv_Id: id }
      );
      next(error);
    }
  }
);

// Fetch material issue register return listings by type
materialIssueRegisterRouter.get(
  "/getAllReturnListing",
  async (req, res, next) => {
    const { type } = req.query;

    infoLogger.info("Request received for return listing", {
      endpoint: "/getAllReturnListing",
      method: req.method,
      type,
    });

    let query = "";
    let values = [];

    if (type === "customer") {
      query = `
        SELECT * 
        FROM material_issue_register 
        WHERE cust_code NOT LIKE '0000' 
        ORDER BY iv_no DESC
      `;
    } else if (type === "pending") {
      query = `
        SELECT * 
        FROM material_issue_register 
        WHERE pkngdcno IS NULL 
          AND ivstatus NOT LIKE 'cancelled' 
        ORDER BY iv_no DESC
      `;
    } else if (type === "sales") {
      query = `
        SELECT * 
        FROM material_issue_register 
        WHERE cust_code = '0000' 
        ORDER BY iv_no DESC
      `;
    } else if (type === "cancelled") {
      query = `
        SELECT * 
        FROM material_issue_register 
        WHERE ivstatus LIKE 'cancelled' 
        ORDER BY iv_no DESC
      `;
    } else {
      return res.status(400).json({
        Status: "Error",
        Message: "Invalid type parameter",
      });
    }

    try {
      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error("Database error in getAllReturnListing", err, {
            endpoint: "/getAllReturnListing",
            type,
          });
          return res.status(500).json({
            Status: "Error",
            Message: "Database error",
          });
        }

        infoLogger.info("Successfully fetched return listings", {
          endpoint: "/getAllReturnListing",
          type,
          recordsFetched: data?.length || 0,
        });

        res.send(data || []);
      });
    } catch (error) {
      errorLogger.error("Unexpected error in getAllReturnListing", error, {
        endpoint: "/getAllReturnListing",
        type,
      });
      next(error);
    }
  }
);

// Cancel a material issue voucher (IV) and reset Issue flag in stock
materialIssueRegisterRouter.post("/postCancleIV", async (req, res, next) => {
  const { Iv_Id } = req.body;

  infoLogger.info("Requested postCancleIV", {
    endpoint: "/postCancleIV",
    method: req.method,
    Iv_Id,
  });

  try {
    // Step 1: Update IVStatus to 'Cancelled'
    const updateIVQuery = `
      UPDATE magodmis.material_issue_register
      SET IVStatus = 'Cancelled'
      WHERE Iv_Id = ?
    `;

    misQueryMod(updateIVQuery, [Iv_Id], async (err, data1) => {
      if (err) {
        errorLogger.error(
          "Error updating material_issue_register to Cancelled",
          err,
          { Iv_Id }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      if (data1.affectedRows === 0) {
        infoLogger.info("No IV record updated for cancellation", { Iv_Id });
        return res.send({
          Status: "NoChange",
          Message: "IV not found or already cancelled",
        });
      }

      try {
        // Step 2: Get IV_No for the cancelled record
        const selectIVNoQuery = `
          SELECT IV_No FROM magodmis.material_issue_register WHERE Iv_Id = ?
        `;

        misQueryMod(selectIVNoQuery, [Iv_Id], (err, data2) => {
          if (err) {
            errorLogger.error("Error fetching IV_No after cancellation", err, {
              Iv_Id,
            });
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          if (!data2.length) {
            infoLogger.info("No IV_No found for cancelled IV", { Iv_Id });
            return res.send({ Status: "NoChange", Message: "IV_No not found" });
          }

          const IV_No = data2[0].IV_No;

          // Step 3: Reset Issue flag in mtrlstocklist
          const resetStockQuery = `
            UPDATE magodmis.mtrlstocklist
            SET Issue = '0'
            WHERE IV_No = ?
          `;

          misQueryMod(resetStockQuery, [IV_No], (err, data3) => {
            if (err) {
              errorLogger.error(
                "Error resetting Issue flag in mtrlstocklist",
                err,
                { IV_No }
              );
              return res
                .status(500)
                .json({ Status: "Error", Message: "Database error" });
            }

            infoLogger.info(
              "Successfully cancelled IV and reset stock Issue flag",
              {
                Iv_Id,
                IV_No,
                updatedRows: data3.affectedRows,
              }
            );

            res.send({
              Status: "Success",
              Message: "IV cancelled and stock updated",
              data: data3,
            });
          });
        });
      } catch (innerError) {
        errorLogger.error(
          "Unexpected error in postCancleIV step 2/3",
          innerError,
          { Iv_Id }
        );
        next(innerError);
      }
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /postCancleIV", error, { Iv_Id });
    next(error);
  }
});

module.exports = materialIssueRegisterRouter;
