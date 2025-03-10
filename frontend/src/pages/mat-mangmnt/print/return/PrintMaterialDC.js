import React, { Fragment, useState, useEffect } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import PrintMaterialDCTable from "./PrintMaterialDCTable";
import { useLocation } from "react-router-dom";

import Modal from "react-bootstrap/Modal";

import { postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";
function PrintMaterialDC(props) {
  const [PDFData, setPDFData] = useState({});

  const location = useLocation();
  // console.log(
  //   "Second formheader = ",
  //   location.state.formHeader,
  //   " outdata = ",
  //   location.state.outData,
  //   " custdata = ",
  //   location.state.custdata
  // );
  let totalQTYVar = 0;

  for (let i = 0; i < props.outData.length; i++) {
    const element = props.outData[i];
    // console.log("element", element.QtyReturned);
    totalQTYVar = totalQTYVar + parseInt(element.Qty);
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
          <Modal.Title>Outward Material Issue Voucher Print</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Fragment>
            <PDFViewer width="1200" height="600" filename="somename.pdf">
              <PrintMaterialDCTable
                //data={data}
                //selectedWeek={selectedWeek}
                //newData={newData}
                formHeader={props.formHeader}
                outData={props.outData}
                custdata={props.custdata}
                dcRegister={props.dcRegister}
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

export default PrintMaterialDC;
