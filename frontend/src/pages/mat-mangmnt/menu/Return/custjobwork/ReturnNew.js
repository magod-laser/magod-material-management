import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ProfilesMaterials from "../custjobwork/components/PofilesMaterials";
import Parts from "./components/Parts";
import BootstrapTable from "react-bootstrap-table-next";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function ReturnNew() {
  const nav = useNavigate();
  let [custdata, setCustdata] = useState([]);
  let [custCode, setCustCode] = useState("");
  let [custName, setCustName] = useState("");
  let [custCST, setCustCSTNo] = useState("");
  let [custTIN, setCustTINNo] = useState("");
  let [custECC, setCustECCNo] = useState("");
  let [custGST, setCustGSTNo] = useState("");

  async function fetchData() {
    getRequest(endpoints.getCustomers, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);
    });
  }

  let changeCustomer = async (e) => {
    //e.preventDefault();
    //const { value, name } = e.target;
    setCustCode(e[0].Cust_Code);
    let foundCustomer = custdata.filter(
      (obj) => obj.Cust_Code === e[0].Cust_Code
    );
    setCustName(foundCustomer[0].Cust_name);
    setCustCSTNo(foundCustomer[0].CST_No);
    setCustTINNo(foundCustomer[0].TIN_No);
    setCustECCNo(foundCustomer[0].ECC_No);
    setCustGSTNo(foundCustomer[0].GSTNo);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <h4 className="title m-0">Customer Material Information</h4>
      <div className="row mb-2">
        <div className=" d-flex col-md-8" style={{ gap: "10px" }}>
          <label className="form-label m-1" style={{ whiteSpace: "nowrap" }}>
            Select Customer
          </label>

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

          <Typeahead
            className="ip-select"
            id="basic-example"
            name="customer"
            options={custdata}
            placeholder="Select Customer"
            onChange={(label) => changeCustomer(label)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-center justify-content-end mt-1">
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
      <Tabs id="controlled-tab-example" className=" tab_font nav-tabs mt-1">
        <Tab eventKey="mat_rece" title="Profiles Material">
          <ProfilesMaterials
            custCode={custCode}
            custName={custName}
            custCST={custCST}
            custECC={custECC}
            custGST={custGST}
            custTIN={custTIN}
          />
        </Tab>

        <Tab eventKey="mat_retu" title="Parts" className=" mt-3">
          <Parts
            custCode={custCode}
            custName={custName}
            custCST={custCST}
            custECC={custECC}
            custGST={custGST}
            custTIN={custTIN}
          />
        </Tab>
      </Tabs>
    </>
  );
}

export default ReturnNew;
