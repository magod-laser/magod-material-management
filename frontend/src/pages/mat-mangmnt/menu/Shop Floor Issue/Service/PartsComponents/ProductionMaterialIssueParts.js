import React from "react";
import Table from "react-bootstrap/Table";
import { useLocation } from "react-router-dom";

function ProductionMaterialIssueParts() {
  const location = useLocation();
  console.log("ID = ", location.state.id);
  return (
    <div>
      <h4 className="title">Production Material Issue :Parts </h4>
      <div className="table_top_style">
        <form action="">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Issue Vt No</label>
              <input className="" />
            </div>
            <div className="col-md-3">
              <label className="form-label">Assembly Name</label>
              <input className="" />
            </div>
            <div className="col-md-3">
              <label className="form-label">Allotted</label>
              <input className="" />
            </div>
            <div className="col-md-3">
              <button className="button-style ">Print</button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Vt Date</label>
              <input className="" />
            </div>
            <div className="col-md-3">
              <label className="form-label">Operation</label>
              <input className="" />
            </div>
            <div className="col-md-3">
              <label className="form-label">Returned</label>
              <input className="" />
            </div>
            <div className="col-md-3">
              <button className="button-style ">Cancel</button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Program No</label>
              <input className="" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Material</label>
              <input className="" />
            </div>

            <div className="col-md-3">
              <button className="button-style ">Accept Return</button>
            </div>
          </div>
        </form>
      </div>
      <div>
        <div
          style={{ height: "400px", overflowY: "scroll", marginTop: "30px" }}
        >
          <Table striped>
            <thead
              style={{
                textAlign: "center",
                position: "sticky",
                top: "-1px",
              }}
            >
              <tr>
                <th>RV No</th>
                <th>Part ID</th>
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
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ProductionMaterialIssueParts;
