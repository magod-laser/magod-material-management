import React, { useState, useEffect } from "react";
import { dateToShort } from "../../../../../utils";
import BootstrapTable from "react-bootstrap-table-next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function ReturnListing(props) {
  const nav = useNavigate();

  const [data, setdata] = useState([]);
  const [allData, setAllData] = useState([]);

  const [checkData, setCheckData] = useState([]);
  const [selectData, setSelectData] = useState();
  const [checkboxDisable, setCheckboxDisable] = useState("on");

  const [checkboxVal, setCheckboxVal] = useState("off");
  let [custdata, setCustdata] = useState([]);
  let [propsType, setPropsType] = useState(props.type);
  const [selectedCust, setSelectedCust] = useState();
  //console.log("listing form type = ", propsType);
  async function fetchData() {
    getRequest(endpoints.getCustomers, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);
    });

    if (props.type === "pendingDispatch") {
      getRequest(endpoints.getReturnPendingList, async (data) => {
        setCheckData(data);
        setdata(data);
        setAllData(data);
      });
    } else if (props.type === "returnSaleListing") {
      getRequest(endpoints.getSalesIVList, async (data) => {
        setCheckData(data);
        setdata(data);
        setAllData(data);
      });
    } else if (props.type === "customerIVList") {
      getRequest(endpoints.getCustomerIVList, async (data) => {
        setCheckData(data);
        setdata(data);
        setAllData(data);
        //console.log("data = ", data);
      });
    } else if (props.type === "returnCancelled") {
      getRequest(endpoints.getCancelledList, async (data) => {
        setCheckData(data);
        setdata(data);
        setAllData(data);
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []); //[inputPart]);

  let totalFetchData = checkData;
  const columns = [
    {
      text: "Iv_Id",
      dataField: "Iv_Id",
      hidden: true,
    },

    {
      text: "IV No",
      dataField: "IV_No",
    },
    {
      text: "IV Date",
      dataField: "IV_Date",
      sort: true,
      formatter: statusFormatter,
    },
    {
      text: "Customer",
      dataField: "Customer",
    },
    {
      text: "Weight",
      dataField: "TotalWeight",
    },
    {
      text: "Type",
      dataField: "Type",
    },
  ];

  let changeCustomer = async (e) => {
    setSelectedCust(e[0].Cust_Code);
    //e.preventDefault();
    //const { value, name } = e.target;

    //console.log("all data = ", data);
    const found = allData.filter((obj) => obj.Cust_code === e[0].Cust_Code);
    setdata(found);
    //setCustdata(filterData);
    setCheckboxVal("on");
    setCheckboxDisable("off");

    // console.log(
    //   "e[0].Cust_Code",
    //   e[0].Cust_Code,
    //   "legftnh",
    //   e[0].Cust_Code.length
    // );

    if (e[0].Cust_Code.length > 0) {
      document.getElementById("filterCustCheckbox").checked = true;
    } else {
      document.getElementById("filterCustCheckbox").checked = false;
    }
  };

  let handleClick = async (e) => {
    e.preventDefault();
    const { value, name } = e.target;
  };

  function statusFormatter(cell, row, rowIndex, formatExtraData) {
    if (!cell) return;
    return dateToShort(cell);
  }

  let openClick = async (e) => {
    //console.log("selected data = ", selectData);
    // console.log("data = ", selectData, "propType = ", propsType);
    if (selectData && selectData.Type !== "Parts") {
      nav(
        "/MaterialManagement/Return/CustomerJobWork/OutwardMaterialIssueVoucher",
        {
          state: { selectData, propsType },
        }
      );
    } else if (selectData && selectData.Type === "Parts") {
      nav(
        "/MaterialManagement/Return/CustomerJobWork/OutwardPartIssueVoucher",
        {
          state: { selectData, propsType },
        }
      );
    } else {
      toast.error("Select IV");
    }

    /*e.preventDefault();
    nav(
      "/materialmanagement/return/customerjobwork/OutwordMaterialIssueVocher",
      {
        state: { selectData },
      }
    );*/
  };
  let changeCheckbox = (e) => {
    // console.log("checkbox action...... = ", e.target.checked);

    if (e.target.checked) {
      const found = allData.filter((obj) => obj.Cust_code === selectedCust);
      setdata(found);

      // console.log("founddddddddddddddddd", found);
    } else {
      // console.log("alllllllllll", allData);
      setdata(allData);
      // setdata()
    }
    // setCheckboxVal("off");

    // //setCustdata(filterData);
    // setCheckboxVal("on");
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row, isSelect, rowIndex, e) => {
      // console.log(row);
      setSelectData({
        Iv_Id: row.Iv_Id,
        IV_No: row.IV_No,
        IV_Date: row.IV_Date,
        Customer: row.Customer,
        TotalWeight: row.TotalWeight,
        TotalCalculatedWeight: row.TotalCalculatedWeight,
        Type: row.Type,
      });
    },
  };

  return (
    <>
      <h4 className="title">Material Return Issue Voucher</h4>
      <div className="row">
        <div className="d-flex col-md-12" style={{ gap: "10px" }}>
          <div className="d-flex col-md-6" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Select Customer
            </label>

            <Typeahead
              className="ip-select "
              id="basic-example"
              name="customer"
              options={custdata}
              placeholder="Select Customer"
              onChange={(label) => changeCustomer(label)}
            />
          </div>

          <div className="d-flex col-md-2  mt-1" style={{ gap: "10px" }}>
            <input
              className="form-check-input "
              type="checkbox"
              // checked={checkboxVal === "on" ? true : false}
              id="filterCustCheckbox"
              onChange={changeCheckbox}
              disabled={!selectedCust}
            />

            <label className="form-label" style={{ whiteSpace: "nowrap" }}>
              Filter Customer
            </label>
          </div>

          <div className="d-flex  ">
            <button className="button-style" onClick={openClick}>
              Open IV
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
      {/* <div className="row">
        <div className="col-md-2 col-sm-12 ">
          <div className="row">
            <div className="col-md-1 col-sm-12 mt-1">
              <input
                className="form-check-input mt-2"
                type="checkbox"
                // checked={checkboxVal === "on" ? true : false}
                id="filterCustCheckbox"
                onChange={changeCheckbox}
                disabled={!selectedCust}
              />
            </div>
            <div className="col-md-1 col-sm-12">
              <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                Filter Customer
              </label>
            </div>
          </div>
        </div>
        <div className="col-md-2">
          <div className="col-md-4 mt-2">
            <button className="button-style"
            style={{width:'65px'}}
             onClick={openClick}>
              Open IV
            </button>
          </div>
        </div>
        <div className="col-md-2 mt-2">
          <button
            className="button-style "
            id="btnclose"
            type="submit"
            onClick={() => nav("/MaterialManagement")}
          >
            Close
          </button>
        </div>
      </div> */}

      <div className="row">
        <div className="col-md-12 mt-4">
          <div
            style={{ height: "420px", overflowY: "scroll" }}
            className="col-md-12 col-sm-12"
          >
            <BootstrapTable
              keyField="Iv_Id"
              columns={columns}
              data={data}
              striped
              hover
              condensed
              selectRow={selectRow}
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReturnListing;
