import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ModalComp from "./ModalComp";
import Form from "react-bootstrap/Form";
import { getWeight } from "../../../../../utils";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { getRequest, postRequest } from "../../../../api/apiinstance";
import { endpoints } from "../../../../api/constants";
import SplitMaterialYesNoModal from "../../../components/SplitMaterialYesNoModal";

function ResizeReturnModal({
  isOpen,
  onClose,
  secondTableRow,
  setSelectedSecondTableRows,
  tableRefresh,
  type,
  setIsModalOpen,
}) {
  const handleClose = () => {
    setTableData([]);
    setInputData([
      {
        SrlNo: "",
        DynamicPara1: "",
        DynamicPara2: "",
        InStock: "",
        Weight: "",
        Location: "",
      },
    ]);
    setSelectedTableRow([]);

    onClose(false);
  };

  const nav = useNavigate();

  const materialCode = secondTableRow[0]?.Mtrl_Code;
  const quantity = secondTableRow?.length;
  const para1 = secondTableRow[0]?.Para1;
  const para2 = secondTableRow[0]?.Para2;

  // console.log("para1", para1);
  // console.log("para2", para2);

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

  const [inputData, setInputData] = useState({
    SrlNo: "",
    DynamicPara1: "",
    DynamicPara2: "",
    InStock: "",
    Weight: "",
    Location: "",
  });
  let [locationData, setLocationData] = useState([]);
  const [showYesNo, setShowYesNo] = useState(false);
  const [isPara2Enabled, setIsPara2Enabled] = useState(false);
  const [quantityEnabled, setQuantityEnabled] = useState(false);

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
      DynamicPara1: 0,
      DynamicPara2: 0,
      InStock: "",
      Weight: "",
      Location: "",
      // MtrlStock_ID: counter,
    };

    setTableData([...tableData, newRow]);
  };

  // console.log("1st Table Data", tableData);

  const selectRow = (val, key) => {
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

  const changeHandler = (e) => {
    const { value, name } = e.target;

    if (name === "DynamicPara1") {
      if (value > 10) {
        setIsPara2Enabled(true);
      } else {
        setIsPara2Enabled(false);
      }
    }

    if (name === "DynamicPara2") {
      if (value > 10) {
        setQuantityEnabled(true);
      } else {
        setQuantityEnabled(false);
      }
    }

    for (let i = 0; i < tableData.length; i++) {
      const element = tableData[i];

      if (i === selectedTableRow[0].SrlNo - 1) {
        tableData[i][name] = value;

        const percentage =
          (parseFloat(tableData[i].DynamicPara1) *
            parseFloat(tableData[i].DynamicPara2) *
            parseFloat(tableData[i].InStock)) /
          (parseFloat(para1) * parseFloat(para2));

        let weightCalculated =
          parseFloat(secondTableRow[0]?.Weight) * percentage;

        if (weightCalculated >= 0) {
          tableData[i].Weight = weightCalculated.toFixed(2);
        } else {
          tableData[i].Weight = 0.0;
        }

        setTableData(tableData);
      } else {
        setTableData(tableData);
      }
    }

    setInputData((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  const focusOutEvent = (e) => {
    const { value, name } = e.target;

    if (value <= 10) {
      toast.error("Value should be more than 10 mm");
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

  const splitMaterialButton = () => {
    let SheetArea = para1 * para2;

    var totalSplitArea = 0;
    for (let i = 0; i < tableData.length; i++) {
      totalSplitArea +=
        tableData[i].DynamicPara1 *
        tableData[i].DynamicPara2 *
        tableData[i].InStock;
    }

    if (SheetArea !== totalSplitArea) {
      toast.error("Split Sheet area does not add up to original sheet area");
    } else {
      for (let i = 0; i < tableData.length; i++) {
        if (
          tableData[i].DynamicPara1 < 10 ||
          tableData[i].DynamicPara2 < 10 ||
          tableData[i].InStock < 1
        ) {
          toast.error("Check Parameters for Resizing");
        } else if (tableData[i].Location.length === 0) {
          toast.error("Select Location for Resized Sheets");
        } else {
          //get mtrl_data by mtrl_code
          let url = endpoints.getRowByMtrlCode + "?code=" + materialCode;
          getRequest(url, async (data) => {
            let totwt = 0;
            totwt = getWeight(
              data,
              parseFloat(tableData[i].DynamicPara1),
              parseFloat(tableData[i].DynamicPara2),
              parseFloat(0)
            );

            tableData[i].Weight = Math.round(0.000001 * totwt);
          });
          setShowYesNo(true);
        }
      }
    }
  };

  // const modalYesNoResponse = (msg) => {
  //   // console.log("msg = ", msg);
  //   if (msg == "yes") {
  //     for (let i = 0; i < secondTableRow?.length; i++) {
  //       const element0 = secondTableRow[i];
  //       let counter = 1;

  //       for (let j = 0; j < tableData.length; j++) {
  //         const element1 = tableData[j];

  //         for (let k = 1; k < parseInt(element1.InStock) + 1; k++) {
  //           let urlGet =
  //             endpoints.getDataByMtrlStockIdResize +
  //             "?MtrlStockID=" +
  //             element0.MtrlStockID;
  //           getRequest(urlGet, async (selectData) => {
  //             if (selectData.length > 0) {
  //               let paraData3 = {
  //                 MtrlStockID: `${element0.MtrlStockID}/P${counter}`,
  //                 MtrlStockIDOld: element0.MtrlStockID,

  //                 Mtrl_Rv_id: selectData[0].Mtrl_Rv_id,
  //                 Cust_Code: selectData[0].Cust_Code,
  //                 Customer: selectData[0].Customer,
  //                 RV_No: selectData[0].RV_No,
  //                 Cust_Docu_No: null,
  //                 Mtrl_Code: selectData[0].Mtrl_Code,
  //                 Shape: selectData[0].Shape,
  //                 Material: selectData[0].Material,
  //                 DynamicPara1: element1.DynamicPara1,
  //                 DynamicPara2: element1.DynamicPara2,
  //                 DynamicPara3: 0,
  //                 DynamicPara4: 0,
  //                 Locked: 0,
  //                 Scrap: 0,
  //                 Issue: 1,
  //                 Weight: element1.Weight,
  //                 ScrapWeight: selectData[0].ScrapWeight,
  //                 IV_No: selectData[0].IV_No,
  //                 NCProgramNo: null,
  //                 LocationNo: element1.Location,
  //               };

  //               postRequest(
  //                 endpoints.insertByMtrlStockIDResize,
  //                 paraData3,
  //                 (data) => {
  //                   if (data.affectedRows > 0) {
  //                     // flagTest.push(1);
  //                     // setFlagTest([...flagTest, 1]);
  //                     // console.log("test...");
  //                   }
  //                   // console.log("inserted stock list.....", flagTest);
  //                 }
  //               );

  //               counter = counter + 1;
  //             } else {
  //               toast.error("unaught error");
  //             }
  //           });
  //         }
  //       }
  //     }

  //     for (let j = 0; j < secondTableRow?.length; j++) {
  //       const element = secondTableRow[j];

  //       let paraData3 = {
  //         LocationNo: "ScrapYard",
  //         MtrlStockID: element.MtrlStockID,
  //       };
  //       postRequest(endpoints.updateMtrlStockLock3, paraData3, (data) => {
  //         if (data.affectedRows > 0) {
  //           // flagTest.push(2);
  //           // setFlagTest([...flagTest, 2]);
  //         }
  //       });

  //       tableRefresh();
  //     }

  //     toast.success("Resize Successfull");

  //     // new
  //     // setTimeout(() => {
  //     //   nav("/MaterialManagement/ShopFloorReturns/PendingList");
  //     // }, 500);
  //   }
  // };

  const modalYesNoResponse = (msg) => {
    // console.log("msg = ", msg);
    if (msg == "yes") {
      if (type == "return") {
        for (let i = 0; i < secondTableRow?.length; i++) {
          if (secondTableRow[i].Rejected === 1) {
            //return the sheet
            let paraData1 = {
              id: secondTableRow[i].IssueID,
            };
            postRequest(
              endpoints.updateShopfloorMaterialIssueRegisterQtyReturnedAddOne,
              paraData1,
              (data) => {
                // console.log("rejected : updated shopfloorregisterqtyreturned");
              }
            );

            //Set issued less by one
            let paraData2 = {
              Id: secondTableRow[i].NcID,
              Qty: 1,
            };
            postRequest(
              endpoints.updateQtyAllotedncprograms,
              paraData2,
              (data) => {
                // console.log("rejected : updated qtyallotted ncprograms");
              }
            );
          }
          if (secondTableRow[i].Used === 1) {
            //return the sheet
            let paraData1 = {
              id: secondTableRow[i].IssueID,
            };
            postRequest(
              endpoints.updateShopfloorMaterialIssueRegisterQtyReturnedAddOne,
              paraData1,
              (data) => {
                // console.log("used : updated shopfloorregisterqtyreturned");
              }
            );
          }

          //update stock list
          let paraData3 = {
            LocationNo: "ScrapYard",
            MtrlStockID: secondTableRow[i].ShapeMtrlID,
          };
          postRequest(endpoints.updateMtrlStockLock3, paraData3, (data) => {
            // console.log("updated stock list");
          });

          //updatencprogrammtrlallotmentlistReturnStock
          let paraData4 = {
            id: secondTableRow[i].NcPgmMtrlId,
          };
          postRequest(
            endpoints.updatencprogrammtrlallotmentlistReturnStock,
            paraData4,
            (data) => {
              // console.log("updated ncprogrammtrlallotmentreturnstock");
            }
          );
        }

        //insert mtrl stock list
        for (let i = 0; i < tableData.length; i++) {
          let paraData3 = {
            DynamicPara1: tableData[i].DynamicPara1,
            DynamicPara2: tableData[i].DynamicPara2,
            DynamicPara3: 0,
            LocationNo: tableData[i].Location,
            Weight: tableData[i].Weight,
            MtrlStockID: secondTableRow[0].ShapeMtrlID + "/P" + (i + 1),
            MtrlStockIDNew: secondTableRow[0].ShapeMtrlID,
          };
          postRequest(endpoints.insertByMtrlStockID, paraData3, (data) => {
            // console.log("inserted stock list");
          });
        }
        tableRefresh();
        toast.success("Spliting done Successfully");

        setTableData([]);
        setSelectedTableRow([]);
        setInputData({
          SrlNo: "",
          DynamicPara1: "",
          DynamicPara2: "",
          InStock: "",
          Weight: "",
          Location: "",
        });

        setIsModalOpen(false);
      } else if (type == "storeresize") {
        // console.log("secondTableRow........", location?.state?.secondTableRow);
        // console.log("resizeTableData........", tableData);
        // console.log("location data...........", location.state);
        //insert mtrl stock list
        for (let i = 0; i < tableData.length; i++) {
          const element0 = tableData[i];

          // console.log('forrrr111111111..', element0);
          for (let j = 0; j < secondTableRow.length; j++) {
            const element1 = secondTableRow[j];
            // console.log("forrrr111111111..", element0);
            // console.log("forrrr222222222222..", element1);

            // console.log("paraaaaaaaaa.......", paraData3);

            let urlGet =
              endpoints.getDataByMtrlStockIdResize +
              "?MtrlStockID=" +
              element1.MtrlStockID;
            getRequest(urlGet, async (selectData) => {
              // console.log("data from BE selecteData", selectData);

              if (selectData.length > 0) {
                let paraData3 = {
                  MtrlStockID: element1.MtrlStockID + "/P" + (i + 1),
                  MtrlStockIDOld: element1.MtrlStockID,

                  Mtrl_Rv_id: selectData[0].Mtrl_Rv_id,
                  Cust_Code: selectData[0].Cust_Code,
                  Customer: selectData[0].Customer,
                  RV_No: selectData[0].RV_No,
                  Cust_Docu_No: null,
                  Mtrl_Code: selectData[0].Mtrl_Code,
                  Shape: selectData[0].Shape,
                  Material: selectData[0].Material,
                  DynamicPara1: element0.DynamicPara1,
                  DynamicPara2: element0.DynamicPara2,
                  DynamicPara3: 0,
                  DynamicPara4: 0,
                  Locked: 0,
                  Scrap: 0,
                  Issue: 1,
                  Weight: element0.Weight,
                  ScrapWeight: selectData[0].ScrapWeight,
                  IV_No: selectData[0].IV_No,
                  NCProgramNo: null,
                  LocationNo: element0.Location,

                  // DynamicPara1: element0.DynamicPara1,
                  // DynamicPara2: element0.DynamicPara2,
                  // DynamicPara3: 0,
                  // DynamicPara4: 0,
                  // LocationNo: element0.Location,
                  // Weight: element0.Weight,
                  // MtrlStockID: element1.MtrlStockID + "/P" + (i + 1),
                  // MtrlStockIDOld: element1.MtrlStockID,
                };

                // console.log("paraData3...", paraData3);
                postRequest(
                  endpoints.insertByMtrlStockIDResize,
                  paraData3,
                  (data) => {
                    if (data.affectedRows > 0) {
                      // flagTest.push(1);
                      // setFlagTest([...flagTest, 1]);
                      // console.log("test...");
                    }
                    // console.log("inserted stock list.....", flagTest);
                  }
                );
              } else {
                toast.error("unaught error");
              }
            });
          }
        }

        // //update stock list
        // for (let i = 0; i < location?.state?.secondTableRow.length; i++) {
        //   let paraData3 = {
        //     LocationNo: "ScrapYard",
        //     MtrlStockID: location?.state?.secondTableRow[i].ShapeMtrlID,
        //   };
        //   postRequest(endpoints.updateMtrlStockLock3, paraData3, (data) => {
        //     // console.log("updated stock list");
        //   });
        // }

        // update the old mtrl...

        for (let j = 0; j < secondTableRow?.length; j++) {
          const element = secondTableRow[j];

          // console.log("element", element.MtrlStockID);

          let paraData3 = {
            LocationNo: "ScrapYard",
            MtrlStockID: element.MtrlStockID,
          };
          postRequest(endpoints.updateMtrlStockLock3, paraData3, (data) => {
            // console.log("updated stock list", data);
            if (data.affectedRows > 0) {
              // flagTest.push(2);
              // setFlagTest([...flagTest, 2]);
            }
          });
        }

        toast.success("Resize Successfull");
        setTimeout(() => {
          // document.getElementById("result").innerHTML = "Hello, I am here";
          nav("/MaterialManagement/StoreManagement/ResizeSheets");
        }, 500);
        // flagTest.push(5);
        // console.log("flagTest", flagTest.length);
        // if (flagTest.sort().reverse()[0] === 0) {
        //   toast.error("Error while inserting new material");
        // } else if (flagTest.sort().reverse()[0] === 1) {
        //   toast.error("Error while udating the material");
        // } else if (flagTest.sort().reverse()[0] === 2) {
        //   toast.success("Resize Successfull");
        // } else {
        //   toast.error("Uncaught error while updating Material");
        // }
      }
    }
  };

  return (
    <>
      <Modal show={isOpen} onHide={handleClose} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>Magod Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4 className="title">Material Resize and Splitting Form</h4>
          <div>
            <div className="row">
              <div className="d-flex col-md-3">
                <div className="col-md-4">
                  <label className="form-label ">Material Code</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="input-disabled mt-1"
                    name="materialCode"
                    value={materialCode}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-2">
                <div className="col-md-4">
                  <label className="form-label">Quantity</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="input-disabled mt-1"
                    name="quantity"
                    value={quantity}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-2">
                <div className="col-md-3">
                  <label className="form-label">Para 1</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="input-disabled mt-1"
                    name="para1"
                    value={para1}
                    disabled
                  />
                </div>
              </div>

              <div className="d-flex col-md-2">
                <div className="col-md-3">
                  <label className="form-label">Para 2</label>
                </div>
                <div className="col-md-8">
                  <input
                    className="input-disabled mt-1"
                    name="para2"
                    value={para2}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-2 d-flex align-items-center">
                <button
                  className="button-style m-0"
                  onClick={splitMaterialButton}
                >
                  Split Material
                </button>
              </div>

              <div className="col-md-1 d-flex align-items-center">
                <button
                  className="button-style m-0"
                  id="btnclose"
                  type="submit"
                  onClick={handleClose}
                  // onClick={() =>
                  //   nav("/MaterialManagement/ShopFloorReturns/PendingList")
                  // }
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          <div className="row mt-2">
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
                <thead className="text-white">
                  <tr>
                    <th>Location</th>
                    <th>MtrlStock ID</th>
                    {/* <th>DynamicPara1</th> */}
                    {/* <th>DynamicPara2</th> */}
                    <th>DynamicPara1</th>
                    <th>DynamicPara2</th>
                    <th>InStock</th>
                    <th>Weight</th>
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
                      <td>{val.Location}</td>
                      <td>{key + 1}</td>
                      <td>{val.DynamicPara1}</td>
                      <td>{val.DynamicPara2}</td>
                      <td>{val.InStock}</td>
                      <td>{val.Weight}</td>
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
              <div className="row">
                <div className="d-flex justify-content-between">
                  <div className="col-md-3"></div>
                  <button
                    className="button-style m-0"
                    style={{ width: "70px" }}
                    onClick={addNew}
                  >
                    Add New
                  </button>
                  <button
                    className="button-style m-0"
                    style={{ width: "75px" }}
                    onClick={deleteItem}
                    // disabled={selectedTableRow.length === 0}
                  >
                    Delete Item
                  </button>
                </div>
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
                        className="input-disabled mt-1"
                        disabled
                        value={inputData.SrlNo}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="row d-flex align-items-end">
                    <div className="col-md-3 p-0">
                      <label className="form-label">Para 1</label>
                    </div>

                    <div className="col-md-9 p-0">
                      <input
                        type="number"
                        className="input-disabled mt-1"
                        name="DynamicPara1"
                        onChange={changeHandler}
                        value={inputData.DynamicPara1}
                        onBlur={focusOutEvent}
                      />
                    </div>
                  </div>
                </div>{" "}
                <div>
                  <div className="row d-flex align-items-end">
                    <div className="col-md-3 p-0">
                      <label className="form-label">Para 2</label>
                    </div>

                    <div className="col-md-9 p-0">
                      <input
                        type="number"
                        className="input-disabled mt-1"
                        name="DynamicPara2"
                        onChange={changeHandler}
                        value={inputData.DynamicPara2}
                        onBlur={focusOutEvent}
                        disabled={!isPara2Enabled}
                      />
                    </div>
                  </div>
                </div>{" "}
                <div>
                  <div className="row d-flex align-items-end">
                    <div className="col-md-3 p-0">
                      <label className="form-label">Quantity</label>
                    </div>

                    <div className="col-md-9 p-0">
                      <input
                        type="number"
                        className="input-disabled mt-1"
                        name="InStock"
                        onChange={changeHandler}
                        value={inputData.InStock}
                        // onBlur={focusOutEvent}
                        disabled={!quantityEnabled}
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
                        // className="in-field ip-select dropdown-field rounded-0"
                        className="input-disabled mt-1"
                        name="Location"
                        onChange={changeHandler}
                        value={inputData.Location}
                        style={{ width: "278px" }}
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
          <SplitMaterialYesNoModal
            show={showYesNo}
            setShow={setShowYesNo}
            message="Do you wish to split the material as indicated and save it. Changes once done cannot be undone"
            modalResponse={modalYesNoResponse}
          />
        </Modal.Body>
        {/* <Modal.Footer>

          <button
            className="button-style"
            style={{ width: "80px", backgroundColor: "gray" }}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="button-style"
            style={{ width: "80px" }}
            onClick={handleClose}
          >
            Save
          </button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default ResizeReturnModal;
