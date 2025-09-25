const mtrlReceiptDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch mtrlreceiptdetails row by Mtrl_Rv_id
mtrlReceiptDetailsRouter.get(
  "/getMtrlReceiptDetailsByID",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Requested mtrlreceiptdetails by Mtrl_Rv_id", {
      endpoint: "/getMtrlReceiptDetailsByID",
      method: req.method,
      Mtrl_Rv_id: id,
    });

    try {
      const query = `SELECT * FROM mtrlreceiptdetails WHERE Mtrl_Rv_id = ?`;
      const values = [id];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching mtrlreceiptdetails by Mtrl_Rv_id",
            err,
            {
              endpoint: "/getMtrlReceiptDetailsByID",
              Mtrl_Rv_id: id,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully fetched mtrlreceiptdetails by Mtrl_Rv_id",
          {
            endpoint: "/getMtrlReceiptDetailsByID",
            Mtrl_Rv_id: id,
            recordsFetched: data.length,
          }
        );

        res.json(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching mtrlreceiptdetails by Mtrl_Rv_id",
        error,
        {
          endpoint: "/getMtrlReceiptDetailsByID",
          Mtrl_Rv_id: id,
        }
      );
      next(error);
    }
  }
);

// Fetch mtrlreceiptdetails by RvID
mtrlReceiptDetailsRouter.get(
  "/getMtrlReceiptDetailsByRvID",
  async (req, res, next) => {
    try {
      const { id } = req.query;

      infoLogger.info("Requested mtrlreceiptdetails by RvID", {
        endpoint: "/getMtrlReceiptDetailsByRvID",
        method: req.method,
        RvID: id,
      });

      const selectQuery = `SELECT * FROM mtrlreceiptdetails WHERE RvID = ? ORDER BY RvID`;

      misQueryMod(selectQuery, [id], (err, data) => {
        if (err) {
          errorLogger.error("Error fetching mtrlreceiptdetails by RvID", err, {
            RvID: id,
          });
          return next(err);
        }

        infoLogger.info("Successfully fetched mtrlreceiptdetails data", {
          RvID: id,
          records: data.length,
        });
        res.json(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in /getMtrlReceiptDetailsByRvID",
        error,
        { RvID: req.query.id }
      );
      next(error);
    }
  }
);

// Insert a new row into mtrlreceiptdetails
mtrlReceiptDetailsRouter.post(
  "/insertMtrlReceiptDetails",
  async (req, res, next) => {
    let {
      rvId,
      srl,
      custCode,
      mtrlCode,
      material,
      shapeMtrlId,
      shapeID,
      dynamicPara1,
      dynamicPara2,
      dynamicPara3,
      qty,
      inspected,
      accepted,
      totalWeightCalculated,
      totalWeight,
      locationNo,
      updated,
      qtyRejected,
      qtyUsed,
      qtyReturned,
    } = req.body;

    inspected = inspected === "on" ? "1" : "0";

    infoLogger.info("Requested insert into mtrlreceiptdetails", {
      endpoint: "/insertMtrlReceiptDetails",
      method: req.method,
      RvID: rvId,
    });

    try {
      const query = `
      INSERT INTO mtrlreceiptdetails
      (RvID, Srl, Cust_Code, Mtrl_Code, Material, ShapeMtrlID, ShapeID, DynamicPara1, DynamicPara2, DynamicPara3,
       Qty, Inspected, Accepted, TotalWeightCalculated, TotalWeight, LocationNo, Updated, QtyRejected, QtyUsed, QtyReturned)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

      const values = [
        rvId,
        srl,
        custCode,
        mtrlCode,
        material,
        shapeMtrlId,
        shapeID,
        dynamicPara1,
        dynamicPara2,
        dynamicPara3,
        qty,
        inspected,
        accepted,
        totalWeightCalculated,
        totalWeight,
        locationNo,
        updated,
        qtyRejected,
        qtyUsed,
        qtyReturned,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error("Error inserting into mtrlreceiptdetails", err, {
            endpoint: "/insertMtrlReceiptDetails",
            RvID: rvId,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully inserted data into mtrlreceiptdetails", {
          endpoint: "/insertMtrlReceiptDetails",
          RvID: rvId,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error inserting into mtrlreceiptdetails",
        error,
        {
          endpoint: "/insertMtrlReceiptDetails",
          RvID: rvId,
        }
      );
      next(error);
    }
  }
);

// Update specific fields in mtrlreceiptdetails after processing
mtrlReceiptDetailsRouter.post(
  "/updateMtrlReceiptDetailsAfter",
  async (req, res, next) => {
    let {
      accepted,
      dynamicPara1,
      dynamicPara2,
      dynamicPara3,
      id,
      inspected,
      locationNo,
      mtrlCode,
      qty,
      qtyRejected,
      srl,
      totalWeightCalculated,
      totalWeight,
    } = req.body;

    inspected = inspected === true ? "1" : "0";

    infoLogger.info(
      "Requested update for mtrlreceiptdetails after processing",
      {
        endpoint: "/updateMtrlReceiptDetailsAfter",
        method: req.method,
        Mtrl_Rv_id: id,
      }
    );

    try {
      const query = `
      UPDATE mtrlreceiptdetails SET 
        Srl = ?, 
        Mtrl_Code = ?, 
        DynamicPara1 = ?, 
        DynamicPara2 = ?, 
        DynamicPara3 = ?, 
        Qty = ?, 
        Inspected = ?, 
        Accepted = ?, 
        TotalWeightCalculated = ?, 
        TotalWeight = ?, 
        LocationNo = ?, 
        QtyRejected = ?
      WHERE Mtrl_Rv_id = ?
    `;

      const values = [
        srl,
        mtrlCode,
        dynamicPara1,
        dynamicPara2,
        dynamicPara3,
        qty,
        inspected,
        accepted,
        totalWeightCalculated,
        totalWeight,
        locationNo,
        qtyRejected,
        id,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error updating mtrlreceiptdetails after processing",
            err,
            {
              endpoint: "/updateMtrlReceiptDetailsAfter",
              Mtrl_Rv_id: id,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully updated mtrlreceiptdetails after processing",
          {
            endpoint: "/updateMtrlReceiptDetailsAfter",
            Mtrl_Rv_id: id,
          }
        );

        res.json(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating mtrlreceiptdetails after processing",
        error,
        {
          endpoint: "/updateMtrlReceiptDetailsAfter",
          Mtrl_Rv_id: id,
        }
      );
      next(error);
    }
  }
);

// Update mtrlreceiptdetails row by Mtrl_Rv_id
mtrlReceiptDetailsRouter.post(
  "/updateMtrlReceiptDetails",
  async (req, res, next) => {
    let {
      id,
      srl,
      custCode,
      mtrlCode,
      material,
      shapeMtrlId,
      shapeID,
      dynamicPara1,
      dynamicPara2,
      dynamicPara3,
      qty,
      inspected,
      accepted,
      totalWeightCalculated,
      totalWeight,
      locationNo,
      updated,
      qtyRejected,
      qtyUsed,
      qtyReturned,
    } = req.body;

    inspected = inspected === "on" ? "1" : "0";

    infoLogger.info("Requested update for mtrlreceiptdetails", {
      endpoint: "/updateMtrlReceiptDetails",
      method: req.method,
      Mtrl_Rv_id: id,
    });

    try {
      const query = `
      UPDATE mtrlreceiptdetails 
      SET Srl = ?, Cust_Code = ?, Mtrl_Code = ?, Material = ?, 
          ShapeMtrlID = ?, ShapeID = ?, DynamicPara1 = ?, DynamicPara2 = ?, DynamicPara3 = ?, 
          Qty = ?, Inspected = ?, Accepted = ?, TotalWeightCalculated = ?, TotalWeight = ?, 
          LocationNo = ?, UpDated = ?, QtyRejected = ?, QtyUsed = ?, QtyReturned = ?
      WHERE Mtrl_Rv_id = ?
    `;

      const values = [
        srl,
        custCode,
        mtrlCode,
        material,
        shapeMtrlId,
        shapeID,
        dynamicPara1,
        dynamicPara2,
        dynamicPara3,
        qty,
        inspected,
        accepted,
        totalWeightCalculated,
        totalWeight,
        locationNo,
        updated,
        qtyRejected,
        qtyUsed,
        qtyReturned,
        id,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error("Error updating mtrlreceiptdetails", err, {
            endpoint: "/updateMtrlReceiptDetails",
            Mtrl_Rv_id: id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully updated mtrlreceiptdetails", {
          endpoint: "/updateMtrlReceiptDetails",
          Mtrl_Rv_id: id,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error("Unexpected error updating mtrlreceiptdetails", error, {
        endpoint: "/updateMtrlReceiptDetails",
        Mtrl_Rv_id: id,
      });
      next(error);
    }
  }
);

// Update the UpDated field of a mtrlreceiptdetails row
mtrlReceiptDetailsRouter.post(
  "/updateMtrlReceiptDetailsUpdated",
  async (req, res, next) => {
    try {
      const { id, upDated } = req.body;

      infoLogger.info("Requested update for mtrlreceiptdetails UpDated field", {
        endpoint: "/updateMtrlReceiptDetailsUpdated",
        method: req.method,
        Mtrl_Rv_id: id,
        UpDated: upDated,
      });

      const query = `UPDATE mtrlreceiptdetails SET UpDated = ? WHERE Mtrl_Rv_id = ?`;

      misQueryMod(query, [upDated, id], (err, data) => {
        if (err) {
          errorLogger.error("Error updating mtrlreceiptdetails", err, {
            endpoint: "/updateMtrlReceiptDetailsUpdated",
            Mtrl_Rv_id: id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully updated mtrlreceiptdetails", {
          endpoint: "/updateMtrlReceiptDetailsUpdated",
          Mtrl_Rv_id: id,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in /updateMtrlReceiptDetailsUpdated",
        error,
        {
          endpoint: "/updateMtrlReceiptDetailsUpdated",
        }
      );
      next(error);
    }
  }
);

// Delete material receipt details by Mtrl_Rv_id
mtrlReceiptDetailsRouter.post(
  "/deleteMtrlReceiptDetails",
  async (req, res, next) => {
    try {
      const { id } = req.body;

      infoLogger.info("Requested deleteMtrlReceiptDetails", {
        endpoint: "/deleteMtrlReceiptDetails",
        method: req.method,
        Mtrl_Rv_id: id,
      });

      const deleteQuery = `DELETE FROM mtrlreceiptdetails WHERE Mtrl_Rv_id = ?`;

      misQueryMod(deleteQuery, [id], (err, data) => {
        if (err) {
          errorLogger.error("Error deleting from mtrlreceiptdetails", err, {
            Mtrl_Rv_id: id,
          });
          return next(err);
        }

        infoLogger.info("Successfully deleted from mtrlreceiptdetails", {
          Mtrl_Rv_id: id,
        });
        res.json(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in /deleteMtrlReceiptDetails",
        error,
        { Mtrl_Rv_id: req.body.id }
      );
      next(error);
    }
  }
);

module.exports = mtrlReceiptDetailsRouter;
