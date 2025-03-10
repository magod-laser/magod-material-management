import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import BootstrapTable from "react-bootstrap-table-next";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import ResizeModal from "./ResizeModal";
import { FaArrowUp } from "react-icons/fa";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

// ResizeModal

function SheetResizeForm() {
  const nav = useNavigate();
  const location = useLocation();

  const state = location.state;
  const [open, setOpen] = useState(false);

  let [custdata, setCustdata] = useState([]);
  let [tabledata, setTabledata] = useState([]);
  let [selectedTableRows, setSelectedTableRows] = useState([]);
  const [selectedCust, setSelectedCust] = useState();

  // console.log("location state value", location?.state?.selectedCust);
  async function fetchData() {
    getRequest(endpoints.getCustomers, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      //console.log("cust data = ", custdata);
      setCustdata(data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  // const columns = [
  //   {
  //     text: "Mtrl Stock",
  //     dataField: "MtrlStockID",
  //   },
  //   {
  //     text: "Mtrl Code",
  //     dataField: "Mtrl_Code",
  //   },
  //   {
  //     text: "Shape",
  //     dataField: "Shape",
  //   },
  //   {
  //     text: "Length",
  //     dataField: "DynamicPara1",
  //   },
  //   {
  //     text: "Width",
  //     dataField: "DynamicPara2",
  //   },
  //   {
  //     text: "Weight",
  //     dataField: "Weight",
  //   },
  // ];

  const changeCustomer = (custCode) => {
    //e.preventDefault();
    //const { value, name } = e.target;
    // if (e.length !== 0) {
    let url1 = endpoints.getResizeMtrlStockList + "?code=" + custCode;

    getRequest(url1, (data) => {
      setSelectedTableRows([]);

      if (data.length <= 0) {
        toast.warning("No data found for selected customer.");
      }
      setTabledata(data);

      setSelectedCust(custCode);
      //console.log("api call = ", data);
    });
    // }
  };

  const selectTableRow = (row) => {
    // mode: "checkbox",
    // clickToSelect: true,
    // bgColor: "#98A8F8",
    // onSelect: (row, isSelect, rowIndex, e) => {
    //   if (isSelect) {

    const found = selectedTableRows.some((obj) => {
      return obj.MtrlStockID === row.MtrlStockID;
    });
    // console.log("foundddddd", found);

    if (found) {
      setSelectedTableRows(
        selectedTableRows.filter((obj) => {
          return obj.MtrlStockID !== row.MtrlStockID;
        })
      );
    } else {
      setSelectedTableRows([...selectedTableRows, row]);
    }

    // } else {
    //   setSelectedTableRows(
    //     selectedTableRows.filter((obj) => {
    //       return obj.MtrlStockID !== row.MtrlStockID;
    //     })
    //   );
    // }
  };

  // console.log("selectedTableRows", selectedTableRows);

  const resizeButton = () => {
    // console.log("selected rows = ", selectedTableRows);
    if (selectedTableRows.length === 0) {
      toast.error("Please select the row first");
    } else {
      const flagArray = [];
      for (let i = 0; i < selectedTableRows.length; i++) {
        const element = selectedTableRows[i];
        // console.log(`element.... + ${i}`, element);

        if (
          selectedTableRows[0].DynamicPara1 !== element.DynamicPara1 ||
          selectedTableRows[0].DynamicPara2 !== element.DynamicPara2 ||
          selectedTableRows[0].Mtrl_Code !== element.Mtrl_Code
        ) {
          // dimension err
          flagArray.push(1);
        } else if (selectedTableRows[0].Mtrl_Code !== element.Mtrl_Code) {
          // material err
          flagArray.push(2);
        } else {
          // good to go
          flagArray.push(0);
        }
      }

      if (flagArray.sort().reverse()[0] === 0) {
        // good to go.................
        setOpen(true);
        // toast.success("go to go..000000000000");
        // nav("/MaterialManagement/StoreManagement/MaterialSplitter", {
        //   state: {
        //     selectedTableRows: selectedTableRows,
        //     selectedCust: selectedCust,
        //     // type: "storeresize",
        //   },
        // });
      } else if (flagArray.sort().reverse()[0] === 1) {
        // dimensions error..........
        // toast.error("errrrr1111111");
        toast.error("Select Items with similar dimensions and Material Code");
      } else if (flagArray.sort().reverse()[0] === 2) {
        // material error................
        toast.error("Select Items with similar Material Code");
        // toast.error("errrrr2222222");
      } else {
        toast.error("Uncaught Error Found...");
      }

      // toast.warning("done......");

      // const flag = 0;
      // for (let i = 0; i < selectedTableRows.length; i++) {
      //   const element = selectedTableRows[i];
      //   if (
      //     selectedTableRows[0].DynamicPara1 !== element.DynamicPara1 ||
      //     selectedTableRows[0].DynamicPara2 !== element.DynamicPara2 ||
      //     selectedTableRows[0].Mtrl_Code !== element.Mtrl_Code
      //   ) {
      //     flag = 1;
      //     break;
      //   } else if (selectedTableRows[0].Mtrl_Code !== element.Mtrl_Code) {
      //     flag = 2;
      //     break;
      //   }
      // }
      // if (flag === 1) {
      //   toast.error("Select Items with similar dimensions and Material Code");
      // } else if (flag === 2) {
      //   toast.error("Select Items with similar Material Code");
      // } else if (flag === 0) {
      //   toast.success("good to go............");
      // nav(
      //   "/MaterialManagement/ShoopFloorReturns/PendingList/ResizeAndReturn/MaterialSplitter",
      //   {
      //     state: {
      //       selectedTableRows: selectedTableRows,
      //       type: "storeresize",
      //     },
      //   }
      // );
      // } else {
      //   toast.error("Uncaught Error Found...");
      // }
    }
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const sortedData = () => {
    let dataCopy = [...tabledata];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        if (!parseFloat(a[sortConfig.key]) || !parseFloat(b[sortConfig.key])) {
          // console.log("string");
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        } else {
          // console.log("number");
          if (parseFloat(a[sortConfig.key]) < parseFloat(b[sortConfig.key])) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (parseFloat(a[sortConfig.key]) > parseFloat(b[sortConfig.key])) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }
      });
    }

    return dataCopy;
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div>
        <h4 className="title">Sheet Resize Form</h4>
        <div className="row">
          <div className="d-flex col-md-10">
            <div className="col-md-1">
              <label className="form-label">Customer</label>
            </div>

            {/* <select
            className="ip-select"
            name="customer"
            onChange={changeCustomer}
            // disabled={boolVal1}
          >
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
                onChange={(label) => {
                  if (label.length !== 0) {
                    changeCustomer(label[0].Cust_Code);
                  }
                }}
              />
            </div>
          </div>
          <div className="col-md-1">
            <button
              className="button-style"
              onClick={resizeButton}
              /*onClick={
              () =>
                selectedTableRows.length !== 0
                  ? nav(
                      "/MaterialManagement/ShoopFloorReturns/PendingList/ResizeAndReturn/MaterialSplitter",
                      {
                        state: {
                          selectedTableRows: selectedTableRows,
                          type: "storeresize",
                        },
                      }
                    )
                  : toast.error("Please select the row first")

              // nav(
              //   "/MaterialManagement/StoreManagement/ResizeSheets/MaterialResizeAndSplittingForm"
              // )
            }*/
            >
              Resize
            </button>
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
        <div className="row mt-4">
          <div style={{ maxHeight: "300px", overflow: "auto" }}>
            <Table
              hover
              condensed
              className="table-data border header-class table-striped"
            >
              <thead className="tableHeaderBGColor">
                <tr>
                  <th
                    onClick={() => requestSort("MtrlStockID")}
                    className="cursor"
                  >
                    Mtrl Stock
                    <FaArrowUp
                      className={
                        sortConfig.key === "MtrlStockID"
                          ? sortConfig.direction === "desc"
                            ? "rotateClass"
                            : ""
                          : "displayNoneClass"
                      }
                    />
                  </th>
                  <th
                    onClick={() => requestSort("Mtrl_Code")}
                    className="cursor"
                  >
                    Mtrl Code
                    <FaArrowUp
                      className={
                        sortConfig.key === "Mtrl_Code"
                          ? sortConfig.direction === "desc"
                            ? "rotateClass"
                            : ""
                          : "displayNoneClass"
                      }
                    />
                  </th>
                  <th onClick={() => requestSort("Shape")} className="cursor">
                    Shape
                    <FaArrowUp
                      className={
                        sortConfig.key === "Shape"
                          ? sortConfig.direction === "desc"
                            ? "rotateClass"
                            : ""
                          : "displayNoneClass"
                      }
                    />
                  </th>
                  <th
                    onClick={() => requestSort("DynamicPara1")}
                    className="cursor"
                  >
                    Length
                    <FaArrowUp
                      className={
                        sortConfig.key === "DynamicPara1"
                          ? sortConfig.direction === "desc"
                            ? "rotateClass"
                            : ""
                          : "displayNoneClass"
                      }
                    />
                  </th>
                  <th
                    onClick={() => requestSort("DynamicPara2")}
                    className="cursor"
                  >
                    Width
                    <FaArrowUp
                      className={
                        sortConfig.key === "DynamicPara2"
                          ? sortConfig.direction === "desc"
                            ? "rotateClass"
                            : ""
                          : "displayNoneClass"
                      }
                    />
                  </th>
                  <th onClick={() => requestSort("Weight")} className="cursor">
                    Weight
                    <FaArrowUp
                      className={
                        sortConfig.key === "Weight"
                          ? sortConfig.direction === "desc"
                            ? "rotateClass"
                            : ""
                          : "displayNoneClass"
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData().map((val, key) => (
                  <tr
                    onClick={() => {
                      selectTableRow(val);
                    }}
                    className={
                      selectedTableRows.some(
                        (ele) => ele.MtrlStockID === val.MtrlStockID
                      )
                        ? "rowSelectedClass"
                        : ""
                    }
                  >
                    <td>{val.MtrlStockID}</td>
                    <td>{val.Mtrl_Code}</td>
                    <td>{val.Shape} </td>
                    <td>{val.DynamicPara1} </td>
                    <td>{val.DynamicPara2} </td>
                    <td>{val.Weight} </td>
                  </tr>
                ))}

                {/* {props.firstTableData.map((val, k) => (
            <tr
              onClick={() => props.selectRowFirstFun(val)}
              className={
                val === props.firstTableSelectedRow[0] ? "rowSelectedClass" : ""
              }
            >
              <td>{k + 1}</td>
              <td>{val.RV_No}</td>
              <td>{val.Cust_Docu_No}</td>
              <td>{val.Mtrl_Code}</td>
              <td>{val.DynamicPara1}</td>
              <td>{val.DynamicPara2}</td>
              <td>
                <input
                  type="checkbox"
                  checked={val.Scrap === 0 ? false : true}
                />
              </td>
              <td>{val.Weight}</td>
              <td>{val.ScrapWeight}</td>
              <td>{val.InStock}</td>
              <td>
                <input
                  type="checkbox"
                  name=""
                  id={`checkBoxFirstTable${k}`}
                  onClick={() => firstTableCheckBoxClickFunc(val, k)}
                />
              </td>
            </tr>
          ))} */}
              </tbody>
            </Table>

            {/* <BootstrapTable
            keyField="MtrlStockID"
            columns={columns}
            data={tabledata}
            striped
            hover
            condensed
            selectRow={selectRow}
            headerClasses="header-class tableHeaderBGColor"
          ></BootstrapTable>
          {/* <Table bordered>
            headerClasses="header-class"
          ></BootstrapTable> */}
            {/* <Table bordered>
            <thead
              style={{
                textAlign: "center",
                position: "sticky",
                top: "-1px",
              }}
            >
              <tr>
                <th>Mtrl Stock</th>
                <th>Mtrl Code</th>
                <th>Shape</th>
                <th>Length</th>
                <th>Width</th>
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
                <td>asdfghj</td>
              </tr>
            </tbody>
          </Table> */}
          </div>
        </div>
      </div>
      {/* <button
        onClick={() => {
          setOpen(true);
        }}
      >
        Open modal
      </button> */}

      <ResizeModal
        setOpen={setOpen}
        open={open}
        selectedTableRows={selectedTableRows}
        selectedCust={selectedCust}
        setSelectedTableRows={setSelectedTableRows}
        changeCustomer={changeCustomer}
        // selectedCust={selectedCust}
        //  selectedTableRows,
        // selectedCust: selectedCust,
      />
    </>
  );
}

export default SheetResizeForm;
