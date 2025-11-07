const shopfloorUnitIssueRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

// Fetch shape based on Mtrl_Code
shopfloorUnitIssueRegisterRouter.get(
  "/getShapeByMaterial",
  async (req, res, next) => {
    const { material } = req.query;

    infoLogger.info("Request received for getShapeByMaterial", {
      endpoint: "/getShapeByMaterial",
      method: req.method,
      Mtrl_Code: material,
    });

    try {
      const query = `SELECT Shape FROM magodmis.mtrl_data WHERE Mtrl_Code = ?`;

      misQueryMod(query, [material], (err, data) => {
        if (err) {
          errorLogger.error("Database error fetching shape by material", err, {
            endpoint: "/getShapeByMaterial",
            Mtrl_Code: material,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Successfully fetched Shape", {
          endpoint: "/getShapeByMaterial",
          Mtrl_Code: material,
          recordsFetched: data?.length || 0,
        });

        res.send(data[0] || null);
      });
    } catch (error) {
      errorLogger.error("Unexpected error in getShapeByMaterial route", error, {
        endpoint: "/getShapeByMaterial",
        Mtrl_Code: material,
      });
      next(error);
    }
  }
);

// Fetch material allotment table by MtrlCode and CustCode
shopfloorUnitIssueRegisterRouter.get(
  "/getMaterialAllotmentTable1",
  async (req, res, next) => {
    let {
      MtrlCode,
      CustCode: custCodeQuery,
      CustMtrl,
      shape,
      para1,
      para2,
    } = req.query;

    infoLogger.info("Requested material allotment table", {
      endpoint: "/getMaterialAllotmentTable1",
      method: req.method,
      MtrlCode,
      CustMtrl,
      shape,
      para1,
      para2,
    });

    try {
      // If customer material is "Magod", force customer code to "0000"
      const CustCode = CustMtrl === "Magod" ? "0000" : custCodeQuery;

      // Base query
      let query = `
        SELECT *
        FROM magodmis.mtrlstocklist m
        WHERE m.cust_Code = ?
          AND m.Mtrl_Code = ?
          AND m.Locked = 0
          AND m.Scrap = 0
      `;

      let queryParams = [CustCode, MtrlCode];

      // Apply filters based on shape
      if (shape === "Sheet") {
        query += `
          AND (
            (m.DynamicPara1 >= ? AND m.DynamicPara2 >= ?)
            OR (m.DynamicPara2 >= ? AND m.DynamicPara1 >= ?)
          )
        `;
        queryParams.push(para1, para2, para2, para1);
      } else if (
        ["Tube Rectangle", "Tube Square", "Tube Round"].includes(shape)
      ) {
        query += ` AND m.DynamicPara1 >= ?`;
        queryParams.push(para1);
      }

      query += `
        ORDER BY
          SUBSTRING(m.MtrlStockID, 1, 8) ASC,
          SUBSTRING(m.MtrlStockID, 9, 2) ASC,
          CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(m.MtrlStockID, '/', -1), '/', 1) AS SIGNED) ASC
      `;

      // Execute query
      await misQueryMod(query, queryParams, (err, data) => {
        if (err) {
          errorLogger.error("Error fetching material allotment table", err, {
            endpoint: "/getMaterialAllotmentTable1",
            MtrlCode,
            CustCode,
            shape,
            para1,
            para2,
          });
          return res
            .status(500)
            .json({ Status: "Error", Message: "Database error" });
        }

        infoLogger.info("Fetched material allotment table successfully", {
          endpoint: "/getMaterialAllotmentTable1",
          MtrlCode,
          CustCode,
          shape,
          para1,
          para2,
          records: data.length,
        });

        res.send(data);
      });
    } catch (error) {
      errorLogger.error(
        "Unexpected error fetching material allotment table",
        error,
        {
          endpoint: "/getMaterialAllotmentTable1",
          MtrlCode,
          CustCode,
          shape,
          para1,
          para2,
        }
      );
      next(error);
    }
  }
);

module.exports = shopfloorUnitIssueRegisterRouter;
