import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { formatDate } from "../../../../../utils";
import { useLocation } from "react-router-dom";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function OpenClosedPurchaseRVList() {
  const location = useLocation();

  const nav = useNavigate();
  const [show, setShow] = useState(false);

  const currDate = new Date()
    .toJSON()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("/");

  //initial disable all
  const [boolVal, setBoolVal] = useState(true);

  const [partUniqueId, setPartUniqueId] = useState();
  const [partArray, setPartArray] = useState([]);

  const [partVal, setPartVal] = useState([]);
  const [inputPart, setInputPart] = useState({
    Id: "",
    PartId: "",
    UnitWt: "",
    QtyReceived: "",
    QtyAccepted: "",
    QtyRejected: "0",
  });

  const [custDetailVal, setCustDetailVal] = useState("");
  const [calcWeightVal, setCalcWeightVal] = useState(0);

  const currDateTime = new Date();
  let [custdata, setCustdata] = useState([]);
  let [mtrlDetails, setMtrlDetails] = useState([]);
  const [saveUpdateCount, setSaveUpdateCount] = useState(0);

  const [formHeader, setFormHeader] = useState({
    RvID: "",
    ReceiptDate: "",
    RV_No: "",
    RV_Date: "",
    RVStatus: "",
    Cust_Code: "",
    Customer: "",
    CustDocuNo: "",
    TotalWeight: "",
    TotalCalculatedWeight: "",
    Type: "",
    address: "",
  });

  //   async function fetchCustData() {
  //     getRequest(endpoints.getCustomers, (data) => {
  //       const found = data.find((obj) => obj.Cust_Code === formHeader.Cust_Code);
  //       formHeader.address = found.Address;
  //       //setCustdata(data);
  //     });
  //     //console.log("data = ", custdata);
  //   }

  async function fetchData() {
    const url =
      endpoints.getByTypeMaterialReceiptRegisterByRvID +
      "?id=" +
      location.state.id;
    getRequest(url, (data) => {
      //console.log("data = ", data);
      data.ReceiptDate = formatDate(new Date(data.ReceiptDate), 4);
      data.RV_Date = formatDate(new Date(data.RV_Date), 3);
      //setFormHeader(data);

      //get customer details for address
      getRequest(endpoints.getCustomers, (data1) => {
        const found = data1.find((obj) => obj.Cust_Code === data.Cust_Code);
        data.address = found.Address;
        setFormHeader(data);

        //get part details
        const url1 =
          endpoints.getPartReceiptDetailsByRvID + "?id=" + location.state.id;
        getRequest(url1, (data2) => {
          setPartArray(data2);
          //setFormHeader(formHeader);
          //console.log(data2);
        });
      });
    });
    //console.log("data = ", formHeader);
  }

  useEffect(() => {
    fetchData();
    //formHeader.ReceiptDate = formatDate(new Date(), 4);
  }, []);

  const columns = [
    {
      text: "#",
      dataField: "Id",
      hidden: true,
    },
    {
      text: "Part Id",
      dataField: "PartId",
    },
    {
      text: "Unit Wt",
      dataField: "UnitWt",
    },
    {
      text: "Qty Received",
      dataField: "QtyReceived",
    },
    {
      text: "Qty Accepted",
      dataField: "QtyAccepted",
    },
    {
      text: "Qty Rejected",
      dataField: "QtyRejected",
    },
  ];

  return (
    <div>
      <div>
        <h4 className="form-title">Customer Parts Receipt Voucher</h4>
        <hr className="horizontal-line" />

        <div className="row">
          <div className="col-md-3">
            <label className="">Receipt Date</label>
            <input
              type="text"
              name="receiptDate"
              value={formHeader.ReceiptDate}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label className="">RV No</label>
            <input type="text" name="rvNo" value={formHeader.RV_No} readOnly />
          </div>
          <div className="col-md-3">
            <label className="">RV Date</label>
            <input
              type="text"
              name="rvDate"
              value={formHeader.RV_Date}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label className="">status</label>
            <input
              type="text"
              name="status"
              value={formHeader.RVStatus}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <label className="form-label">Customer</label>
            <select className="ip-select" name="customer" disabled={boolVal}>
              <option value={formHeader.Cust_Code} disabled selected>
                {formHeader.Customer}
              </option>
              {/* {custdata.map((customer, index) => (
                <option key={index} value={customer.Cust_Code}>
                  {customer.Cust_name}
                </option>
              ))} */}
            </select>
          </div>
          <div className="col-md-4">
            <label className="">Weight</label>
            <input
              type="text"
              name="weight"
              value={formHeader.TotalWeight}
              disabled={boolVal}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <label className="">Reference</label>
            <input
              type="text"
              name="reference"
              value={formHeader.CustDocuNo}
              disabled={boolVal}
            />
          </div>
          <div className="col-md-4">
            <label className="">Calculated Weight</label>
            <input
              type="text"
              name="calculatedWeight"
              value={formHeader.TotalCalculatedWeight}
              readOnly
            />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-8 justify-content-center">
            <button
              className="button-style"
              style={{ width: "196px" }}
              disabled={boolVal}
            >
              Save
            </button>
            <button
              className="button-style"
              style={{ width: "196px" }}
              disabled={boolVal}
            >
              Allot RV No
            </button>
            <button
              className="button-style"
              style={{ width: "196px" }}
              disabled={boolVal}
            >
              Delete RV
            </button>
          </div>
          <div className="col-md-4">
            <label className="form-label"></label>
            <textarea
              style={{ height: "110px" }}
              className="form-control"
              value={formHeader.address}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
      <div className="row">
        <div
          style={{ height: "330px", overflowY: "scroll" }}
          className="col-md-6 col-sm-12"
        >
          <BootstrapTable
            keyField="Id"
            columns={columns}
            data={partArray}
            striped
            hover
            condensed
            //selectRow={selectRow}
          ></BootstrapTable>
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="ip-box form-bg">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <div className="ip-box form-bg">
                  <div className="row">
                    <div className="row justify-content-center mt-1 mb-2">
                      <button
                        className="button-style "
                        style={{ width: "120px" }}
                        disabled={boolVal}
                      >
                        Add New
                      </button>
                    </div>
                    <div className="row">
                      <div className="col-md-3 ">
                        <label className="">Part ID</label>
                      </div>
                      <div className="col-md-8" style={{ marginTop: "8px" }}>
                        <select
                          className="ip-select dropdown-field"
                          name="partId"
                          value={inputPart.partId}
                          disabled={boolVal}
                        >
                          {mtrlDetails.map((part, index) => (
                            <option key={index} value={part.PartId}>
                              {part.PartId}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3 ">
                        <label className="">Unit Wt</label>
                      </div>
                      <div className="col-md-8 ">
                        <input
                          className="in-field"
                          type="text"
                          name="unitWeight"
                          value={inputPart.unitWeight}
                          disabled={boolVal}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3 ">
                        <label className="">Qty Received</label>
                      </div>
                      <div className="col-md-8 ">
                        <input
                          className="in-field"
                          type="text"
                          name="qtyReceived"
                          //value={tempVal}
                          value={inputPart.qtyReceived}
                          disabled={boolVal}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3 ">
                        <label className="">Qty Accepted</label>
                      </div>
                      <div className="col-md-8 ">
                        <input
                          className="in-field"
                          type="text"
                          name="qtyAccepted"
                          value={inputPart.qtyAccepted}
                          disabled={boolVal}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-3 ">
                        <label className="">Qty Rejected</label>
                      </div>
                      <div className="col-md-8 ">
                        <input
                          className="in-field"
                          type="text"
                          name="qtyRejected"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center mt-3">
              <button
                className="button-style "
                style={{ width: "120px" }}
                disabled={boolVal}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenClosedPurchaseRVList;
