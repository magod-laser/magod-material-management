import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import ReturnCancelIVModal from "../../../components/ReturnCancelIVModal";
import CreateDCYesNoModal from "../../../components/CreateDCYesNoModal";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import PrintPartsDC from "../../../print/return/PrintPartsDC";
import { FaArrowUp } from "react-icons/fa";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function OutwordPartIssueVocher(props) {
  const todayDate = new Date();

  const [printOpen, setPrintOpen] = useState(false);

  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [showCreateDC, setShowCreateDC] = useState(false);
  let [custdata, setCustdata] = useState({
    Address: "",
  });

  let [dcID, setdcID] = useState("");
  let [dcRegister, setdcRegister] = useState({});

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: null,
  });

  const [outData, setOutData] = useState([]);
  const location = useLocation();

  const [IVNOValue, setIVNOValue] = useState("");
  const [IVIDValue, setIVIDValue] = useState("");

  const [formHeader, setFormHeader] = useState({
    Iv_Id: "",
    IV_No: "",
    IV_Date: "",
    Cust_code: "",
    Customer: "",
    CustCSTNo: "",
    CustGSTNo: "",
    PkngDcNo: "",
    TotalWeight: "",
    TotalCalculatedWeight: "",
    Dc_ID: "",
    IVStatus: "",
    RV_Remarks: "",
  });

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const [formData, setFormData] = useState({ unitName: userData.UnitName });
  const [runningNoData, setRunningNoData] = useState([]);

  async function fetchData() {
    let url =
      endpoints.getMaterialIssueRegisterRouterByIVID +
      "?id=" +
      location.state.selectData.Iv_Id;
    getRequest(url, (data) => {
      setIVNOValue(data.IV_No);
      setIVIDValue(data.Iv_Id);
      setdcID(data.Dc_ID);
      setFormHeader({
        Iv_Id: data.Iv_Id,
        IV_No: data.IV_No,
        IV_Date: data.IV_Date,
        Cust_code: data.Cust_code,
        CustCSTNo: data.CustCSTNo,
        Customer: data.Customer,
        CustGSTNo: data.CustGSTNo,
        PkngDcNo: data.PkngDcNo,
        PkngDCDate: data.PkngDCDate,
        TotalWeight: parseFloat(data.TotalWeight).toFixed(3),
        TotalCalculatedWeight: parseFloat(data.TotalCalculatedWeight).toFixed(
          3
        ),
        Dc_ID: data.Dc_ID,
        IVStatus: data.IVStatus,
        RV_Remarks: data.RV_Remarks || "",
      });

      //get cust data
      let url2 = endpoints.getCustomerByCustCode + "?code=" + data.Cust_code;
      getRequest(url2, async (data) => {
        setCustdata(data);
      });
    });

    //grid data
    let url1 =
      endpoints.getmtrlPartIssueDetailsByIVID +
      "?id=" +
      location.state.selectData.Iv_Id;
    getRequest(url1, (data) => {
      setOutData(data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const InputHeaderEvent = (name, value) => {
    setFormHeader({ ...formHeader, [name]: value });
  };

  const saveButtonState = (e) => {
    e.preventDefault();

    postRequest(
      endpoints.updateDCWeight,
      { outData: outData, formHeader: formHeader, type: "part" },
      (data) => {
        if (data.affectedRows !== 0) {
          toast.success("Record Updated Successfully");
          fetchData();
        } else {
          toast.error("Record Not Updated");
        }
      }
    );
    //}
  };

  let cancelIV = () => {
    setShow(true);

    setFormHeader({ ...formHeader, IVStatus: "Cancelled" });
  };

  const getDCNo = async () => {
    let Period = `${todayDate.getFullYear()}`;

    const srlType = "Outward_DCNo";
    const ResetPeriod = "Year";
    const ResetValue = 0;
    const Length = 4;
    const EffectiveFrom_date = `${todayDate.getFullYear() + "-01-01"}`;
    const Reset_date = `${todayDate.getFullYear() + "-12-31"}`;

    postRequest(
      endpoints.insertAndGetRunningNo,
      {
        Period: Period,
        unitName: formData.unitName,
        srlType: srlType,
        ResetPeriod: ResetPeriod,
        ResetValue: ResetValue,
        Length: Length,
        EffectiveFrom_date: EffectiveFrom_date,
        Reset_date: Reset_date,
      },
      (res) => {
        setRunningNoData(res.runningNoData);
      }
    );
  };

  let createDC = (e) => {
    let flag = true;

    for (let i = 0; i < outData.length; i++) {
      const element = outData[i];
      if (
        element.TotalWeight === null ||
        element.TotalWeight === "null" ||
        element.TotalWeight === "" ||
        element.TotalWeight === 0 ||
        element.TotalWeight === "0" ||
        element.TotalWeight === "0.000" ||
        element.TotalWeight === "0.00" ||
        element.TotalWeight === 0.0
      ) {
        flag = false;
        break;
      }
    }

    if (flag) {
      getDCNo();
      setShowCreateDC(true);
    } else {
      toast.warning("Serial Weight cannot be zero. Set Weight and try again");
    }
  };

  let getDCID = async (data) => {
    setdcID(data);

    if (data !== "" && data !== 0 && data !== undefined) {
      //get data from dcregister
      let url3 = endpoints.getDCRegisterByID + "?id=" + data;
      getRequest(url3, (data) => {
        setdcRegister(data);
      });

      let url4 =
        endpoints.getMaterialIssueRegisterRouterByIVID +
        "?id=" +
        location.state.selectData.Iv_Id;
      getRequest(url4, async (data) => {
        setFormHeader({
          ...formHeader,
          PkngDcNo: data.PkngDcNo,
        });
      });
    }
  };
  let printDC = () => {
    setPrintOpen(true);
  };

  const setReturnValueFunc = () => {
    setFormHeader({
      ...formHeader,
      IVStatus: "Returned",
    });
  };

  const createDcResponse = async (data) => {
    setFormHeader(data);
  };

  const updateChange = (key, value, field) => {
    const newArray = [];

    for (let i = 0; i < outData.length; i++) {
      const element = outData[i];

      if (i === key) {
        element[field] = value;

        if (field === "UnitWt") {
          let totalWeight = 0;

          totalWeight = (
            parseFloat(element.QtyReturned || 0) * parseFloat(value || 0)
          ).toFixed(3);
          element.TotalWeight = totalWeight;
        }
      }

      newArray.push(element);
    }

    setOutData(newArray);
  };

  const handleChangeWeightTotalCal = () => {
    let newTotalWeight = 0;
    for (let i = 0; i < outData.length; i++) {
      const element = outData[i];

      newTotalWeight =
        parseFloat(newTotalWeight) + parseFloat(element.TotalWeight);
    }

    setFormHeader({
      ...formHeader,
      TotalWeight: newTotalWeight,
      TotalCalculatedWeight: newTotalWeight,
    });
  };

  const sortedData = () => {
    let dataCopy = [...outData];

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

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
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
      <div>
        <h4 className="title">Outward Part Issue Voucher</h4>

        <div>
          <div className="row">
            <div className="d-flex col-md-3">
              <div className="col-md-5">
                <label className="form-label">IV No & IV Date</label>
              </div>

              <div className="col-md-6">
                <input
                  type="text"
                  name="IvId"
                  value={`${formHeader.IV_No} | ${formHeader.IV_Date}`}
                  disabled
                  className="input-disabled mt-1"
                />
              </div>
            </div>

            <div className="d-flex col-md-3">
              <div className="col-md-5">
                <label className="form-label">DC No & DC Date</label>
              </div>

              <div className="col-md-7">
                <input
                  type="text"
                  name="IVDate"
                  value={
                    formHeader.PkngDcNo
                      ? `${formHeader.PkngDcNo} | ${formHeader.PkngDCDate}`
                      : ""
                  }
                  disabled
                  className="input-disabled mt-1"
                />
              </div>
            </div>

            <div className="d-flex col-md-3">
              <div className="col-md-3">
                <label className="form-label">Status</label>
              </div>
              <div className="col-md-7">
                <input
                  type="text"
                  name="reference"
                  value={formHeader.IVStatus}
                  disabled
                  className="input-disabled mt-1"
                />
              </div>
            </div>

            <div className="d-flex col-md-3">
              <div className="col-md-5">
                <label className="form-label">Calculated Weight</label>
              </div>

              <div className="col-md-6">
                <input
                  name="Type"
                  value={formHeader.TotalCalculatedWeight}
                  disabled
                  className="input-disabled mt-1"
                />
              </div>
            </div>
            <div className="d-flex col-md-6 mt-2">
              <div className="col-md-2">
                <label className="form-label">Customer</label>
              </div>

              <div className="col-md-10">
                <input
                  type="text"
                  name="Customer"
                  value={formHeader.Customer}
                  disabled
                  className="input-disabled mt-1"
                />
              </div>
            </div>

            <div className="d-flex col-md-3 mt-2">
              <div className="col-md-3">
                <label className="form-label">GST</label>
              </div>
              <div className="col-md-7">
                <input
                  type="text"
                  name="reference"
                  value={formHeader.CustGSTNo}
                  disabled
                  className="input-disabled mt-1"
                />
              </div>
            </div>

            <div className="d-flex col-md-3 mt-2">
              <div className="col-md-5">
                <label className="form-label">Actual Weight</label>
              </div>
              <div className="col-md-6">
                <input
                  type="number"
                  // min="0"
                  name="TotalWeight"
                  value={formHeader.TotalWeight}
                  onKeyDown={numbValidations}
                  onChange={(e) => {
                    if (
                      e.target.value === "" ||
                      parseInt(e.target.value) <= 100000000
                    ) {
                      e.target.value = e.target.value.replace(
                        /(\.\d{3})\d+/,
                        "$1"
                      );

                      if (parseInt(e.target.value) < 0) {
                        e.target.value = parseInt(e.target.value) * -1;
                        toast.warning("Actual weight can't be negative");
                      }

                      InputHeaderEvent(
                        e.target.name,
                        parseFloat(e.target.value || 0)
                      );
                    } else {
                      toast.warning("Actual Weight can't be greater then 10Cr");
                      e.preventDefault();
                    }
                  }}
                  disabled={
                    formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
                  }
                  className={
                    formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
                      ? "input-disabled"
                      : ""
                  }
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column">
                <label className="form-label">Consignee Address</label>
                <textarea
                  cols="30"
                  rows="3"
                  value={custdata.Address}
                  disabled
                  className="input-disabled"
                  style={{ height: "90px" }}
                ></textarea>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column">
                <label className="form-label">Remarks</label>
                <textarea
                  cols="30"
                  rows="3"
                  name="RV_Remarks"
                  value={formHeader.RV_Remarks}
                  onChange={(e) => {
                    if (e.target.value?.length <= 150) {
                      InputHeaderEvent(e.target.name, e.target.value || "");
                    } else {
                      toast.warning("Remarks can be only 150 characters");
                      e.preventDefault();
                    }
                  }}
                  disabled={
                    formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
                  }
                  className={
                    formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
                      ? "input-disabled"
                      : ""
                  }
                  style={{ height: "90px" }}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between">
          <button
            onClick={saveButtonState}
            disabled={
              formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
            }
            className={
              formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
                ? "button-style ms-3 button-disabled"
                : "button-style ms-3"
            }
          >
            Save
          </button>
          <button
            onClick={cancelIV}
            disabled={
              formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
            }
            className={
              formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
                ? "button-style button-disabled"
                : "button-style"
            }
          >
            Cancel IV
          </button>
          <button
            onClick={createDC}
            disabled={
              formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
            }
            className={
              formHeader.IVStatus === "Cancelled" || formHeader.PkngDcNo
                ? "button-style button-disabled"
                : "button-style"
            }
          >
            Create DC
          </button>
          <button
            onClick={printDC}
            disabled={
              formHeader.IVStatus === "Cancelled" || !formHeader.PkngDcNo
            }
            className={
              formHeader.IVStatus === "Cancelled" || !formHeader.PkngDcNo
                ? "button-style button-disabled"
                : "button-style"
            }
          >
            Print DC
          </button>
          <button
            className="button-style me-3"
            id="btnclose"
            type="submit"
            onClick={() => nav("/MaterialManagement")}
          >
            Close
          </button>
        </div>

        <div className="p-2"></div>

        <div className="row">
          <div className="col-md-12">
            <div style={{ maxHeight: "420px", overflow: "auto" }}>
              <Table
                striped
                className="table-data border"
                style={{ border: "1px" }}
              >
                <thead className="tableHeaderBGColor">
                  <tr>
                    <th>SL No</th>
                    <th
                      onClick={() => requestSort("PartId")}
                      className="cursor"
                    >
                      PartId / Part Name
                      <FaArrowUp
                        className={
                          sortConfig.key === "PartId"
                            ? sortConfig.direction === "desc"
                              ? "rotateClass"
                              : ""
                            : "displayNoneClass"
                        }
                      />
                    </th>
                    <th
                      onClick={() => requestSort("QtyReturned")}
                      className="cursor"
                    >
                      Qty Returned
                      <FaArrowUp
                        className={
                          sortConfig.key === "QtyReturned"
                            ? sortConfig.direction === "desc"
                              ? "rotateClass"
                              : ""
                            : "displayNoneClass"
                        }
                      />
                    </th>
                    <th
                      onClick={() => requestSort("UnitWt")}
                      className="cursor"
                    >
                      Unit Weight
                      <FaArrowUp
                        className={
                          sortConfig.key === "UnitWt"
                            ? sortConfig.direction === "desc"
                              ? "rotateClass"
                              : ""
                            : "displayNoneClass"
                        }
                      />
                    </th>
                    <th
                      onClick={() => requestSort("TotalWeight")}
                      className="cursor"
                    >
                      Total Weight
                      <FaArrowUp
                        className={
                          sortConfig.key === "TotalWeight"
                            ? sortConfig.direction === "desc"
                              ? "rotateClass"
                              : ""
                            : "displayNoneClass"
                        }
                      />
                    </th>
                    <th>Remarks</th>
                    <th>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData().map((val, key) => (
                    <tr>
                      <td>{key + 1}</td>
                      <td>{val.PartId}</td>
                      <td>{parseInt(val.QtyReturned)} </td>
                      <td>
                        <input
                          type="number"
                          value={val.UnitWt}
                          onKeyDown={numbValidations}
                          onChange={(e) => {
                            if (
                              e.target.value === "" ||
                              parseInt(e.target.value) <= 100000000
                            ) {
                              e.target.value = e.target.value.replace(
                                /(\.\d{3})\d+/,
                                "$1"
                              );

                              if (parseInt(e.target.value) < 0) {
                                e.target.value = parseInt(e.target.value) * -1;
                                toast.warning("Unit weight can't be negative");
                              }

                              updateChange(key, e.target.value || 0, "UnitWt");
                              handleChangeWeightTotalCal();
                            } else {
                              toast.warning(
                                "Unit Weight can't be greater then 10Cr"
                              );
                              e.preventDefault();
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                          disabled={
                            formHeader.IVStatus === "Cancelled" ||
                            formHeader.PkngDcNo
                          }
                          className={
                            formHeader.IVStatus === "Cancelled" ||
                            formHeader.PkngDcNo
                              ? "input-disabled"
                              : ""
                          }
                        />
                      </td>
                      <td>{parseFloat(val.TotalWeight).toFixed(3)}</td>
                      <td>
                        <input
                          value={val.Remarks}
                          onChange={(e) => {
                            if (e.target.value?.length <= 150) {
                              updateChange(
                                key,
                                e.target.value || "",
                                "Remarks"
                              );
                            } else {
                              toast.warning(
                                "Remarks can be only 150 characters"
                              );
                              e.preventDefault();
                            }
                          }}
                          style={{
                            width: "100%",
                            height: "100%",
                            backgroundColor: "transparent",
                            border: "none",
                          }}
                          disabled={
                            formHeader.IVStatus === "Cancelled" ||
                            formHeader.PkngDcNo
                          }
                          className={
                            formHeader.IVStatus === "Cancelled" ||
                            formHeader.PkngDcNo
                              ? "input-disabled"
                              : ""
                          }
                        />
                      </td>
                      <td>
                        {val.UpDated === 0 ? (
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            disabled={
                              formHeader.IVStatus === "Cancelled" ||
                              formHeader.PkngDcNo
                            }
                            className={
                              formHeader.IVStatus === "Cancelled" ||
                              formHeader.PkngDcNo
                                ? "input-disabled"
                                : ""
                            }
                            onClick={() => updateChange(key, 1, "UpDated")}
                          />
                        ) : (
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            checked
                            disabled={
                              formHeader.IVStatus === "Cancelled" ||
                              formHeader.PkngDcNo
                            }
                            className={
                              formHeader.IVStatus === "Cancelled" ||
                              formHeader.PkngDcNo
                                ? "input-disabled"
                                : ""
                            }
                            onClick={() => updateChange(key, 0, "UpDated")}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      <PrintPartsDC
        printOpen={printOpen}
        setPrintOpen={setPrintOpen}
        formHeader={formHeader}
        outData={outData}
        custdata={custdata}
        dcRegister={dcRegister}
      />

      <ReturnCancelIVModal
        show={show}
        setShow={setShow}
        IV_NO={IVNOValue}
        IV_ID={IVIDValue}
        type="parts"
        outData={outData}
      />

      <CreateDCYesNoModal
        showCreateDC={showCreateDC}
        setShowCreateDC={setShowCreateDC}
        formHeader={formHeader}
        outData={outData}
        type="parts"
        getDCID={getDCID}
        setFormHeader={setFormHeader}
        setReturnValueFunc={setReturnValueFunc}
        createDcResponse={createDcResponse}
        saveButtonState={saveButtonState}
        runningNoData={runningNoData}
      />
    </>
  );
}

export default OutwordPartIssueVocher;
