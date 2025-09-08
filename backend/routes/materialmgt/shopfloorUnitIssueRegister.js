const shopfloorUnitIssueRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const { infoLogger, errorLogger } = require("../../helpers/logger");

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
      let CustCode = CustMtrl === "Magod" ? "0000" : custCodeQuery;

      let query = `SELECT * FROM magodmis.mtrlstocklist m WHERE m.cust_Code = ? AND m.Mtrl_Code = ? AND m.Locked = 0 AND m.Scrap = 0 ORDER BY SUBSTRING(MtrlStockID, 1, 8) ASC, SUBSTRING(MtrlStockID, 9, 2) ASC, CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(MtrlStockID, '/', -1), '/', 1) AS SIGNED) ASC`;

      let queryParams = [CustCode, MtrlCode];

      if (shape === "Sheet") {
        query += ` AND ((DynamicPara1 >= ? AND DynamicPara2 >= ?) OR (DynamicPara2 >= ? AND DynamicPara1 >= ?))`;
        queryParams.push(para1, para2, para1, para2);
      } else if (
        ["Tube Rectangle", "Tube Square", "Tube Round"].includes(shape)
      ) {
        query += ` AND (DynamicPara1 >= ?)`;
        queryParams.push(para1);
      }

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
