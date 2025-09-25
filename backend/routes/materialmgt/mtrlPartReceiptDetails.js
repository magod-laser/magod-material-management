const mtrlPartReceiptDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch mtrl_part_receipt_details by RvID
mtrlPartReceiptDetailsRouter.get(
  "/getPartReceiptDetailsByRvID",
  async (req, res, next) => {
    try {
      const { id } = req.query;

      infoLogger.info("Requested mtrl_part_receipt_details by RvID", {
        endpoint: "/getPartReceiptDetailsByRvID",
        method: req.method,
        RvID: id,
      });

      const selectQuery = `SELECT * FROM mtrl_part_receipt_details WHERE RvID = ? ORDER BY RvID`;

      misQueryMod(selectQuery, [id], (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching mtrl_part_receipt_details by RvID",
            err,
            { RvID: id }
          );
          return next(err);
        }

        infoLogger.info("Successfully fetched mtrl_part_receipt_details data", {
          RvID: id,
          records: data.length,
        });
        res.json(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in /getPartReceiptDetailsByRvID",
        error,
        { RvID: req.query.id }
      );
      next(error);
    }
  }
);

// Insert material part receipt details
mtrlPartReceiptDetailsRouter.post(
  "/insertPartReceiptDetails",
  async (req, res, next) => {
    const {
      rvId,
      custBomId,
      unitWeight,
      qtyReceived,
      qtyRejected,
      qtyUsed,
      qtyReturned,
      partId,
      qtyAccepted,
      qtyIssued,
    } = req.body;

    infoLogger.info("Requested insert for material part receipt details", {
      endpoint: "/insertPartReceiptDetails",
      method: req.method,
      rvId,
      custBomId,
    });

    try {
      const query = `
      INSERT INTO mtrl_part_receipt_details 
      (RVID, CustBOM_Id, UnitWt, QtyReceived, QtyRejected, QtyUsed, QtyReturned, PartId, QtyAccepted, QtyIssued)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
        rvId,
        custBomId,
        unitWeight,
        qtyReceived,
        qtyRejected,
        qtyUsed,
        qtyReturned,
        partId,
        qtyAccepted,
        qtyIssued,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error inserting into mtrl_part_receipt_details",
            err,
            {
              endpoint: "/insertPartReceiptDetails",
              rvId,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully inserted into mtrl_part_receipt_details",
          {
            endpoint: "/insertPartReceiptDetails",
            rvId,
            recordsAffected: data.affectedRows,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error inserting into mtrl_part_receipt_details",
        error,
        {
          endpoint: "/insertPartReceiptDetails",
          rvId,
        }
      );
      next(error);
    }
  }
);

// Update material part receipt details
mtrlPartReceiptDetailsRouter.post(
  "/updatePartReceiptDetails",
  async (req, res, next) => {
    const {
      id,
      rvId,
      custBomId,
      unitWeight,
      qtyReceived,
      qtyRejected,
      partId,
      qtyAccepted,
    } = req.body;

    infoLogger.info("Requested update for material part receipt details", {
      endpoint: "/updatePartReceiptDetails",
      method: req.method,
      id,
      rvId,
      custBomId,
    });

    try {
      const query = `
      UPDATE mtrl_part_receipt_details
      SET CustBOM_Id = ?, UnitWt = ?, QtyReceived = ?, QtyRejected = ?, PartId = ?, QtyAccepted = ?
      WHERE id = ?
    `;

      const values = [
        custBomId,
        unitWeight,
        qtyReceived,
        qtyRejected,
        partId,
        qtyAccepted,
        id,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error("Error updating mtrl_part_receipt_details", err, {
            endpoint: "/updatePartReceiptDetails",
            id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully updated mtrl_part_receipt_details", {
          endpoint: "/updatePartReceiptDetails",
          id,
          recordsAffected: data.affectedRows,
        });

        res.json(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating mtrl_part_receipt_details",
        error,
        {
          endpoint: "/updatePartReceiptDetails",
          id,
        }
      );
      next(error);
    }
  }
);

// Delete material part receipt details
mtrlPartReceiptDetailsRouter.post(
  "/deletePartReceiptDetails",
  async (req, res, next) => {
    const { id } = req.body;

    infoLogger.info("Requested delete for material part receipt details", {
      endpoint: "/deletePartReceiptDetails",
      method: req.method,
      id,
    });

    try {
      const query = "DELETE FROM mtrl_part_receipt_details WHERE Id = ?";
      const values = [id];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error deleting from mtrl_part_receipt_details",
            err,
            {
              endpoint: "/deletePartReceiptDetails",
              id,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully deleted from mtrl_part_receipt_details", {
          endpoint: "/deletePartReceiptDetails",
          id,
          recordsAffected: data.affectedRows,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error deleting from mtrl_part_receipt_details",
        error,
        {
          endpoint: "/deletePartReceiptDetails",
          id,
        }
      );
      next(error);
    }
  }
);

// Update QtyReturned in material part receipt details
mtrlPartReceiptDetailsRouter.post(
  "/updateQtyReturnedPartReceiptDetails",
  async (req, res, next) => {
    const { Id, QtyReturned } = req.body;

    infoLogger.info("Requested to update QtyReturned for part receipt detail", {
      endpoint: "/updateQtyReturnedPartReceiptDetails",
      method: req.method,
      Id,
      QtyReturned,
    });

    try {
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details 
         SET QtyReturned = QtyReturned - ? 
         WHERE Id = ?`,
        [QtyReturned, Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating QtyReturned for part receipt detail",
              err,
              {
                endpoint: "/updateQtyReturnedPartReceiptDetails",
                Id,
                QtyReturned,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Updated QtyReturned for part receipt detail successfully",
            {
              endpoint: "/updateQtyReturnedPartReceiptDetails",
              Id,
              QtyReturned,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating QtyReturned for part receipt detail",
        error,
        { endpoint: "/updateQtyReturnedPartReceiptDetails", Id, QtyReturned }
      );
      next(error);
    }
  }
);

// Increment QtyReturned in material part receipt details
mtrlPartReceiptDetailsRouter.post(
  "/updateQtyReturnedPartReceiptDetails1",
  async (req, res, next) => {
    const { Id, QtyReturned } = req.body;

    infoLogger.info(
      "Requested to increment QtyReturned for part receipt detail",
      {
        endpoint: "/updateQtyReturnedPartReceiptDetails1",
        method: req.method,
        Id,
        QtyReturned,
      }
    );

    try {
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details 
         SET QtyReturned = QtyReturned + ? 
         WHERE Id = ?`,
        [QtyReturned, Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error incrementing QtyReturned for part receipt detail",
              err,
              {
                endpoint: "/updateQtyReturnedPartReceiptDetails1",
                Id,
                QtyReturned,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Incremented QtyReturned for part receipt detail successfully",
            {
              endpoint: "/updateQtyReturnedPartReceiptDetails1",
              Id,
              QtyReturned,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error incrementing QtyReturned for part receipt detail",
        error,
        { endpoint: "/updateQtyReturnedPartReceiptDetails1", Id, QtyReturned }
      );
      next(error);
    }
  }
);

// Update quantity issued in part receipt details
mtrlPartReceiptDetailsRouter.post(
  "/updateQtyIssuedPartReceiptDetails",
  async (req, res, next) => {
    const { Id, Qty } = req.body;

    infoLogger.info(
      "Requested update of quantity issued in part receipt details",
      {
        endpoint: "/updateQtyIssuedPartReceiptDetails",
        method: req.method,
        Id,
        Qty,
      }
    );

    try {
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details m SET m.QtyIssued = m.QtyIssued - ? WHERE m.Id = ?`,
        [Qty, Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating quantity issued in part receipt details",
              err,
              {
                endpoint: "/updateQtyIssuedPartReceiptDetails",
                Id,
                Qty,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Updated quantity issued successfully", {
            endpoint: "/updateQtyIssuedPartReceiptDetails",
            Id,
            Qty,
          });

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error("Unexpected error updating quantity issued", error, {
        endpoint: "/updateQtyIssuedPartReceiptDetails",
        Id,
        Qty,
      });
      next(error);
    }
  }
);

// Increment QtyIssued in material part receipt details
mtrlPartReceiptDetailsRouter.post(
  "/updateQtyIssuedPartReceiptDetails1",
  async (req, res, next) => {
    const { Id, Qty } = req.body;

    infoLogger.info(
      "Requested to increment QtyIssued for part receipt detail",
      {
        endpoint: "/updateQtyIssuedPartReceiptDetails1",
        method: req.method,
        Id,
        Qty,
      }
    );

    try {
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details 
         SET QtyIssued = QtyIssued + ? 
         WHERE Id = ?`,
        [Qty, Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error incrementing QtyIssued for part receipt detail",
              err,
              { endpoint: "/updateQtyIssuedPartReceiptDetails1", Id, Qty }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Incremented QtyIssued for part receipt detail successfully",
            { endpoint: "/updateQtyIssuedPartReceiptDetails1", Id, Qty }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error incrementing QtyIssued for part receipt detail",
        error,
        { endpoint: "/updateQtyIssuedPartReceiptDetails1", Id, Qty }
      );
      next(error);
    }
  }
);

// Update QtyIssued in material part receipt details
mtrlPartReceiptDetailsRouter.post(
  "/updateQtyIssuedPartReceiptDetails2",
  async (req, res, next) => {
    const { Id, Qty } = req.body;

    infoLogger.info(
      "Request received to update QtyIssued in material part receipt details",
      {
        endpoint: "/updateQtyIssuedPartReceiptDetails2",
        method: req.method,
        payload: { Id, Qty },
      }
    );

    try {
      const query = `
        UPDATE magodmis.mtrl_part_receipt_details m
        SET m.QtyIssued = CASE 
          WHEN m.QtyIssued <= m.QtyIssued + ? THEN m.QtyIssued + ?
          ELSE m.QtyIssued 
        END
        WHERE m.Id = ?
      `;
      const values = [Qty, Qty, Id];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error updating QtyIssued in mtrl_part_receipt_details",
            err,
            {
              endpoint: "/updateQtyIssuedPartReceiptDetails2",
              payload: { Id, Qty },
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully updated QtyIssued in mtrl_part_receipt_details",
          {
            endpoint: "/updateQtyIssuedPartReceiptDetails2",
            Id,
            recordsAffected: data?.affectedRows || 0,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in updateQtyIssuedPartReceiptDetails2",
        error,
        {
          endpoint: "/updateQtyIssuedPartReceiptDetails2",
          payload: { Id, Qty },
        }
      );
      next(error);
    }
  }
);

module.exports = mtrlPartReceiptDetailsRouter;
