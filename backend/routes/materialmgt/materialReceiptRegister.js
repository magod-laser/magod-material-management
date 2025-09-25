const materialReceiptRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");
const { formatDate } = require("../../helpers/utils");

// Fetch material receipt register by type
materialReceiptRegisterRouter.get(
  "/getByTypeMaterialReceiptRegister",
  async (req, res, next) => {
    const { type1, type2, type3 } = req.query;

    infoLogger.info("Requested fetch for material receipt register by type", {
      endpoint: "/getByTypeMaterialReceiptRegister",
      method: req.method,
      type1,
      type2,
    });

    try {
      let query = "";
      let values = [];

      if (type3) {
        query = `
        SELECT * FROM material_receipt_register
        WHERE RVStatus = ? AND Type = ? AND Cust_Code = 0
        ORDER BY ReceiptDate DESC
      `;
        values = [type1, type2];
      } else {
        query = `
        SELECT * FROM material_receipt_register
        WHERE RVStatus = ? AND Type = ? AND Cust_Code NOT LIKE '0000'
        ORDER BY ReceiptDate DESC
      `;
        values = [type1, type2];
      }

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching material_receipt_register by type",
            err,
            {
              endpoint: "/getByTypeMaterialReceiptRegister",
              type1,
              type2,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully fetched material_receipt_register by type",
          {
            endpoint: "/getByTypeMaterialReceiptRegister",
            type1,
            type2,
            recordsFetched: data.length,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching material_receipt_register by type",
        error,
        {
          endpoint: "/getByTypeMaterialReceiptRegister",
          type1,
          type2,
        }
      );
      next(error);
    }
  }
);

// Fetch material receipt register by RvID
materialReceiptRegisterRouter.get(
  "/getByTypeMaterialReceiptRegisterByRvID",
  async (req, res, next) => {
    try {
      const { id } = req.query;

      infoLogger.info("Requested material receipt register by RvID", {
        endpoint: "/getByTypeMaterialReceiptRegisterByRvID",
        method: req.method,
        RvID: id,
      });

      const selectQuery = `SELECT * FROM material_receipt_register WHERE RvID = ? ORDER BY RvID`;

      misQueryMod(selectQuery, [id], (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching material_receipt_register by RvID",
            err,
            { RvID: id }
          );
          return next(err);
        }

        infoLogger.info("Successfully fetched material_receipt_register", {
          RvID: id,
        });
        res.json(data[0]);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in /getByTypeMaterialReceiptRegisterByRvID",
        error,
        { RvID: req.query.id }
      );
      next(error);
    }
  }
);

