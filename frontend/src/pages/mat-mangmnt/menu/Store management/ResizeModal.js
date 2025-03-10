import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

import BootstrapTable from "react-bootstrap-table-next";
import { toast } from "react-toastify";
import { getWeight } from "../../../../utils";
import SplitMaterialYesNoModal from "../../components/SplitMaterialYesNoModal";
import { useNavigate, useLocation } from "react-router-dom";
import { getRequest, postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";

export default function ResizeModal(props) {
  const handleClose = () => {
    props.changeCustomer(props.selectedCust);
    setTableData([]);
    setSelectedTableRow([
      {
        SrlNo: "",
        DynamicPara1: "",
        DynamicPara2: "",
        InStock: "",
        Weight: "",
        Location: "",
      },
    ]);

    setLocationData([]);
    setInputData([]);

    props.setOpen(false);
  };
  const nav = useNavigate();
  // const location = useLocation();

  // const [formHeader, setFormHeader] = useState({
  //   materialCode: props?.selectedTableRows[0]?.Mtrl_Code,
  //   quantity: props?.selectedTableRows?.length,
  //   para1: props?.selectedTableRows[0]?.DynamicPara1,
  //   para2: props?.selectedTableRows[0]?.DynamicPara2,
  //   selectedCust: props?.selectedCust,
  // });

  const [tableData, setTableData] = useState([]);
  const [selectedTableRow, setSelectedTableRow] = useState([
    {
      SrlNo: "",
      DynamicPara1: "",
      DynamicPara2: "",
      InStock: "",
      Weight: "",
      Location: "",
    },
  ]);
  let [locationData, setLocationData] = useState([]);

  const [inputData, setInputData] = useState({
    SrlNo: "",
    DynamicPara1: "",
    DynamicPara2: "",
    InStock: "",
    Weight: "",

    Location: "",
  });

  const [showYesNo, setShowYesNo] = useState(false);

  const fetchData = () => {
    getRequest(endpoints.getMaterialLocationList, (data) => {
      setLocationData(data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  const addNew = () => {
    let newRow = {
      DynamicPara1: 100,
      DynamicPara2: 100,
      InStock: "",
      Weight: "",
      Location: "",
      // MtrlStock_ID: counter,
    };
    //setPartArray(newRow);
    setTableData([...tableData, newRow]);
    // setCounter(counter + 1);

    // //clear all data
    // setInputData((preValue) => {
    //   //console.log(preValue)
    //   return {
    //     Location: "",
    //     MtrlStock_ID: counter,
    //     DynamicPara1: "",
    //     DynamicPara2: "",
    //     InStock: "",
    //     Weight: "",
    //   };
    // });
  };

  const selectRow = (val, key) => {
    // mode: "radio",
    // clickToSelect: true,
    // bgColor: "#98A8F8",
    // onSelect: (row, isSelect, rowIndex, e) => {
    setSelectedTableRow([
      {
        SrlNo: key,
        DynamicPara1: val.DynamicPara1,
        DynamicPara2: val.DynamicPara2,
        InStock: val.InStock,
        Weight: "",

        Location: val.Location,
      },
    ]);

    setInputData({});
    setInputData({
      SrlNo: key,
      DynamicPara1: val.DynamicPara1,
      DynamicPara2: val.DynamicPara2,
      InStock: val.InStock,
      Weight: "",

      Location: val.Location,
    });

    // },
  };

  const focusOutEvent = (e) => {
    const { value, name } = e.target;
    if (value < 10) {
      toast.error("Value should be more than 10 mm");
    }
  };
  const changeHandler = (e) => {
    const { value, name } = e.target;

    for (let i = 0; i < tableData.length; i++) {
      const element = tableData[i];

      // console.log(
      //   "formaheader.........",
      //   "para1...",
      //   formHeader.para1,
      //   "para2...",
      //   formHeader.para2,
      //   "amount...",

      //   parseFloat(formHeader.para1) * parseFloat(formHeader.para2)
      // );
      // console.log("element", element);

      if (i === selectedTableRow[0].SrlNo - 1) {
        // console.log("yesss");

        tableData[i][name] = value;
        // setTableData(tableData);

        // InStock
        // DynamicPara2
        // DynamicPara1
        // console.log(
        //   "selectedRow...",
        //   "length...",
        //   tableData[i].DynamicPara1,
        //   "width...",
        //   tableData[i].DynamicPara2,
        //   "quantity...",
        //   tableData[i].InStock
        // );
        // console.log(
        //   "amount...",
        //   tableData[i].DynamicPara1 *
        //     tableData[i].DynamicPara2 *
        //     tableData[i].InStock
        // );

        const percentage =
          (parseFloat(tableData[i].DynamicPara1) *
            parseFloat(tableData[i].DynamicPara2) *
            parseFloat(tableData[i].InStock)) /
          (parseFloat(props?.selectedTableRows[0]?.DynamicPara1) *
            parseFloat(props?.selectedTableRows[0]?.DynamicPara2));

        let weightCalculated =
          parseFloat(props?.selectedTableRows[0].Weight) * percentage;
        // console.log(
        //   "get weight...",
        //   getWeight(
        //     data,
        //     parseFloat(tableData[i].DynamicPara1),
        //     parseFloat(tableData[i].DynamicPara2),
        //     parseFloat(0)
        //   )
        // );

        if (weightCalculated >= 0) {
          tableData[i].Weight = weightCalculated.toFixed(3);
        } else {
          tableData[i].Weight = 0.0;
        }
        // weightCalculated >= 0 ? (tableData[i].Weight = weightCalculated) : "";

        setTableData(tableData);

        // let url =
        //   endpoints.getRowByMtrlCode + "?code=" + formHeader.materialCode;
        // getRequest(url, async (data) => {
        //   let totwt = 0;
        //   totwt = getWeight(
        //     data,
        //     parseFloat(tableData[i].DynamicPara1),
        //     parseFloat(tableData[i].DynamicPara2),
        //     parseFloat(0)
        //   );
        //   console.log("totwt", Math.round(0.000001 * totwt));
        // tableData[i].Weight = Math.round(0.000001 * totwt);
        // setShowYesNo(true);
        // });
      } else {
        // console.log("nooooo");
        setTableData(tableData);

        // setTableData(tableData)
      }
    }
    // console.log("tableData", tableData);
    // console.log(
    //   "value..",
    //   value,
    //   "name..",
    //   name,
    //   "srl",
    //   selectedTableRow[0].SrlNo
    // );

    // const newArray =

    // tableData.map((p, i) =>
    //   i === selectedTableRow[0].SrlNo - 1
    //     ?
    //     // p[name] :value

    //     return [{
    //       ...p,
    //       [name]: value,
    //     }]
    //     console.log("yesssssss", p)
    //     :

    //     // null
    //     console.log("no")
    // );
    // console.log("val.p", p)

    setInputData((preValue) => {
      //console.log(preValue)
      return {
        ...preValue,
        [name]: value,
      };
    });

    // console.log(newArray);
    // // setTableData(newArray);
  };

  const splitMaterialButton = () => {
    let SheetArea =
      parseFloat(props?.selectedTableRows[0]?.DynamicPara1) *
      parseFloat(props?.selectedTableRows[0]?.DynamicPara2);

    var totalSplitArea = 0;
    for (let i = 0; i < tableData.length; i++) {
      totalSplitArea +=
        tableData[i].DynamicPara1 *
        tableData[i].DynamicPara2 *
        tableData[i].InStock;
      // console.log(`totalSplitArea +${i + 1}`, totalSplitArea);
    }

    // console.log("SheetArea", SheetArea);
    // console.log("new", totalSplitArea);
    if (SheetArea !== totalSplitArea) {
      toast.error("Split Sheet area does not add up to original sheet area");
    } else {
      const tesFlagArray = [];
      for (let i = 0; i < tableData.length; i++) {
        if (
          tableData[i].DynamicPara1 < 10 ||
          tableData[i].DynamicPara2 < 10 ||
          tableData[i].InStock < 1
        ) {
          tesFlagArray.push(1);
          // toast.error("Check Parameters for Resizing");
          // break;
        } else if (tableData[i].Location.length === 0) {
          tesFlagArray.push(2);

          // toast.error("Select Location for Resized Sheets");
          // break;
        } else {
          tesFlagArray.push(3);

          // setShowYesNo(true);
          //get mtrl_data by mtrl_code
          // let url =
          //   endpoints.getRowByMtrlCode + "?code=" + formHeader.materialCode;
          // getRequest(url, async (data) => {
          //   let totwt = 0;
          //   totwt = getWeight(
          //     data,
          //     parseFloat(tableData[i].DynamicPara1),
          //     parseFloat(tableData[i].DynamicPara2),
          //     parseFloat(0)
          //   );

          //   tableData[i].Weight = Math.round(0.000001 * totwt);
          //   setShowYesNo(true);
          // });
        }
      }
      /*If MsgBox("Do you wish to split the material as indicated and save it. Changes once done cannot be undone", MsgBoxStyle.YesNo) = MsgBoxResult.No Then
        Exit Sub
    End If*/
      // console.log("tesFlagArray", tesFlagArray);
      if (tesFlagArray.sort()[0] === 1) {
        toast.error("Check Parameters for Resizing");
      } else if (tesFlagArray.sort()[0] === 2) {
        toast.error("Select Location for Resized Sheets");
      } else if (tesFlagArray.sort()[0] === 3) {
        setShowYesNo(true);
      } else {
        toast.error("Uncaught Error");
      }
    }
    // console.log("clicked");
  };

  const modalYesNoResponse = (msg) => {
    if (msg == "yes") {
      //insert mtrl stock list
      for (let i = 0; i < props?.selectedTableRows.length; i++) {
        const element0 = props?.selectedTableRows[i];
        let counter = 1;
        for (let j = 0; j < tableData.length; j++) {
          const element1 = tableData[j];

          for (let k = 1; k < parseInt(element1.InStock) + 1; k++) {
            // new....

            let urlGet =
              endpoints.getDataByMtrlStockIdResize +
              "?MtrlStockID=" +
              element0.MtrlStockID;
            getRequest(urlGet, async (selectData) => {
              // console.log("data from BE selecteData", selectData);

              if (selectData.length > 0) {
                let paraData3 = {
                  MtrlStockID: `${element0.MtrlStockID}/P${counter}`,
                  MtrlStockIDOld: element0.MtrlStockID,
                  Mtrl_Rv_id: selectData[0].Mtrl_Rv_id,
                  Cust_Code: selectData[0].Cust_Code,
                  Customer: selectData[0].Customer,
                  RV_No: selectData[0].RV_No,
                  Cust_Docu_No: null,
                  Mtrl_Code: selectData[0].Mtrl_Code,
                  Shape: selectData[0].Shape,
                  Material: selectData[0].Material,
                  DynamicPara1: element1.DynamicPara1,
                  DynamicPara2: element1.DynamicPara2,
                  DynamicPara3: element1.DynamicPara3 || 0,
                  DynamicPara4: 0,
                  Locked: 0,
                  Scrap: 0,
                  Issue: 0,
                  Weight: (
                    parseFloat(element1.Weight) /
                    parseInt(element1.InStock || 1)
                  ).toFixed(3),
                  ScrapWeight: selectData[0].ScrapWeight,
                  IV_No: selectData[0].IV_No,
                  NCProgramNo: null,
                  LocationNo: element1.Location,
                };

                postRequest(
                  endpoints.insertByMtrlStockIDResize,
                  paraData3,
                  (data) => {
                    if (data.affectedRows > 0) {
                    }
                  }
                );

                counter = counter + 1;
              } else {
                toast.error("unaught error");
              }
            });
          }
        }
      }

      // new
      for (let j = 0; j < props?.selectedTableRows.length; j++) {
        const element = props?.selectedTableRows[j];
        let paraData3 = {
          LocationNo: "ScrapYard",
          MtrlStockID: element.MtrlStockID,
        };
        postRequest(endpoints.updateMtrlStockLock3, paraData3, (data) => {
          if (data.affectedRows > 0) {
          }
        });
      }

      toast.success("Resize Successfull");
      // new
      props.setSelectedTableRows([]);

      setTimeout(() => {
        props.changeCustomer(props.selectedCust);
        handleClose();
      }, 300);
    }
  };

  const deleteItem = () => {
    // console.log("delete clicked...");
    // console.log("selectedTableRow", selectedTableRow);
    // console.log(
    //   "tableData",
    //   tableData[parseInt(selectedTableRow[0].SrlNo) - 1]
    // );

    // const newArray = tableData.filter(
    //   (p) => p.MtrlStock_ID !== selectedRow.srlNo
    // );

    const newArray = [];
    for (let i = 0; i < tableData.length; i++) {
      const element = tableData[i];

      if (i !== parseInt(selectedTableRow[0].SrlNo - 1)) {
        // console.log(`table data... ${i + 1}`, tableData);

        newArray.push(element);
      }
    }
    // console.log("newArray", newArray);
    setTableData(newArray);
    setSelectedTableRow([]);
    setInputData({
      SrlNo: "",
      DynamicPara1: "",
      DynamicPara2: "",
      InStock: "",
      Weight: "",

      Location: "",
    });
  };

  const numbValidations = (e) => {
    if (
      e.which === 38 ||
      e.which === 40 ||
      ["e", "E", "+", "-"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <>
      <Modal show={props.open} fullscreen={true} onHide={() => handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>Resize Sheets </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h4 className="title">Material Resize and Splitting Form </h4>
            <div>
              <div className="row">
                <div className="d-flex col-md-2 " style={{ gap: "10px" }}>
                  <label
                    className="form-label "
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Material Code
                  </label>
                  <input
                    className="form-label mt-1"
                    name="materialCode"
                    value={props?.selectedTableRows[0]?.Mtrl_Code}
                    disabled
                  />
                </div>

                <div className="d-flex col-md-2" style={{ gap: "10px" }}>
                  <label
                    className="form-label "
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Quantity
                  </label>
                  <input
                    className="form-label mt-1"
                    name="quantity"
                    value={props?.selectedTableRows?.length}
                    disabled
                  />
                </div>

                <div className="d-flex col-md-2" style={{ gap: "10px" }}>
                  <label
                    className="form-label "
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Para1
                  </label>
                  <input
                    className="form-label mt-1"
                    name="para1"
                    value={props?.selectedTableRows[0]?.DynamicPara1}
                    disabled
                  />
                </div>
                <div className=" d-flex col-md-2" style={{ gap: "10px" }}>
                  <label
                    className="form-label "
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Para2
                  </label>
                  <input
                    className="form-label mt-1"
                    name="para2"
                    value={props?.selectedTableRows[0]?.DynamicPara2}
                    disabled
                  />
                </div>

                <div className="col-md-3 d-flex " style={{ gap: "20px" }}>
                  <button
                    className="button-style m-0"
                    onClick={splitMaterialButton}
                  >
                    Split Material
                  </button>

                  <button
                    className="button-style m-0"
                    id="btnclose"
                    type="submit"
                    onClick={() => nav("/MaterialManagement")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>

            <div className="p-2"></div>

            <div className="row">
              {/* table */}
              <div
                className="col-md-8"
                style={{
                  maxHeight: "350px",
                  overflow: "auto",
                }}
              >
                <Table
                  hover
                  condensed
                  className="table-data border header-class table-striped"
                >
                  <thead className="tableHeaderBGColor">
                    <tr>
                      <th>SL No</th>
                      <th>DynamicPara1</th>
                      <th>DynamicPara2</th>
                      <th>Quantity</th>
                      <th>Weight</th>
                      <th>Location</th>
                    </tr>
                  </thead>

                  <tbody>
                    {tableData.map((val, key) => (
                      <tr
                        onClick={() => {
                          selectRow(val, key + 1);
                        }}
                        className={
                          selectedTableRow?.some(
                            (el) => parseInt(el.SrlNo) === parseInt(key + 1)
                          )
                            ? "rowSelectedClass"
                            : ""
                        }
                      >
                        <td>{key + 1}</td>
                        <td>{val.DynamicPara1}</td>
                        <td>{val.DynamicPara2}</td>
                        <td>{val.InStock}</td>
                        <td>{val.Weight}</td>
                        <td>{val.Location}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              {/* form */}
              <div
                className="col-md-4 p-3"
                style={{ backgroundColor: "#e6e6e6" }}
              >
                <div
                  className="d-flex justify-content-center"
                  style={{ gap: "15px" }}
                >
                  <button className="button-style m-0" onClick={addNew}>
                    Add
                  </button>
                  <button
                    className="button-style m-0"
                    onClick={deleteItem}
                    disabled={selectedTableRow.length === 0}
                  >
                    Delete
                  </button>
                </div>

                <div className="row">
                  <div>
                    <div className="row d-flex align-items-end">
                      <div className="col-md-3 p-0">
                        <label className="form-label">SL No</label>
                      </div>

                      <div className="col-md-9 p-0">
                        <input
                          type="text"
                          className="in-field rounded-0"
                          disabled
                          value={inputData.SrlNo}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="row d-flex align-items-end">
                      <div className="col-md-3 p-0">
                        <label className="form-label">Para1</label>
                      </div>

                      <div className="col-md-9 p-0">
                        <input
                          type="number"
                          className="in-field rounded-0"
                          name="DynamicPara1"
                          value={inputData.DynamicPara1}
                          onKeyDown={numbValidations}
                          onChange={(e) => {
                            if (
                              e.target.value === "" ||
                              parseInt(e.target.value) === "NaN" ||
                              parseInt(e.target.value) === NaN
                            ) {
                              e.target.value = 0;
                            }

                            e.target.value = e.target.value.replace(
                              /(\.\d{2})\d+/,
                              "$1"
                            );

                            if (parseInt(e.target.value) < 0) {
                              e.target.value = parseInt(e.target.value) * -1;
                              toast.warning("Para1 can't be negative");
                            }

                            changeHandler(e);
                          }}
                          onBlur={focusOutEvent}
                          disabled={selectedTableRow.length === 0}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="row d-flex align-items-end">
                      <div className="col-md-3 p-0">
                        <label className="form-label">Para2</label>
                      </div>

                      <div className="col-md-9 p-0">
                        <input
                          type="number"
                          className="in-field rounded-0"
                          name="DynamicPara2"
                          value={inputData.DynamicPara2}
                          onKeyDown={numbValidations}
                          onChange={(e) => {
                            if (
                              e.target.value === "" ||
                              parseInt(e.target.value) === "NaN" ||
                              parseInt(e.target.value) === NaN
                            ) {
                              e.target.value = 0;
                            }

                            e.target.value = e.target.value.replace(
                              /(\.\d{2})\d+/,
                              "$1"
                            );

                            if (parseInt(e.target.value) < 0) {
                              e.target.value = parseInt(e.target.value) * -1;
                              toast.warning("Para2 can't be negative");
                            }

                            changeHandler(e);
                          }}
                          onBlur={focusOutEvent}
                          disabled={selectedTableRow.length === 0}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="row d-flex align-items-end">
                      <div className="col-md-3 p-0">
                        <label className="form-label">Quantity</label>
                      </div>

                      <div className="col-md-9 p-0">
                        <input
                          type="number"
                          className="in-field rounded-0"
                          name="InStock"
                          value={inputData.InStock}
                          onKeyDown={numbValidations}
                          onChange={(e) => {
                            if (
                              e.target.value === "" ||
                              parseInt(e.target.value) === "NaN" ||
                              parseInt(e.target.value) === NaN
                            ) {
                              e.target.value = 0;
                            }

                            e.target.value = e.target.value.replace(
                              /(\.\d{2})\d+/,
                              "$1"
                            );

                            if (parseInt(e.target.value) < 0) {
                              e.target.value = parseInt(e.target.value) * -1;
                              toast.warning("Quantity can't be negative");
                            }

                            changeHandler(e);
                          }}
                          disabled={selectedTableRow.length === 0}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="row d-flex align-items-end">
                      <div className="col-md-3 p-0">
                        <label className="form-label">Location</label>
                      </div>

                      <div className="col-md-9 p-0">
                        <select
                          className="in-field ip-select dropdown-field rounded-0"
                          name="Location"
                          onChange={changeHandler}
                          value={inputData.Location}
                          disabled={selectedTableRow.length === 0}
                        >
                          <option value="" disabled selected hidden>
                            Select Location
                          </option>
                          {locationData.map((location, index) => (
                            <option key={index} value={location.LocationNo}>
                              {location.LocationNo}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <SplitMaterialYesNoModal
        show={showYesNo}
        setShow={setShowYesNo}
        message="Do you wish to split the material as indicated and save it. Changes once done cannot be undone"
        modalResponse={modalYesNoResponse}
      />
    </>
  );
}
