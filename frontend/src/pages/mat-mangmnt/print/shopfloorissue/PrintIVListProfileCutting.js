import { Fragment, useState, useEffect } from "react";
import { PDFViewer, StyleSheet, pdf } from "@react-pdf/renderer";
import PrintIVListProfileCuttingTable1 from "./PrintIVListProfileCuttingTable1";
import PrintIVListProfileCuttingTable2 from "./PrintIVListProfileCuttingTable2";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast } from "react-toastify";

const { postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  logoImage: {
    width: "50px",
  },
  companyInfo: {
    marginTop: "5px",
    marginLeft: "20%",
    width: "60%",
    fontSize: "9",
    alignSelf: "center",
  },
});

function PrintIVListProfileCutting({
  isOpen,
  formHeader,
  tableData,
  setIsPrintModalOpen,
  noDetails,
  combineSheets,
  formType,
  fromType,
}) {
  const [PDFData, setPDFData] = useState({});

  const handleClose = () => {
    setIsPrintModalOpen(false);
  };

  function fetchPDFData() {
    let url1 = endpoints.getPDFData;
    postRequest(url1, {}, async (res) => {
      setPDFData(res[0]);
    });
  }

  const taskNo = formHeader?.TaskNo ?? "";
  const parts = taskNo.split(" ");
  // Get order number
  const orderNum = parts[0];
  // Get schedule number (first + second part)
  const schNo = parts.slice(0, 2).join(" ");

  const savePdfToServer = async () => {
    try {
      const orderNo = orderNum;
      const ordSchNo = schNo;

      let baseName = "";

      if (formType === "Units") {
        baseName = "Units";
      } else if (formType === "Others") {
        baseName = "ProfileCutting";
      } else if (fromType === "current") {
        baseName = "IVListProfileCuttingCurrent";
      } else if (fromType === "closed") {
        baseName = "IVListProfileCuttingClosed";
      }

      const adjustment = `${baseName} ${ordSchNo}`;

      await axios.post(endpoints.pdfServer, {
        adjustment,
        WO: "WO",
        OrderNo: orderNo,
        SchNo: ordSchNo,
      });

      const blob = await pdf(
        noDetails === 0 ? (
          <PrintIVListProfileCuttingTable1
            formHeader={formHeader}
            tableData={tableData}
            PDFData={PDFData}
          />
        ) : (
          <PrintIVListProfileCuttingTable2
            formHeader={formHeader}
            tableData={tableData}
            combineSheets={combineSheets}
            PDFData={PDFData}
          />
        )
      ).toBlob();

      const file = new File([blob], "GeneratedPDF.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();

      formData.append("file", file);

      const response = await axios.post(endpoints.savePdf, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        toast.success("PDF saved successfully!");
      }
    } catch (error) {
      console.error("Error saving PDF to server:", error);
    }
  };

  useEffect(() => {
    fetchPDFData();
  }, []);

  return (
    <Modal show={isOpen} onHide={handleClose} fullscreen>
      <Modal.Header closeButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Modal.Title>Material : Shop Floor Issue</Modal.Title>
          <button className="button-style" onClick={savePdfToServer}>
            Save to Server
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Fragment>
          <PDFViewer
            width="1200"
            height="600"
            filename="IVListProfileCutting.pdf"
          >
            {noDetails === 0 ? (
              <PrintIVListProfileCuttingTable1
                formHeader={formHeader}
                tableData={tableData}
                PDFData={PDFData}
              />
            ) : (
              <PrintIVListProfileCuttingTable2
                formHeader={formHeader}
                tableData={tableData}
                combineSheets={combineSheets}
                PDFData={PDFData}
              />
            )}
          </PDFViewer>
        </Fragment>
      </Modal.Body>
    </Modal>
  );
}

export default PrintIVListProfileCutting;
