import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { formatDate } from "../../../../utils";
import { useLocation } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function OpenButtonOpenClosedPartList() {
  const nav = useNavigate();

  const location = useLocation();

  //const nav = useNavigate();
  //const [show, setShow] = useState(false);

  // const currDate = new Date()
  //   .toJSON()
  //   .slice(0, 10)
  //   .split("-")
  //   .reverse()
  //   .join("/");

  //initial disable all
  const [boolVal, setBoolVal] = useState(true);

  const [partUniqueId, setPartUniqueId] = useState();
  const [partArray, setPartArray] = useState([]);

  const [partVal, setPartVal] = useState([]);
  const [inputPart, setInputPart] = useState({
    Id: "",
    PartId: "",
    UnitWt: "",
    qtyReceived: "",
    qtyAccepted: "",
    qtyRejected: "0",
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

  const [selectedPart, setSelectedPart] = useState([]);

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
      data.ReceiptDate = formatDate(new Date(data.ReceiptDate), 10);
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
          getRequest(url1, (data2) => {
            data2.forEach((obj) => {
              obj["id"] = obj["Id"];
              obj["partId"] = obj["PartId"];
              obj["unitWeight"] = obj["UnitWt"];
              obj["qtyReceived"] = obj["QtyReceived"];
              obj["qtyAccepted"] = obj["QtyAccepted"];
              obj["qtyRejected"] = obj["QtyRejected"];
            });
            setPartArray(data2);
          });
          // setPartArray(data2);
          //setFormHeader(formHeader);
          //console.log(data2);
        });
      });

      getRequest(endpoints.getCustBomList, (data3) => {
        const foundPart = data3.filter(
          (obj) => obj.Cust_code == data.Cust_Code
        );
        setMtrlDetails(foundPart);
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
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Unit Wt",
      dataField: "UnitWt",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Qty Received",
      dataField: "qtyReceived",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Qty Accepted",
      dataField: "qtyAccepted",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Qty Rejected",
      dataField: "qtyRejected",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];

  // const selectRow = {
  //   mode: "radio",
  //   clickToSelect: true,
  //   bgColor: "#8A92F0",
  //   onSelect: (row, isSelect, rowIndex, e) => {
  //     setPartUniqueId(row.id);
  //     setInputPart({
  //       id: row.id,
  //       partId: row.partId,
  //       unitWeight: row.unitWeight,
  //       qtyAccepted: row.qtyAccepted,
  //       qtyRejected: row.qtyRejected,
  //       qtyReceived: row.qtyReceived,
  //     });
  //   },
  // };

  console.log("receiptDate", formHeader.ReceiptDate);

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row, isSelect, rowIndex, e) => {
      setPartUniqueId(row.id);
      setInputPart({
        id: row.id,
        partId: row.partId,
        // partId: isSelect ? row.partId : "",
        unitWeight: row.unitWeight,
        qtyAccepted: row.qtyAccepted,
        qtyRejected: row.qtyRejected,
        qtyReceived: row.qtyReceived,
      });
      setSelectedPart([{ PartId: row.partId }]);
    },
  };

  return (
    <div>
      <div>
        <h4 className="title">Customer Parts Receipt Voucher</h4>

        <div className="row">
          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Receipt Date
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="receiptDate"
              // value={formHeader.receiptDate}
              value={formHeader.ReceiptDate}
              readOnly
            />
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              RV No
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="rvNo"
              value={formHeader.RV_No}
              readOnly
            />
          </div>

          <div className="d-flex col-md-2" style={{ gap: "19px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              RV Date
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="rvDate"
              value={formHeader.RV_Date}
              readOnly
            />
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Status
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="status"
              value={formHeader.RVStatus}
              readOnly
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "70px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Weight
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="weight"
              value={formHeader.TotalWeight}
              disabled={boolVal}
            />
          </div>
        </div>

        <div className="row">
          <div className="d-flex col-md-5" style={{ gap: "28px" }}>
            <label className="form-label">Customer</label>

            <select
              className="ip-select mt-1"
              name="customer"
              //onChange={changeCustomer}
              disabled={boolVal}
            >
              <option value={formHeader.Cust_Code} disabled selected>
                {formHeader.Customer}
              </option>
            </select>
          </div>

          <div className="d-flex col-md-4" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Reference
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="reference"
              value={formHeader.CustDocuNo}
              disabled={boolVal}
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label" style={{ whiteSpace: "nowrap" }}>
              Calculated Weight
            </label>

            <input
              className="input-disabled mt-1"
              type="number"
              name="calculatedWeight"
              value={formHeader.TotalCalculatedWeight}
              readOnly
            />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8">
            <textarea
              className="input-disabled mt-1"
              id="exampleFormControlTextarea1"
              rows="4"
              style={{ width: "100%", height: "60px" }}
              value={formHeader.address}
              readOnly
            ></textarea>
          </div>

          <div className="col-md-4 justify-content-center">
            <button className="button-style" disabled={boolVal}>
              Save
            </button>
            <button className="button-style" disabled={boolVal}>
              Allot RV No
            </button>
            <button className="button-style" disabled={boolVal}>
              Delete RV
            </button>
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
      </div>
      <div className="row">
        <div
          style={{ height: "238px", overflowY: "scroll" }}
          className="col-md-8 col-sm-12"
        >
          <BootstrapTable
            keyField="Id"
            columns={columns}
            data={partArray}
            striped
            hover
            condensed
            headerClasses="header-class tableHeaderBGColor"
            selectRow={selectRow}
          ></BootstrapTable>
        </div>

        <div className="col-md-4 col-sm-12">
          <div className=" form-bg">
            <div className="d-flex justify-content-center mt-2 ">
              <div className="col-md-4"></div>
              <button className="button-style " disabled={boolVal}>
                Add New
              </button>

              <button className="button-style " disabled={boolVal}>
                Delete
              </button>
            </div>
            <div className="row">
              {/* <label className="form-label">Srl Details</label> */}
              {/* <p className="form-title-deco mt-1">
                <h5>Serial Details</h5>
              </p> */}
              <label
                className="form-label"
                style={{ textDecoration: "underline" }}
              >
                Serial Details
              </label>
              <div className="col-md-4 ">
                <label className="form-label mt-1">Part ID</label>
              </div>
              <div className="col-md-8">
                {/* <select
                  className="ip-select dropdown-field"
                  name="partId"
                  value={inputPart.partId}
                  disabled={boolVal}
                >
                  <option value="" disabled selected>
                    Select Part
                  </option>
                  {mtrlDetails.map((part, index) => (
                    <option key={index} value={part.PartId}>
                      {part.PartId}
                    </option>
                  ))}
                </select> */}

                <Typeahead
                  className="input-disabled mt-1"
                  id="partId"
                  labelKey="PartId"
                  options={mtrlDetails}
                  selected={selectedPart}
                  disabled
                  placeholder="Select Part"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4  ">
                <label className="form-label mt-1">Unit Wt</label>
              </div>
              <div className="col-md-8">
                <input
                  className="input-disabled mt-1"
                  type="text"
                  name="unitWeight"
                  value={inputPart.unitWeight}
                  disabled={boolVal}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ">
                <label className="form-label mt-1">QtyReceived</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="text"
                  name="qtyReceived"
                  //value={tempVal}
                  value={inputPart.qtyReceived}
                  disabled={boolVal}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ">
                <label className="form-label mt-1">QtyAccepted</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="text"
                  name="qtyAccepted"
                  value={inputPart.qtyAccepted}
                  disabled={boolVal}
                />
              </div>
              <div className="col-md-8 "></div>
            </div>
            <div className="row">
              <div className="col-md-4 ">
                <label className="form-label mt-1">QtyRejected</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="text"
                  value={inputPart.qtyReceived - inputPart.qtyAccepted}
                  name="qtyRejected"
                  // readOnly
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenButtonOpenClosedPartList;
