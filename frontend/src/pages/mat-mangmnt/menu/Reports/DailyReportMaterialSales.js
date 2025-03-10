import React from "react";
import Table from "react-bootstrap/Table";

function DailyReportMaterialSales() {
  return (
    <div>
      {" "}
      <div style={{ height: "200px", overflowY: "scroll" }}>
        <Table bordered>
          <thead
            style={{
              textAlign: "center",
              position: "sticky",
              top: "-1px",
            }}
          >
            <tr>
              <th>Inv No</th>
              <th>Type</th>
              <th>Customer</th>
              <th>Material</th>
              <th>Weight</th>
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

export default DailyReportMaterialSales;
