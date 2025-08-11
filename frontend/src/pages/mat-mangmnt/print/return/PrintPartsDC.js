import { Fragment, useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PrintPartsDCTable from "./PrintPartsDCTable";
import Modal from "react-bootstrap/Modal";

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

  useEffect(() => {
    fetchPDFData();
  }, []);
  return (
    <>
      <Modal show={props.printOpen} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Outward Part Issue Voucher Print</Modal.Title>
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
