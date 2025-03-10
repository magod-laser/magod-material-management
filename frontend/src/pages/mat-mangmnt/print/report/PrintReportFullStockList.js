import React, { Fragment, useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import PrintReportFullStockListTable from "./PrintReportFullStockListTable";
import Modal from "react-bootstrap/Modal";
import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";

function PrintReportFullStockList(props) {
  const [PDFData, setPDFData] = useState({});
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const location = useLocation();
  // console.log(
  //   "customerDetails = ",
  //   location.state.customerDetails,
  //   " tabledata = ",
  //   location.state.fullStockTable,
  //   " scrap = ",
  //   location.state.fullStockScrapTable
  //   //" weight = ",
  //   //location.state.totalweight1
  // );
  const handleClose = () => props.setPrintFullStockListOpen(false);

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
        show={props.printFullStockListOpen}
        onHide={handleClose}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Print Full Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <PrintReportFullStockListTable
                customerDetails={props.customerDetails}
                fullStockTable={props.fullStockTable}
                fullStockScrapTable={props.fullStockScrapTable}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrintReportFullStockList;
