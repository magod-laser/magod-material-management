import React, { Fragment, useState, useEffect } from "react";
import { PDFViewer, StyleSheet, pdf } from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import PrintIVListServicePartTable from "./PrintIVListServicePartTable";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast } from "react-toastify";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

function PrintIVListServicePart({
  isOpen,
  formHeader,
  tableData,
  setIsPrintModalOpen,
}) {
  const [PDFData, setPDFData] = useState({});
  const [logoBase64, setLogoBase64] = useState(null);
  const location = useLocation();
  // console.log(
  //   "Second formheader = ",
  //   location?.state?.formHeader,
  //   " outdata = ",
  //   location?.state?.tableData
  // );

  const handleClose = () => {
    setIsPrintModalOpen(false);
  };

  function fetchPDFData() {
    let url1 = endpoints.getPDFData;
    postRequest(url1, {}, async (res) => {
      // console.log("res", res);
      console.log("url", url1);
      setPDFData(res[0]);
    });
  }

  const savePdfToServer = async () => {
    try {
      const adjustment = "IVListPart";
      await axios.post(endpoints.pdfServer, { adjustment });

      const blob = await pdf(
        <PrintIVListServicePartTable
          formHeader={formHeader}
          tableData={tableData}
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
    <Modal show={isOpen} onHide={handleClose} fullscreen>
      <Modal.Header closeButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Modal.Title>Assembly Parts Issue Voucher</Modal.Title>
          <button className="button-style" onClick={savePdfToServer}>
            Save to Server
          </button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <Fragment>
          <PDFViewer width="1200" height="600" filename="IVListPart.pdf">
            <PrintIVListServicePartTable
              formHeader={formHeader}
              tableData={tableData}
              PDFData={PDFData}
            />
          </PDFViewer>
        </Fragment>
      </Modal.Body>
    </Modal>
  );
}

export default PrintIVListServicePart;
