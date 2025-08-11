import { Fragment, useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PrintMonthlyTable from "./PrintMonthlyTable";
import { Modal } from "react-bootstrap";

import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";
function PrintMonthlyReport(props) {
  const [PDFData, setPDFData] = useState({});

  const handleClose = () => props.setPrintReportOpen(false);

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
      <Modal show={props.printReportOpen} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Print Monthly Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <PrintMonthlyTable
                date={props.date}
                thirdTab={props.thirdTab}
                fourthTab={props.fourthTab}
                totalobj={props.totalobj}
                purchaseDetails={props.purchaseDetails}
                saleDetails={props.saleDetails}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrintMonthlyReport;
