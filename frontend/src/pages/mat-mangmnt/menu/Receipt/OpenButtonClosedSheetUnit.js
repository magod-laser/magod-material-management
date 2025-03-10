import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { formatDate } from "../../../../utils";
import { useLocation } from "react-router-dom";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function OpenButtonClosedSheetUnit() {
  const nav = useNavigate();
  const location = useLocation();

  //initial disable all
  const [boolVal, setBoolVal] = useState(true);

  const [mtrlArray, setMtrlArray] = useState([]);
  const [para1Label, setPara1Label] = useState("");
  const [para2Label, setPara2Label] = useState("");
  const [para3Label, setPara3Label] = useState("");
  const [mtrlStock, setMtrlStock] = useState({});

  const [formHeader, setFormHeader] = useState({
    RvID: "",
    ReceiptDate: "",
    RV_No: "",
    RV_Date: "",
    RVStatus: "",
    Cust_Code: "",
    Customer: "",
    CustDocuNo: "",
    TotalWeight: "",
    TotalCalculatedWeight: "",
    Type: "",
    address: "",
  });

  const [unitLabel1, setUnitLabel1] = useState("");
  const [unitLabel2, setUnitLabel2] = useState("");
  const [unitLabel3, setUnitLabel3] = useState("");

  const [sheetRowSelect, setSheetRowSelect] = useState(false);
  const [plateRowSelect, setPlateRowSelect] = useState(false);
  const [tubeRowSelect, setTubeRowSelect] = useState(false);
  const [tilesStripRowSelect, setTilesStripRowSelect] = useState(false);
  const [blockRowSelect, setBlockRowSelect] = useState(false);
  const [cylinderRowSelect, setCylinderRowSelect] = useState(false);
  const [unitRowSelect, setUnitRowSelect] = useState(false);

  const [inputPart, setInputPart] = useState({
    id: "",
    rvId: "",
    srl: "",
    custCode: "",
    mtrlCode: "",
    material: "",
    shapeMtrlId: "",
    shapeID: "",
    dynamicPara1: "",
    dynamicPara2: "",
    dynamicPara3: "",
    qty: "",
    inspected: "",
    accepted: "",
    totalWeightCalculated: "",
    totalWeight: "",
    locationNo: "",
    upDated: "",
    qtyAccepted: 0,
    qtyReceived: 0,
    qtyRejected: 0,
    qtyUsed: 0,
    qtyReturned: 0,
  });

  async function fetchData() {
    const url =
      endpoints.getByTypeMaterialReceiptRegisterByRvID +
      "?id=" +
      location.state.id;
    getRequest(url, (data) => {
      //console.log("data = ", data);
      data.ReceiptDate = formatDate(new Date(data.ReceiptDate), 10);
      data.RV_Date = formatDate(new Date(data.RV_Date), 3);
      setFormHeader(data);

      //get customer details for address
      getRequest(endpoints.getCustomers, (data1) => {
        const found = data1.find((obj) => obj.Cust_Code === data.Cust_Code);
        data.address = found.Address;
        setFormHeader(data);
      });
      //get material details
      const url1 =
        endpoints.getMtrlReceiptDetailsByRvID + "?id=" + location.state.id;
      getRequest(url1, (data2) => {
        console.log("data2  = ", data2);
        // setMtrlArray(data2);

        data2.forEach((obj) => {
          obj.id = obj.Mtrl_Rv_id;
          obj.rvId = obj.RvID;
          obj.srl = obj.Srl;
          obj.custCode = obj.Cust_Code;
          obj.mtrlCode = obj.Mtrl_Code;
          obj.material = obj.Material;
          obj.shapeMtrlId = obj.ShapeMtrlID;
          obj.shapeID = obj.ShapeID;
          obj.dynamicPara1 = obj.DynamicPara1;
          obj.dynamicPara2 = obj.DynamicPara2;
          obj.dynamicPara3 = obj.DynamicPara3;
          obj.qty = Math.floor(obj.Qty);
          obj.inspected = obj.Inspected;
          obj.accepted = obj.Accepted;
          obj.totalWeightCalculated = obj.TotalWeightCalculated;
          obj.totalWeight = obj.TotalWeight;
          obj.locationNo = obj.LocationNo;
          obj.updated = obj.UpDated;
          obj.qtyAccepted = obj.QtyAccepted;
          obj.qtyReceived = obj.QtyReceived;
          obj.qtyRejected = obj.QtyRejected;
          obj.qtyUsed = obj.QtyUsed;
          obj.qtyReturned = obj.QtyReturned;
        });
        setMtrlArray(data2);

        //find shape of material
        // for (let i = 0; i < data2.length; i++) {
        //   const url2 =
        //     endpoints.getRowByMtrlCode + "?code=" + data2[i].Mtrl_Code;
        //   getRequest(url2, (data3) => {
        //     if (data3.Shape === "Block") {
        //       setPara1Label("Length");
        //       setPara2Label("Width");
        //       setPara3Label("Height");
        //     } else if (data3.Shape === "Plate") {
        //       setPara1Label("Length");
        //       setPara2Label("Width");
        //       setPara3Label("");
        //     } else if (data3.Shape === "Sheet") {
        //       setPara1Label("Width");
        //       setPara2Label("Length");
        //       setPara3Label("");
        //     } else if (data3.Shape === "Tiles") {
        //       setPara1Label("");
        //       setPara2Label("");
        //       setPara3Label("");
        //     } else if (data3.Shape.includes("Tube")) {
        //       setPara1Label("Length");
        //       setPara2Label("");
        //       setPara3Label("");
        //     } else if (data3.Shape.includes("Units")) {
        //       setPara1Label("Qty(Nos)");
        //       setPara2Label("");
        //       setPara3Label("");
        //     }
        //   });
        // }

        const url2 =
          endpoints.getRowByMtrlCode + "?code=" + data2[0]?.Mtrl_Code;
        getRequest(url2, (data3) => {
          if (data3.Shape === "Sheet") {
            // Sheet
            setPara1Label("Width");
            setPara2Label("Length");
            setUnitLabel1("mm");
            setUnitLabel2("mm");
            setSheetRowSelect(true);
          } else {
            setSheetRowSelect(false);
          }

          if (data3.Shape === "Plate") {
            // Plate
            setPara1Label("Length");
            setPara2Label("Width");
            setUnitLabel1("mm");
            setUnitLabel2("mm");
            setPlateRowSelect(true);
          } else {
            setPlateRowSelect(false);
          }

          if (data3.Shape.includes("Tube")) {
            // Tube
            setPara1Label("Length");
            setUnitLabel1("mm");
            setTubeRowSelect(true);
          } else {
            setTubeRowSelect(false);
          }

          if (data3.Shape === "Tiles" || data3.Shape === "Strip") {
            // Titles, Strip
            setPara1Label("");
            setUnitLabel1("");
            setTilesStripRowSelect(true);
          } else {
            setTilesStripRowSelect(false);
          }

          if (data3.Shape === "Block") {
            // Block
            setPara1Label("Length");
            setPara2Label("Width");
            setPara3Label("Height");
            setUnitLabel1("mm");
            setUnitLabel2("mm");
            setUnitLabel3("mm");
            setBlockRowSelect(true);
          } else {
            setBlockRowSelect(false);
          }

          if (data3.Shape === "Cylinder") {
            // Cylinder
            setPara1Label("Volume");
            setUnitLabel1("CubicMtr");
            setCylinderRowSelect(true);
          } else {
            setCylinderRowSelect(false);
          }

          if (data3.Shape === "Units") {
            // Units
            setPara1Label("Qty");
            setUnitLabel1("Nos");
            setUnitRowSelect(true);
          } else {
            setUnitRowSelect(false);
          }
        });

        //setFormHeader(formHeader);
        //console.log(data2);
      });
    });
    //console.log("data = ", formHeader);
  }

  useEffect(() => {
    fetchData();
    //formHeader.ReceiptDate = formatDate(new Date(), 4);
  }, []);

  const columns = [
    {
      text: "#",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Srl",
      dataField: "Srl",
    },
    {
      text: "Mtrl Code",
      dataField: "Mtrl_Code",
      sort: true,
    },
    {
      text: para1Label,
      dataField: "DynamicPara1",
      sort: true,
    },
    {
      text: para2Label,
      dataField: "DynamicPara2",
      sort: true,
    },
    {
      text: para3Label,
      dataField: "DynamicPara3",
      sort: true,
    },
    {
      text: "Qty",
      dataField: "Qty",
      sort: true,
    },
    {
      text: "Inspected",
      dataField: "Inspected",
      formatter: (celContent, row) => (
        console.log("inspected cell = ", celContent),
        (
          <div className="checkbox">
            <lable>
              <input type="checkbox" checked={celContent == 1 ? true : false} />
            </lable>
          </div>
        )
      ),
    },
    {
      text: "Location No",
      dataField: "LocationNo",
      sort: true,
    },
    {
      text: "UpDated",
      dataField: "UpDated",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.UpDated == 1 ? true : false} />
          </lable>
        </div>
      ),
    },
  ];

  console.log("mtrlArray", mtrlArray);

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row, isSelect, rowIndex, e) => {
      // setSelectedRows(row);
      console.log("row", row);
      setInputPart(row);
      // if (row.updated === 1) {
      //   setRmvBtn(true);
      //   setAddBtn(false);
      // } else {
      //   setRmvBtn(false);
      //   setAddBtn(true);
      // }
      // console.log("mtrlArray", mtrlArray);
      mtrlArray?.map((obj) => {
        if (obj.id == row.id) {
          setMtrlStock(obj);
          // console.log("obj.totalWeight", obj.totalWeight);
          setInputPart({
            // qtyAccepted: row.qtyAccepted,
            qtyRejected: obj.qtyRejected,
            // qtyReceived: row.qtyReceived,
            id: obj.id,
            srl: obj.srl,
            mtrlCode: row.mtrlCode,
            dynamicPara1: row.dynamicPara1,
            dynamicPara2: row.dynamicPara2,
            dynamicPara3: row.dynamicPara3,
            qty: obj.qty,
            inspected: obj.inspected,
            locationNo: obj.locationNo,
            updated: obj.updated,
            accepted: obj.accepted,
            totalWeightCalculated: obj.totalWeightCalculated,
            totalWeight: obj.totalWeight,
          });
          if (obj.shapeID === 1) {
            // Sheet
            setPara1Label("Width");
            setPara2Label("Length");
            setPara3Label("");
            setUnitLabel1("mm");
            setUnitLabel2("mm");
            setSheetRowSelect(true);
          } else {
            setSheetRowSelect(false);
          }

          if (obj.ShapeID === 2) {
            // Plate
            setPara1Label("Length");
            setPara2Label("Width");
            setPara3Label("");
            setUnitLabel1("mm");
            setUnitLabel2("mm");
            setPlateRowSelect(true);
          } else {
            setPlateRowSelect(false);
          }

          if (obj.ShapeID === 3 || obj.ShapeID === 4 || obj.ShapeID === 5) {
            setPara1Label("Length");
            setPara2Label("");
            setPara3Label("");
            setUnitLabel1("mm");
            setTubeRowSelect(true);
          } else {
            setTubeRowSelect(false);
          }

          if (obj.ShapeID === 6 || obj.ShapeID === 7) {
            // Titles, Strip
            setPara1Label("");
            setPara2Label("");
            setPara3Label("");
            setUnitLabel1("");
            setTilesStripRowSelect(true);
          } else {
            setTilesStripRowSelect(false);
          }

          if (obj.ShapeID === 8) {
            // Block
            setPara1Label("Length");
            setPara2Label("Width");
            setPara3Label("Height");
            setUnitLabel1("mm");
            setUnitLabel2("mm");
            setUnitLabel3("mm");
            setBlockRowSelect(true);
          } else {
            setBlockRowSelect(false);
          }

          if (obj.ShapeID === 9) {
            // Cylinder
            setPara1Label("Volume");
            setPara2Label("");
            setPara3Label("");
            setUnitLabel1("CubicMtr");
            setCylinderRowSelect(true);
          } else {
            setCylinderRowSelect(false);
          }

          if (obj.ShapeID === 10) {
            // Units
            setPara1Label("Qty");
            setPara2Label("");
            setPara3Label("");
            setUnitLabel1("Nos");
            setUnitRowSelect(true);
          } else {
            setUnitRowSelect(false);
          }
        }
      });
    },
  };

  return (
    <div>
      <div>
        <h4 className="title">Material Receipt Voucher</h4>

        <div className="row">
          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Receipt Date
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="receiptDate"
              value={formHeader.ReceiptDate}
              readOnly
              // disabled
            />
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              RV No
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="rvNo"
              value={formHeader.RV_No}
              readOnly
            />
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              RV Date
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="rvDate"
              value={formHeader.RV_Date}
              readOnly
            />
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Status
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="status"
              value={formHeader.RVStatus}
              readOnly
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "70px" }}>
            <label className="form-label" style={{ whiteSpace: "nowrap" }}>
              Weight
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="weight"
              value={formHeader.TotalWeight}
              disabled={boolVal}
              // onChange={InputHeaderEvent}
            />
          </div>
        </div>
        <div className="row">
          <div className="d-flex col-md-5" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Customer
            </label>

            <select
              className="ip-select mt-1"
              name="customer"
              //onChange={changeCustomer}
              disabled={boolVal}
            >
              <option value={formHeader.Cust_Code} disabled selected>
                {formHeader.Customer}
              </option>
            </select>
          </div>

          <div className="d-flex col-md-4" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Reference
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="reference"
              value={formHeader.CustDocuNo}
              disabled={boolVal}
              // onChange={InputHeaderEvent}
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Calculated Weight
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="calculatedWeight"
              value={formHeader.TotalCalculatedWeight}
              readOnly
            />
          </div>
        </div>

        <div className="row ">
          <div className="col-md-8">
            <textarea
              className="input-disabled mt-1"
              id="exampleFormControlTextarea1"
              rows="4"
              style={{ width: "100%", height: "60px" }}
              value={formHeader.address}
              readOnly
            ></textarea>
          </div>
          <div className="col-md-4 justify-content-center">
            <button className="button-style" disabled={boolVal}>
              Save
            </button>

            <button className="button-style" disabled={boolVal}>
              Allot RV No
            </button>

            <button className="button-style" disabled={boolVal}>
              Delete RV
            </button>

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
        <div className="row">
          <div
            style={{ height: "363px", overflowY: "scroll" }}
            className="col-md-8 col-sm-12"
          >
            <BootstrapTable
              keyField="id"
              columns={columns}
              data={mtrlArray}
              striped
              hover
              condensed
              headerClasses="header-class tableHeaderBGColor"
              selectRow={selectRow}
            ></BootstrapTable>
          </div>
          {/* <div className="col-md-6 col-sm-12">
           <div
              className="table-data"
              style={{ height: "480px", overflowY: "scroll" }}
            >
              <Tables theadData={getHeadings()} tbodyData={data3} />
            </div> 
          </div> */}
          <div className="col-md-4 col-sm-12" style={{ overflowY: "scroll" }}>
            <div className=" form-bg">
              <div className="d-flex  justify-content-center mt-2">
                {/* <button
                  className="button-style "
                  style={{ width: "155px" }}
                  disabled={boolVal}
                >
                  Add Serial
                </button> */}

                <button className="button-style " disabled={boolVal}>
                  Add to stock
                </button>

                <button className="button-style " disabled={boolVal}>
                  Remove stock
                </button>
              </div>

              <div className="row">
                <div className="col-md-12 col-sm-12">
                  <div className="ip-box form-bg">
                    <label
                      className="form-label"
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      Serial Details
                    </label>
                    <div className="row">
                      {/* <p className="form-title-deco mt-2">
                        <h5>Serial Details</h5>
                      </p> */}

                      <div className="col-md-4">
                        <label
                          className="form-label"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Mtrl Code
                        </label>
                      </div>
                      <div className="col-md-8" style={{ marginTop: "8px" }}>
                        <select
                          // className="ip-select dropdown-field"
                          style={{ width: "100%" }}
                          className="input-disabled mt-1"
                          disabled={boolVal}
                          value={inputPart.mtrlCode}
                          name="mtrlCode"
                        >
                          <option value="" disabled selected>
                            Select Material
                          </option>
                          <option value={inputPart.mtrlCode} disabled selected>
                            {inputPart.mtrlCode}
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* <div className="row">                      
                      <div className="col-md-4">
                        <label className="form-label">{para1Label}</label>
                      </div>
                      <div className="col-md-6 ">
                        <input
                          className="in-field"                        
                          disabled={boolVal}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">{unitLabel1}</label>
                      </div>
                    </div> */}
                    {/* <div className="row">
                      <div className="col-md-3">
                        <label className="form-label">{para2Label}</label>
                      </div>
                      <div className="col-md-6 ">
                        <input className="in-field" disabled={boolVal} />
                      </div>
                      <div className="col-md-3"></div>
                    </div> */}
                    {/* <div className="row">
                      <div className="col-md-3">
                        <label className="form-label">{para3Label}</label>
                      </div>
                      <div className="col-md-6 ">
                        <input className="in-field" disabled={boolVal} />
                      </div>
                      <div className="col-md-3"></div>
                    </div> */}
                    {sheetRowSelect && (
                      <div>
                        <div className="row mt-1">
                          <div className="col-md-4">
                            <label className="form-label">{para1Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-2"
                              name="dynamicPara1"
                              value={inputPart.dynamicPara1}
                              disabled
                              min="0"
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel1}</label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">{para2Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-1"
                              name="dynamicPara2"
                              value={inputPart.dynamicPara2}
                              min="0"
                              disabled
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel2}</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {plateRowSelect && (
                      <div>
                        <div className="row mt-1">
                          <div className="col-md-4">
                            <label className="form-label">{para1Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-2"
                              name="dynamicPara1"
                              value={inputPart.dynamicPara1}
                              disabled
                              min="0"
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel1}</label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">{para2Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-1"
                              name="dynamicPara2"
                              value={inputPart.dynamicPara2}
                              min="0"
                              disabled
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel2}</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {tubeRowSelect && (
                      <div>
                        <div className="row mt-1">
                          <div className="col-md-4">
                            <label className="form-label">{para1Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-2"
                              name="dynamicPara1"
                              value={inputPart.dynamicPara1}
                              disabled
                              min="0"
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel1}</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {tilesStripRowSelect && <div></div>}

                    {blockRowSelect && (
                      <div>
                        <div className="row mt-1">
                          <div className="col-md-4">
                            <label className="form-label">{para1Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-2"
                              name="dynamicPara1"
                              value={inputPart.dynamicPara1}
                              disabled
                              min="0"
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel1}</label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">{para2Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-1"
                              name="dynamicPara2"
                              value={inputPart.dynamicPara2}
                              min="0"
                              disabled
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel2}</label>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            <label className="form-label">{para3Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-1"
                              name="dynamicPara3"
                              value={inputPart.dynamicPara3}
                              min="0"
                              disabled
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel3}</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {cylinderRowSelect && (
                      <div>
                        <div className="row mt-1">
                          <div className="col-md-3">
                            <label className="form-label">{para1Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-2"
                              name="dynamicPara1"
                              value={inputPart.dynamicPara1}
                              disabled
                              min="0"
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel1}</label>
                          </div>
                        </div>
                      </div>
                    )}

                    {unitRowSelect && (
                      <div>
                        <div className="row mt-1">
                          <div className="col-md-4">
                            <label className="form-label">{para1Label}</label>
                          </div>
                          <div className="col-md-6">
                            <input
                              type="number"
                              className="input-disabled mt-2"
                              name="dynamicPara1"
                              value={inputPart.dynamicPara1}
                              disabled
                              min="0"
                            />
                          </div>
                          <div className="col-md-2">
                            <label className="form-label">{unitLabel1}</label>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="col-md-12 ">
                      {/* <p className="form-title-deco">
                        <h5>Quantity Details</h5>
                      </p> */}
                      <label
                        className="form-label"
                        style={{
                          textDecoration: "underline",
                        }}
                      >
                        Quantity Details
                      </label>
                      <div className="d-flex col-md-12" style={{ gap: "10px" }}>
                        <div
                          className=" d-flex col-md-6"
                          style={{ gap: "10px" }}
                        >
                          <label className="form-label mt-2">Received</label>
                          <input
                            className="input-disabled mt-2"
                            disabled={boolVal}
                            value={(inputPart.qty = Math.floor(inputPart.qty))}
                          />
                        </div>

                        <div
                          className=" d-flex col-md-6"
                          style={{ gap: "10px" }}
                        >
                          <input
                            className="form-check-input mt-3"
                            type="checkbox"
                            id="flexCheckDefault"
                            disabled={boolVal}
                            name="inspected"
                            checked={inputPart.inspected == 1 ? true : false}
                            value={inputPart.inspected}
                          />

                          <label className="form-label mt-2">Inspected</label>
                        </div>
                      </div>

                      <div className="d-flex col-md-12" style={{ gap: "10px" }}>
                        <div
                          className="d-flex col-md-6"
                          style={{ gap: "10px" }}
                        >
                          <label className="form-label mt-2">Accepted</label>
                          <input
                            className="input-disabled mt-2"
                            disabled={boolVal}
                            value={
                              (inputPart.accepted = Math.floor(
                                inputPart.accepted
                              ))
                            }
                          />
                        </div>

                        <div
                          className="d-flex col-md-6"
                          style={{ gap: "10px" }}
                        >
                          <input
                            className="form-check-input mt-3"
                            type="checkbox"
                            checked={inputPart.updated === 1 ? true : false}
                            value=""
                            id="flexCheckDefault"
                            disabled={boolVal}
                          />
                          <label className="form-label mt-2">Updated</label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mt-2">
                          <label
                            className="form-label"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Wt Caluclated 2
                          </label>
                        </div>
                        <div className="col-md-6 mt-1">
                          <input
                            className="input-disabled mt-1"
                            disabled={boolVal}
                            value={inputPart.totalWeightCalculated}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">Weight</label>
                        </div>
                        <div className="col-md-6 ">
                          <input
                            className="input-disabled mt-1"
                            disabled={boolVal}
                            value={inputPart.totalWeight}
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6 ">
                          <label className="form-label">Location</label>
                        </div>
                        <div className="col-md-6 mt-2">
                          <select
                            // className="ip-select dropdown-field"
                            className="input-disabled mt-1"
                            style={{ width: "100%" }}
                            disabled={boolVal}
                          >
                            <option value={inputPart.locationNo}>
                              {inputPart.locationNo}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="row justify-content-center mt-3 mb-4">
                <button
                  className="button-style "
                  style={{ width: "75px" }}
                  disabled={boolVal}
                >
                  Delete
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenButtonClosedSheetUnit;
