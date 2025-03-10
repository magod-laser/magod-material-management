import React from "react";
import Table from "react-bootstrap/Table";

function MonthlyMatPurDetails() {
  return (
    <div>
      {" "}
      <div style={{ height: "400px", overflowY: "scroll" }}>
        <Table bordered>
          <thead
            style={{
              textAlign: "center",
              position: "sticky",
              top: "-1px",
            }}
          >
            <tr>
              <th>RV No</th>
              <th>Date</th>
              <th>Material</th>
              <th>Quantity</th>
              <th>Weight Calculated </th>
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

export default MonthlyMatPurDetails;
