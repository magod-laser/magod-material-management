import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import BootstrapTable from "react-bootstrap-table-next";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function MaterialStockList() {
  const [data, setData] = useState([]);
  const [grid1, setGrid1] = useState([]);
  const [grid2, setGrid2] = useState([]);
  const [grid3, setGrid3] = useState([]);

  async function fetchData() {
    getRequest(endpoints.getCustomerDetailsByMtrlStock, (data) => {
      setData(data);
      console.log("data = ", data);
    });
  }
  useEffect(() => {
    fetchData();
  }, []); //[inputPart]);
  let changeCustomerDropdown = async (e) => {
    e.preventDefault();
    const { value, name } = e.target;

    await getRequest(
      `${endpoints.getMaterialStockList1}Cust_Code=${value}`,
      (data1) => {
        setGrid1(data1);
      }
    );

    await getRequest(
      `${endpoints.getMaterialStockList2}Cust_Code=${value}`,
      (data2) => {
        console.log("before1", data2);
        setGrid2(data2);
      }
    );

    await getRequest(
      `${endpoints.getMaterialStockList3}Cust_Code=${value}`,
      (data3) => {
        setGrid3(data3);
        console.log("data:", data3);
      }
    );
  };
  console.log("after1", grid2);
  const columns = [
    {
      text: "Material",
      dataField: "Material",
    },
    {
      text: "Qty",
      dataField: "Qty",
    },
    {
      text: "Weight",
      dataField: "Weight",
    },
    {
      text: "Scrap Weight",
      dataField: "ScrapWeight",
    },
  ];
  const columns1 = [
    {
      text: "Material Code",
      dataField: "Mtrl_Code",
    },
    {
      text: "Qty",
      dataField: "Qty",
    },
    {
      text: "Weight",
      dataField: "Weight",
    },
    {
      text: "Scrap Weight",
      dataField: "ScrapWeight",
    },
  ];
  const columns2 = [
    {
      text: "Length",
      dataField: "DynamicPara1",
    },
    {
      text: "Width",
      dataField: "DynamicPara2",
    },
    {
      text: "Qty",
      dataField: "Qty",
    },
    {
      text: "Locked",
      dataField: "Locked",
    },
    {
      text: "Scrap ",
      dataField: "Scrap",
    },
    {
      text: "Weight",
      dataField: "Weight",
    },
    {
      text: "Scrap Weight",
      dataField: "ScrapWeight",
    },
  ];
  return (
    <div>
      <>
        <h4 className="form-title">Material Stock List </h4>
        <hr className="horizontal-line" />
        <h4 className="form-title">Customer Material Stock List</h4>
        <div className="row">
          <div className="col-md-1 mt-2">
            <label className="">Get Customer</label>
          </div>
          <div className="col-md-6 mt-2">
            <select
              className="ip-select"
              name="pending"
              onChange={changeCustomerDropdown}
            >
              <option value="" disabled selected>
                Select Customer
              </option>

              {data.map((pending, index) => (
                <option key={index} value={pending.Cust_Code}>
                  {pending.Customer}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button className="button-style">Selected Stock</button>
          </div>
          <div className="col-md-2">
            <button className="button-style">Full Stock</button>
          </div>
        </div>

        <hr className="horizontal-line mt-4" />
        <div className="row">
          <div className="col-md-6 col-sm-12">
            <div className="row">
              {" "}
              <div style={{ height: "200px", overflowY: "scroll" }}>
                <BootstrapTable
                  keyField="IV_No"
                  columns={columns}
                  data={grid1}
                  striped
                  hover
                  condensed
                  //selectRow={selectRow}
                ></BootstrapTable>
                {/* <Table bordered>
                  <thead
                    style={{
                      textAlign: "center",
                      position: "sticky",
                      top: "-1px",
                    }}
                  >
                    <tr>
                      <th>Material</th>
                      <th>Qty</th>
                      <th>Weight</th>
                      <th>Scrap Weight</th>
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
                    </tr>
                  </tbody>
                </Table> */}
              </div>
            </div>
            <div className="row">
              {" "}
              <div style={{ height: "200px", overflowY: "scroll" }}>
                <BootstrapTable
                  keyField="IV_No"
                  columns={columns1}
                  data={grid2}
                  striped
                  hover
                  condensed
                  //selectRow={selectRow}
                ></BootstrapTable>
                {/* <Table bordered>
                  <thead
                    style={{
                      textAlign: "center",
                      position: "sticky",
                      top: "-1px",
                    }}
                  >
                    <tr>
                      <th>Material</th>
                      <th>Qty</th>
                      <th>Weight</th>
                      <th>Scrap Weight</th>
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
                    </tr>
                  </tbody>
                </Table> */}
              </div>
            </div>
          </div>

          <div className="col-md-6 col-sm-12">
            <div style={{ height: "400px", overflowY: "scroll" }}>
              <BootstrapTable
                keyField="IV_No"
                columns={columns2}
                data={grid3}
                striped
                hover
                condensed
                //selectRow={selectRow}
              ></BootstrapTable>
              {/* <Table bordered>
                <thead
                  style={{
                    textAlign: "center",
                    position: "sticky",
                    top: "-1px",
                  }}
                >
                  <tr>
                    <th>Para1</th>
                    <th>Para2</th>
                    <th>Qty</th>
                    <th>Locked</th>
                    <th>Scrap</th>
                    <th>Weight</th>
                    <th>Scrap Weight</th>
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
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>asdfghj</td>
                    <td>asdfghj</td>
                  </tr>
                </tbody>
              </Table> */}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default MaterialStockList;
