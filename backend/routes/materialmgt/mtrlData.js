const mtrlDataRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch all material data ordered by Mtrl_Code
mtrlDataRouter.get("/allmtrldata", async (req, res, next) => {
  infoLogger.info("Requested all material data", {
    endpoint: "/allmtrldata",
    method: req.method,
  });

  try {
    const query = "SELECT * FROM magodmis.mtrl_data ORDER BY Mtrl_Code ASC";

    misQueryMod(query, [], (err, data) => {
      if (err) {
        errorLogger.error("Error fetching data from mtrl_data", err, {
          endpoint: "/allmtrldata",
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully fetched data from mtrl_data", {
        endpoint: "/allmtrldata",
        recordsFetched: data.length,
      });

      res.send(data);
    });
  } catch (error) {
    errorLogger.error("Unexpected error fetching data from mtrl_data", error, {
      endpoint: "/allmtrldata",
    });
    next(error);
  }
});

// Fetch a single material data row by Mtrl_Code
mtrlDataRouter.get("/getRowByMtrlCode", async (req, res, next) => {
  const { code } = req.query;

  infoLogger.info("Requested material data row by Mtrl_Code", {
    endpoint: "/getRowByMtrlCode",
    method: req.method,
    code,
  });

  try {
    const query = "SELECT * FROM magodmis.mtrl_data WHERE Mtrl_Code = ?";
    const values = [code];

    misQueryMod(query, values, (err, data) => {
      if (err) {
        errorLogger.error(
          "Error fetching data from mtrl_data by Mtrl_Code",
          err,
          {
            endpoint: "/getRowByMtrlCode",
            code,
          }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully fetched data from mtrl_data by Mtrl_Code", {
        endpoint: "/getRowByMtrlCode",
        code,
        recordsFetched: data.length,
      });

      res.send(data[0] || null);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching data from mtrl_data by Mtrl_Code",
      error,
      {
        endpoint: "/getRowByMtrlCode",
        code,
      }
    );
    next(error);
  }
});

// Fetch Material from mtrlgrades by MtrlGradeID
mtrlDataRouter.get("/getGradeID", async (req, res, next) => {
  const { gradeid } = req.query;

  infoLogger.info("Requested Material from mtrlgrades by MtrlGradeID", {
    endpoint: "/getGradeID",
    method: req.method,
    gradeid,
  });

  try {
    const query =
      "SELECT Material FROM magodmis.mtrlgrades WHERE MtrlGradeID = ?";
    const values = [gradeid];

    misQueryMod(query, values, (err, data) => {
      if (err) {
        errorLogger.error("Error fetching Material from mtrlgrades", err, {
          endpoint: "/getGradeID",
          gradeid,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully fetched Material from mtrlgrades", {
        endpoint: "/getGradeID",
        gradeid,
        recordsFetched: data.length,
      });

      res.send(data[0] || null);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching Material from mtrlgrades",
      error,
      {
        endpoint: "/getGradeID",
        gradeid,
      }
    );
    next(error);
  }
});

// Fetch mtrl_data joined with mtrlgrades by Mtrl_Code
mtrlDataRouter.get("/getSpecific_Wt", async (req, res, next) => {
  const { code } = req.query;

  infoLogger.info("Requested specific weight data by Mtrl_Code", {
    endpoint: "/getSpecific_Wt",
    method: req.method,
    Mtrl_Code: code,
  });

  try {
    const query = `
      SELECT *
      FROM magodmis.mtrl_data AS md
      INNER JOIN magodmis.mtrlgrades AS mg ON md.MtrlGradeID = mg.MtrlGradeID
      WHERE md.Mtrl_Code = ?
    `;
    const values = [code];

    misQueryMod(query, values, (err, data) => {
      if (err) {
        errorLogger.error(
          "Error fetching data from mtrl_data and mtrlgrades",
          err,
          {
            endpoint: "/getSpecific_Wt",
            Mtrl_Code: code,
          }
        );
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info(
        "Successfully fetched data from mtrl_data and mtrlgrades",
        {
          endpoint: "/getSpecific_Wt",
          Mtrl_Code: code,
          recordsFetched: data.length,
        }
      );

      res.send(data[0] || null);
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching data from mtrl_data and mtrlgrades",
      error,
      {
        endpoint: "/getSpecific_Wt",
        Mtrl_Code: code,
      }
    );
    next(error);
  }
});

module.exports = mtrlDataRouter;
