const shopfloorMaterialIssueRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert a new record into shopfloor material issue register
shopfloorMaterialIssueRegisterRouter.post(
  "/insertShopfloorMaterialIssueRegister",
  async (req, res, next) => {
    const { IV_No, Issue_date, NC_ProgramNo, QtyIssued, QtyReturned, Ncid } =
      req.body;

    infoLogger.info("Requested insert into shopfloor material issue register", {
      endpoint: "/insertShopfloorMaterialIssueRegister",
      method: req.method,
      IV_No,
      Issue_date,
      NC_ProgramNo,
      QtyIssued,
      QtyReturned,
      Ncid,
    });

    try {
      misQueryMod(
        `INSERT INTO magodmis.shopfloor_material_issueregister
         (IV_No, Issue_date, NC_ProgramNo, QtyIssued, QtyReturned, Ncid, Issue_time) 
         VALUES (?, ?, ?, ?, ?, ?, CURTIME())`,
        [IV_No, Issue_date, NC_ProgramNo, QtyIssued, QtyReturned, Ncid],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error inserting into shopfloor material issue register",
              err,
              {
                endpoint: "/insertShopfloorMaterialIssueRegister",
                IV_No,
                Issue_date,
                NC_ProgramNo,
                QtyIssued,
                QtyReturned,
                Ncid,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Inserted into shopfloor material issue register successfully",
            {
              endpoint: "/insertShopfloorMaterialIssueRegister",
              IV_No,
              Issue_date,
              NC_ProgramNo,
              QtyIssued,
              QtyReturned,
              Ncid,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error inserting into shopfloor material issue register",
        error,
        {
          endpoint: "/insertShopfloorMaterialIssueRegister",
          IV_No,
          Issue_date,
          NC_ProgramNo,
          QtyIssued,
          QtyReturned,
          Ncid,
        }
      );
      next(error);
    }
  }
);

// Increment QtyReturned by 1 for a shopfloor material issue register record
shopfloorMaterialIssueRegisterRouter.post(
  "/updateShopfloorMaterialIssueRegisterQtyReturnedAddOne",
  async (req, res, next) => {
    const { id } = req.body;

    infoLogger.info(
      "Requested to increment QtyReturned in shopfloor_material_issueregister",
      {
        endpoint: "/updateShopfloorMaterialIssueRegisterQtyReturnedAddOne",
        method: req.method,
        IssueID: id,
      }
    );

    try {
      misQueryMod(
        `UPDATE magodmis.shopfloor_material_issueregister s 
         SET s.QtyReturned = s.QtyReturned + 1 
         WHERE s.IssueID = ?`,
        [id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating QtyReturned in shopfloor_material_issueregister",
              err,
              {
                endpoint:
                  "/updateShopfloorMaterialIssueRegisterQtyReturnedAddOne",
                IssueID: id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Updated QtyReturned successfully", {
            endpoint: "/updateShopfloorMaterialIssueRegisterQtyReturnedAddOne",
            IssueID: id,
          });

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error("Unexpected error updating QtyReturned", error, {
        endpoint: "/updateShopfloorMaterialIssueRegisterQtyReturnedAddOne",
        IssueID: id,
      });
      next(error);
    }
  }
);

module.exports = shopfloorMaterialIssueRegisterRouter;
