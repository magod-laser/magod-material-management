import React, { useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import BootstrapTable from "react-bootstrap-table-next";
import { formatDate } from "../../../../utils";
import { useNavigate } from "react-router-dom";
import PrintMonthlyReport from "../../print/report/PrintMonthlyReport";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function MonthlyReport() {
  const nav = useNavigate();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const dateee = new Date();
  const monthhh = dateee.getMonth();
  const yearrr = dateee.getFullYear();

  // console.log("monthhhhhhhhh", yearrr + "-" + (monthhh + 1));
  const [firstTab, setFirstTab] = useState([]);
  const [secondTab, setSecondTab] = useState([]);
  const [thirdTab, setThirdTab] = useState([]);
  const [fourthTab, setFourthTab] = useState([]);
  const [fifthTab, setFifthTab] = useState([]);

  const [dateVal, setDateVal] = useState(yearrr + "-" + (monthhh + 1));
  const [monthval, setMonthVal] = useState(0);
  const [yearval, setYearVal] = useState(1900);

  const [printReportOpen, setPrintReportOpen] = useState(false);
  const InputEvent = (e) => {
    const { name, value } = e.target;
    //console.log("value = ", value);
    //console.log("year = ", formatDate(new Date(value), 6));
    //console.log("month = ", formatDate(new Date(value), 8));
    setDateVal(value);
    setMonthVal(formatDate(new Date(value), 8));
    setYearVal(formatDate(new Date(value), 6));
  };

  const loadData = () => {
    //first tab
    const url1 =
      endpoints.getMonthlyReportMaterialPurchaseDetails +
      "?month=" +
      monthval +
      "&year=" +
      yearval;
    getRequest(url1, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setFirstTab(data);
      //console.log("first tab : ", data);
    });

    //second tab
    const url2 =
      endpoints.getMonthlyReportMaterialSalesDetails +
      "?month=" +
      monthval +
      "&year=" +
      yearval;
    getRequest(url2, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setSecondTab(data);
      //console.log("second tab : ", data);
    });

    //thhird tab
    const url3 =
      endpoints.getMonthlyReportMaterialSalesSummary +
      "?month=" +
      monthval +
      "&year=" +
      yearval;
    getRequest(url3, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setThirdTab(data);
      //console.log("third tab : ", data);
    });

    //fourth tab
    const url4 =
      endpoints.getMonthlyReportMaterialPurchaseSummary +
      "?month=" +
      monthval +
      "&year=" +
      yearval;
    getRequest(url4, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setFourthTab(data);
      //console.log("fourth tab : ", data);
    });

    //fifth tab
    const url5 =
      endpoints.getMonthlyReportMaterialHandlingSummary +
      "?month=" +
      monthval +
      "&year=" +
      yearval;
    getRequest(url5, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setFifthTab(data);
      //console.log("fifth tab : ", data);
    });
  };
  function statusFormatter(cell, row, rowIndex, formatExtraData) {
    return formatDate(new Date(cell), 3);
  }

  const columns1 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "RV No",
      dataField: "RV_No",
    },
    {
      text: "Date",
      dataField: "RV_Date",
      formatter: statusFormatter,
    },
    {
      text: "Material",
      dataField: "Material",
    },
    {
      text: "Quantity",
      dataField: "qty",
    },
    {
      text: "Weight Calculate",
      dataField: "TotalWeightCalculated",
    },
    {
      text: "Actual Weight",
      dataField: "TotalWeight",
    },
  ];
  const columns2 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Invoice",
      dataField: "Inv_No",
    },
    {
      text: "Date",
      dataField: "Inv_Date",
      formatter: statusFormatter,
    },
    {
      text: "Customer",
      dataField: "Cust_Name",
    },
    {
      text: "Material",
      dataField: "Material",
    },
    {
      text: "SrlWt",
      dataField: "SrlWt",
    },
  ];
  const columns3 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Type",
      dataField: "DC_InvType",
    },
    {
      text: "Material",
      dataField: "Material",
    },
    {
      text: "Weight",
      dataField: "SrlWt",
    },
  ];
  const columns4 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Material",
      dataField: "Material",
    },
    {
      text: "Calculated Weight",
      dataField: "TotalWeightCalculated",
    },
    {
      text: "Actual Weight",
      dataField: "TotalWeight",
    },
  ];
  const columns5 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Type",
      dataField: "Type",
    },
    {
      text: "Material",
      dataField: "Material",
    },
    {
      text: "Calc Weight",
      dataField: "TotalWeightCalculated",
    },
    {
      text: "Total Weight",
      dataField: "TotalWeight",
    },
    {
      text: "Qty",
      dataField: "qty",
    },
  ];

  // print report funtion starts

  //find out total of Receipt and Dispatch
  let tot1 = 0,
    tot2 = 0;
  for (let i = 0; i < fifthTab.length; i++) {
    if (fifthTab[i].Type === "Receipts") {
      tot1 = tot1 + parseInt(fifthTab[i].qty);
    }
    if (fifthTab[i].Type === "Despatch") {
      tot2 = tot2 + parseInt(fifthTab[i].qty);
    }
  }
  delay(100);
  let totalobj = [
    { type: "Receipts", total: tot1 },
    { type: "Despatch", total: tot2 },
  ];

  //calculate material purchase details
  var fullStockTable1 = [];
  for (let i = 0; i < fourthTab.length; i++) {
    let tot = 0;
    var tempdata = [];
    for (let j = 0; j < firstTab.length; j++) {
      if (fourthTab[i].Material === firstTab[j].Material) {
        tempdata.push(firstTab[j]);
        tot = tot + parseInt(firstTab[j].TotalWeight);
      }
    }
    let obj = {
      material: fourthTab[i].Material,
      totwt: tot,
      data: tempdata,
    };
    fullStockTable1.push(obj);
  }
  delay(300);
  //console.log("fullStockTable1 = ", fullStockTable1);

  //calculate material purchase details
  var fullStockTable2 = [];
  for (let i = 0; i < thirdTab.length; i++) {
    let tot = 0;
    var tempdata = [];
    for (let j = 0; j < secondTab.length; j++) {
      if (thirdTab[i].Material === secondTab[j].Material) {
        tempdata.push(secondTab[j]);
        tot = tot + parseInt(secondTab[j].SrlWt);
      }
    }
    let obj = {
      material: thirdTab[i].Material,
      totwt: tot,
      data: tempdata,
    };
    fullStockTable2.push(obj);
  }
  // await delay(300);
  // //console.log("fullStockTable2 = ", fullStockTable2);

  // nav("/MaterialManagement/Reports/PrintMonthlyReport", {
  //   state: {
  //     date: formatDate(new Date(dateVal), 9),
  //     thirdTab: thirdTab,
  //     fourthTab: fourthTab,
  //     fourthTab: fourthTab,
  //     totalobj: totalobj,
  //     purchaseDetails: fullStockTable1,
  //     saleDetails: fullStockTable2,
  //   },
  // });
  // print report funtion ends

  const printReport = async () => {
    setPrintReportOpen(true);
    // //find out total of Receipt and Dispatch
    // let tot1 = 0,
    //   tot2 = 0;
    // for (let i = 0; i < fifthTab.length; i++) {
    //   if (fifthTab[i].Type === "Receipts") {
    //     tot1 = tot1 + parseInt(fifthTab[i].qty);
    //   }
    //   if (fifthTab[i].Type === "Despatch") {
    //     tot2 = tot2 + parseInt(fifthTab[i].qty);
    //   }
    // }
    // await delay(100);
    // let totalobj = [
    //   { type: "Receipts", total: tot1 },
    //   { type: "Despatch", total: tot2 },
    // ];

    // //calculate material purchase details
    // var fullStockTable1 = [];
    // for (let i = 0; i < fourthTab.length; i++) {
    //   let tot = 0;
    //   var tempdata = [];
    //   for (let j = 0; j < firstTab.length; j++) {
    //     if (fourthTab[i].Material === firstTab[j].Material) {
    //       tempdata.push(firstTab[j]);
    //       tot = tot + parseInt(firstTab[j].TotalWeight);
    //     }
    //   }
    //   let obj = {
    //     material: fourthTab[i].Material,
    //     totwt: tot,
    //     data: tempdata,
    //   };
    //   fullStockTable1.push(obj);
    // }
    // await delay(300);
    // //console.log("fullStockTable1 = ", fullStockTable1);

    // //calculate material purchase details
    // var fullStockTable2 = [];
    // for (let i = 0; i < thirdTab.length; i++) {
    //   let tot = 0;
    //   var tempdata = [];
    //   for (let j = 0; j < secondTab.length; j++) {
    //     if (thirdTab[i].Material === secondTab[j].Material) {
    //       tempdata.push(secondTab[j]);
    //       tot = tot + parseInt(secondTab[j].SrlWt);
    //     }
    //   }
    //   let obj = {
    //     material: thirdTab[i].Material,
    //     totwt: tot,
    //     data: tempdata,
    //   };
    //   fullStockTable2.push(obj);
    // }
    // await delay(300);
    // //console.log("fullStockTable2 = ", fullStockTable2);

    // nav("/MaterialManagement/Reports/PrintMonthlyReport", {
    //   state: {
    //     date: formatDate(new Date(dateVal), 9),
    //     thirdTab: thirdTab,
    //     fourthTab: fourthTab,
    //     fourthTab: fourthTab,
    //     totalobj: totalobj,
    //     purchaseDetails: fullStockTable1,
    //     saleDetails: fullStockTable2,
    //   },
    // });
  };

  // console.log("monthhh", monthhh + 1, "yearrr", yearrr);
  return (
    <>
      <div>
        {" "}
        <h4 className="title">Raw Material Month Report</h4>
        <div className="row">
          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
              Select Month
            </label>

            <input
              className="input-field"
              type="month"
              name="month"
              defaultValue={`${yearrr}-${monthhh + 1}`}
              onChange={InputEvent}
              // placeholder="month,year"
            />
          </div>

          <div className="d-flex col-md-4">
            <button className="button-style" onClick={loadData}>
              Load Data
            </button>

            <button className="button-style" onClick={printReport}>
              Print Report
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
        <div className="row mt-4">
          <div className="col-md-12">
            <Tabs
              id="controlled-tab-example"
              className="mb-3 mt-3 tab_font"
              style={{ width: "1200px" }}
            >
              <Tab eventKey="mat_rece" title="Material Purchase Details">
                {/* <MonthlyMatPurDetails /> */}
                <div style={{ height: "400px", overflowY: "scroll" }}>
                  <BootstrapTable
                    keyField="id"
                    columns={columns1}
                    data={firstTab}
                    striped
                    hover
                    condensed
                    //selectRow={selectRow1}
                    headerClasses="header-class tableHeaderBGColor"
                  ></BootstrapTable>
                </div>
              </Tab>
              <Tab eventKey="mat_sale" title="Material Sales Datails">
                {/* <MonthlyMatSalesDetails /> */}
                <div style={{ height: "400px", overflowY: "scroll" }}>
                  <BootstrapTable
                    keyField="id"
                    columns={columns2}
                    data={secondTab}
                    striped
                    hover
                    condensed
                    //selectRow={selectRow1}
                    headerClasses="header-class tableHeaderBGColor"
                  ></BootstrapTable>
                </div>
              </Tab>
              <Tab eventKey="mat_sale_sum" title="Material Sales Summary">
                {/* <MonthlyMatSalesSummary /> */}
                <div style={{ height: "400px", overflowY: "scroll" }}>
                  <BootstrapTable
                    keyField="id"
                    columns={columns3}
                    data={thirdTab}
                    striped
                    hover
                    condensed
                    //selectRow={selectRow1}
                    headerClasses="header-class tableHeaderBGColor"
                  ></BootstrapTable>
                </div>
              </Tab>
              <Tab eventKey="mat_pur" title="Material Purchase Summary">
                {/* <MonthlyMatPurSummary /> */}
                <div style={{ height: "400px", overflowY: "scroll" }}>
                  <BootstrapTable
                    keyField="id"
                    columns={columns4}
                    data={fourthTab}
                    striped
                    hover
                    condensed
                    //selectRow={selectRow1}
                    headerClasses="header-class tableHeaderBGColor"
                  ></BootstrapTable>
                </div>
              </Tab>

              <Tab
                eventKey="mat_han_sum"
                title="Monthly Material Handling Summary"
              >
                {/* <MonthlyMatHandlingSummary /> */}
                <div style={{ height: "400px", overflowY: "scroll" }}>
                  <BootstrapTable
                    keyField="id"
                    columns={columns5}
                    data={fifthTab}
                    striped
                    hover
                    condensed
                    //selectRow={selectRow1}
                    headerClasses="header-class tableHeaderBGColor"
                  ></BootstrapTable>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
      <PrintMonthlyReport
        printReportOpen={printReportOpen}
        setPrintReportOpen={setPrintReportOpen}
        date={formatDate(new Date(dateVal), 9)}
        thirdTab={thirdTab}
        fourthTab={fourthTab}
        //  fourthTab={fourthTab}
        totalobj={totalobj}
        purchaseDetails={fullStockTable1}
        saleDetails={fullStockTable2}
      />
    </>
  );
}

export default MonthlyReport;
