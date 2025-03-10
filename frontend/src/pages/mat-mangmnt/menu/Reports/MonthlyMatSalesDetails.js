import React from "react";
import Table from "react-bootstrap/Table";

function MonthlyMatSalesDetails() {
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
              <th>Invoice</th>
              <th>Date</th>
              <th>Material</th>
              <th>Customer</th>
              <th>Srl weight</th>
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

export default MonthlyMatSalesDetails;
