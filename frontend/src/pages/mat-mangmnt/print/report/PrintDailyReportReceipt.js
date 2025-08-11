import { Fragment, useState, useEffect } from "react";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import PrintDailyReportReceiptTable from "./PrintDailyReportReceiptTable";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";
function PrintDailyReportReceipt(props) {
  const [PDFData, setPDFData] = useState({});

  const handleClose = () => props.setReceiptReportPrint(false);

  function fetchPDFData() {
    postRequest(endpoints.getPDFData, {}, (res) => {
      setPDFData(res[0]);
    });
  }

  const savePdfToServer = async () => {
    try {
      const adjustment = "DailyReceiptReport";
      await axios.post(endpoints.pdfServer, { adjustment });

      const blob = await pdf(
        <PrintDailyReportReceiptTable
          tableData={props.tableData}
          date={props.date}
          totqty={props.totqty}
          totalweight={props.totalweight}
          PDFData={PDFData}
        />
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
    <>
      <Modal show={props.receiptReportPrint} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Modal.Title>Print Receipt Report</Modal.Title>
            <button className="button-style" onClick={savePdfToServer}>
              Save to Server
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <PrintDailyReportReceiptTable
                tableData={props.tableData}
                date={props.date}
                totqty={props.totqty}
                totalweight={props.totalweight}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrintDailyReportReceipt;
