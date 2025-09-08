const dcRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert a new DC register entry
dcRegisterRouter.post("/insert", async (req, res, next) => {
  const {
    DC_Type,
    DC_No,
    DC_Date,
    Cust_Code,
    Cust_Name,
    Cust_Address,
    Cust_Place,
    Cust_State,
    PIN_Code,
    GSTNo,
    ECC_No,
    TIN_No,
    CST_No,
    AuhtorisingDocu,
    Total_Wt,
    ScarpWt,
    DCStatus,
    Remarks,
  } = req.body;

  infoLogger.info("Requested to insert DC register entry", {
    endpoint: "/insert",
    method: req.method,
    DC_No,
    Cust_Code,
  });

  try {
    misQueryMod(
      `INSERT INTO magodmis.dc_register
        (DC_Type, DC_No, DC_Date, Cust_Code, Cust_Name, Cust_Address, Cust_Place,
         Cust_State, PIN_Code, GSTNo, ECC_No, TIN_No, CST_No, AuhtorisingDocu,
         Total_Wt, ScarpWt, DCStatus, Remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        DC_Type,
        DC_No,
        DC_Date,
        Cust_Code,
        Cust_Name,
        Cust_Address,
        Cust_Place,
        Cust_State,
        PIN_Code,
        GSTNo,
        ECC_No,
        TIN_No,
        CST_No,
        AuhtorisingDocu,
        Total_Wt,
        ScarpWt,
        DCStatus,
        Remarks,
      ],
      (err, data) => {
        if (err) {
          errorLogger.error("Error inserting DC register entry", err, {
            endpoint: "/insert",
            DC_No,
            Cust_Code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Inserted DC register entry successfully", {
          endpoint: "/insert",
          DC_No,
          Cust_Code,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error inserting DC register entry", error, {
      endpoint: "/insert",
      DC_No,
      Cust_Code,
    });
    next(error);
  }
});

// Fetch DC register entry by ID
dcRegisterRouter.get("/getDCRegisterByID", async (req, res, next) => {
  const { id } = req.query;

  infoLogger.info("Requested DC register entry by ID", {
    endpoint: "/getDCRegisterByID",
    method: req.method,
    DC_Id: id,
  });

  try {
    misQueryMod(
      `SELECT * FROM magodmis.dc_register WHERE DC_Id = ?`,
      [id],
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching DC register entry by ID", err, {
            endpoint: "/getDCRegisterByID",
            DC_Id: id,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        if (data.length !== 0) {
          res.send(data[0]);
        } else {
          res.send([]);
        }

        infoLogger.info("Fetched DC register entry successfully", {
          endpoint: "/getDCRegisterByID",
          DC_Id: id,
          found: data.length !== 0,
        });
      }
    );
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching DC register entry by ID",
      error,
      {
        endpoint: "/getDCRegisterByID",
        DC_Id: id,
      }
    );
    next(error);
  }
});

module.exports = dcRegisterRouter;
