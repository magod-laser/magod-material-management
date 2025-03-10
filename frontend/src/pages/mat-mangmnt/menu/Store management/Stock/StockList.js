import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import BootstrapTable from "react-bootstrap-table-next";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import PrintReportStockList from "../../../print/report/PrintReportStockList";
import PrintReportFullStockList from "../../../print/report/PrintReportFullStockList";
// PrintReportStockList
const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function StockList(props) {
  const nav = useNavigate();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const [firstTable, setFirstTable] = useState([]);
  const [secondTable, setSecondTable] = useState([]);
  const [thirdTable, setThirdTable] = useState([]);
  // const [firstAllData, setFirstAllData] = useState([]);
  const [secondAllData, setSecondAllData] = useState([]);
  const [thirdAllData, setThirdAllData] = useState([]);
  let [custdata, setCustdata] = useState([]);
  let [custCode, setCustCode] = useState("0");

  const [totQty1, setTotQty1] = useState(0);
  const [totWeight1, setTotWeight1] = useState(0);

  let [customerDetails, setCustomerDetails] = useState({
    customerName: "",
    city: "",
    address: "",
  });

  const [printSelectedStockOpen, setprintSelectedStockOpen] = useState(false);
  const [printFullStockListOpen, setPrintFullStockListOpen] = useState(false);
  const fetchData = async () => {
    //fetch customer
    getRequest(endpoints.getCustomers, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);

      //set customer 0
      const found = await data.find((obj) => obj.Cust_Code === "0000");
      //console.log("cust data found = ", found);
      setCustomerDetails(() => {
        return {
          customerName: found.Cust_name,
          city: found.City,
          address: found.Address,
        };
      });
    });
    if (props.type === "customer") {
      setFirstTable([]);
      setSecondTable([]);
      setThirdTable([]);
    } else {
      let url1 = endpoints.getStockListByCustCodeFirst + "?code=0";
      let url2 = endpoints.getStockListByCustCodeSecond + "?code=0";
      let url3 = endpoints.getStockListByCustCodeThird + "?code=0";
      //first table
      getRequest(url1, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        setFirstTable(data);
        //console.log("first table = ", data);
      });

      //second table
      getRequest(url2, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        setSecondAllData(data);
        //setFirstTable(data);
        //console.log("second table = ", data);
      });

      //third table
      getRequest(url3, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        //setFirstTable(data);
        setThirdAllData(data);
        //console.log("third table = ", data);
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeCustomer = (e) => {
    ////console.log("e = ", e);
    if (e.length !== 0) {
      setCustCode(e[0].Cust_Code);

      let url1 =
        endpoints.getStockListByCustCodeFirst + "?code=" + e[0].Cust_Code;
      let url2 =
        endpoints.getStockListByCustCodeSecond + "?code=" + e[0].Cust_Code;
      let url3 =
        endpoints.getStockListByCustCodeThird + "?code=" + e[0].Cust_Code;
      //first table
      getRequest(url1, (data) => {
        if (data.length === 0) {
          toast.warning("No data found for selected customer");
        }
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }

        setFirstTable(data);
        //console.log("first table = ", data);
      });

      //second table
      getRequest(url2, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        setSecondAllData(data);
        //setFirstTable(data);
        //console.log("second table = ", data);
      });

      //third table
      getRequest(url3, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        //setFirstTable(data);
        setThirdAllData(data);
        //console.log("third table = ", data);
      });

      //set customer data
      const found = custdata.find((obj) => obj.Cust_Code === e[0].Cust_Code);
      setCustomerDetails(() => {
        return {
          customerName: found.Cust_name,
          city: found.City,
          address: found.Address,
        };
      });
    } else {
      setFirstTable([]);
      setSecondTable([]);
      setThirdTable([]);
      setSecondAllData([]);
      setThirdAllData([]);
    }
  };

  const columns1 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Material",
      dataField: "Material",
      sort: true,
    },
    {
      text: "Qty",
      dataField: "Qty",
      sort: true,
    },
    {
      text: "Weight",
      dataField: "Weight",
      sort: true,
    },
    {
      text: "Scrap Weight",
      dataField: "ScrapWeight",
      sort: true,
    },
  ];
  const columns2 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Material Code",
      dataField: "Mtrl_Code",
      sort: true,
    },
    {
      text: "Qty",
      dataField: "Qty",
      sort: true,
    },
    {
      text: "Weight",
      dataField: "Weight",
      sort: true,
    },
    {
      text: "Scrap Weight",
      dataField: "ScrapWeight",
      sort: true,
    },
  ];
  const columns3 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Para1",
      dataField: "DynamicPara1",
      sort: true,
    },
    {
      text: "Para2",
      dataField: "DynamicPara2",
      sort: true,
    },
    {
      text: "Qty",
      dataField: "Qty",
      sort: true,
    },
    {
      text: "Locked",
      dataField: "Locked",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Locked === 0 ? false : true} />
          </lable>
        </div>
      ),
      sort: true,
    },
    {
      text: "Scrap",
      dataField: "Scrap",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Scrap === 0 ? false : true} />
          </lable>
        </div>
      ),
      sort: true,
    },
    {
      text: "Weight",
      dataField: "Weight",
      sort: true,
    },
    {
      text: "Scrap Weight",
      dataField: "ScrapWeight",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];
  const selectRow1 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      ////console.log("row = ", row);
      setSecondTable(
        secondAllData.filter((obj) => obj.Material === row.Material)
      );
    },
  };

  const selectRow2 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      ////console.log("row = ", row);
      setThirdTable(
        thirdAllData.filter((obj) => obj.Mtrl_Code === row.Mtrl_Code)
      );
    },
  };

  // selected stock calc start
  let tq1 = 0;
  let tw1 = 0;
  for (let i = 0; i < thirdTable.length; i++) {
    if (thirdTable[i].Scrap === 0) {
      tq1 = tq1 + thirdTable[i].Qty;
      tw1 = tw1 + parseFloat(thirdTable[i].Weight);
    }
  }

  let tq2 = 0;
  let tw2 = 0;
  for (let i = 0; i < thirdTable.length; i++) {
    if (thirdTable[i].Scrap !== 0) {
      tq2 = tq2 + thirdTable[i].Qty;
      tw2 = tw2 + parseFloat(thirdTable[i].ScrapWeight);
    }
  }
  delay(300);

  const scrapDataTbl = thirdTable.filter((item, index) => {
    return item.Scrap !== 0;
  });

  //console.log("scrapDataTbl", scrapDataTbl);

  const tblDataTbl = thirdTable.filter((item, index) => {
    return item.Scrap === 0;
  });
  delay(300);

  // setprintSelectedStockOpen(true)

  // nav("/MaterialManagement/Reports/PrintReportStockList", {
  //   state: {
  //     //tableData: thirdTable,
  //     customerDetails: customerDetails,
  //     totalweight1: tw1,
  //     totqty1: tq1,
  //     totalweight2: tw2,
  //     totqty2: tq2,
  //     tableData: tblDataTbl,
  //     scrapData: scrapDataTbl,
  //     scrapFlag: scrapDataTbl.length,
  //   },
  // });

  // selected stock cal end

  const selectedStock = async () => {
    setprintSelectedStockOpen(true);

    // let tq1 = 0;
    // let tw1 = 0;
    // for (let i = 0; i < thirdTable.length; i++) {
    //   if (thirdTable[i].Scrap === 0) {
    //     tq1 = tq1 + thirdTable[i].Qty;
    //     tw1 = tw1 + parseFloat(thirdTable[i].Weight);
    //   }
    // }

    // let tq2 = 0;
    // let tw2 = 0;
    // for (let i = 0; i < thirdTable.length; i++) {
    //   if (thirdTable[i].Scrap !== 0) {
    //     tq2 = tq2 + thirdTable[i].Qty;
    //     tw2 = tw2 + parseFloat(thirdTable[i].Weight);
    //   }
    // }
    // await delay(300);

    // const scrapDataTbl = thirdTable.filter((item, index) => {
    //   return item.Scrap !== 0;
    // });

    // const tblDataTbl = thirdTable.filter((item, index) => {
    //   return item.Scrap === 0;
    // });
    // await delay(300);

    // setprintSelectedStockOpen(true)

    // nav("/MaterialManagement/Reports/PrintReportStockList", {
    //   state: {
    //     //tableData: thirdTable,
    //     customerDetails: customerDetails,
    //     totalweight1: tw1,
    //     totqty1: tq1,
    //     totalweight2: tw2,
    //     totqty2: tq2,
    //     tableData: tblDataTbl,
    //     scrapData: scrapDataTbl,
    //     scrapFlag: scrapDataTbl.length,
    //   },
    // });
  };

  var fullStockTable = [];
  var fullStockScrapTable = [];
  for (let i = 0; i < firstTable.length; i++) {
    let totqty = 0;
    let totwt = 0;
    var tempdata = [];
    for (let j = 0; j < thirdAllData.length; j++) {
      if (
        firstTable[i].Material === thirdAllData[j].Material &&
        thirdAllData[j].Scrap === 0
      ) {
        tempdata.push(thirdAllData[j]);
        totqty = totqty + parseInt(thirdAllData[j].Qty);
        totwt = totwt + parseFloat(thirdAllData[j].Weight);
      }
    }
    let obj = {
      material: firstTable[i].Material,
      totqty: totqty,
      totwt: totwt,
      data: tempdata,
    };
    //await delay(500);
    fullStockTable.push(obj);

    //for scrap
    totqty = 0;
    totwt = 0;
    tempdata = [];
    for (let j = 0; j < thirdAllData.length; j++) {
      if (
        firstTable[i].Material === thirdAllData[j].Material &&
        thirdAllData[j].Scrap !== 0
      ) {
        tempdata.push(thirdAllData[j]);
        totqty = totqty + parseInt(thirdAllData[j].Qty);
        totwt = totwt + parseFloat(thirdAllData[j].Weight);
      }
    }
    obj = {
      material: firstTable[i].Material,
      totqty: totqty,
      totwt: totwt,
      data: tempdata,
    };
    //await delay(500);
    fullStockScrapTable.push(obj);
  }
  //fullStockTable.push({ material: "Aluminium", data: thirdAllData });
  delay(500);
  // //console.log("table = ", fullStockTable);
  // //console.log("table scrap = ", fullStockScrapTable);

  // nav("/MaterialManagement/Reports/PrintReportFullStockList", {
  //   state: {
  //     customerDetails: customerDetails,
  //     fullStockTable: fullStockTable,
  //     fullStockScrapTable: fullStockScrapTable,
  //   },
  // });

  const fullStock = async () => {
    //ready to print data

    setPrintFullStockListOpen(true);

    // var fullStockTable = [];
    // var fullStockScrapTable = [];
    // for (let i = 0; i < firstTable.length; i++) {
    //   let totqty = 0;
    //   let totwt = 0;
    //   var tempdata = [];
    //   for (let j = 0; j < thirdAllData.length; j++) {
    //     if (
    //       firstTable[i].Material === thirdAllData[j].Material &&
    //       thirdAllData[j].Scrap === 0
    //     ) {
    //       tempdata.push(thirdAllData[j]);
    //       totqty = totqty + parseInt(thirdAllData[j].Qty);
    //       totwt = totwt + parseFloat(thirdAllData[j].Weight);
    //     }
    //   }
    //   let obj = {
    //     material: firstTable[i].Material,
    //     totqty: totqty,
    //     totwt: totwt,
    //     data: tempdata,
    //   };
    //   //await delay(500);
    //   fullStockTable.push(obj);

    //   //for scrap
    //   totqty = 0;
    //   totwt = 0;
    //   tempdata = [];
    //   for (let j = 0; j < thirdAllData.length; j++) {
    //     if (
    //       firstTable[i].Material === thirdAllData[j].Material &&
    //       thirdAllData[j].Scrap !== 0
    //     ) {
    //       tempdata.push(thirdAllData[j]);
    //       totqty = totqty + parseInt(thirdAllData[j].Qty);
    //       totwt = totwt + parseFloat(thirdAllData[j].Weight);
    //     }
    //   }
    //   obj = {
    //     material: firstTable[i].Material,
    //     totqty: totqty,
    //     totwt: totwt,
    //     data: tempdata,
    //   };
    //   //await delay(500);
    //   fullStockScrapTable.push(obj);
    // }
    // //fullStockTable.push({ material: "Aluminium", data: thirdAllData });
    // await delay(500);
    // //console.log("table = ", fullStockTable);
    // //console.log("table scrap = ", fullStockScrapTable);

    // nav("/MaterialManagement/Reports/PrintReportFullStockList", {
    //   state: {
    //     customerDetails: customerDetails,
    //     fullStockTable: fullStockTable,
    //     fullStockScrapTable: fullStockScrapTable,
    //   },
    // });
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
        {" "}
        <>
          <h4 className="title">Material Stock List </h4>
          {/* <h4 className="form-title">Customer Material Stock List</h4> */}
          <div className="row">
            <div className="d-flex col-md-8 col-sm-12" style={{ gap: "10px" }}>
              <div
                className={
                  props.type === "customer" ? " col-md-1 mt-2" : "d-none"
                }
              >
                <label className="form-label">Customer</label>
              </div>
              <div
                className={
                  props.type === "customer" ? "col-md-6 mt-3" : "d-none"
                }
              >
                {/* <select
              className="ip-select dropdown-field"
              onChange={customerChange}
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
            </div>

            <div className="d-flex col-md-4 ">
              <button
                onClick={selectedStock}
                className={
                  thirdTable.length <= 0
                    ? "button-style button-disabled"
                    : "button-style"
                }
                disabled={thirdTable.length <= 0}
              >
                Selected Stock
              </button>

              <button
                onClick={fullStock}
                className={
                  firstTable.length <= 0
                    ? "button-style button-disabled"
                    : "button-style"
                }
                disabled={firstTable.length <= 0}
              >
                Full Stock
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

          <hr className="horizontal-line mt-4" />
          <div className="row">
            <div className="col-md-6 col-sm-12">
              <div className="row">
                {" "}
                <div style={{ height: "200px", overflowY: "scroll" }}>
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
              <div className="row mt-3">
                {" "}
                <div style={{ height: "200px", overflowY: "scroll" }}>
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
            </div>

            <div className="col-md-6 col-sm-12">
              <div style={{ height: "400px", overflowY: "scroll" }}>
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
        </>
      </div>

      <PrintReportStockList
        setprintSelectedStockOpen={setprintSelectedStockOpen}
        printSelectedStockOpen={printSelectedStockOpen}
        customerDetails={customerDetails}
        totalweight1={tw1}
        totqty1={tq1}
        totalweight2={tw2}
        totqty2={tq2}
        tableData={tblDataTbl}
        scrapData={scrapDataTbl}
        scrapFlag={scrapDataTbl.length}
      />

      <PrintReportFullStockList
        setPrintFullStockListOpen={setPrintFullStockListOpen}
        printFullStockListOpen={printFullStockListOpen}
        customerDetails={customerDetails}
        fullStockTable={fullStockTable}
        fullStockScrapTable={fullStockScrapTable}
      />
    </>
  );
}

export default StockList;
