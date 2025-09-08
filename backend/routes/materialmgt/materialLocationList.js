const materialLocationListRouter = require("express").Router();
const { setupQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

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

// Delete material location entry by LocationNo
materialLocationListRouter.post(
  "/deleteMaterialLocationList",
  async (req, res, next) => {
    const { LocationNo } = req.body;

    infoLogger.info("Requested delete material location", {
      endpoint: "/deleteMaterialLocationList",
      method: req.method,
      LocationNo,
    });

    try {
      if (!LocationNo) {
        return res.status(400).json({
          Status: "Error",
          Message: "LocationNo is required",
        });
      }

      setupQueryMod(
        `DELETE FROM magod_setup.material_location_list WHERE LocationNo = ?`,
        [LocationNo],
        (err, data) => {
          if (err) {
            errorLogger.error("Error deleting material location", err, {
              endpoint: "/deleteMaterialLocationList",
              LocationNo,
            });
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Deleted material location successfully", {
            endpoint: "/deleteMaterialLocationList",
            LocationNo,
            affectedRows: data?.affectedRows || 0,
          });

          res.json({
            Status: "Success",
            Message:
              data?.affectedRows > 0
                ? "Material location deleted successfully"
                : "No matching location found",
          });
        }
      );
    } catch (error) {
      errorLogger.error("Unexpected error deleting material location", error, {
        endpoint: "/deleteMaterialLocationList",
        LocationNo,
      });
      next(error);
    }
  }
);

// Update material location entry by LocationNo
materialLocationListRouter.post(
  "/updateMaterialLocationList",
  async (req, res, next) => {
    const { LocationNo, StorageType, Capacity } = req.body;

    infoLogger.info("Requested update material location", {
      endpoint: "/updateMaterialLocationList",
      method: req.method,
      LocationNo,
      StorageType,
      Capacity,
    });

    try {
      if (!LocationNo || !StorageType || Capacity == null) {
        return res.status(400).json({
          Status: "Error",
          Message: "LocationNo, StorageType, and Capacity are required",
        });
      }

      setupQueryMod(
        `UPDATE magod_setup.material_location_list 
         SET StorageType = ?, Capacity = ? 
         WHERE LocationNo = ?`,
        [StorageType, Capacity, LocationNo],
        (err, data) => {
          if (err) {
            errorLogger.error("Error updating material location", err, {
              endpoint: "/updateMaterialLocationList",
              LocationNo,
            });
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Updated material location successfully", {
            endpoint: "/updateMaterialLocationList",
            LocationNo,
            affectedRows: data?.affectedRows || 0,
          });

          res.json({
            Status: "Success",
            Message:
              data?.affectedRows > 0
                ? "Material location updated successfully"
                : "No matching location found",
          });
        }
      );
    } catch (error) {
      errorLogger.error("Unexpected error updating material location", error, {
        endpoint: "/updateMaterialLocationList",
        LocationNo,
      });
      next(error);
    }
  }
);

// Insert a new material location
materialLocationListRouter.post(
  "/insertMaterialLocationList",
  async (req, res, next) => {
    const { LocationNo, StorageType, Capacity } = req.body;

    infoLogger.info("Insert material location request received", {
      endpoint: "/insertMaterialLocationList",
      method: req.method,
      body: req.body,
    });

    try {
      setupQueryMod(
        `INSERT INTO magod_setup.material_location_list
          (LocationNo, StorageType, Capacity)
         VALUES (?, ?, ?)`,
        [LocationNo, StorageType, Capacity],
        (err, data) => {
          if (err) {
            errorLogger.error("Error inserting material location", err, {
              endpoint: "/insertMaterialLocationList",
              body: req.body,
            });
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info("Material location inserted successfully", {
            endpoint: "/insertMaterialLocationList",
            insertedId: data.insertId,
          });

          res.json({
            Status: "Success",
            Message: "Material location inserted successfully",
            InsertedId: data.insertId,
          });
        }
      );
    } catch (error) {
      errorLogger.error("Unexpected error inserting material location", error, {
        endpoint: "/insertMaterialLocationList",
      });
      next(error);
    }
  }
);

module.exports = materialLocationListRouter;
