const shopfloorBOMIssueDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert a new shopfloor BOM issue detail
shopfloorBOMIssueDetailsRouter.post(
  "/insertShopfloorBOMIssueDetails",
  async (req, res, next) => {
    const {
      IV_ID,
      RV_Id,
      PartReceipt_DetailsID,
      QtyIssued,
      QtyReturned,
      QtyUsed,
    } = req.body;

    infoLogger.info("Request received to insert shopfloor BOM issue detail", {
      endpoint: "/insertShopfloorBOMIssueDetails",
      method: req.method,
      payload: {
        IV_ID,
        RV_Id,
        PartReceipt_DetailsID,
        QtyIssued,
        QtyReturned,
        QtyUsed,
      },
    });

    try {
      const query = `
        INSERT INTO magodmis.shopfloor_bom_issuedetails
        (IV_ID, RV_Id, PartReceipt_DetailsID, QtyIssued, QtyReturned, QtyUsed)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [
        IV_ID,
        RV_Id,
        PartReceipt_DetailsID,
        QtyIssued,
        QtyReturned,
        QtyUsed,
      ];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error(
            "Error inserting into shopfloor_bom_issuedetails",
            err,
            {
              endpoint: "/insertShopfloorBOMIssueDetails",
              payload: {
                IV_ID,
                RV_Id,
                PartReceipt_DetailsID,
                QtyIssued,
                QtyReturned,
                QtyUsed,
              },
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          "Successfully inserted data into shopfloor_bom_issuedetails",
          {
            endpoint: "/insertShopfloorBOMIssueDetails",
            insertedId: data?.insertId,
          }
        );

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in insertShopfloorBOMIssueDetails",
        error,
        {
          endpoint: "/insertShopfloorBOMIssueDetails",
          payload: {
            IV_ID,
            RV_Id,
            PartReceipt_DetailsID,
            QtyIssued,
            QtyReturned,
            QtyUsed,
          },
        }
      );
      next(error);
    }
  }
);

// Update quantity returned in shopfloor BOM issue details
shopfloorBOMIssueDetailsRouter.post(
  "/updateQtyReturnedShopfloorBOMIssueDetails",
  async (req, res, next) => {
    const { Id } = req.body;

    infoLogger.info(
      "Requested update of quantity returned in shopfloor BOM issue details",
      {
        endpoint: "/updateQtyReturnedShopfloorBOMIssueDetails",
        method: req.method,
        Id,
      }
    );

    try {
      misQueryMod(
        `UPDATE magodmis.shopfloor_bom_issuedetails s SET s.QtyReturned = s.QtyIssued WHERE s.Id = ?`,
        [Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating quantity returned in shopfloor BOM issue details",
              err,
              {
                endpoint: "/updateQtyReturnedShopfloorBOMIssueDetails",
                Id,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Updated quantity returned successfully", {
            endpoint: "/updateQtyReturnedShopfloorBOMIssueDetails",
            Id,
          });

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error("Unexpected error updating quantity returned", error, {
        endpoint: "/updateQtyReturnedShopfloorBOMIssueDetails",
        Id,
      });
      next(error);
    }
  }
);

module.exports = shopfloorBOMIssueDetailsRouter;
