import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import BootstrapTable from "react-bootstrap-table-next";
import { toast } from "react-toastify";
// import YesNoModal from "../../../components/YesNoModal";
import { getWeight } from "../../../../utils";
import SplitMaterialYesNoModal from "../../components/SplitMaterialYesNoModal";
import { useNavigate, useLocation } from "react-router-dom";
import { getRequest, postRequest } from "../../../api/apiinstance";
import { endpoints } from "../../../api/constants";

export default function ResizeAndSplittingStoreManagement() {
  const nav = useNavigate();
  const location = useLocation();

  const [formHeader, setFormHeader] = useState({
    materialCode: location?.state?.selectedTableRows[0].Mtrl_Code,
    quantity: location?.state?.selectedTableRows.length,
    para1: location?.state?.selectedTableRows[0].DynamicPara1,
    para2: location?.state?.selectedTableRows[0].DynamicPara2,
    selectedCust: location?.state?.selectedCust,
  });

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

  // console.log("location", location?.state?.selectedTableRows[0].Weight);

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
          (parseFloat(formHeader.para1) * parseFloat(formHeader.para2));

        let weightCalculated =
          parseFloat(location?.state?.selectedTableRows[0].Weight) * percentage;
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
          tableData[i].Weight = weightCalculated.toFixed(2);
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
    let SheetArea = formHeader.para1 * formHeader.para2;

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
          setShowYesNo(true);
        }
      }
      /*If MsgBox("Do you wish to split the material as indicated and save it. Changes once done cannot be undone", MsgBoxStyle.YesNo) = MsgBoxResult.No Then
        Exit Sub
    End If*/
    }
    // console.log("clicked");
  };

  const modalYesNoResponse = (msg) => {
    // console.log("msg = ", msg);
    if (msg == "yes") {
      // console.log("selectedTableRows........", location?.state?.selectedTableRows);
      // console.log("resizeTableData........", tableData);
      // console.log("location data...........", location.state);
      //insert mtrl stock list
      for (let i = 0; i < location?.state?.selectedTableRows.length; i++) {
        const element0 = location?.state?.selectedTableRows[i];
        let counter = 1;

        // console.log("forrrr111111111..", element0);
        for (let j = 0; j < tableData.length; j++) {
          const element1 = tableData[j];
          // console.log("forrrr111111111..", element0);
          // console.log("forrrr222222222222..", element1);

          // console.log("paraaaaaaaaa.......", paraData3);

          for (let k = 1; k < parseInt(element1.InStock) + 1; k++) {
            // console.log(
            //   `meterial + ${i + 1} ...... quantity + ${
            //     element1.InStock
            //   }........ counter number + ${counter}`
            // );

            // console.log(
            //   `meterial + ${i + 1} ...... quantity + ${
            //     element1.InStock
            //   }........ counter number + ${counter}`
            // );
            // counter = counter + 1;
            // new....

            // const element = array[k];

            let urlGet =
              endpoints.getDataByMtrlStockIdResize +
              "?MtrlStockID=" +
              element0.MtrlStockID;
            getRequest(urlGet, async (selectData) => {
              // console.log("data from BE selecteData", selectData);

              if (selectData.length > 0) {
                let paraData3 = {
                  MtrlStockID: `${element0.MtrlStockID}/P${counter}`,
                  // element0.MtrlStockID + "/P" + counter,
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
                  DynamicPara3: 0,
                  DynamicPara4: 0,
                  Locked: 0,
                  Scrap: 0,
                  Issue: 1,
                  Weight: element1.Weight,
                  ScrapWeight: selectData[0].ScrapWeight,
                  IV_No: selectData[0].IV_No,
                  NCProgramNo: null,
                  LocationNo: element1.Location,

                  // DynamicPara1: element0.DynamicPara1,
                  // DynamicPara2: element0.DynamicPara2,
                  // DynamicPara3: 0,
                  // DynamicPara4: 0,
                  // LocationNo: element0.Location,
                  // Weight: element0.Weight,
                  // MtrlStockID: element1.MtrlStockID + "/P" + (i + 1),
                  // MtrlStockIDOld: element1.MtrlStockID,
                };

                // console.log(
                //   `meterial + ${i + 1} ...... quantity + ${
                //     element1.InStock
                //   }........ counter number + ${counter}`
                // );

                // console.log("paraData...", paraData3);

                // new

                // console.log(
                //   `meterial + ${i + 1} ...... quantity + ${
                //     element1.InStock
                //   }........ counter number + ${counter}`
                // );

                // console.log(
                //   `material... + ${i + 1}, quantity... ${
                //     element1.InStock
                //   }, counter.... ${counter}`
                // );

                // console.log("paraa", paraData3);
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

                counter = counter + 1;
              } else {
                toast.error("unaught error");
              }
            });
          }
        }
      }

      // //update stock list
      // for (let i = 0; i < location?.state?.selectedTableRows.length; i++) {
      //   let paraData3 = {
      //     LocationNo: "ScrapYard",
      //     MtrlStockID: location?.state?.selectedTableRows[i].ShapeMtrlID,
      //   };
      //   postRequest(endpoints.updateMtrlStockLock3, paraData3, (data) => {
      //     // console.log("updated stock list");
      //   });
      // }

      // update the old mtrl...

      // new
      for (let j = 0; j < location?.state?.selectedTableRows.length; j++) {
        const element = location?.state?.selectedTableRows[j];

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
      // new
      setTimeout(() => {
        // document.getElementById("result").innerHTML = "Hello, I am here";
        nav("/MaterialManagement/StoreManagement/ResizeSheets", {
          state: {
            selectedCust: formHeader.selectedCust,
            // type: "storeresize",
          },
        });
      }, 500);

      //
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

  // console.log("selectedCust", formHeader.selectedCust);

  return (
    <>
      <SplitMaterialYesNoModal
        show={showYesNo}
        setShow={setShowYesNo}
        message="Do you wish to split the material as indicated and save it. Changes once done cannot be undone"
        modalResponse={modalYesNoResponse}
      />
      <h4 className="title">Material Resize and Splitting Form</h4>

      <div>
        <div className="row">
          <div className="col-md-10">
            <label className="form-label">Material Code</label>
            <input
              className="form-label"
              name="materialCode"
              value={formHeader.materialCode}
              disabled
            />
          </div>

          <div className="col-md-2 d-flex align-items-center">
            <button className="button-style m-0" onClick={splitMaterialButton}>
              Split Material
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-md-10 p-0">
            <div className="row">
              <div className="col-md-4">
                <label className="form-label">Quantity</label>
                <input
                  className="form-label"
                  name="quantity"
                  value={formHeader.quantity}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Length</label>
                <input
                  className="form-label"
                  name="para1"
                  value={formHeader.para1}
                  disabled
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Width</label>
                <input
                  className="form-label"
                  name="para2"
                  value={formHeader.para2}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="col-md-2 d-flex align-items-center">
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
            <thead className="text-white">
              <tr>
                <th>SL No</th>
                <th>Length</th>
                <th>Width</th>
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
                      // &&
                      // parseInt(el.DynamicPara1) ===
                      //   parseInt(val.DynamicPara1) &&
                      // parseInt(el.DynamicPara2) ===
                      //   parseInt(val.DynamicPara2) &&
                      // parseInt(el.InStock) === parseInt(val.InStock) &&
                      // parseInt(el.Weight) === parseInt(val.Weight) &&
                      // parseInt(el.Location) === parseInt(val.Location)
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
        <div className="col-md-4 p-3" style={{ backgroundColor: "#e6e6e6" }}>
          <div className="row">
            <div className="d-flex justify-content-between">
              <button
                className="button-style m-0"
                style={{ width: "130px" }}
                onClick={addNew}
              >
                Add
              </button>
              <button
                className="button-style m-0"
                style={{ width: "130px" }}
                onClick={deleteItem}
                disabled={selectedTableRow.length === 0}
              >
                Delete
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
                  <label className="form-label">
                    Length
                    {/* <span className="text-danger">*</span> */}
                  </label>
                </div>

                <div className="col-md-9 p-0">
                  <input
                    type="number"
                    className="in-field rounded-0"
                    name="DynamicPara1"
                    // value={selectedTableRow[0].DynamicPara1}
                    onChange={changeHandler}
                    value={inputData.DynamicPara1}
                    onBlur={focusOutEvent}
                    disabled={selectedTableRow.length === 0}
                  />
                </div>
              </div>
            </div>{" "}
            <div>
              <div className="row d-flex align-items-end">
                <div className="col-md-3 p-0">
                  <label className="form-label">Width</label>
                </div>

                <div className="col-md-9 p-0">
                  <input
                    type="number"
                    className="in-field rounded-0"
                    name="DynamicPara2"
                    // value={selectedTableRow[0].DynamicPara1}
                    onChange={changeHandler}
                    value={inputData.DynamicPara2}
                    onBlur={focusOutEvent}
                    disabled={selectedTableRow.length === 0}
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
                    className="in-field rounded-0"
                    name="InStock"
                    // value={selectedTableRow[0].DynamicPara1}
                    onChange={changeHandler}
                    value={inputData.InStock}
                    // onBlur={focusOutEvent}
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
                    // value={selectedTableRow[0].DynamicPara1}
                    onChange={changeHandler}
                    value={inputData.Location}
                    //  onBlur={focusOutEvent}
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
    </>
  );
}
