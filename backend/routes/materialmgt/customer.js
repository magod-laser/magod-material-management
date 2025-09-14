const customerRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch all customers ordered by name
customerRouter.get("/allcustomers", async (req, res, next) => {
  infoLogger.info("Requested for all customers list", {
    endpoint: "/allcustomers",
    method: req.method,
  });

  try {
    misQueryMod(
      "SELECT * FROM magodmis.cust_data ORDER BY Cust_name ASC",
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching all customers list", err, {
            endpoint: "/allcustomers",
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched all customers list successfully", {
          endpoint: "/allcustomers",
        });
        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching all customers list", error, {
      endpoint: "/allcustomers",
    });
    next(error);
  }
});

// Fetch customer details by Cust_Code
customerRouter.get("/getCustomerByCustCode", async (req, res, next) => {
  const endpoint = "/getCustomerByCustCode";
  const code = req.query.code;

  infoLogger.info("Requested customer details by Cust_Code", {
    endpoint,
    method: req.method,
    queryParams: { code },
  });

  try {
    misQueryMod(
      `SELECT * FROM magodmis.cust_data WHERE Cust_Code = ${code}`,
      (err, data) => {
        if (err) {
          errorLogger.error(
            `Error fetching customer details for Cust_Code = ${code}`,
            err,
            { endpoint }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info(
          `Fetched customer details successfully for Cust_Code = ${code}`,
          { endpoint }
        );
        res.send(data[0]);
      }
    );
  } catch (error) {
    errorLogger.error(
      `Unexpected error fetching customer details for Cust_Code = ${code}`,
      error,
      { endpoint }
    );
    next(error);
  }
});

module.exports = customerRouter;
