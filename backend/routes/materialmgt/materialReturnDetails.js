const materialReturnDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert returned material details from stock list
materialReturnDetailsRouter.post("/insert", async (req, res, next) => {
  const { DelDate, IV_NO } = req.body;

  infoLogger.info("Requested to insert returned material details", {
    endpoint: "/insert",
    method: req.method,
    IV_NO,
    DelDate,
  });

  try {
    misQueryMod(
      `INSERT INTO magodmis.materialreturneddetails 
       SELECT *, ? FROM magodmis.mtrlstocklist WHERE IV_NO = ?`,
      [DelDate, IV_NO],
      (err, data) => {
        if (err) {
          errorLogger.error("Error inserting returned material details", err, {
            endpoint: "/insert",
            IV_NO,
            DelDate,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Returned material details inserted successfully", {
          endpoint: "/insert",
          IV_NO,
          DelDate,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error inserting returned material details",
      error,
      {
        endpoint: "/insert",
        IV_NO,
        DelDate,
      }
    );
    next(error);
  }
});

// Delete returned material details by IV_NO
materialReturnDetailsRouter.post("/deleteByIVNO", async (req, res, next) => {
  const { IV_NO } = req.body;

  infoLogger.info("Requested to delete returned material details", {
    endpoint: "/deleteByIVNO",
    method: req.method,
    IV_NO,
  });

  try {
    misQueryMod(
      `DELETE FROM magodmis.materialreturneddetails WHERE IV_NO = ?`,
      [IV_NO],
      (err, data) => {
        if (err) {
          errorLogger.error("Error deleting returned material details", err, {
            endpoint: "/deleteByIVNO",
            IV_NO,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Returned material details deleted successfully", {
          endpoint: "/deleteByIVNO",
          IV_NO,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error deleting returned material details",
      error,
      {
        endpoint: "/deleteByIVNO",
        IV_NO,
      }
    );
    next(error);
  }
});

module.exports = materialReturnDetailsRouter;
