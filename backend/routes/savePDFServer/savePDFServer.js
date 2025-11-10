const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createFolder } = require("../../helpers/folderhelper");
const { infoLogger, errorLogger } = require("../../helpers/logger");
const savePDF = express.Router();
const globalConfig = require("../Utils/globalConfig");

let OrderNOO;
let SchNoo;
let globalAdjustmentName;

// Ensure upload directory exists
const uploadFolder =
  process.env.FILE_SERVER_PDF_PATH || path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const getFormattedDateTime = () => {
  const now = new Date();

  // Format date as dd-mm-yyyy
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  // Format time as hh:mm:ss with AM/PM
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert to 12-hour format, replace 0 with 12

  // Return the formatted date and time string
  return `${day}-${month}-${year} ${hours}-${minutes}-${seconds} ${ampm}`;
};
// API to store adjustment name globally

// Save global adjustment name
savePDF.post("/set-adjustment-name", (req, res) => {
  const { adjustment, OrderNo, SchNo } = req.body;

  console.log("REQ", req.body);

  //Path from setup details table

  infoLogger.info("Requested to save global adjustment name", {
    endpoint: "/set-adjustment-name",
    method: req.method,
    adjustment,
  });

  const workOrderPath = globalConfig.getAll();
  let baseUploadFolder = workOrderPath.WORKORDER;

  if (SchNo) {
    createFolder("Schedule", SchNo, "");
  }

  OrderNOO = req.body.OrderNo;
  SchNoo = req.body.SchNo;

  if (!adjustment || !OrderNo) {
    errorLogger.error("Adjustment name is missing in request", {
      endpoint: "/set-adjustment-name",
    });
    return res
      .status(400)
      .send({ message: "Adjustment name and OrderNo are required." });
  }

  globalAdjustmentName = adjustment;

  let uploadFolder = path.join(baseUploadFolder, OrderNo.toString());

  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }

  if (SchNo) {
    uploadFolder = path.join(
      // baseUploadFolder,
      // "Wo",
      // OrderNo.toString(),
      // SchNo.toString()
      baseUploadFolder,
      // "Wo",
      OrderNo.toString(),
      SchNo.toString()
    );

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }
  }

  infoLogger.info("Global adjustment name saved successfully", {
    endpoint: "/set-adjustment-name",
    adjustment,
  });

  res.status(200).send({ message: "Adjustment name saved successfully." });
});

//Function for mulrter storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const orderNo = OrderNOO;

    if (!orderNo) {
      return cb(new Error("OrderNo is required to save the file."), null);
    }
    const workOrderPath = globalConfig.getAll();
    let baseUploadFolder = workOrderPath.WORKORDER;

    // Base folder for the order
    // let orderPath = path.join(baseUploadFolder, "Wo", orderNo.toString());
    let orderPath = path.join(baseUploadFolder, orderNo.toString());

    // Ensure the base folder exists
    if (!fs.existsSync(orderPath)) {
      fs.mkdirSync(orderPath, { recursive: true });
    }

    // If SchNo exists, append it to the path
    if (SchNoo) {
      orderPath = path.join(orderPath, SchNoo.toString());

      // Ensure the schedule folder exists
      if (!fs.existsSync(orderPath)) {
        fs.mkdirSync(orderPath, { recursive: true });
      }
    }

    cb(null, orderPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${globalAdjustmentName}${ext}`);
  },
});

// This API is for save
savePDF.post("/save-pdf", (req, res) => {
  const upload = multer({ storage }).single("file");

  upload(req, res, (err) => {
    if (err) {
      console.error("File upload error:", err);
      return res
        .status(500)
        .send({ message: "File upload failed", error: err });
    }

    const orderNo = OrderNOO;

    if (!orderNo) {
      return res.status(400).send({ message: "OrderNo is required." });
    }

    res
      .status(200)
      .send({ message: "PDF saved successfully!", filePath: req.file.path });
  });
});

module.exports = savePDF;
