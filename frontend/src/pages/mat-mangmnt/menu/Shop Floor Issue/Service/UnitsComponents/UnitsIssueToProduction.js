import React from "react";
import Table from "react-bootstrap/Table";

function UnitsIssueToProduction() {
  return (
    <div>
      <h4 className="title">Shop Material Issue Vocher</h4>
      <div className="row">
        <div className="col-md-4">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label"> IV No</label>
              <input className="" />
            </div>
            <div className="col-md-6">
              {" "}
              <label className="form-label">&nbsp;</label>
              <input className="" />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col-md-6">
              {" "}
              <label className="form-label">Program No</label>
              <input className="" />
            </div>
            <div className="col-md-6">
              {" "}
              <label className="form-label">&nbsp;</label>
              <input className="" />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col-md-12">
              <label className="form-label">Customer</label>
              <input className="" />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col-md-6">
              <label className="form-label">Operation</label>
              <input className="" />
            </div>
            <div className="col-md-6">
              <label className="form-label">&nbsp;</label>
              <input className="" />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col-md-12">
              <label className="form-label">Source</label>
              <input className="" />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          {" "}
          <div className="row">
            <div className="col-md-12">
              <label className="form-label">Material</label>
              <input className="" />
            </div>
          </div>
          <div className="row">
            {" "}
            <div className="col-md-4">
              <label className="form-label">Dim</label>
              <input className="" />
            </div>
            <div className="col-md-4">
              <label className="form-label">X</label>
              <input className="" />
            </div>
            <div className="col-md-4">
              <label className="form-label">X</label>
              <input className="" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Machine</label>
              <input className="" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Qty Required</label>
              <input className="" />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Qty Issued</label>
              <input className="" />
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="row mt-4">
            <div className="col-md-12">
              <button className="button-style ">Print</button>
            </div>
          </div>
          <div className="row mt-4">
            <div
              className="col-md-12 mt-2"
              style={{ display: "flex", gap: "5px" }}
            >
              <input
                className="form-check-input mt-3"
                type="checkbox"
                id="flexCheckDefault"
                name="updated"
                //   value={inputPart.upDated}
                //disabled={boolVal3 | boolVal4}
                //   disabled={true}
                //   onChange={changeMaterialHandle}
              />
               <label className="form-label mt-1">No Details</label>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <label className="form-label">Combined Sheets</label>
              <div>
                <textarea style={{ height: "100px" }}></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          height: "400px",
          overflowY: "scroll",
          border: "solid #c0c4c2 1px",
          marginTop: "20px",
        }}
      >
        <Table striped className="table-data border">
          <thead
            className="tableHeaderBGColor"
            style={{
              textAlign: "center",
              position: "sticky",
              top: "-1px",
            }}
          >
            <tr>
              <th>Shape Mtrl ID</th>
              <th>Para 1</th>
              <th>Para 2</th>
              <th>Para 3</th>
              <th>Used</th>
              <th>Rejected</th>
              <th>Selected</th>
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
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <input type="checkbox" />
              </td>
              <td>
                <input type="checkbox" />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default UnitsIssueToProduction;
