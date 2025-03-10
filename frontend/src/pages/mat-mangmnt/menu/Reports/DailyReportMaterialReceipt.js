import React from "react";
import Table from "react-bootstrap/Table";

function DailyReportMaterialReceipt() {
  return (
    <div>
      {" "}
      <div style={{ height: "200px", overflowY: "scroll" }}>
        <Table striped>
          <thead className="tableHeaderBGColor">
            style=
            {{
              textAlign: "center",
              position: "sticky",
              top: "-1px",
            }}
            <tr>
              <th style={{ whiteSpace: "nowrap" }}>RV No</th>
              <th>Customer</th>
              <th style={{ whiteSpace: "nowrap" }}>Customer Doc No</th>
              <th>Type</th>
              <th style={{ whiteSpace: "nowrap" }}>Receipt Details</th>
              <th>Quantity</th>
              <th style={{ whiteSpace: "nowrap" }}>Weight Caluclated</th>
              <th style={{ whiteSpace: "nowrap" }}>Actual Weight</th>
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
              <td>asdfghj</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default DailyReportMaterialReceipt;
