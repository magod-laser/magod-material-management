import React, { useEffect, useState } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import PrintLocationStockSummaryReport from "../../print/store/PrintLocationStockSummaryReport";
import PrintLocationStockDetailReport from "../../print/store/PrintLocationStockDetailReport";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function LocationStockReport() {
  const nav = useNavigate();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  let [custdata, setCustdata] = useState([]);
  let [locdata, setLocdata] = useState([]);
  let [firstTable, setFirstTable] = useState([]);
  let [secondTable, setSecondTable] = useState([]);
  let [secondTableAll, setSecondTableAll] = useState([]);
  let [thirdTable, setThirdTable] = useState([]);
  let [custCode, setCustCode] = useState("-1");

  const [summaryReportPrintOpen, setSummaryReportPrintOpen] = useState(false);
  const [detailsReportPrintOpen, setDetailsReportPrintOpen] = useState(false);

  let [selectedfirstRow, setSelectedFirstRow] = useState({
    LocationNo: "",
    CurrentCapacity: "",
    StorageType: "",
    CapacityUtilised: "",
  });
  let [selectedSecondRow, setSelectedSecondRow] = useState({
    Customer: "",
    Mtrl_Code: "",
    DynamicPara1: "",
    DynamicPara2: "",
    Scrap: 0,
  });

  async function fetchCustData() {
    getRequest(endpoints.getCustomers, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }
      setCustdata(data);
    });
    getRequest(endpoints.getMaterialLocationList, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setFirstTable(data);
      console.log("Location List = ", data);
    });
  }

  useEffect(() => {
    fetchCustData();
  }, []);

  const changeCustomer = (e) => {
    //const { name, value } = e.target;
    setCustCode(e[0]?.Cust_Code);

    document.getElementById("showStockAll").checked = true;
    document.getElementById("showStockCustomer").checked = false;

    setSecondTable(secondTableAll);
    setThirdTable([]);
  };
  const radioButtonChanged = async (e) => {
    const { name, value } = e.target;
    console.log("name = ", name, " value = ", value);
    if (value === "all") {
      setSecondTable(secondTableAll);
      // setCustCode("-1");
      setThirdTable([]);
    }
    if (value === "customer") {
      if (custCode !== "-1") {
        let newArray = secondTableAll.filter(
          (item) => item.Cust_Code === custCode
        );
        setSecondTable(newArray);
      }
      setThirdTable([]);
    }
  };

  // summary report func starts

  //find the unique name of customers
  var custnames = [...new Set(secondTable.map((item) => item.Customer))];
  custnames = custnames.sort();

  //calculate material purchase details
  var fullTable = [];
  for (let i = 0; i < custnames.length; i++) {
    let tot1wt = 0,
      tot1swt = 0,
      tot1qty = 0;
    let tot2wt = 0,
      tot2swt = 0,
      tot2qty = 0;
    var raw = [];
    var scrap = [];
    for (let j = 0; j < secondTable.length; j++) {
      if (custnames[i] === secondTable[j].Customer) {
        if (secondTable[j].Scrap === 0) {
          raw.push(secondTable[j]);
          tot1wt = tot1wt + parseFloat(secondTable[j].Weight);
          tot1swt = tot1swt + parseFloat(secondTable[j].SWeight);
          tot1qty = tot1qty + parseFloat(secondTable[j].Quantity);
        } else {
          scrap.push(secondTable[j]);
          tot2wt = tot2wt + parseFloat(secondTable[j].Weight);
          tot2swt = tot2swt + parseFloat(secondTable[j].SWeight);
          tot2qty = tot2qty + parseFloat(secondTable[j].Quantity);
        }
      }
    }
    let obj = {
      customer: custnames[i],
      rawMaterial: raw,
      scrapMaterial: scrap,
      tot1wt: tot1wt,
      tot1swt: tot1swt,
      tot1qty: tot1qty,
      tot2wt: tot2wt,
      tot2swt: tot2swt,
      tot2qty: tot2qty,
      rawlength: raw.length,
      scraplength: scrap.length,
    };
    fullTable.push(obj);
  }
  delay(300);
  // console.log("fullTable = ", fullTable);

  // nav("/MaterialManagement/StoreManagement/PrintLocationStockSummaryReport", {
  //   state: {
  //     formHeader: selectedfirstRow,
  //     tableData: fullTable,
  //   },
  // });
  // summary report func ends
  const summaryReport = async () => {
    setSummaryReportPrintOpen(true);

    // //find the unique name of customers
    // var custnames = [...new Set(secondTable.map((item) => item.Customer))];
    // custnames = custnames.sort();

    // //calculate material purchase details
    // var fullTable = [];
    // for (let i = 0; i < custnames.length; i++) {
    //   let tot1wt = 0,
    //     tot1swt = 0,
    //     tot1qty = 0;
    //   let tot2wt = 0,
    //     tot2swt = 0,
    //     tot2qty = 0;
    //   var raw = [];
    //   var scrap = [];
    //   for (let j = 0; j < secondTable.length; j++) {
    //     if (custnames[i] === secondTable[j].Customer) {
    //       if (secondTable[j].Scrap === 0) {
    //         raw.push(secondTable[j]);
    //         tot1wt = tot1wt + parseFloat(secondTable[j].Weight);
    //         tot1swt = tot1swt + parseFloat(secondTable[j].SWeight);
    //         tot1qty = tot1qty + parseFloat(secondTable[j].Quantity);
    //       } else {
    //         scrap.push(secondTable[j]);
    //         tot2wt = tot2wt + parseFloat(secondTable[j].Weight);
    //         tot2swt = tot2swt + parseFloat(secondTable[j].SWeight);
    //         tot2qty = tot2qty + parseFloat(secondTable[j].Quantity);
    //       }
    //     }
    //   }
    //   let obj = {
    //     customer: custnames[i],
    //     rawMaterial: raw,
    //     scrapMaterial: scrap,
    //     tot1wt: tot1wt,
    //     tot1swt: tot1swt,
    //     tot1qty: tot1qty,
    //     tot2wt: tot2wt,
    //     tot2swt: tot2swt,
    //     tot2qty: tot2qty,
    //     rawlength: raw.length,
    //     scraplength: scrap.length,
    //   };
    //   fullTable.push(obj);
    // }
    // await delay(300);
    // console.log("fullTable = ", fullTable);

    // nav("/MaterialManagement/StoreManagement/PrintLocationStockSummaryReport", {
    //   state: {
    //     formHeader: selectedfirstRow,
    //     tableData: fullTable,
    //   },
    // });
  };

  // details report calc starts

  let tot1 = 0,
    tot2 = 0;
  for (let i = 0; i < thirdTable.length; i++) {
    tot1 = tot1 + parseFloat(thirdTable[i].Weight);
    tot2 = tot2 + parseFloat(thirdTable[i].ScrapWeight);
  }
  let tabletotal = {
    qty: thirdTable.length,
    tot1: tot1,
    tot2: tot2,
  };
  // await delay(300);
  // nav("/MaterialManagement/StoreManagement/PrintLocationStockDetailReport", {
  //   state: {
  //     formHeader: selectedSecondRow,
  //     tableData: thirdTable,
  //     tabletotal: tabletotal,
  //   },
  // });
  // details report calc ends

  const detailsReport = async () => {
    setDetailsReportPrintOpen(true);
    // let tot1 = 0,
    //   tot2 = 0;
    // for (let i = 0; i < thirdTable.length; i++) {
    //   tot1 = tot1 + parseFloat(thirdTable[i].Weight);
    //   tot2 = tot2 + parseFloat(thirdTable[i].ScrapWeight);
    // }
    // let tabletotal = {
    //   qty: thirdTable.length,
    //   tot1: tot1,
    //   tot2: tot2,
    // };
    // await delay(300);
    // nav("/MaterialManagement/StoreManagement/PrintLocationStockDetailReport", {
    //   state: {
    //     formHeader: selectedSecondRow,
    //     tableData: thirdTable,
    //     tabletotal: tabletotal,
    //   },
    // });
  };
  const columns1 = [
    {
      text: "#",
      dataField: "id",
      hidden: true,
    },
    {
      text: "LocationNo",
      dataField: "LocationNo",
      sort: true,
    },
    {
      text: "StorageType",
      dataField: "StorageType",
      sort: true,
    },
    {
      text: "Capacity",
      dataField: "Capacity",
      sort: true,
    },
    {
      text: "CapacityUtilised",
      dataField: "CapacityUtilised",
      sort: true,
    },
  ];
  const columns2 = [
    {
      text: "#",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Customer",
      dataField: "Customer",
      sort: true,
    },
    {
      text: "Material",
      dataField: "Mtrl_Code",
      sort: true,
    },
    {
      text: "Dim1",
      dataField: "DynamicPara1",
      sort: true,
    },
    {
      text: "Dim2",
      dataField: "DynamicPara2",
      sort: true,
    },
    {
      text: "Quantity",
      dataField: "Quantity",
      sort: true,
    },
    {
      text: "Scrap",
      dataField: "Scrap",
      sort: true,
    },
    {
      text: "Weight",
      dataField: "Weight",
      sort: true,
    },
    {
      text: "SWeight",
      dataField: "SWeight",
      sort: true,
    },
  ];
  const columns3 = [
    {
      text: "#",
      dataField: "id",
      hidden: true,
    },
    {
      text: "MtrlStockID",
      dataField: "MtrlStockID",
      sort: true,
    },
    {
      text: "Dim1",
      dataField: "DynamicPara1",
      sort: true,
    },
    {
      text: "Dim2",
      dataField: "DynamicPara2",
      sort: true,
    },
    {
      text: "Weight",
      dataField: "Weight",
      sort: true,
    },
    {
      text: "ScrapWeight",
      dataField: "ScrapWeight",
      sort: true,
    },
  ];
  const selectRow1 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log("row = ", row);
      setSelectedFirstRow(row);

      let url =
        endpoints.getLocationStockSecond + "?location=" + row.LocationNo;
      getRequest(url, async (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        setSecondTableAll(data);
        if (custCode !== "-1") {
          let newArray = data.filter((item) => item.Cust_Code === custCode);
          setSecondTable(newArray);
        } else {
          setSecondTable(data);
        }
        console.log("second table = ", data);
      });
      setThirdTable([]);
    },
  };

  const selectRow2 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log("row = ", row);
      //setSelectedFirstRow(row);
      setSelectedSecondRow(row);
      let url =
        endpoints.getLocationStockThird +
        "?location=" +
        row.LocationNo +
        "&mtrlcode=" +
        row.Mtrl_Code +
        "&para1=" +
        row.DynamicPara1 +
        "&para2=" +
        row.DynamicPara2 +
        "&custcode=" +
        row.Cust_Code +
        "&scrap=" +
        row.Scrap;
      getRequest(url, async (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        setThirdTable([]);
        setThirdTable(data);
        console.log("third table = ", data);
      });
    },
  };

  const [sort1, setSort1] = React.useState({
    dataField: "id",
    order: "asc",
  });

  const [sort2, setSort2] = React.useState({
    dataField: "id",
    order: "asc",
  });

  const [sort3, setSort3] = React.useState({
    dataField: "id",
    order: "asc",
  });

  const onSortChange1 = (dataField, order) => {
    setSort1({ dataField, order });
  };

  const onSortChange2 = (dataField, order) => {
    setSort2({ dataField, order });
  };

  const onSortChange3 = (dataField, order) => {
    setSort3({ dataField, order });
  };

  return (
    <>
      <div>
        <h4 className="title">Location Stock Report</h4>
        <div className="row">
          <div className="col-md-4">
            {/* <h4 className="form-title">
              <u>Stock Viewer</u>
            </h4> */}
            <label className="form-label" style={{ fontSize: "14px" }}>
              {" "}
              Stock Viewer
            </label>

            <div className="row">
              <div className="col-md-12">
                <label className="form-label"> Select Customer</label>
                {/* <select
                className="ip-select"
                name="customer"
                onChange={changeCustomer}
                // disabled={boolVal1}
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
                  id="basic-example"
                  name="customer"
                  options={custdata}
                  placeholder="Select Customer"
                  onChange={(label) => changeCustomer(label)}
                />
              </div>

              <div className="d-flex col-md-6 mt-1" style={{ gap: "10px" }}>
                <label
                  className="form-label mt-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Location
                </label>
                <input
                  className="input-disabled "
                  name="LocationNo"
                  value={selectedfirstRow.LocationNo}
                />
              </div>

              <div className="d-flex col-md-6 mt-1" style={{ gap: "10px" }}>
                <label
                  className="form-label mt-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Capacity
                </label>
                <input
                  className="input-disabled "
                  name="Capacity"
                  value={selectedfirstRow.Capacity}
                />
              </div>

              <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                <label
                  className="form-label mt-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Type
                </label>
                <input
                  className="input-disabled "
                  name="StorageType"
                  value={selectedfirstRow.StorageType}
                />
              </div>

              <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                <label
                  className="form-label mt-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Used
                </label>
                <input
                  className="input-disabled "
                  name="CapacityUtilised"
                  value={selectedfirstRow.CapacityUtilised}
                />
              </div>
            </div>
            <div className="row">
              {/* <div className="col-md-6">
                
                <label className="form-label">Type</label>
                <input
                  className=""
                  name="StorageType"
                  value={selectedfirstRow.StorageType}
                />
              </div> */}
              {/* <div className="col-md-6">
                
                <label className="form-label">Used</label>
                <input
                  className=""
                  name="CapacityUtilised"
                  value={selectedfirstRow.CapacityUtilised}
                />
              </div> */}
            </div>
          </div>

          <div className="col-md-8">
            <h8 className="form-label">Show Stock</h8>
            <div className="row">
              <div className="col-md-4">
                <div className="row">
                  <div
                    className="col-md-6 mt-2"
                    style={{ display: "flex", gap: "5px" }}
                  >
                    <input
                      className="form-check-input mt-2"
                      type="radio"
                      id="showStockAll"
                      name="updated"
                      value="all"
                      //   value={inputPart.upDated}
                      //disabled={boolVal3 | boolVal4}
                      //   disabled={true}
                      onChange={radioButtonChanged}
                    />
                    <label className="form-label">All</label>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="col-md-8 mt-2"
                    style={{ display: "flex", gap: "5px" }}
                  >
                    <input
                      className="form-check-input mt-2"
                      type="radio"
                      id="showStockCustomer"
                      name="updated"
                      onChange={radioButtonChanged}
                      value="customer"
                      //   value={inputPart.upDated}
                      //disabled={boolVal3 | boolVal4}
                      //   disabled={true}
                      //   onChange={changeMaterialHandle}
                    />
                    <label className="form-label">Customer</label>
                  </div>
                </div>
              </div>

              <div className="d-flex col-md-8  mt-3">
                <button className="button-style " onClick={summaryReport}>
                  Summary Report
                </button>

                <button
                  className="button-style "
                  // style={{ width: "155px" }}
                  onClick={detailsReport}
                >
                  Details Report
                </button>

                <button
                  className="button-style"
                  // style={{ width: "155px" }}
                  id="btnclose"
                  type="submit"
                  onClick={() => nav("/MaterialManagement")}
                >
                  Close
                </button>
              </div>

              {/* <div className="col-md-12">
                <label className="form-label">Customer</label>
                <input className="" value={selectedSecondRow.Customer} />
              </div> */}
            </div>

            <div className="row">
              <div className="d-flex col-md-4" style={{ gap: "10px" }}>
                <label
                  className="form-label mt-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Material
                </label>
                <input
                  className="input-disabled "
                  value={selectedSecondRow.Mtrl_Code}
                />
              </div>

              <div className="d-flex col-md-4" style={{ gap: "10px" }}>
                <label
                  className="form-label mt-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Customer
                </label>
                <input
                  className="input-disabled "
                  value={selectedSecondRow.Customer}
                />
              </div>

              <div className="row col-md-4">
                <div className="col-md-2 col-sm-12">
                  <input
                    className="form-check-input mt-3"
                    type="checkbox"
                    id="flexCheckDefault"
                    name="updated"
                    checked={selectedSecondRow.Scrap !== 0 ? true : false}
                    //   value={inputPart.upDated}
                    //disabled={boolVal3 | boolVal4}
                    //   disabled={true}
                    //   onChange={changeMaterialHandle}
                  />
                </div>
                <div className="col-md-8 col-sm-12">
                  <label className="form-label mt-1">Scrap</label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className=" d-flex col-md-4" style={{ gap: "5px" }}>
                <label className="form-label col-md-3">Dim 1</label>
                <input
                  className="input-disabled "
                  value={selectedSecondRow.DynamicPara1}
                />
              </div>

              <div className="d-flex col-md-4" style={{ gap: "5px" }}>
                <label className="form-label col-md-3">Dim 2</label>
                <input
                  className="input-disabled "
                  value={selectedSecondRow.DynamicPara2}
                />
              </div>

              <div className="col-md-4 mt-2">
                {/* <div className="row">
                  <div className="col-md-1 col-sm-12">
                    <input
                      className="form-check-input mt-3"
                      type="checkbox"
                      id="flexCheckDefault"
                      name="updated"
                      checked={selectedSecondRow.Scrap !== 0 ? true : false}
                      //   value={inputPart.upDated}
                      //disabled={boolVal3 | boolVal4}
                      //   disabled={true}
                      //   onChange={changeMaterialHandle}
                    />
                  </div>
                  <div className="col-md-8 col-sm-12">
                    <label className="form-label mt-1">Scrap</label>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-5">
            <div
              style={{
                height: "400px",
                overflowY: "scroll",
                border: "solid #c0c4c2 1px",
                marginTop: "20px",
              }}
            >
              <BootstrapTable
                keyField="id"
                columns={columns1}
                data={firstTable}
                striped
                hover
                condensed
                selectRow={selectRow1}
                headerClasses="header-class tableHeaderBGColor"
                sort={sort1}
                onSortChange={onSortChange1}
              ></BootstrapTable>
            </div>
          </div>
          <div className="col-md-7">
            <div className="row">
              <div
                style={{
                  height: "200px",
                  overflowY: "scroll",
                  border: "solid #c0c4c2 1px",
                  marginTop: "20px",
                }}
              >
                <BootstrapTable
                  keyField="id"
                  columns={columns2}
                  data={secondTable}
                  striped
                  hover
                  condensed
                  selectRow={selectRow2}
                  headerClasses="header-class tableHeaderBGColor"
                  sort={sort2}
                  onSortChange={onSortChange2}
                ></BootstrapTable>
              </div>
            </div>
            <div className="row">
              <div
                style={{
                  height: "200px",
                  overflowY: "scroll",
                  border: "solid #c0c4c2 1px",
                  marginTop: "20px",
                }}
              >
                <BootstrapTable
                  keyField="id"
                  columns={columns3}
                  data={thirdTable}
                  striped
                  hover
                  condensed
                  //selectRow={selectRow1}
                  headerClasses="header-class tableHeaderBGColor"
                  sort={sort3}
                  onSortChange={onSortChange3}
                ></BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PrintLocationStockSummaryReport
        setSummaryReportPrintOpen={setSummaryReportPrintOpen}
        summaryReportPrintOpen={summaryReportPrintOpen}
        formHeader={selectedfirstRow}
        tableData={fullTable}
      />

      <PrintLocationStockDetailReport
        setDetailsReportPrintOpen={setDetailsReportPrintOpen}
        detailsReportPrintOpen={detailsReportPrintOpen}
        formHeader={selectedSecondRow}
        tableData={thirdTable}
        tabletotal={tabletotal}
      />
    </>
  );
}

export default LocationStockReport;
