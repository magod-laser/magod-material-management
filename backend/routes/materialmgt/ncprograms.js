const ncprogramsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Update quantity allotted in ncprograms
ncprogramsRouter.post("/updateQtyAllotedncprograms", async (req, res, next) => {
  const { Id, Qty } = req.body;

  infoLogger.info("Requested update of quantity allotted in ncprograms", {
    endpoint: "/updateQtyAllotedncprograms",
    method: req.method,
    Ncid: Id,
    Qty,
  });

  try {
    misQueryMod(
      `UPDATE magodmis.ncprograms n SET n.QtyAllotted = n.QtyAllotted - ? WHERE n.Ncid = ?`,
      [Qty, Id],
      (err, data) => {
        if (err) {
          errorLogger.error(
            "Error updating quantity allotted in ncprograms",
            err,
            {
              endpoint: "/updateQtyAllotedncprograms",
              Ncid: Id,
              Qty,
            }
          );
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Updated quantity allotted successfully", {
          endpoint: "/updateQtyAllotedncprograms",
          Ncid: Id,
          Qty,
        });

        res.send(data);
      }
    );
  } catch (error) {
    errorLogger.error("Unexpected error updating quantity allotted", error, {
      endpoint: "/updateQtyAllotedncprograms",
      Ncid: Id,
      Qty,
    });
    next(error);
  }
});

// Update QtyAllotted in ncprograms and set PStatus to 'Processing'
ncprogramsRouter.post(
  "/updateQtyAllotedncprograms1",
  async (req, res, next) => {
    const { Id, Qty } = req.body;

    infoLogger.info("Request received to update QtyAllotted in ncprograms", {
      endpoint: "/updateQtyAllotedncprograms1",
      method: req.method,
      payload: { Id, Qty },
    });

    try {
      const query = `
        UPDATE magodmis.ncprograms n
        SET n.QtyAllotted = n.QtyAllotted + ?,
            n.PStatus = 'Processing'
        WHERE n.Ncid = ?
      `;
      const values = [Qty, Id];

      misQueryMod(query, values, (err, data) => {
        if (err) {
          errorLogger.error("Error updating QtyAllotted in ncprograms", err, {
            endpoint: "/updateQtyAllotedncprograms1",
            payload: { Id, Qty },
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully updated ncprograms", {
          endpoint: "/updateQtyAllotedncprograms1",
          Ncid: Id,
          recordsAffected: data?.affectedRows || 0,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error in updateQtyAllotedncprograms1",
        error,
        {
          endpoint: "/updateQtyAllotedncprograms1",
          payload: { Id, Qty },
        }
      );
      next(error);
    }
  }
);

// Update quantity allotted and set PStatus to 'Cutting' in ncprograms
ncprogramsRouter.post(
  "/updateQtyAllotedncprograms2",
  async (req, res, next) => {
    const { Id, Qty } = req.body;

    infoLogger.info(
      "Requested update of quantity allotted and PStatus in ncprograms",
      {
        endpoint: "/updateQtyAllotedncprograms2",
        method: req.method,
        Ncid: Id,
        Qty,
      }
    );

    try {
      misQueryMod(
        `UPDATE magodmis.ncprograms n SET n.QtyAllotted = n.QtyAllotted + ?, n.PStatus = 'Cutting' WHERE n.Ncid = ?`,
        [Qty, Id],
        (err, data) => {
          if (err) {
            errorLogger.error(
              "Error updating quantity allotted and PStatus in ncprograms",
              err,
              {
                endpoint: "/updateQtyAllotedncprograms2",
                Ncid: Id,
                Qty,
              }
            );
            return res
              .status(500)
              .json({ Status: "Error", Message: "Database error" });
          }

          infoLogger.info(
            "Updated quantity allotted and PStatus successfully",
            {
              endpoint: "/updateQtyAllotedncprograms2",
              Ncid: Id,
              Qty,
            }
          );

          res.send(data);
        }
      );
    } catch (error) {
      errorLogger.error(
        "Unexpected error updating quantity allotted and PStatus",
        error,
        {
          endpoint: "/updateQtyAllotedncprograms2",
          Ncid: Id,
          Qty,
        }
      );
      next(error);
    }
  }
);

// Fetch NC program row by Ncid
ncprogramsRouter.get("/getRowByNCID", async (req, res, next) => {
  const { id } = req.query;

  infoLogger.info("Request received for NC program row", {
    endpoint: "/getRowByNCID",
    method: req.method,
    Ncid: id,
  });

  try {
    const query = `SELECT * FROM magodmis.ncprograms WHERE Ncid = ?`;

    misQueryMod(query, [id], (err, data) => {
      if (err) {
        errorLogger.error("Database error fetching NC program row", err, {
          endpoint: "/getRowByNCID",
          Ncid: id,
        });
        return res
          .status(500)
          .json({ Status: "Error", Message: "Database error" });
      }

      infoLogger.info("Successfully fetched NC program row", {
        endpoint: "/getRowByNCID",
        Ncid: id,
        recordsFetched: data?.length || 0,
      });

      res.send(data[0] || null);
    });
  } catch (error) {
    errorLogger.error("Unexpected error in getRowByNCID route", error, {
      endpoint: "/getRowByNCID",
      Ncid: id,
    });
    next(error);
  }
});

module.exports = ncprogramsRouter;
