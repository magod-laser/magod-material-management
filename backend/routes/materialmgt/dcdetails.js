const dcDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Insert a new DC detail
dcDetailsRouter.post("/insert", async (req, res, next) => {
  const {
    DC_ID,
    DC_Srl,
    Cust_Code,
    cust_docu_No,
    Item_Descrption,
    Material,
    Qty,
    Unit_Wt,
    DC_Srl_Wt,
    Excise_CL_no,
    DespStatus,
  } = req.body;

  infoLogger.info("Requested to insert DC detail", {
    endpoint: "/insert",
    method: req.method,
    DC_ID,
    DC_Srl,
    Cust_Code,
  });

  try {
    misQueryMod(
      `INSERT INTO magodmis.dc_details
       (DC_ID, DC_Srl, Cust_Code, cust_docu_No, Item_Descrption, Material, Qty,
        Unit_Wt, DC_Srl_Wt, Excise_CL_no, DespStatus) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        DC_ID,
        DC_Srl,
        Cust_Code,
        cust_docu_No,
        Item_Descrption,
        Material,
        Qty,
        Unit_Wt,
        DC_Srl_Wt,
        Excise_CL_no,
        DespStatus,
      ],
      (err, data) => {
        if (err) {
          errorLogger.error("Error inserting DC detail", err, {
            endpoint: "/insert",
            DC_ID,
            DC_Srl,
            Cust_Code,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Inserted DC detail successfully", {
          endpoint: "/insert",
          DC_ID,
          DC_Srl,
          Cust_Code,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error inserting DC detail", error, {
      endpoint: "/insert",
      DC_ID,
      DC_Srl,
      Cust_Code,
    });
    next(error);
  }
});

// Fetch last inserted DC_ID
dcDetailsRouter.get("/getLastInsertID", async (req, res, next) => {
  infoLogger.info("Requested last inserted DC_ID", {
    endpoint: "/getLastInsertID",
    method: req.method,
  });

  try {
    misQueryMod(
      "SELECT DC_ID FROM magodmis.dc_details ORDER BY DC_ID DESC LIMIT 1",
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching last inserted DC_ID", err, {
            endpoint: "/getLastInsertID",
          });
        }
        res.send(data[0]);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching last inserted DC_ID", error, {
      endpoint: "/getLastInsertID",
    });
    next(error);
  }
});

module.exports = dcDetailsRouter;
