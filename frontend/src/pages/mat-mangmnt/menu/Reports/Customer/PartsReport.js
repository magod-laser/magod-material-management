import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import PartsInStockAndProcess from "./Components/PartsInStockAndProcess";
import ReceiptAndUsage from "./Components/ReceiptAndUsage";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function PartsReport() {
  const nav = useNavigate();
  let [custdata, setCustdata] = useState([]);
  let [custCode, setCustCode] = useState("");

  async function fetchData() {
    getRequest(endpoints.getCustomers, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  let changeCustomer = async (e) => {
    //e.preventDefault();
    //const { value, name } = e.target;
    //console.log("value = ", value);
    setCustCode(e[0].Cust_Code);
  };

  return (
    <>
      <h4 className="title">Customer Parts Stock</h4>
      <div className="row">
        <div className="d-flex col-md-11" style={{ gap: "10px" }}>
          <div className="col-md-1.5 ">
            <label className="form-label ">Select Customer</label>
          </div>

          {/* <select className="ip-select" onChange={changeCustomer}>
            <option value="" disabled selected>
              Select Customer
            </option>
            {custdata.map((customer, index) => (
              <option key={index} value={customer.Cust_Code}>
                {customer.Cust_name}
              </option>
            ))}
          </select> */}
          <div className="col-md-4 mt-2">
            <Typeahead
              id="basic-example"
              name="customer"
              options={custdata}
              placeholder="Select Customer"
              onChange={(label) => changeCustomer(label)}
            />
          </div>
        </div>
        <div className="col-md-1">
          <button
            className="button-style "
            id="btnclose"
            type="submit"
            onClick={() => nav("/MaterialManagement")}
          >
            Close
          </button>
        </div>
      </div>
      <Tabs className="mt-3 tab_font">
        <Tab eventKey="mat_rece" title="Parts In Stock And Process">
          <PartsInStockAndProcess custCode={custCode} />
        </Tab>

        <Tab eventKey="mat_retu" title="Receipt And Usage">
          <ReceiptAndUsage custCode={custCode} />
        </Tab>
      </Tabs>
    </>
  );
}

export default PartsReport;
