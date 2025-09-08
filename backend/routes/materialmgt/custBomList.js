const custBomListRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch all customer BOM list from magodmis.cust_bomlist ordered by part description
custBomListRouter.get("/allCustBomList", async (req, res, next) => {
  infoLogger.info("Requested for all customer BOM list", {
    endpoint: "/allCustBomList",
    method: req.method,
  });

  try {
    misQueryMod(
      "SELECT * FROM magodmis.cust_bomlist ORDER BY PartDescription ASC",
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching customer BOM list", err, {
            endpoint: "/allCustBomList",
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched customer BOM list successfully", {
          endpoint: "/allCustBomList",
        });
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching customer BOM list", error, {
      endpoint: "/allCustBomList",
    });
    next(error);
  }
});

// Fetch customer BOM entry from magodmis.cust_bomlist by PartId and Cust_code
custBomListRouter.post("/getCustBomId", async (req, res, next) => {
  const { partId, cust_Code } = req.body;

  infoLogger.info("Requested customer BOM entry", {
    endpoint: "/getCustBomId",
    method: req.method,
    partId,
    cust_Code,
  });

  try {
    misQueryMod(
      "SELECT * FROM magodmis.cust_bomlist WHERE PartId = ? AND Cust_code = ?",
      [partId, cust_Code],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching customer BOM entry", err, {
            endpoint: "/getCustBomId",
            partId,
            cust_Code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched customer BOM entry successfully", {
          endpoint: "/getCustBomId",
          partId,
          cust_Code,
          records: data.length,
        });
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching customer BOM entry", error, {
      endpoint: "/getCustBomId",
      partId,
      cust_Code,
    });
    next(error);
  }
});

module.exports = custBomListRouter;
