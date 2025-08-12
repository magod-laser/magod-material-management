import { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PrintIVListProfileCutting from "../../../../print/shopfloorissue/PrintIVListProfileCutting";
import { PDFViewer, StyleSheet, pdf } from "@react-pdf/renderer";
import axios from "axios";
import { toast } from "react-toastify";
import PrintIVListProfileCuttingTable1 from "../../../../print/shopfloorissue/PrintIVListProfileCuttingTable1";
import PrintIVListProfileCuttingTable2 from "../../../../print/shopfloorissue/PrintIVListProfileCuttingTable2";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function ShopMatIssueVocher() {
  const nav = useNavigate();
  const location = useLocation();
  const [noDetails, setNoDetails] = useState(0);
  const [combineSheets, setCombineSheets] = useState("");
  const [tableData, setTableData] = useState([]);
  const [PDFData, setPDFData] = useState({});

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  let [formHeader, setFormHeader] = useState({
    CustMtrl: "",
    Cust_name: "",
    IV_No: "",
    IssueID: "",
    Issue_date: "",
    Issue_time: "",
    MProcess: "",
    Machine: "",
    Mtrl_Code: "",
    NC_ProgramNo: "",
    NcId: "",
    Operation: "",
    Para1: "",
    Para2: "",
    Para3: "",
    Qty: "",
    QtyIssued: "",
    QtyReturned: "",
    Remarks: "",
    Status: "",
    TaskNo: "",
  });

  const fetchData = async () => {
    let url =
      endpoints.getShopMaterialIssueVoucher +
      "?id=" +
      location?.state?.issueIDVal;
    getRequest(url, async (data) => {
      setFormHeader({
        CustMtrl: data.CustMtrl,
        Cust_name: data.Cust_name,
        IV_No: data.IV_No,
        IssueID: data.IssueID,
        Isssue_date: data.Issue_date,
        Issue_time: data.Issue_time,
        MProcess: data.MProcess,
        Machine: data.Machine,
        Mtrl_Code: data.Mtrl_Code,
        NC_ProgramNo: data.NC_ProgramNo,
        NcId: data.NcId,
        Operation: data.Operation,
        Para1: data.Para1,
        Para2: data.Para2,
        Para3: data.Para3,
        Qty: data.Qty,
        QtyIssued: data.QtyIssued,
        QtyReturned: data.QtyReturned,
        Remarks: data.Remarks,
        Status: data.Status,
        TaskNo: data.TaskNo,
      });
    });

    let url2 =
      endpoints.getShopMaterialIssueVoucherTable +
      "?id=" +
      location.state.issueIDVal;
    getRequest(url2, (data) => {
      setTableData(data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      text: "Id",
      dataField: "NcPgmMtrlId",
      hidden: true,
    },
    {
      text: "Shape Mtrl ID",
      dataField: "ShapeMtrlID",
      sort: true,
    },
    {
      text: "Para1",
      dataField: "Para1",
      sort: true,
    },
    {
      text: "Para2",
      dataField: "Para2",
      sort: true,
    },
    {
      text: "Para3",
      dataField: "Para3",
      sort: true,
    },
    {
      text: "Used",
      dataField: "Used",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Used == 1 ? true : false} />
          </lable>
        </div>
      ),
    },
    {
      text: "Rejected",
      dataField: "Rejected",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Rejected == 1 ? true : false} />
          </lable>
        </div>
      ),
    },
    {
      text: "Selected",
      dataField: "Selected",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Rejected == 2 ? true : false} />
          </lable>
        </div>
      ),
    },
  ];

  const checkboxChange = (e) => {
    if (e.target.checked === true) {
      setNoDetails(1);
    }
    if (e.target.checked === false) {
      setNoDetails(0);
    }
  };

  function fetchPDFData() {
    let url1 = endpoints.getPDFData;
    postRequest(url1, {}, async (res) => {
      setPDFData(res[0]);
    });
  }

  const savePdfToServer = async () => {
    try {
      const adjustment = "IVListProfileCutting";
      await axios.post(endpoints.pdfServer, { adjustment });

      const blob = await pdf(
        noDetails === 0 ? (
          <PrintIVListProfileCuttingTable1
            formHeader={formHeader}
            tableData={tableData}
            PDFData={PDFData}
          />
        ) : (
          <PrintIVListProfileCuttingTable2
            formHeader={formHeader}
            tableData={tableData}
            combineSheets={combineSheets}
            PDFData={PDFData}
          />
        )
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

  const printButton = () => {
    if (noDetails === 1 && combineSheets.length > 0) {
      setIsPrintModalOpen(true);
      savePdfToServer();
    } else {
      setIsPrintModalOpen(true);
      savePdfToServer();
    }
  };

  const InputEventCombineShhet = (e) => {
    setCombineSheets(e.target.value);
  };

  return (
    <div>
      <PrintIVListProfileCutting
        isOpen={isPrintModalOpen}
        formHeader={formHeader}
        noDetails={noDetails}
        tableData={tableData}
        setIsPrintModalOpen={setIsPrintModalOpen}
        combineSheets={combineSheets}
      />
      <h4 className="title">Shop Material Issue Voucher</h4>
      <div className="row">
        <div className="d-flex col-md-3" style={{ gap: "35px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            {" "}
            IV No
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.IV_No}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "30px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Date
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={
              formHeader.Isssue_date
                ? new Date(formHeader.Isssue_date).toLocaleDateString("en-GB")
                : ""
            }
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Program No
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.NC_ProgramNo}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label m-1" style={{ whiteSpace: "nowrap" }}>
            &nbsp;
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.TaskNo}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Operation
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.Operation}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "55px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            &nbsp;
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.MProcess}
          />
        </div>

        <div className="d-flex col-md-6" style={{ gap: "25px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Customer
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.Cust_name}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "26px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Source
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.CustMtrl}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Material
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.Mtrl_Code}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "42px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Para1
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.Para1}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "30px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Para2
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.Para2}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "25px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Para3
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.Para3}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Machine
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.Machine}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "8px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Qty Required
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.Qty}
          />
        </div>

        <div className="d-flex col-md-3" style={{ gap: "10px" }}>
          <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
            Qty Issued
          </label>

          <input
            className="input-disabled mt-1"
            disabled
            value={formHeader.QtyIssued}
          />
        </div>

        <div className="d-flex col-md-12 mt-2" style={{ gap: "10px" }}>
          <div className="d-flex col-md-2 mt-2" style={{ gap: "10px" }}>
            <input
              className="form-check-input mt-2"
              type="checkbox"
              id="flexCheckDefault"
              name="updated"
              onChange={checkboxChange}
            />
            <label className="form-label mt-1">No Details</label>
          </div>

          <div className="d-flex col-md-6" style={{ gap: "5px" }}>
            <label className="form-label" style={{ whiteSpace: "nowrap" }}>
              Combined Sheets
            </label>

            <textarea
              style={{ height: "40px", width: "100%", fontSize: "12px" }}
              onChange={InputEventCombineShhet}
              value={combineSheets}
            ></textarea>
          </div>

          <div className="d-flex col-md-2">
            <button
              className="button-style col-md-2 "
              onClick={printButton}
              style={{ width: "50px" }}
            >
              Print
            </button>

            <button
              className="button-style col-md-2"
              id="btnclose"
              type="submit"
              style={{ width: "50px" }}
              onClick={() => nav("/MaterialManagement")}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          height: "300px",
          overflowY: "scroll",
          border: "solid #c0c4c2 1px",
          marginTop: "20px",
        }}
      >
        <BootstrapTable
          keyField="NcPgmMtrlId"
          columns={columns}
          data={tableData}
          striped
          hover
          condensed
          headerClasses="header-class tableHeaderBGColor"
        ></BootstrapTable>
      </div>
    </div>
  );
}

export default ShopMatIssueVocher;
