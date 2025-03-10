import React from "react";
import Table from "react-bootstrap/Table";

function MonthlyMatPurSummary() {
  return (
    <div>
      {" "}
      <div style={{ height: "400px", width: "600px", overflowY: "scroll" }}>
        <Table bordered>
          <thead
            style={{
              textAlign: "center",
              position: "sticky",
              top: "-1px",
            }}
          >
            <tr>
              <th>Material</th>
              <th> Calculated Weight </th>
              <th>Actual Weight</th>
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
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default MonthlyMatPurSummary;
