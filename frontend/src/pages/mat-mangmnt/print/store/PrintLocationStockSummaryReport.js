import { Fragment, useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PrintLocationStockSummaryTableReport from "./PrintLocationStockSummaryTableReport";
import { Modal } from "react-bootstrap";

import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";

function PrintLocationStockSummaryReport(props) {
  const [PDFData, setPDFData] = useState({});
  const handleClose = () => props.setSummaryReportPrintOpen(false);

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
      <Modal
        show={props.summaryReportPrintOpen}
        onHide={handleClose}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Location Stock Summary Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <PrintLocationStockSummaryTableReport
                formHeader={props.formHeader}
                tableData={props.tableData}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrintLocationStockSummaryReport;
