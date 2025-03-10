import React, { useState, useEffect } from "react";
import NavComp from "../../../../components/NavComp";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import TreeView from "react-treeview";
import BootstrapTable from "react-bootstrap-table-next";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function PartsInStockAndProcess(props) {
  const [tableData, setTableData] = useState([]);
  const [tableDataAll, setTableDataAll] = useState([]);
  const [treeData, setTreeData] = useState([]);

  async function fetchData() {
    let url1 =
      endpoints.getPartListInStockAndProcess + "?code=" + props.custCode;
    getRequest(url1, (data) => {
      setTableDataAll(data);
      //console.log("table data = ", data);

      const uniqueData = [
        ...new Map(data.map((item) => [item["PartId"], item])).values(),
      ];
      setTreeData(uniqueData);
    });
  }

  useEffect(() => {
    fetchData();
  }, [props.custCode]);

  const treeViewclickMachine = (part) => {
    const newTable = tableDataAll.filter((obj) => obj.PartId === part);
    setTableData(newTable);
  };

  const columns = [
    {
      text: "Id",
      dataField: "Id",
      hidden: true,
    },
    {
      text: "RV NO",
      dataField: "RV_No",
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
      text: "Returned",
      dataField: "QtyReturned",
    },
  ];

  // const nav = useNavigate();
  return (
    <div className="">
      <div className="row-md-6 justify-content-center mt-1 ">
        {/* <h5>
          <b>
            Issued : Issued for Production &nbsp;&nbsp;&nbsp;&nbsp; Used : Used
            in Production{" "}
          </b>
        </h5> */}
        <label className="form-label ">Issued : Issued for Production &nbsp;&nbsp;&nbsp;&nbsp; Used : Used
            in Production{" "}</label>
      </div>
      <div className="row mt-2">
        <div className="col-md-2">
          {/* <NavComp /> */}
          {treeData.map((node, i) => {
            const part = node.PartId;
            const label = <span className="node" style={{fontSize:'12px'}}>{part}</span>;
            return (
              <TreeView
                key={part + "|" + i}
                nodeLabel={label}
                defaultCollapsed={true}
                onClick={() => treeViewclickMachine(part)}
              ></TreeView>
            );
          })}
        </div>
        <div className="col-md-10">
          <div style={{ height: "375px", overflow: "scroll" }}>
            <BootstrapTable
              keyField="Id"
              columns={columns}
              data={tableData}
              striped
              hover
              condensed
              //selectRow={selectRow1}
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
                  <th>RV NO</th>
                  <th>Received</th>
                  <th>Accepted</th>
                  <th>Rejected</th>
                  <th>Issued</th>
                  <th>Used</th>
                  <th>Returned</th>
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
                  <td>asdfghj</td>
                  <td>asdfghj</td>
                  <td>asdfghj</td>
                </tr>
              </tbody>
            </Table> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartsInStockAndProcess;
