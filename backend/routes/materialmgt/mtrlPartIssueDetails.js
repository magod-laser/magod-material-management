const mtrlPartIssueDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert a new material part issue detail
mtrlPartIssueDetailsRouter.post("/insert", async (req, res, next) => {
  const {
    Iv_Id,
    Srl,
    Cust_Code,
    RVId,
    Mtrl_Rv_id,
    PartId,
    CustBOM_Id,
    UnitWt,
    TotalWeight,
    QtyReturned,
    Remarks,
  } = req.body;

  infoLogger.info("Requested to insert material part issue detail", {
    endpoint: "/insert",
    method: req.method,
    Iv_Id,
    PartId,
  });

  try {
    misQueryMod(
      `INSERT INTO magodmis.mtrl_part_issue_details 
      (Iv_Id, Srl, Cust_Code, RVId, Mtrl_Rv_id, PartId, CustBOM_Id, UnitWt, TotalWeight, QtyReturned, Remarks) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Iv_Id,
        Srl,
        Cust_Code,
        RVId,
        Mtrl_Rv_id,
        PartId,
        CustBOM_Id,
        UnitWt,
        TotalWeight,
        QtyReturned,
        Remarks,
      ],
      (err, data) => {
        if (err) {
          errorLogger.error("Error inserting material part issue detail", err, {
            endpoint: "/insert",
            Iv_Id,
            PartId,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Inserted material part issue detail successfully", {
          endpoint: "/insert",
          Iv_Id,
          PartId,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error inserting material part issue detail",
      error,
      {
        endpoint: "/insert",
        Iv_Id,
        PartId,
      }
    );
    next(error);
  }
});

// Fetch material part issue details by IV_Id
mtrlPartIssueDetailsRouter.get(
  "/getmtrlPartIssueDetailsByIVID",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Request received for material part issue details", {
      endpoint: "/getmtrlPartIssueDetailsByIVID",
      method: req.method,
      IV_Id: id,
    });

    try {
      const query = `
        SELECT *
        FROM magodmis.mtrl_part_issue_details
        WHERE Iv_Id = ?
      `;
      const values = [id];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Database error in getmtrlPartIssueDetailsByIVID",
            err,
            {
              endpoint: "/getmtrlPartIssueDetailsByIVID",
              IV_Id: id,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully fetched material part issue details", {
          endpoint: "/getmtrlPartIssueDetailsByIVID",
          IV_Id: id,
          recordsFetched: data?.length || 0,
        });

        res.send(data || []);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in getmtrlPartIssueDetailsByIVID",
        error,
        {
          endpoint: "/getmtrlPartIssueDetailsByIVID",
          IV_Id: id,
        }
      );
      next(error);
    }
  }
);

module.exports = mtrlPartIssueDetailsRouter;
