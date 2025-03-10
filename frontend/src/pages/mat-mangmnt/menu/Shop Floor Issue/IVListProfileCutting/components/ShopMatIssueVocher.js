import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Table from "react-bootstrap/Table";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../../../utils";
import PrintIVListProfileCutting from "../../../../print/shopfloorissue/PrintIVListProfileCutting";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function ShopMatIssueVocher() {
  const nav = useNavigate();
  const location = useLocation();
  const [noDetails, setNoDetails] = useState(0);
  const [combineSheets, setCombineSheets] = useState("");
  console.log("location id = ", location?.state?.issueIDVal);
  const [tableData, setTableData] = useState([]);

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

  // console.log("IssueIDVal", location?.state?.issueIDVal);
  // console.log("formHeader", formHeader);
  console.log("tableData", tableData);

  const fetchData = async () => {
    let url =
      endpoints.getShopMaterialIssueVoucher +
      "?id=" +
      location?.state?.issueIDVal;
    getRequest(url, async (data) => {
      console.log("data = ", data);
      //get cust name
      // let url1 = endpoints.getCustomerByCustCode + "?code=" + data.Cust_Code;
      // getRequest(url1, async (cdata) => {
      setFormHeader({
        CustMtrl: data.CustMtrl,
        Cust_name: data.Cust_name,
        IV_No: data.IV_No,
        IssueID: data.IssueID,
        // Issue_date: formatDate(new Date(data.Issue_date), 3),
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
      //});
    });
    //get table data
    let url2 =
      endpoints.getShopMaterialIssueVoucherTable +
      "?id=" +
      location.state.issueIDVal;
    getRequest(url2, (data) => {
      console.log("table data = ", data);
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
    //console.log("change  val = ", e.target.checked);
    if (e.target.checked === true) {
      setNoDetails(1);
    }
    if (e.target.checked === false) {
      setNoDetails(0);
    }
  };

  const printButton = () => {
    console.log("print = ", noDetails);
    console.log("combine sheets = ", combineSheets);

    // if (combineSheets.length > 0) {
    //     setNoDetails(2);
    //   const myArray = combineSheets.split("\n");
    //   //console.log("combine sheets array = ", myArray);
    //   let newTable = [];

    //   for (let i = 0; i < myArray.length; i++) {
    //     tableData.map((obj) => {
    //       if (obj.ShapeMtrlID === myArray[i]) {
    //         newTable.push(obj);
    //       }
    //     });
    //   }
    //   //console.log("new table = ", newTable);

    //   nav(
    //     "/materialmanagement/shopfloorissue/ivlistprofilecutting/PrintIVListProfileCutting",
    //     {
    //       state: {
    //         formHeader: formHeader,
    //         tableData: newTable,
    //         noDetails: noDetails,
    //       },
    //     }
    //   );
    // }
    if (noDetails === 1 && combineSheets.length > 0) {
      // nav(
      //   "/MaterialManagement/ShopFloorIssue/IVListProfileCutting/PrintIVListProfileCutting",
      //   {
      //     state: {
      //       formHeader: formHeader,
      //       tableData: tableData,
      //       noDetails: noDetails,
      //       combineSheets: combineSheets,
      //     },
      //   }
      // );
      setIsPrintModalOpen(true);
    } else {
      // nav(
      //   "/MaterialManagement/ShopFloorIssue/IVListProfileCutting/PrintIVListProfileCutting",
      //   {
      //     state: {
      //       formHeader: formHeader,
      //       tableData: tableData,
      //       noDetails: noDetails,
      //       combineSheets: combineSheets,
      //     },
      //   }
      // );
      setIsPrintModalOpen(true);
    }
  };

  const InputEventCombineShhet = (e) => {
    setCombineSheets(e.target.value);
  };

  console.log("formHeader", formHeader);
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
        {/* <div className="col-md-4">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label"> IV No</label>
              <input className="" disabled value={formHeader.IV_No} />
            </div>

            <div className="col-md-6">
              {" "}
              <label className="form-label">&nbsp;</label>
              <input
                className=""
                disabled
                // value={formHeader.Isssue_date}
                value={
                  formHeader.Isssue_date
                    ? new Date(formHeader.Isssue_date).toLocaleDateString(
                        "en-GB"
                      )
                    : ""
                }
              />
            </div>
          </div>


          <div className="row">
            {" "}
            <div className="col-md-6">
              {" "}
              <label className="form-label">Program No</label>
              <input className="" disabled value={formHeader.NC_ProgramNo} />
            </div>

            <div className="col-md-6">
              {" "}
              <label className="form-label">&nbsp;</label>
              <input className="" disabled value={formHeader.TaskNo} />
            </div>

          </div>
          <div className="row">
            {" "}
            <div className="col-md-12">
              <label className="form-label">Customer</label>
              <input className="" disabled value={formHeader.Cust_name} />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col-md-6">
              <label className="form-label">Operation</label>
              <input className="" disabled value={formHeader.Operation} />
            </div>
            <div className="col-md-6">
              <label className="form-label">&nbsp;</label>
              <input className="" disabled value={formHeader.MProcess} />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col-md-12">
              <label className="form-label">Source</label>
              <input className="" disabled value={formHeader.CustMtrl} />
            </div>
          </div>
        </div> */}

        {/* <div className="col-md-4">
          {" "}
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Material</label>
              <input className="" disabled value={formHeader.Mtrl_Code} />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col-md-4">
              <label className="form-label">Length</label>
              <input className="" disabled value={formHeader.Para1} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Width</label>
              <input className="" disabled value={formHeader.Para2} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Height</label>
              <input className="" disabled value={formHeader.Para3} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Machine</label>
              <input className="" disabled value={formHeader.Machine} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Qty Required</label>
              <input className="" disabled value={formHeader.Qty} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Qty Issued</label>
              <input className="" disabled value={formHeader.QtyIssued} />
            </div>
          </div>
        </div> */}

        {/* <div className="col-md-4">
          {" "}
          <div className="row mt-4">
            <div className="col-md-6 col-sm-12">
              <button className="button-style " onClick={printButton}>
                Print
              </button>
            </div>
            <div className="col-md-6 col-sm-12">
              <button
                className="button-style "
                id="btnclose"
                type="submit"
                onClick={() => nav("/MaterialManagement")}
              >
                Close
              </button>
            </div>
          </div>

          <div className="row mt-4">
            {" "}
            <div
              className="col-md-12 mt-2"
              style={{ display: "flex", gap: "5px" }}
            >
              <input
                className="form-check-input mt-3"
                type="checkbox"
                id="flexCheckDefault"
                name="updated"
                //   value={inputPart.upDated}
                //disabled={boolVal3 | boolVal4}
                //   disabled={true}
                onChange={checkboxChange}
              />
               <label className="form-label mt-1">No Details</label>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <label className="form-label">Combined Sheets</label>
              <div>
                {" "}
                <textarea
                  style={{ height: "100px" }}
                  onChange={InputEventCombineShhet}
                  value={combineSheets}
                ></textarea>
              </div>
            </div>
          </div>
        </div> */}

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
            // value={formHeader.Isssue_date}
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
              //   value={inputPart.upDated}
              //disabled={boolVal3 | boolVal4}
              //   disabled={true}
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

          {/* <div className="d-flex col-md-4" style={{gap:'70px'}}>
            <div className="col-md-3">
              <label className="form-label">Combined Sheets</label>
            </div>
            <div>
              <textarea
                style={{ height: "40px", width: '450px' }}
                onChange={InputEventCombineShhet}
                value={combineSheets}
              ></textarea>
            </div>

          </div> */}
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
          //pagination={paginationFactory()}
          //selectRow={selectRow}
          headerClasses="header-class tableHeaderBGColor"
        ></BootstrapTable>

        {/* <Table bordered>
          <thead
            style={{
              textAlign: "center",
              position: "sticky",
              top: "-1px",
            }}
          >
            <tr>
              <th>Shape Mtrl ID</th>
              <th>Para 1</th>
              <th>Para 2</th>
              <th>Para 3</th>
              <th>Used</th>
              <th>Rejected</th>
              <th>Selected</th>
            </tr>
          </thead>

          <tbody className="tablebody">
            <tr
            // onClick={() => selectedRowFn(item, key)}
            // className={
            //   key === selectedRow?.index ? "selcted-row-clr" : ""
            // }
            >
              <td>asdfghj</td>
              <td>asdfghj</td>
              <td>asdfghj</td>
              <td>asdfghj</td>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <input type="checkbox" />
              </td>
            </tr>
          </tbody>
        </Table> */}
      </div>
    </div>
  );
}

export default ShopMatIssueVocher;
