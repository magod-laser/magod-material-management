const shopFloorReturnRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch first main table for shop floor returns
shopFloorReturnRouter.get("/getFirstMainTable", async (req, res, next) => {
  const { status } = req.query;

  infoLogger.info("Requested first main table for shop floor returns", {
    endpoint: "/getFirstMainTable",
    method: req.method,
    Status: status,
  });

  try {
    misQueryMod(
      `SELECT s.*, n.Machine, n.shape, n.mtrl_code, c.cust_name 
         FROM magodmis.shopfloor_material_issueregister s,
              magodmis.ncprograms n,
              magodmis.cust_data c
         WHERE n.NcId = s.NcId 
           AND s.QtyReturned <= s.QtyIssued
           AND s.Status not like 'Closed' 
           AND n.Machine is not null 
           AND c.cust_code = n.Cust_code
         ORDER BY s.Issue_date DESC`,
      [],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error fetching first main table for shop floor returns",
            err,
            {
              endpoint: "/getFirstMainTable",
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched first main table successfully", {
          endpoint: "/getFirstMainTable",
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching first main table", error, {
      endpoint: "/getFirstMainTable",
    });
    next(error);
  }
});

// Fetch second main table for shop floor returns by IssueID
shopFloorReturnRouter.get("/getSecondMainTable", async (req, res, next) => {
  const { id } = req.query;

  infoLogger.info("Requested second main table for shop floor returns", {
    endpoint: "/getSecondMainTable",
    method: req.method,
    IssueID: id,
  });

  try {
    misQueryMod(
      `SELECT * FROM magodmis.ncprogrammtrlallotmentlist n 
         WHERE n.IssueID = ? 
           AND (n.Used OR n.Rejected) 
           AND NOT n.returntostock`,
      [id],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching second main table", err, {
            endpoint: "/getSecondMainTable",
            IssueID: id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched second main table successfully", {
          endpoint: "/getSecondMainTable",
          IssueID: id,
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching second main table", error, {
      endpoint: "/getSecondMainTable",
      IssueID: id,
    });
    next(error);
  }
});

module.exports = shopFloorReturnRouter;
