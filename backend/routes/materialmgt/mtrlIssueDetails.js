const mtrlIssueDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert a new record into mtrlissuedetails
mtrlIssueDetailsRouter.post("/insert", async (req, res, next) => {
  const {
    Iv_Id,
    Srl,
    IV_Date,
    IV_No,
    Cust_Code,
    Customer,
    MtrlDescription,
    Mtrl_Code,
    Material,
    PkngDCNo,
    cust_docu_No,
    RV_No,
    RV_Srl,
    Qty,
    TotalWeightCalculated,
    TotalWeight,
    UpDated,
    RvId,
    Mtrl_Rv_id,
  } = req.body;

  infoLogger.info("Requested insert into mtrlissuedetails", {
    endpoint: "/insert",
    method: "POST",
    IV_No,
    Cust_Code,
  });

  try {
    const query = `
      INSERT INTO mtrlissuedetails
        (Iv_Id, Srl, IV_Date, IV_No, Cust_Code, Customer, MtrlDescription, Mtrl_Code, Material, PkngDCNo, cust_docu_No, RV_No, RV_Srl, Qty, TotalWeightCalculated, TotalWeight, UpDated, RvId, Mtrl_Rv_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      Iv_Id,
      Srl,
      IV_Date,
      IV_No,
      Cust_Code,
      Customer,
      MtrlDescription,
      Mtrl_Code,
      Material,
      PkngDCNo,
      cust_docu_No,
      RV_No,
      RV_Srl,
      Qty,
      TotalWeightCalculated,
      TotalWeight,
      UpDated,
      RvId,
      Mtrl_Rv_id,
    ];

    misQueryMod(query, values, (err, data) => {
      if (err) {
        errorLogger.error("Error inserting into mtrlissuedetails", err, {
          endpoint: "/insert",
          IV_No,
          Cust_Code,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully inserted record into mtrlissuedetails", {
        endpoint: "/insert",
        IV_No,
        Cust_Code,
        insertedId: data.insertId,
      });

      res.send(data);
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /insert mtrlissuedetails", error, {
      endpoint: "/insert",
      IV_No,
      Cust_Code,
    });
    next(error);
  }
});

// Fetch material issue details by IV_Id
mtrlIssueDetailsRouter.get(
  "/getmtrlIssueDetailsByIVID",
  async (req, res, next) => {
    const { id } = req.query;

    infoLogger.info("Requested material issue details by IV_Id", {
      endpoint: "/getmtrlIssueDetailsByIVID",
      method: req.method,
      IV_Id: id,
    });

    try {
      const query = `
      SELECT *
      FROM magodmis.mtrlissuedetails
      WHERE IV_Id = ?
    `;
      const values = [id];

      await misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error("Error fetching material issue details", err, {
            endpoint: "/getmtrlIssueDetailsByIVID",
            IV_Id: id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully fetched material issue details", {
          endpoint: "/getmtrlIssueDetailsByIVID",
          IV_Id: id,
          recordsFetched: data.length,
        });

        res.send(data || []);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in /getmtrlIssueDetailsByIVID",
        error,
        {
          endpoint: "/getmtrlIssueDetailsByIVID",
          IV_Id: id,
        }
      );
      next(error);
    }
  }
);

module.exports = mtrlIssueDetailsRouter;
