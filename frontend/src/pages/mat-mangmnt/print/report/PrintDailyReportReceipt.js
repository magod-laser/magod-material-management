import { Fragment, useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PrintDailyReportReceiptTable from "./PrintDailyReportReceiptTable";
import { Modal } from "react-bootstrap";

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

  useEffect(() => {
    fetchPDFData();
  }, []);

  return (
    <>
      <Modal show={props.receiptReportPrint} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Print Receipt Report</Modal.Title>
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
