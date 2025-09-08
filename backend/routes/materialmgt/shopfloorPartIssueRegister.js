const shopfloorPartIssueRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Update status in shopfloor part issue register
shopfloorPartIssueRegisterRouter.post(
  "/updateStatusShopfloorPartIssueRegister",
  async (req, res, next) => {
    const { Id, status } = req.body;

    infoLogger.info(
      "Requested update of status in shopfloor part issue register",
      {
        endpoint: "/updateStatusShopfloorPartIssueRegister",
        method: req.method,
        IssueID: Id,
        Status: status,
      }
    );

    try {
      misQueryMod(
        `UPDATE magodmis.shopfloor_part_issueregister s SET s.Status = ? WHERE s.IssueID = ?`,
        [status, Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating status in shopfloor part issue register",
              err,
              {
                endpoint: "/updateStatusShopfloorPartIssueRegister",
                IssueID: Id,
                Status: status,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Updated status successfully", {
            endpoint: "/updateStatusShopfloorPartIssueRegister",
            IssueID: Id,
            Status: status,
          });

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error("Unexpected error updating status", error, {
        endpoint: "/updateStatusShopfloorPartIssueRegister",
        IssueID: Id,
        Status: status,
      });
      next(error);
    }
  }
);

// Insert a new shopfloor part issue register entry
shopfloorPartIssueRegisterRouter.post(
  "/insertShopfloorPartIssueRegister",
  async (req, res, next) => {
    const {
      IV_No,
      Issue_date,
      NC_ProgramNo,
      QtyIssued,
      QtyReturned,
      QtyUsed,
      Ncid,
    } = req.body;

    infoLogger.info(
      "Request received to insert shopfloor part issue register",
      {
        endpoint: "/insertShopfloorPartIssueRegister",
        method: req.method,
        payload: {
          IV_No,
          Issue_date,
          NC_ProgramNo,
          QtyIssued,
          QtyReturned,
          QtyUsed,
          Ncid,
        },
      }
    );

    try {
      const query = `
        INSERT INTO magodmis.shopfloor_part_issueregister
        (IV_No, Issue_date, NC_ProgramNo, QtyIssued, QtyReturned, QtyUsed, Ncid)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        IV_No,
        Issue_date,
        NC_ProgramNo,
        QtyIssued,
        QtyReturned,
        QtyUsed,
        Ncid,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error inserting shopfloor part issue register",
            err,
            {
              endpoint: "/insertShopfloorPartIssueRegister",
              payload: {
                IV_No,
                Issue_date,
                NC_ProgramNo,
                QtyIssued,
                QtyReturned,
                QtyUsed,
                Ncid,
              },
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully inserted data into shopfloor_part_issueregister",
          {
            endpoint: "/insertShopfloorPartIssueRegister",
            insertedId: data?.insertId,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in insertShopfloorPartIssueRegister",
        error,
        {
          endpoint: "/insertShopfloorPartIssueRegister",
          payload: {
            IV_No,
            Issue_date,
            NC_ProgramNo,
            QtyIssued,
            QtyReturned,
            QtyUsed,
            Ncid,
          },
        }
      );
      next(error);
    }
  }
);

module.exports = shopfloorPartIssueRegisterRouter;
