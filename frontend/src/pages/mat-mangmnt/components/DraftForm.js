import React from "react";

function DraftForm() {
  return (
    <>
      <div className="col-md-6 col-sm-12">
        <div className="ip-box form-bg">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="ip-box form-bg">
                <div className="row">
                  <div className="row">
                    <div className="col-md-3 ">
                      <label className="form-label">Part ID</label>
                    </div>
                    <div className="col-md-8" style={{ marginTop: "8px" }}>
                      <select className="ip-select dropdown-field">
                        <option value="option 1">001</option>
                        <option value="option 1">002</option>
                        <option value="option 1">003</option>
                        <option value="option 1">004</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 ">
                      <label className="form-label">Receipt Date</label>
                    </div>
                    <div className="col-md-8 ">
                      <input
                        className="in-field"
                        type="date"
                        // onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 ">
                      <label className="form-label">RV No</label>
                    </div>
                    <div className="col-md-8 ">
                      <input className="in-field" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">RV Date</label>
                    </div>
                    <div className="col-md-8 ">
                      <input
                        className="in-field"
                        type="date"
                        // onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 ">
                      <label className="form-label">Cust code</label>
                    </div>
                    <div className="col-md-8 ">
                      <input className="in-field" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 ">
                      <label className="form-label">Customer</label>
                    </div>
                    <div className="col-md-8" style={{ marginTop: "8px" }}>
                      <select className="ip-select dropdown-field">
                        <option value="option 1">001</option>
                        <option value="option 1">002</option>
                        <option value="option 1">003</option>
                        <option value="option 1">004</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Cust Docu No</label>
                    </div>

                    <div className="col-md-8 ">
                      <input className="in-field" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 ">
                      <label className="form-label">Total Weight</label>
                    </div>
                    <div className="col-md-8 ">
                      <input className="in-field" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Caluclatd weight</label>
                    </div>
                    <div className="col-md-8 ">
                      <input className="in-field" />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3 ">
                      <label className="form-label">RV status</label>
                    </div>
                    <div className="col-md-8 ">
                      <input className="in-field" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-4">
            <button className="button-style " style={{ width: "120px" }}>
              Open
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DraftForm;
