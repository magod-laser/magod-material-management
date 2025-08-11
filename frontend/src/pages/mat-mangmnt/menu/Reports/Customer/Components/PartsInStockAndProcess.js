import { useState, useEffect } from "react";
import TreeView from "react-treeview";
import BootstrapTable from "react-bootstrap-table-next";

const { getRequest } = require("../../../../../api/apiinstance");
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

  return (
    <div className="">
      <div className="row-md-6 justify-content-center mt-1 ">
        <label className="form-label ">
          Issued : Issued for Production &nbsp;&nbsp;&nbsp;&nbsp; Used : Used in
          Production{" "}
        </label>
      </div>
      <div className="row mt-2">
        <div className="col-md-2">
          {treeData.map((node, i) => {
            const part = node.PartId;
            const label = (
              <span className="node" style={{ fontSize: "12px" }}>
                {part}
              </span>
            );
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
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartsInStockAndProcess;