// Insert header for material receipt register
materialReceiptRegisterRouter.post(
  "/insertHeaderMaterialReceiptRegister",
  async (req, res, next) => {
    try {
      let {
        receiptDate,
        rvNo,
        rvDate,
        status,
        customer,
        customerName,
        reference,
        weight,
        calcWeight,
        type,
      } = req.body;

      receiptDate = formatDate(new Date(), 5);
      rvDate = rvDate.split("/").reverse().join("-");

      infoLogger.info("Requested insert for material receipt register header", {
        endpoint: "/insertHeaderMaterialReceiptRegister",
        method: req.method,
        customer,
        rvNo,
      });

      const query = `
      INSERT INTO material_receipt_register
      (ReceiptDate, RV_No, RV_Date, Cust_Code, Customer, CustDocuNo, RVStatus, TotalWeight, TotalCalculatedWeight, Type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
        receiptDate,
        rvNo,
        rvDate,
        customer,
        customerName,
        reference,
        status,
        weight,
        calcWeight,
        type,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error inserting into material_receipt_register header",
            err,
            {
              endpoint: "/insertHeaderMaterialReceiptRegister",
              customer,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully inserted into material_receipt_register header",
          {
            endpoint: "/insertHeaderMaterialReceiptRegister",
            customer,
            recordsAffected: data.affectedRows,
          }
        );

        res.json(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error inserting into material_receipt_register header",
        error,
        {
          endpoint: "/insertHeaderMaterialReceiptRegister",
          customer,
        }
      );
      next(error);
    }
  }
);

// Update header for material receipt register
materialReceiptRegisterRouter.post(
  "/updateHeaderMaterialReceiptRegister",
  async (req, res, next) => {
    try {
      let {
        rvId,
        receiptDate,
        rvNo,
        rvDate,
        status,
        customer,
        customerName,
        reference,
        weight,
        calcWeight,
      } = req.body;

      receiptDate = formatDate(new Date(), 5);
      rvDate = rvDate.split("/").reverse().join("-");

      infoLogger.info("Requested update for material receipt register header", {
        endpoint: "/updateHeaderMaterialReceiptRegister",
        method: req.method,
        rvId,
        customer,
      });

      const query = `
      UPDATE material_receipt_register
      SET ReceiptDate = ?, RV_No = ?, RV_Date = ?, Cust_Code = ?, Customer = ?, CustDocuNo = ?, RVStatus = ?, TotalWeight = ?, TotalCalculatedWeight = ?
      WHERE RvID = ?
    `;

      const values = [
        receiptDate,
        rvNo,
        rvDate,
        customer,
        customerName,
        reference,
        status,
        weight,
        calcWeight,
        rvId,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error updating material_receipt_register header",
            err,
            {
              endpoint: "/updateHeaderMaterialReceiptRegister",
              rvId,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully updated material_receipt_register header",
          {
            endpoint: "/updateHeaderMaterialReceiptRegister",
            rvId,
            recordsAffected: data.affectedRows,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating material_receipt_register header",
        error,
        {
          endpoint: "/updateHeaderMaterialReceiptRegister",
          rvId,
        }
      );
      next(error);
    }
  }
);

// Delete details of material receipt register and material_receipt_register
materialReceiptRegisterRouter.post(
  "/deleteHeaderMaterialReceiptRegisterAndDetails",
  async (req, res, next) => {
    const { rvId } = req.body;

    infoLogger.info(
      "Requested delete for material receipt register and details",
      {
        endpoint: "/deleteHeaderMaterialReceiptRegisterAndDetails",
        method: req.method,
        rvId,
      }
    );

    try {
      const deleteDetailsQuery =
        "DELETE FROM mtrl_part_receipt_details WHERE RvID = ?";
      const deleteHeaderQuery =
        "DELETE FROM material_receipt_register WHERE RvID = ?";
      const values = [rvId];

      // Delete mtrl_part_receipt_details
      misQueryMod(deleteDetailsQuery, values, (err, detailsResult) => {
        if (err) {
          errorLogger.error(
            "Error deleting from mtrl_part_receipt_details",
            err,
            {
              endpoint: "/deleteHeaderMaterialReceiptRegisterAndDetails",
              rvId,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully deleted from mtrl_part_receipt_details", {
          endpoint: "/deleteHeaderMaterialReceiptRegisterAndDetails",
          rvId,
          recordsAffected: detailsResult.affectedRows,
        });

        // Delete material_receipt_register details
        misQueryMod(deleteHeaderQuery, values, (err, headerResult) => {
          if (err) {
            errorLogger.error(
              "Error deleting from material_receipt_register",
              err,
              {
                endpoint: "/deleteHeaderMaterialReceiptRegisterAndDetails",
                rvId,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Successfully deleted from material_receipt_register",
            {
              endpoint: "/deleteHeaderMaterialReceiptRegisterAndDetails",
              rvId,
              recordsAffected: headerResult.affectedRows,
            }
          );

          res.json({ message: "Header and details deleted successfully." });
        });
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error deleting material receipt register and details",
        error,
        {
          endpoint: "/deleteHeaderMaterialReceiptRegisterAndDetails",
          rvId,
        }
      );
      next(error);
    }
  }
);

module.exports = materialReceiptRegisterRouter;
