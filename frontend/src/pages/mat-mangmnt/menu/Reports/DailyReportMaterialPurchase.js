import React from "react";
import Table from "react-bootstrap/Table";

function DailyReportMaterialPurchase() {
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
              <th>RV No</th>
              <th>Docu Reference</th>
              <th>Material</th>
              <th>Caluclated Weight </th>
              <th>Actual Weight</th>
              <th>Quantity</th>
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

export default DailyReportMaterialPurchase;
