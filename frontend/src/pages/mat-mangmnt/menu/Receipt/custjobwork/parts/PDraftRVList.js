import React, { useState, useEffect } from "react";
import { dateToShort, formatDate } from "../../../../../../utils";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function PDraftRVList() {
  const nav = useNavigate();

  let [custdata, setCustdata] = useState([]);

  const [tabledata, setTableData] = useState([]);
  const [allData, setAllData] = useState([]);

  const [data, setData] = useState({
    CustDocuNo: "",
    Cust_Code: "",
    Customer: "",
    RVStatus: "",
    RV_Date: "",
    RV_No: "",
    ReceiptDate: "",
    RvID: "",
    TotalWeight: "",
    TotalCalculatedWeight: "",
  });

  const fetchData = () => {
    getRequest(endpoints.getCustomers, (data) => {
      // console.log("dataa", data);
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);
    });

    getRequest(endpoints.getPartsCreatedMaterial, (data) => {
      // console.log("dataaaaaaaaaaaaaaaaaaaaaa", data);
      setTableData(data);
      setAllData(data);
    });
  };

  console.log("tabledata", tabledata);
  console.log("allData", allData);
  useEffect(() => {
    fetchData();
  }, []);

  let changeCustomer = async (e) => {
    //e.preventDefault();
    //const { value, name } = e.target;

    const found = allData.filter((obj) => obj.Cust_Code === e[0].Cust_Code);
    //console.log("table data = ", tabledata);
    setTableData(found);
  };

  // Process the returned date in the formatter
  function statusFormatter(cell, row, rowIndex, formatExtraData) {
    //return dateToShort(cell);
    return formatDate(new Date(cell), 3);
  }

  const openButtonClick = () => {
    //console.log("data = ", data);
    //console.log("button click : ");
    if (data && data.RvID !== "") {
      nav("/MaterialManagement/Receipt/OpenButtonDraftPartList", {
        state: { id: data.RvID },
      });
    } else {
      toast.error("Please select Table Row");
    }
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",

    onSelect: (row, isSelect, rowIndex, e) => {
      setData({
        CustDocuNo: row.CustDocuNo,
        Cust_Code: row.Cust_Code,
        Customer: row.Customer,
        RVStatus: row.RVStatus,
        RV_Date: formatDate(new Date(row.RV_Date), 3), //dateToShort(row.RV_Date),
        RV_No: row.RV_No,
        ReceiptDate: formatDate(new Date(row.ReceiptDate), 3), //dateToShort(row.ReceiptDate),
        RvID: row.RvID,
        TotalWeight: row.TotalWeight,
        TotalCalculatedWeight: row.TotalCalculatedWeight,
      });
    },
  };

  console.log("tweight", data);
  const columns = [
    {
      text: "RV No",
      dataField: "RV_No",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "RV Date",
      dataField: "RV_Date",
      sort: true,
      formatter: statusFormatter,
    },
    {
      text: "Customer",
      dataField: "Customer",
      sort: true,
    },
    {
      text: "Cust Doc No",
      dataField: "CustDocuNo",
      sort: true,
    },
  ];
  return (
    <div>
      <>
        <h4 className="title">Customer : Parts Receipt List Created</h4>
        <div className="row ">
          <div className="d-flex col-md-7 mb-2" style={{ gap: "10px" }}>
            <label className="form-label">Customer</label>

            {/* <select
              className="ip-select"
              name="customer"
              onChange={changeCustomer}
            >
              <option value="" disabled selected>
                Select Customer
              </option>
              {custdata.map((customer, index) => (
                <option key={index} value={customer.Cust_Code}>
                  {customer.Cust_name}
                </option>
              ))}
            </select> */}

            <Typeahead
              className="ip-select"
              id="basic-example"
              options={custdata}
              placeholder="Select Customer"
              onChange={(label) => changeCustomer(label)}
            />
          </div>

          {/* <div className="row justify-content-center ">
                <button
                  className="button-style "
                  style={{ width: "55px" }}
                  //data.RvID
                  onClick={openButtonClick}
                >
                  Open
                </button>
              </div> */}
          <div className="col-md-5 text-center mb-2 ">
            <button
              className="button-style "
              //data.RvID
              onClick={openButtonClick}
            >
              Open
            </button>
            <button
              className="button-style  "
              id="btnclose"
              type="submit"
              onClick={() => nav("/MaterialManagement")}
            >
              Close
            </button>
          </div>

          <div
            style={{ height: "350px", overflowY: "scroll" }}
            className="col-md-7 col-sm-12"
          >
            <BootstrapTable
              keyField="RvID"
              //keyField="id"
              columns={columns}
              data={tabledata}
              striped
              hover
              condensed
              //pagination={paginationFactory()}
              selectRow={selectRow}
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>

          <div className="col-md-5 col-sm-12">
            <div className=" form-bg">
              <div className="row">
                <div className="col-md-4 mt-1 ">
                  <label className="form-label">Receipt Date</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.ReceiptDate}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1 ">
                  <label className="form-label">RV No</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.RV_No}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    RV Date
                  </label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.RV_Date}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1 ">
                  <label className="form-label">Cust Code</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.Cust_Code}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1 ">
                  <label className="form-label">Customer</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.Customer}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Cust Docu No
                  </label>
                </div>

                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.CustDocuNo}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1 ">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Total Weight
                  </label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.TotalWeight}
                    readOnly
                  />
                </div>
              </div>

              <div className="row ">
                <div className="col-md-4 mt-1">
                  <label
                    className="form-label"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Calculated Weight
                  </label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.TotalCalculatedWeight}
                    readOnly
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1 ">
                  <label className="form-label">RV Status</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-2"
                    value={data.RVStatus}
                    readOnly
                  />
                </div>
              </div>

              {/* <div className="row justify-content-center mt-4 mb-4">
                <button
                  className="button-style "
                  style={{ width: "55px" }}
                  //data.RvID
                  onClick={openButtonClick}
                >
                  Open
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default PDraftRVList;
