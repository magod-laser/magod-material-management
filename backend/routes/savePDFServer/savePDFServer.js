/** @format */

const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { infoLogger, errorLogger } = require("../../helpers/logger");
const savePDF = express.Router();
const globalConfig = require("../Utils/globalConfig");

// ---------------------------
// Globals (as you wanted)
// ---------------------------
let OrderNOO = null;
let SchNoo = null;
let globalAdjustmentName = "Default_Name";
let globalSaveTarget = "MATERIAL"; // "WO" or "MATERIAL"

// ---------------------------
// Base upload folder (fallback)
// ---------------------------
const uploadFolder =
  process.env.FILE_SERVER_PDF_PATH || path.join(__dirname, "uploads");

console.log("Initializing savePDF router...");
console.log("FILE_SERVER_PDF_PATH:", process.env.FILE_SERVER_PDF_PATH);
console.log("Using upload folder (fallback):", uploadFolder);

// Ensure fallback root exists
try {
  if (!fs.existsSync(uploadFolder)) {
    console.log("Creating fallback upload directory:", uploadFolder);
    fs.mkdirSync(uploadFolder, { recursive: true });
  }
} catch (err) {
  console.error("Error creating fallback upload directory:", err);
  errorLogger &&
    errorLogger.error(`Error creating upload directory: ${err.message}`);
}

// ---------------------------
// Utility: timestamp for filename
// ---------------------------
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

  // Use d-m-y hh-mm-ss AM/PM
  return `${day}-${month}-${year} ${hours}-${minutes}-${seconds} ${ampm}`;
};

// ---------------------------
// Helper: get configured paths
// ---------------------------
function getPathsFromConfig() {
  const cfg = globalConfig.getAll() || {};
  const workOrderRoot = cfg.WORKORDER || cfg.WORK_ORDER || null;
  const materialRoot =
    cfg.MATERIALMANAGEMENT || cfg.MATERIAL_MANAGEMENT || cfg.MATERIAL || null;

  return { workOrderRoot, materialRoot };
}

// ---------------------------
// API: /set-adjustment-name
// - Accepts: { adjustment, OrderNo?, SchNo?, WO? }
// - If OrderNo present (or WO === "WO") -> target = WO
// - If only adjustment provided -> target = MATERIAL
// ---------------------------
savePDF.post("/set-adjustment-name", (req, res) => {
  try {
    const { adjustment, OrderNo, SchNo, WO } = req.body || {};

    console.log("📥 Received /set-adjustment-name:", req.body);

    if (!adjustment) {
      errorLogger &&
        errorLogger.error("Adjustment missing in set-adjustment-name");
      return res.status(400).send({ message: "adjustment is required" });
    }

    // store adjustment name always
    globalAdjustmentName = String(adjustment).trim();

    // Determine target: prefer explicit OrderNo or WO flag
    if (OrderNo || WO === "WO") {
      if (!OrderNo) {
        console.warn(
          "WO flag set but OrderNo missing — treating as MATERIAL by fallback"
        );
      } else {
        OrderNOO = OrderNo;
        SchNoo = SchNo || null;
        globalSaveTarget = "WO";
      }
    } else {
      // MaterialManagement case
      OrderNOO = null;
      SchNoo = null;
      globalSaveTarget = "MATERIAL";
    }

    console.log("✅ Stored Values →", {
      globalAdjustmentName,
      OrderNOO,
      SchNoo,
      globalSaveTarget,
    });

    // Create folder(s) upfront where appropriate
    const { workOrderRoot, materialRoot } = getPathsFromConfig();

    if (globalSaveTarget === "WO" && OrderNOO) {
      const base = workOrderRoot || uploadFolder;
      let orderPath = path.join(base, String(OrderNOO));

      if (!fs.existsSync(orderPath)) {
        fs.mkdirSync(orderPath, { recursive: true });
        console.log("✅ Created WO order folder:", orderPath);
      }

      if (SchNoo) {
        const schPath = path.join(orderPath, String(SchNoo));
        if (!fs.existsSync(schPath)) {
          fs.mkdirSync(schPath, { recursive: true });
          console.log("✅ Created WO schedule folder:", schPath);
        }
      }
    } else {
      // Material management folder
      const matBase =
        materialRoot ||
        path.join(workOrderRoot || uploadFolder, "..", "MaterialManagement");
      if (!fs.existsSync(matBase)) {
        fs.mkdirSync(matBase, { recursive: true });
        console.log("✅ Created MaterialManagement folder:", matBase);
      }
    }

    infoLogger &&
      infoLogger.info("Global adjustment saved", {
        adjustment: globalAdjustmentName,
        target: globalSaveTarget,
      });

    return res.status(200).send({
      message: "Adjustment name saved successfully.",
      target: globalSaveTarget,
    });
  } catch (err) {
    console.error("Error in /set-adjustment-name:", err);
    errorLogger &&
      errorLogger.error(
        "Error in /set-adjustment-name: " + (err && err.message)
      );
    return res.status(500).send({ message: "Internal server error" });
  }
});

