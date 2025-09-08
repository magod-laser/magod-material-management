const PDFRouter = require("express").Router();
const { setupQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch PDF data from magodlaser_units
PDFRouter.post("/getPDFData", async (req, res, next) => {
  infoLogger.info("Requested PDF data", {
    endpoint: "/getPDFData",
    method: req.method,
  });

  try {
    setupQueryMod(
      `SELECT * FROM magod_setup.magodlaser_units`,
      (err, pdfData) => {
        if (err) {
          errorLogger.error("Error fetching PDF data", err, {
            endpoint: "/getPDFData",
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched PDF data successfully", {
          endpoint: "/getPDFData",
          records: pdfData.length,
        });

        res.send(pdfData);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching PDF data", error, {
      endpoint: "/getPDFData",
    });
    next(error);
  }
});

module.exports = PDFRouter;
