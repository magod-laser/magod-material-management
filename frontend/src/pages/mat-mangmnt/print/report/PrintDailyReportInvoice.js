import { Fragment, useState, useEffect } from "react";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import PrintDailyReportInvoiceTable from "./PrintDailyReportInvoiceTable";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";

import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";
function PrintDailyReportInvoice(props) {
  const [PDFData, setPDFData] = useState({});
  const handleClose = () => props.setInvoiceDispatchPrint(false);

  function fetchPDFData() {
    postRequest(endpoints.getPDFData, {}, (res) => {
      setPDFData(res[0]);
    });
  }

  const savePdfToServer = async () => {
    try {
      const adjustment = "DailyReportInvoice";
      await axios.post(endpoints.pdfServer, { adjustment });

      const blob = await pdf(
        <PrintDailyReportInvoiceTable
          tableData={props.tableData}
          date={props.date}
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
      <Modal show={props.invoiceDispatchPrint} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Modal.Title>Print Invoice Dispatch</Modal.Title>
            <button className="button-style" onClick={savePdfToServer}>
              Save to Server
            </button>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <PrintDailyReportInvoiceTable
                tableData={props.tableData}
                date={props.date}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrintDailyReportInvoice;
