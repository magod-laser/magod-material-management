/** @format */

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { infoLogger, errorLogger } = require("../../helpers/logger");
const savePDF = express.Router();
const globalConfig = require("../Utils/globalConfig");

let OrderNOO = null;
let SchNoo = null;
let globalAdjustmentName = "Default_Name";
let globalSaveTarget = "MATERIAL";

const WO_ENV_PATH = process.env.FILE_SERVER_PDF_PATH;
const MATERIAL_ENV_PATH = process.env.FILE_SERVER_MATERIAL_PATH;

const uploadFolder =
  process.env.FILE_SERVER_PDF_PATH || path.join(__dirname, "uploads");

try {
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
  }
} catch (err) {
  console.error("Error creating fallback upload directory:", err);
}

const getFormattedDateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}-${month}-${year} ${hours}-${minutes}-${seconds} ${ampm}`;
};

function getPathsFromConfig() {
  const cfg = globalConfig.getAll() || {};
  const workOrderRoot = cfg.WORKORDER || cfg.WORK_ORDER || null;
  const materialRoot =
    cfg.MATERIALMANAGEMENT || cfg.MATERIAL_MANAGEMENT || cfg.MATERIAL || null;
  return { workOrderRoot, materialRoot };
}

savePDF.post("/set-adjustment-name", (req, res) => {
  try {
    const { adjustment, OrderNo, SchNo, WO } = req.body || {};

    if (!adjustment) {
      return res.status(400).send({ message: "adjustment is required" });
    }

    globalAdjustmentName = String(adjustment).trim();

    if (OrderNo || WO === "WO") {
      if (OrderNo) {
        OrderNOO = OrderNo;
        SchNoo = SchNo || null;
        globalSaveTarget = "WO";
      }
    } else {
      OrderNOO = null;
      SchNoo = null;
      globalSaveTarget = "MATERIAL";
    }

    if (globalSaveTarget === "WO" && OrderNOO) {
      const { workOrderRoot } = getPathsFromConfig();
      const base = WO_ENV_PATH || workOrderRoot || uploadFolder;
      let orderPath = path.join(base, String(OrderNOO));

      if (!fs.existsSync(orderPath)) {
        fs.mkdirSync(orderPath, { recursive: true });
      }

      if (SchNoo) {
        let schPath = path.join(orderPath, String(SchNoo));
        if (!fs.existsSync(schPath)) {
          fs.mkdirSync(schPath, { recursive: true });
        }
      }
    } else {
      const matBase = MATERIAL_ENV_PATH;

      if (!fs.existsSync(matBase)) {
        fs.mkdirSync(matBase, { recursive: true });
      }
    }

    return res.status(200).send({
      message: "Adjustment name saved successfully.",
      target: globalSaveTarget,
    });
  } catch (err) {
    console.error("Error in /set-adjustment-name:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (globalSaveTarget === "WO") {
        const orderNo = OrderNOO;

        if (!orderNo) {
          return cb(
            new Error("OrderNo not set. Call /set-adjustment-name first."),
            null
          );
        }

        let orderPath = path.join(WO_ENV_PATH, String(orderNo));

        if (!fs.existsSync(orderPath))
          fs.mkdirSync(orderPath, { recursive: true });

        if (SchNoo) {
          orderPath = path.join(orderPath, String(SchNoo));
          if (!fs.existsSync(orderPath))
            fs.mkdirSync(orderPath, { recursive: true });
        }

        return cb(null, orderPath);
      }

      // MATERIAL
      const matBase = MATERIAL_ENV_PATH;

      if (!fs.existsSync(matBase)) fs.mkdirSync(matBase, { recursive: true });

      return cb(null, matBase);
    } catch (err) {
      console.error("Error in multer.destination:", err);
      return cb(err, null);
    }
  },

  filename: (req, file, cb) => {
    try {
      const base = (globalAdjustmentName || "Document")
        .replace(/[\/\\:?<>|"]/g, "")
        .trim();
      const ext = path.extname(file.originalname) || ".pdf";
      const stamp = getFormattedDateTime();
      const fileName = `${base}_${stamp}${ext}`;

      cb(null, fileName);
    } catch (err) {
      cb(err);
    }
  },
});

const upload = multer({ storage }).single("file");

savePDF.post("/save-pdf", (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "File upload failed", error: err.message });
      }

      if (!req.file) {
        return res.status(400).send({ message: "No file uploaded." });
      }

      return res.status(200).send({
        message: "PDF saved successfully!",
        filePath: req.file.path,
        fileName: req.file.filename,
        target: globalSaveTarget,
      });
    });
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = savePDF;
