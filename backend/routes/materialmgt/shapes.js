const shapeRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { logger, infoLogger, errorLogger } = require("../../helpers/logger");

shapeRouter.get("/getAllShapes", async (req, res, next) => {
  try {
    misQueryMod(`Select * from magodmis.shapes`, (err, data) => {
      if (err) logger.error(err);
      res.send(data);
    });
  } catch (error) {
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

shapeRouter.get("/getAllShapeNames", async (req, res, next) => {
  try {
    misQueryMod(
      `SELECT s.Shape FROM magodmis.shapes s ORDER BY s.Shape`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = shapeRouter;
