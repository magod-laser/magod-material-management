const materialLocationListRouter = require("express").Router();
const { setupQueryMod } = require("../../helpers/dbconn");
const { logger, infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch all material location list ordered by LocationNo
materialLocationListRouter.get(
  "/allMaterialLocationList",
  async (req, res, next) => {
    infoLogger.info("Requested all material location list", {
      endpoint: "/allMaterialLocationList",
      method: req.method,
    });

    try {
      const query =
        "SELECT * FROM magod_setup.material_location_list ORDER BY LocationNo ASC";

      setupQueryMod(query, [], (err, data) => {
        if (err) {
          errorLogger.error("Error fetching material_location_list data", err, {
            endpoint: "/allMaterialLocationList",
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully fetched material_location_list data", {
          endpoint: "/allMaterialLocationList",
          recordsFetched: data.length,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching material_location_list data",
        error,
        {
          endpoint: "/allMaterialLocationList",
        }
      );
      next(error);
    }
  }
);

materialLocationListRouter.post(
  "/deleteMaterialLocationList",
  async (req, res, next) => {
    try {
      let { LocationNo } = req.body;
      setupQueryMod(
        `DELETE FROM magod_setup.material_location_list WHERE LocationNo='${LocationNo}'`,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialLocationListRouter.post(
  "/updateMaterialLocationList",
  async (req, res, next) => {
    try {
      let { LocationNo, StorageType, Capacity } = req.body;
      setupQueryMod(
        `UPDATE  magod_setup.material_location_list 
        SET StorageType='${StorageType}', Capacity=${Capacity} 
        WHERE LocationNo='${LocationNo}'`,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialLocationListRouter.post(
  "/insertMaterialLocationList",
  async (req, res, next) => {
    try {
      let { LocationNo, StorageType, Capacity } = req.body;
      setupQueryMod(
        `INSERT INTO magod_setup.material_location_list
          (LocationNo, StorageType, Capacity) 
          Values('${LocationNo}', '${StorageType}', ${Capacity})`,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = materialLocationListRouter;