// ---------------------------
// Multer storage engine (uses globals as per your requirement)
// - If globalSaveTarget === "WO" -> save under WORKORDER/OrderNo[/SchNo]
// - Otherwise -> save under MATERIALMANAGEMENT
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const { workOrderRoot, materialRoot } = getPathsFromConfig();

      if (globalSaveTarget === "WO") {
        const orderNo = OrderNOO;
        if (!orderNo) {
          return cb(
            new Error(
              "OrderNo not set. Call /set-adjustment-name with OrderNo first."
            ),
            null
          );
        }

        const base = workOrderRoot || uploadFolder;
        let orderPath = path.join(base, String(orderNo));

        if (!fs.existsSync(orderPath))
          fs.mkdirSync(orderPath, { recursive: true });

        if (SchNoo) {
          orderPath = path.join(orderPath, String(SchNoo));
          if (!fs.existsSync(orderPath))
            fs.mkdirSync(orderPath, { recursive: true });
        }

        console.log("📁 Upload Path (WO):", orderPath);
        return cb(null, orderPath);
      }

      // MaterialManagement target
      const matBase =
        materialRoot ||
        path.join(workOrderRoot || uploadFolder, "..", "MaterialManagement");
      if (!fs.existsSync(matBase)) fs.mkdirSync(matBase, { recursive: true });

      console.log("📁 Upload Path (Material):", matBase);
      cb(null, matBase);
    } catch (err) {
      console.error("Error in multer.destination:", err);
      return cb(err, null);
    }
  },

  filename: (req, file, cb) => {
    try {
      // sanitize adjustment for filename
      const base = (globalAdjustmentName || "Document")
        .replace(/[\/\\:?<>|"]/g, "")
        .trim();
      const ext = path.extname(file.originalname) || ".pdf";
      const stamp = getFormattedDateTime();

      const fileName = `${base}_${stamp}${ext}`;
      console.log("📝 Generated Filename:", fileName);
      cb(null, fileName);
    } catch (err) {
      console.error("Error in multer.filename:", err);
      cb(err);
    }
  },
});

const upload = multer({ storage }).single("file");

// ---------------------------
// API: /save-pdf
// - Expects file in multipart/form-data only (metadata already set via /set-adjustment-name)
// ---------------------------
savePDF.post("/save-pdf", (req, res) => {
  try {
    console.log("\n📨 Received POST /save-pdf");
    console.log("Current Stored Values:", {
      OrderNOO,
      SchNoo,
      globalAdjustmentName,
      globalSaveTarget,
    });

    upload(req, res, (err) => {
      if (err) {
        console.error("File upload error:", err);
        errorLogger &&
          errorLogger.error(
            "File upload error in /save-pdf: " + (err && err.message)
          );
        return res
          .status(500)
          .send({ message: "File upload failed", error: err && err.message });
      }

      if (!req.file) {
        console.warn("No file uploaded in request.");
        return res.status(400).send({ message: "No file uploaded." });
      }

      console.log("✅ File uploaded successfully!");
      console.log("   → File name:", req.file.filename);
      console.log("   → File size (bytes):", req.file.size);
      console.log("   → File path:", req.file.path);

      infoLogger &&
        infoLogger.info(
          `Successfully saved PDF: ${req.file.filename} (${req.file.size} bytes) to ${req.file.path}`
        );

      return res.status(200).send({
        message: "PDF saved successfully!",
        filePath: req.file.path,
        fileName: req.file.filename,
        target: globalSaveTarget,
      });
    });
  } catch (err) {
    console.error("Error in /save-pdf:", err);
    errorLogger &&
      errorLogger.error("Error in /save-pdf: " + (err && err.message));
    return res.status(500).send({ message: "Internal server error" });
  }
});

module.exports = savePDF;
