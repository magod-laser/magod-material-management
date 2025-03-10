import React, { Fragment, useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import PrintLocationStockDetailTableReport from "./PrintLocationStockDetailTableReport";
import { Modal } from "react-bootstrap";

import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";
function PrintLocationStockDetailReport(props) {
  const [PDFData, setPDFData] = useState({});

  const location = useLocation();
  // console.log(
  //   "formHeader = ",
  //   location.state.formHeader,
  //   " tabledata = ",
  //   location.state.tableData,
  //   " tabletotal = ",
  //   location.state.tabletotal
  //   //" weight = ",
  //   //location.state.totalweight1
  // );

  const handleClose = () => props.setDetailsReportPrintOpen(false);

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
        show={props.detailsReportPrintOpen}
        onHide={handleClose}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Location Stock Details Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <PrintLocationStockDetailTableReport
                formHeader={props.formHeader}
                tableData={props.tableData}
                tabletotal={props.tabletotal}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrintLocationStockDetailReport;
