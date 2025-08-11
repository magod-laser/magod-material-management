const mtrlReceiptDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");
const { log } = require("winston");

mtrlReceiptDetailsRouter.get(
  "/getMtrlReceiptDetailsByID",
  async (req, res, next) => {
    try {
      let id = req.query.id;

      misQueryMod(
        `SELECT * FROM mtrlreceiptdetails where Mtrl_Rv_id = ${id}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully fetched data from mtrlreceiptdetails for Mtrl_Rv_id = ${id}`
          );
          res.json(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlReceiptDetailsRouter.get(
  "/getMtrlReceiptDetailsByRvID",
  async (req, res, next) => {
    try {
      let id = req.query.id;

      misQueryMod(
        `SELECT * FROM mtrlreceiptdetails where RvID = ${id} order by RvID`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully fetched data from mtrlreceiptdetails for RvID=${id}`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlReceiptDetailsRouter.post(
  "/insertMtrlReceiptDetails",
  async (req, res, next) => {
    try {
      let {
        rvId,
        srl,
        custCode,
        mtrlCode,
        material,
        shapeMtrlId,
        shapeID,
        dynamicPara1,
        dynamicPara2,
        dynamicPara3,
        qty,
        inspected,
        accepted,
        totalWeightCalculated,
        totalWeight,
        locationNo,
        updated,
        qtyAccepted,
        qtyReceived,
        qtyRejected,
        qtyUsed,
        qtyReturned,
      } = req.body;

      misQueryMod(
        `insert into  mtrlreceiptdetails (RvID,Srl,Cust_Code,Mtrl_Code,Material,ShapeMtrlID,ShapeID, DynamicPara1,DynamicPara2,DynamicPara3,Qty,Inspected,Accepted,TotalWeightCalculated,TotalWeight,LocationNo,Updated,QtyRejected, QtyUsed,QtyReturned) values ("${rvId}","${srl}","${custCode}","${mtrlCode}","${material}",${shapeMtrlId},${shapeID}, ${dynamicPara1},${dynamicPara2},${dynamicPara3},${qty},${inspected},${accepted},${totalWeightCalculated},${totalWeight},"${locationNo}",${updated},"${qtyRejected}","${qtyUsed}","${qtyReturned}")`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info("successfully inserted data into mtrlreceiptdetails");
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlReceiptDetailsRouter.post(
  "/updateMtrlReceiptDetailsAfter",
  async (req, res, next) => {
    try {
      let {
        accepted,
        dynamicPara1,
        dynamicPara2,
        dynamicPara3,
        id,
        inspected,
        locationNo,
        mtrlCode,
        qty,
        updated,
        qtyAccepted,
        qtyReceived,
        qtyRejected,
        srl,
        totalWeightCalculated,
        totalWeight,
      } = req.body;
      inspected = inspected == true ? "1" : "0";

      misQueryMod(
        `UPDATE mtrlreceiptdetails SET 
          Srl = '${srl}', 
          Mtrl_Code = '${mtrlCode}', 
          DynamicPara1 = ${dynamicPara1}, 
          DynamicPara2 = ${dynamicPara2}, 
          DynamicPara3 = ${dynamicPara3}, 
          Qty = ${qty}, 
          Inspected = ${inspected}, 
          Accepted = ${accepted}, 
          TotalWeightCalculated = ${totalWeightCalculated}, 
          TotalWeight = ${totalWeight},
          LocationNo = '${locationNo}',      
          Accepted = ${accepted}, 
          QtyRejected = '${qtyRejected}' 
          WHERE Mtrl_Rv_id = ${id}`,
        (err, data) => {
          if (err) logger.error(err);

          logger.info(
            `successfully updated mtrlreceiptdetails data with Mtrl_Rv_id = ${id} `
          );
          res.json(data);
        }
      );
      // }
    } catch (error) {
      next(error);
    }
  }
);

mtrlReceiptDetailsRouter.post(
  "/updateMtrlReceiptDetails",
  async (req, res, next) => {
    try {
      let {
        id,

        srl,
        custCode,
        mtrlCode,
        material,
        shapeMtrlId,
        shapeID,
        dynamicPara1,
        dynamicPara2,
        dynamicPara3,
        qty,
        inspected,
        accepted,
        totalWeightCalculated,
        totalWeight,
        locationNo,
        updated,
        qtyAccepted,
        qtyReceived,
        qtyRejected,
        qtyUsed,
        qtyReturned,
      } = req.body;
      inspected = inspected == "on" ? "1" : "0";

      misQueryMod(
        `update mtrlreceiptdetails set Srl = "${srl}",Cust_Code = "${custCode}",Mtrl_Code = "${mtrlCode}",Material = "${material}",ShapeMtrlID = ${shapeMtrlId},ShapeID = ${shapeID}, DynamicPara1 = ${dynamicPara1},DynamicPara2 = ${dynamicPara2},DynamicPara3 = ${dynamicPara3},Qty = ${qty},Inspected = ${inspected},Accepted = ${accepted}, TotalWeightCalculated = ${totalWeightCalculated},TotalWeight = ${totalWeight},LocationNo = "${locationNo}",UpDated = "${updated}",QtyRejected = "${qtyRejected}",QtyUsed = "${qtyUsed}",QtyReturned = "${qtyReturned}" where Mtrl_Rv_id = ${id}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully updated mtrlreceiptdetails with Mtrl_Rv_id = ${id}`
          );

          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlReceiptDetailsRouter.post(
  "/updateMtrlReceiptDetailsUpdated",
  async (req, res, next) => {
    try {
      let { id, upDated } = req.body;
      misQueryMod(
        `update mtrlreceiptdetails set UpDated = ${upDated} where Mtrl_Rv_id = ${id}`,
        (err, data) => {
          if (err) logger.error(err);

          logger.info(
            `successfully updated mtrlreceiptdetails for Mtrl_Rv_id = ${id}`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlReceiptDetailsRouter.post(
  "/deleteMtrlReceiptDetails",
  async (req, res, next) => {
    try {
      let { id } = req.body;

      misQueryMod(
        `delete from mtrlreceiptdetails where Mtrl_Rv_id = ${id}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully deleted data from mtrlreceiptdetails for Mtrl_Rv_id = ${id}`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mtrlReceiptDetailsRouter;
