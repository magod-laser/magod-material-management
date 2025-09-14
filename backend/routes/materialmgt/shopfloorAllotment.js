const shopFloorAllotmentRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { logger, infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch shop floor allotment first table by NCID
shopFloorAllotmentRouter.get(
  "/getShopFloorAllotmentPartFirstTable",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Request received for shop floor allotment first table", {
      endpoint: "/getShopFloorAllotmentPartFirstTable",
      method: req.method,
      Ncid: id,
    });

    try {
      const query = `
        SELECT c1.id, c2.PartId, c1.Quantity AS QtyPerAssy, c2.Id AS CustBOM_Id,
               n.Sheets * c1.Quantity AS QtyRequired, n.NC_Pgme_Part_ID, n.QtyRejected
        FROM magodmis.ncprogram_partslist n
        JOIN magodmis.task_partslist t ON n.Task_Part_Id = t.Task_Part_Id
        JOIN magodmis.orderscheduledetails o ON t.SchDetailsId = o.SchDetailsID
        JOIN magodmis.cust_assy_data c ON c.MagodCode = o.Dwg_Code
        JOIN magodmis.cust_assy_bom_list c1 ON c1.Cust_AssyId = c.Id
        JOIN magodmis.cust_bomlist c2 ON c1.Cust_BOM_ListId = c2.Id
        WHERE n.Ncid = ?
      `;

      misQueryMod(query, [id], (err, data) => {
        if (err) {
          errorLogger.error(
            "Database error fetching shop floor allotment first table",
            err,
            {
              endpoint: "/getShopFloorAllotmentPartFirstTable",
              Ncid: id,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully fetched shop floor allotment first table",
          {
            endpoint: "/getShopFloorAllotmentPartFirstTable",
            Ncid: id,
            recordsFetched: data?.length || 0,
          }
        );

        res.send(data || []);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in getShopFloorAllotmentPartFirstTable",
        error,
        {
          endpoint: "/getShopFloorAllotmentPartFirstTable",
          Ncid: id,
        }
      );
      next(error);
    }
  }
);

// Fetch available quantity for shop floor allotment part by CustBOM_Id
shopFloorAllotmentRouter.get(
  "/getShopFloorAllotmentPartFirstTableQtyAvl",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Requested available quantity for Shop Floor Allotment", {
      endpoint: "/getShopFloorAllotmentPartFirstTableQtyAvl",
      method: req.method,
      id,
    });

    try {
      misQueryMod(
        `SELECT SUM(m.QtyAccepted - m.QtyIssued - m.QtyReturned) AS QtyAvialable
         FROM magodmis.mtrl_part_receipt_details m
         JOIN magodmis.material_receipt_register m1 ON m.RvID = m1.RvID
         WHERE m.CustBOM_Id = ?
           AND m1.RVStatus = 'Received'
           AND m.QtyAccepted > m.QtyIssued + m.QtyReturned`,
        [id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error fetching available quantity for Shop Floor Allotment",
              err,
              {
                endpoint: "/getShopFloorAllotmentPartFirstTableQtyAvl",
                id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Fetched available quantity for Shop Floor Allotment successfully",
            {
              endpoint: "/getShopFloorAllotmentPartFirstTableQtyAvl",
              id,
              records: data.length,
            }
          );
          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching available quantity for Shop Floor Allotment",
        error,
        {
          endpoint: "/getShopFloorAllotmentPartFirstTableQtyAvl",
          id,
        }
      );
      next(error);
    }
  }
);

// Fetch material part receipt details for second table by CustBOM IDs (old query style)
shopFloorAllotmentRouter.get(
  "/getShopFloorAllotmentPartSecondTableIds",
  async (req, res, next) => {
    const { bomids } = req.query;

    infoLogger.info("Request received for shop floor allotment second table", {
      endpoint: "/getShopFloorAllotmentPartSecondTableIds",
      method: req.method,
      CustBOM_Ids: bomids,
    });

    try {
      if (!bomids) {
        errorLogger.error("CustBOM IDs not provided", null, {
          endpoint: "/getShopFloorAllotmentPartSecondTableIds",
        });
        return res
          .status(400)
          .json({ Status: "Error", Message: "CustBOM IDs are required" });
      }

      // Using old query style directly
      const query = `
        SELECT m.*, m1.RV_No, m1.RV_Date 
        FROM magodmis.mtrl_part_receipt_details m, magodmis.material_receipt_register m1 
        WHERE m.CustBOM_Id in (${bomids}) AND m1.RvID=m.RVId AND m1.RVStatus='Received'
          AND m.QtyAccepted > m.QtyIssued + m.QtyReturned 
        ORDER BY CustBOM_Id, m1.RV_Date
      `;

      misQueryMod(query, (err, data) => {
        if (err) {
          errorLogger.error("Database error fetching second table data", err, {
            endpoint: "/getShopFloorAllotmentPartSecondTableIds",
            CustBOM_Ids: bomids,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully fetched second table data", {
          endpoint: "/getShopFloorAllotmentPartSecondTableIds",
          CustBOM_Ids: bomids,
          recordsFetched: data?.length || 0,
        });

        res.send(data || []);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in getShopFloorAllotmentPartSecondTableIds",
        error,
        {
          endpoint: "/getShopFloorAllotmentPartSecondTableIds",
          CustBOM_Ids: bomids,
        }
      );
      next(error);
    }
  }
);

module.exports = shopFloorAllotmentRouter;
