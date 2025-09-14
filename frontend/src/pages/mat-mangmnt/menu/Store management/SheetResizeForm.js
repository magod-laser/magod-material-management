import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import ResizeModal from "./ResizeModal";
import { FaArrowUp } from "react-icons/fa";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function SheetResizeForm() {
  const nav = useNavigate();
  const location = useLocation();

  const state = location.state;
  const [open, setOpen] = useState(false);

  let [custdata, setCustdata] = useState([]);
  let [tabledata, setTabledata] = useState([]);
  let [selectedTableRows, setSelectedTableRows] = useState([]);
  const [selectedCust, setSelectedCust] = useState();

  // Fetch all customers
  async function fetchData() {
    getRequest(endpoints.getCustomers, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch and update material stock list for the selected customer
  const changeCustomer = (custCode) => {
    let url1 = endpoints.getResizeMtrlStockList + "?code=" + custCode;

    getRequest(url1, (data) => {
      setSelectedTableRows([]);

      if (data.length <= 0) {
        toast.warning("No data found for selected customer.");
      }
      setTabledata(data);

      setSelectedCust(custCode);
    });
  };

  // Toggle table row selection (add/remove row from selected rows)
  const selectTableRow = (row) => {
    const found = selectedTableRows.some((obj) => {
      return obj.MtrlStockID === row.MtrlStockID;
    });

    if (found) {
      setSelectedTableRows(
        selectedTableRows.filter((obj) => {
          return obj.MtrlStockID !== row.MtrlStockID;
        })
      );
    } else {
      setSelectedTableRows([...selectedTableRows, row]);
    }
  };

  // Validate selected rows for resizing before opening dialog
  const resizeButton = () => {
    if (selectedTableRows.length === 0) {
      toast.error("Please select the row first");
    } else {
      const flagArray = [];
      for (let i = 0; i < selectedTableRows.length; i++) {
        const element = selectedTableRows[i];

        if (
          selectedTableRows[0].DynamicPara1 !== element.DynamicPara1 ||
          selectedTableRows[0].DynamicPara2 !== element.DynamicPara2 ||
          selectedTableRows[0].Mtrl_Code !== element.Mtrl_Code
        ) {
          flagArray.push(1);
        } else if (selectedTableRows[0].Mtrl_Code !== element.Mtrl_Code) {
          flagArray.push(2);
        } else {
          flagArray.push(0);
        }
      }

      if (flagArray.sort().reverse()[0] === 0) {
        setOpen(true);
      } else if (flagArray.sort().reverse()[0] === 1) {
        toast.error("Select Items with similar dimensions and Material Code");
      } else if (flagArray.sort().reverse()[0] === 2) {
        toast.error("Select Items with similar Material Code");
      } else {
        toast.error("Uncaught Error Found...");
      }
    }
  };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Return sorted table data based on current sort config
  const sortedData = () => {
    let dataCopy = [...tabledata];

    if (sortConfig.key) {
      dataCopy.sort((a, b) => {
        if (!parseFloat(a[sortConfig.key]) || !parseFloat(b[sortConfig.key])) {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        } else {
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

  // Update sort configuration (toggle between ascending/descending)
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
            <button className="button-style" onClick={resizeButton}>
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
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <ResizeModal
        setOpen={setOpen}
        open={open}
        selectedTableRows={selectedTableRows}
        selectedCust={selectedCust}
        setSelectedTableRows={setSelectedTableRows}
        changeCustomer={changeCustomer}
      />
    </>
  );
}

export default SheetResizeForm;
