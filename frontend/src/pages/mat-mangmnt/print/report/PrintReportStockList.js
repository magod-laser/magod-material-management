import { Fragment, useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PrintReportStockListTable from "./PrintReportStockListTable";

import Modal from "react-bootstrap/Modal";
import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";

function PrintReportStockList(props) {
  const [PDFData, setPDFData] = useState({});
  const handleClose = () => props.setprintSelectedStockOpen(false);

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
        show={props.printSelectedStockOpen}
        onHide={handleClose}
        fullscreen
      >
        <Modal.Header closeButton>
          <Modal.Title>Print Selected Stock</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <PrintReportStockListTable
                totQty1={props.totqty1}
                totWeight1={props.totalweight1}
                totQty2={props.totqty2}
                totWeight2={props.totalweight2}
                tableData={props.tableData}
                scrapData={props.scrapData}
                scrapFlag={props.scrapFlag}
                customerDetails={props.customerDetails}
                PDFData={PDFData}
              />
            </PDFViewer>
          </Fragment>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default PrintReportStockList;
