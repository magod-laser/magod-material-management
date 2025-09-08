const shapeRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch all shapes from shapes table
shapeRouter.get("/getAllShapes", async (req, res, next) => {
  infoLogger.info("Requested all shapes", {
    endpoint: "/getAllShapes",
    method: "GET",
  });

  try {
    const query = `SELECT * FROM magodmis.shapes`;

    misQueryMod(query, [], (err, data) => {
      if (err) {
        errorLogger.error("Error fetching all shapes", err, {
          endpoint: "/getAllShapes",
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully fetched all shapes", {
        endpoint: "/getAllShapes",
        recordsFetched: data.length,
      });

      res.send(data || []);
    });
  } catch (error) {
    errorLogger.error("Unexpected error in /getAllShapes", error, {
      endpoint: "/getAllShapes",
    });
    next(error);
  }
});

// Fetch a single shape row by Shape
shapeRouter.get("/getRowByShape", async (req, res, next) => {
  const { shape } = req.query;

  infoLogger.info("Requested shape data row by Shape", {
    endpoint: "/getRowByShape",
    method: req.method,
    shape,
  });

  try {
    const query = "SELECT * FROM magodmis.shapes WHERE Shape = ?";
    const values = [shape];

    misQueryMod(query, values, (err, data) => {
      if (err) {
        errorLogger.error("Error fetching data from shapes by Shape", err, {
          endpoint: "/getRowByShape",
          shape,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully fetched data from shapes by Shape", {
        endpoint: "/getRowByShape",
        shape,
        recordsFetched: data.length,
      });

      res.send(data[0] || {});
    });
  } catch (error) {
    errorLogger.error(
      "Unexpected error fetching data from shapes by Shape",
      error,
      {
        endpoint: "/getRowByShape",
        shape,
      }
    );
    next(error);
  }
});

// Fetch all shape names
shapeRouter.get("/getAllShapeNames", async (req, res, next) => {
  infoLogger.info("Requested all shape names", {
    endpoint: "/getAllShapeNames",
    method: req.method,
  });

  try {
    misQueryMod(
      `SELECT s.Shape 
       FROM magodmis.shapes s 
       ORDER BY s.Shape`,
      (err, data) => {
        if (err) {
          errorLogger.error("Error fetching shape names", err, {
            endpoint: "/getAllShapeNames",
          });
          return res.status(500).send({ message: "Database error" });
        }

        infoLogger.info("Fetched shape names successfully", {
          endpoint: "/getAllShapeNames",
          records: data.length,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error fetching shape names", error, {
      endpoint: "/getAllShapeNames",
    });
    next(error);
  }
});

module.exports = shapeRouter;
