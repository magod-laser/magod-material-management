import { Fragment, useState, useEffect } from "react";
import { PDFViewer, pdf } from "@react-pdf/renderer";
import PrintPartsDCTable from "./PrintPartsDCTable";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast } from "react-toastify";

import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";
function PrintPartsDC(props) {
  const [PDFData, setPDFData] = useState({});

  let totalQTYVar = 0;

  for (let i = 0; i < props?.outData?.length; i++) {
    const element = props.outData[i];
    totalQTYVar = totalQTYVar + parseInt(element.QtyReturned);
  }

  const handleClose = () => props.setPrintOpen(false);

  function fetchPDFData() {
    postRequest(endpoints.getPDFData, {}, (res) => {
      setPDFData(res[0]);
    });
  }

  const savePdfToServer = async () => {
    try {
      const adjustment = "OutwardPartIssueVoucher";
      await axios.post(endpoints.pdfServer, { adjustment });

      const blob = await pdf(
        <PrintPartsDCTable
          formHeader={props?.formHeader}
          outData={props?.outData}
          custdata={props?.custdata}
          dcRegister={props?.dcRegister}
          totalQTYVar={totalQTYVar}
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
      <Modal show={props.printOpen} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Modal.Title>Outward Part Issue Voucher Print</Modal.Title>
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
              filename="OutwardPartIssueVoucher.pdf"
            >
              <PrintPartsDCTable
                formHeader={props?.formHeader}
                outData={props?.outData}
                custdata={props?.custdata}
                dcRegister={props?.dcRegister}
                totalQTYVar={totalQTYVar}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrintPartsDC;
