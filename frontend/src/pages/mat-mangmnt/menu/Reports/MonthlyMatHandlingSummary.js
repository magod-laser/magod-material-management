import React from "react";
import Table from "react-bootstrap/Table";

function MonthlyMatHandlingSummary() {
  return (
    <div>
      {" "}
      <div style={{ height: "400px", width: "800px", overflowY: "scroll" }}>
        <Table bordered>
          <thead
            style={{
              textAlign: "center",
              position: "sticky",
              top: "-1px",
            }}
          >
            <tr>
              <th>Type</th>
              <th>Material</th>
              <th>Calc Weight</th>
              <th>Total Weight</th>
              <th>Qty </th>
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
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default MonthlyMatHandlingSummary;
