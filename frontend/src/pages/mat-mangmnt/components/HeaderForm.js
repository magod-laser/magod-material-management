import React from "react";

function HeaderForm() {
  return (
    <div>
      <div>
        <h4 className="form-title">Name of the form</h4>
        <hr className="horizontal-line" />

        <div className="row">
          <div className="col-md-3">
            <label className="form-label">Receipt Date</label>
            <input
              type="text"
              name="receiptDate"
              //   value={formHeader.receiptDate}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">RV No</label>
            <input
              type="text"
              name="rvNo"
              readOnly
              // value={formHeader.rvNo}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">RV Date</label>
            <input
              type="text"
              name="rvDate"
              //   value={formHeader.rvDate}
              readOnly
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Status</label>
            <input
              type="text"
              name="status"
              //   value={formHeader.status}
              readOnly
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <label className="form-label">Customer</label>
            <select
              className="ip-select"
              name="customer"
              //   onChange={changeCustomer}
            >
              <option value="" disabled selected>
                Select Customer
              </option>
              {/* {custdata.map((customer, index) => (
                <option key={index} value={customer.Cust_Code}>
                  {customer.Cust_name}
                </option>
              ))} */}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Weight</label>
            <input
              type="text"
              name="weight"
              //   value={formHeader.weight}
              // onChange={InputHeaderEvent}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-md-8">
            <label className="form-label">Reference</label>
            <input
              type="text"
              name="reference"
              //   value={formHeader.reference}
              // onChange={InputHeaderEvent}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Caluclated Weight</label>
            <input
              type="text"
              name="calculatedWeight"
              // value={calcWeightVal}
              readOnly
            />
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-8 justify-content-center">
            <button
              className="button-style"
              style={{ width: "196px" }}
              // onClick={saveButtonState}
            >
              Save
            </button>
            <button className="button-style" style={{ width: "196px" }}>
              Allot RV No
            </button>
            <button className="button-style" style={{ width: "196px" }}>
              Delete RV
            </button>
          </div>
          <div className="col-md-4">
            <label className="form-label"></label>
            <textarea
              style={{ height: "110px" }}
              className="form-control"
              //   value={formHeader.address}
              readOnly
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderForm;
