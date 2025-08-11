const materialReceiptRegisterRouter = require("express").Router();
var createError = require("http-errors");
const { createFolder, copyallfiles } = require("../../helpers/folderhelper");
const { misQuery, setupQuery, misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");
const { formatDate } = require("../../helpers/utils");

materialReceiptRegisterRouter.get(
  "/getByTypeMaterialReceiptRegister",
  async (req, res, next) => {
    try {
      let type1 = req.query.type1;
      let type2 = req.query.type2;
      if (req.query.type3) {
        misQueryMod(
          `SELECT * FROM material_receipt_register where RVStatus = '${type1}' and Type = '${type2}' and Cust_Code = 0 order by ReceiptDate DESC`,
          (err, data) => {
            if (err) logger.error(err);
            logger.info(
              `Successfully fetched material_receipt_register data for rv_status=${type1} and type=${type2}`
            );
            res.send(data);
          }
        );
      } else {
        misQueryMod(
          `SELECT * FROM material_receipt_register where RVStatus = '${type1}' and Type = '${type2}'   and Cust_Code  not like '0000' order by ReceiptDate DESC `,
          (err, data) => {
            if (err) logger.error(err);
            logger.info(
              `Successfully fetched material_receipt_register data for rv_status=${type1} and type=${type2}`
            );
            res.send(data);
          }
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

materialReceiptRegisterRouter.get(
  "/getByTypeMaterialReceiptRegisterByRvID",
  async (req, res, next) => {
    try {
      let id = req.query.id;

      misQueryMod(
        `SELECT * FROM material_receipt_register where RvID = ${id} order by RvID`,
        (err, data) => {
          if (err) logger.error(err);

          logger.info(
            `successfully fetched data from material_receipt_register for RvID=${id}`
          );
          res.send(data[0]);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialReceiptRegisterRouter.post(
  "/insertHeaderMaterialReceiptRegister",
  async (req, res, next) => {
    try {
      let {
        receiptDate,
        rvNo,
        rvDate,
        status,
        customer,
        customerName,
        reference,
        weight,
        calcWeight,
        type,
      } = req.body;

      receiptDate = formatDate(new Date(), 5);
      rvDate = rvDate.split("/").reverse().join("-");

      misQueryMod(
        `insert into  material_receipt_register (ReceiptDate,RV_No,RV_Date,Cust_Code,Customer,CustDocuNo,RVStatus,TotalWeight,TotalCalculatedWeight,Type) values ("${receiptDate}","${rvNo}","${rvDate}","${customer}","${customerName}","${reference}","${status}","${weight}","${calcWeight}","${type}")`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            "successfully inserted data into  material_receipt_register"
          );
          res.json(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialReceiptRegisterRouter.post(
  "/updateHeaderMaterialReceiptRegister",
  async (req, res, next) => {
    try {
      let {
        rvId,
        receiptDate,
        rvNo,
        rvDate,
        status,
        customer,
        customerName,
        reference,
        weight,
        calcWeight,
        type,
      } = req.body;

      receiptDate = formatDate(new Date(), 5);
      rvDate = rvDate.split("/").reverse().join("-");

      misQueryMod(
        `update material_receipt_register set ReceiptDate = "${receiptDate}",RV_No="${rvNo}",RV_Date="${rvDate}",Cust_Code="${customer}",Customer="${customerName}",CustDocuNo="${reference}",RVStatus="${status}",TotalWeight="${weight}",TotalCalculatedWeight="${calcWeight}" where  RvID = ${rvId}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully updated material_receipt_register data for rvId=${rvId}`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialReceiptRegisterRouter.post(
  "/deleteHeaderMaterialReceiptRegisterAndDetails",
  async (req, res, next) => {
    try {
      let { rvId } = req.body;
      misQueryMod(
        `delete from mtrl_part_receipt_details  where  RvID = ${rvId}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully deleted data from mtrl_part_receipt_details with RvId=${rvId}`
          );

          misQueryMod(
            `delete from material_receipt_register  where  RvID = ${rvId}`,
            (err, data) => {
              if (err) logger.error(err);
              logger.info(
                `successfully deleted data from material_receipt_register with RvId=${rvId}`
              );
              res.send(data);
            }
          );
          //res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = materialReceiptRegisterRouter;
