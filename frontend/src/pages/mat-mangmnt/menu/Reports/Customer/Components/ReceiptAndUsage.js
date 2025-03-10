import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

import BootstrapTable from "react-bootstrap-table-next";
import { formatDate } from "../../../../../../utils";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function ReceiptAndUsage(props) {
  const [firstTable, setFirstTable] = useState([]);
  const [secondTable, setSecondTable] = useState([]);
  const [selectedSecondRow, setSelectedSecondRow] = useState({});
  const [thirdTable, setThirdTable] = useState([]);
  const [fourthTable, setFourthTable] = useState([]);

  async function fetchData() {
    let url1 =
      endpoints.getPartListReceiptAndUsageFirst + "?code=" + props.custCode;
    getRequest(url1, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setFirstTable(data);
      console.log("first table = ", data);
    });
  }

  useEffect(() => {
    fetchData();
  }, [props.custCode]);

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
      text: "RV NO",
      dataField: "RV_No",
    },
    {
      text: "Date",
      dataField: "RV_Date",
      formatter: statusFormatter,
    },
    {
      text: "Status",
      dataField: "RVStatus",
    },
  ];
  const columns2 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "SrlNo",
      dataField: "id",
    },
    {
      text: "Part ID",
      dataField: "PartId",
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "Received",
      dataField: "QtyReceived",
    },
    {
      text: "Accepted",
      dataField: "QtyAccepted",
    },
    {
      text: "Rejected",
      dataField: "QtyRejected",
    },
    {
      text: "Issued",
      dataField: "QtyIssued",
    },
    {
      text: "Used",
      dataField: "QtyUsed",
    },
    {
      text: "Returned Unused",
      dataField: "QtyReturned",
      headerStyle: { whiteSpace: "nowrap" },
    },
  ];
  const columns3 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "NCProgramNo",
      dataField: "NCProgramNo",
    },
    {
      text: "QtyIssued",
      dataField: "QtyIssued",
    },
    {
      text: "QtyUsed",
      dataField: "QtyUsed",
    },
    {
      text: "QtyReturned",
      dataField: "QtyReturned",
    },
  ];
  const columns4 = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "IV_No",
      dataField: "IV_No",
    },
    {
      text: "Issue_date",
      dataField: "Issue_date",
      formatter: statusFormatter,
    },
    {
      text: "QtyIssued",
      dataField: "QtyIssued",
    },
    {
      text: "QtyUsed",
      dataField: "QtyUsed",
    },
    {
      text: "QtyReturned",
      dataField: "QtyReturned",
    },
    {
      text: "Remarks",
      dataField: "Remarks",
    },
  ];
  const selectRow1 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log("first row = ", row);
      let url1 = endpoints.getPartListReceiptAndUsageSecond + "?id=" + row.RvID;
      getRequest(url1, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        setSecondTable(data);
        console.log("second table = ", data);
      });
    },
  };
  const selectRow2 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log("second row = ", row);
      let url1 = endpoints.getPartListReceiptAndUsageThird + "?id=" + row.Id;
      getRequest(url1, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        setSelectedSecondRow(row);
        setThirdTable(data);
        console.log("third table = ", data);
      });
    },
  };
  const selectRow3 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log("third row = ", row);
      let url1 =
        endpoints.getPartListReceiptAndUsageFourth +
        "?id1=" +
        row.NCProgramNo +
        "&id2=" +
        selectedSecondRow.Id;
      getRequest(url1, (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].id = i + 1;
        }
        setFourthTable(data);
        console.log("fourth table = ", data);
      });
    },
  };

  return (
    <div className="mt-3">
      <div className="row">
        <div className="col-md-5">
          {" "}
          <div style={{ height: "675px", overflow: "scroll" }}>
            <BootstrapTable
              keyField="id"
              columns={columns1}
              data={firstTable}
              striped
              hover
              condensed
              selectRow={selectRow1}
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>
        </div>
        <div className="col-md-7">
          <div style={{ height: "375px", overflow: "scroll" }}>
            <BootstrapTable
              keyField="id"
              columns={columns2}
              data={secondTable}
              striped
              hover
              condensed
              selectRow={selectRow2}
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <div
                style={{
                  height: "375px",
                  overflowX: "scroll",
                  overflowY: "scroll",
                }}
              >
                <BootstrapTable
                  keyField="id"
                  columns={columns3}
                  data={thirdTable}
                  striped
                  hover
                  condensed
                  selectRow={selectRow3}
                  headerClasses="header-class tableHeaderBGColor"
                ></BootstrapTable>
              </div>
            </div>
            <div className="col-md-6">
              <div
                style={{
                  height: "375px",
                  overflowX: "scroll",
                  overflowY: "scroll",
                }}
              >
                <BootstrapTable
                  keyField="id"
                  columns={columns4}
                  data={fourthTable}
                  striped
                  hover
                  condensed
                  //selectRow={selectRow1}
                  headerClasses="header-class tableHeaderBGColor"
                ></BootstrapTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReceiptAndUsage;
