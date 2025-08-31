import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { formatDate } from "../../../../../../utils";
import ReturnPartQtyCheckOk from "../../../../components/ReturnPartQtyCheckOk";
import FirstTable from "./PartsTables/FirstTable";
import SecondTable from "./PartsTables/SecondTable";
import ThirdTable from "./PartsTables/ThirdTable";
import ConfirmationModal from "./Modals/ConfimationModal";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function Parts(props) {
  const todayDate = new Date();
  const toastId = useRef(null);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  let [firstTableData, setFirstTableData] = useState([]);
  let [secondTableData, setSecondTableData] = useState([]);
  let [thirdTableData, setThirdTableData] = useState([]);
  const [thirdTableRVIDs, setThirdTableRVIDs] = useState([]);

  let [firstTableSelectedRow, setFirstTableSelectedRow] = useState([]);

  const [srlIVID, setSrlIVID] = useState("");
  const [IVNOVal, setIVNOVal] = useState("");

  const [show, setShow] = useState(false);
  const [srlMaterialType, setSrlMaterialType] = useState("");

  let [allData, setAllData] = useState([]);

  let [rvNoval, setrvNoVal] = useState("");
  let [custRefval, setCustRefVal] = useState("");
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [runningNoData, setRunningNoData] = useState([]);

  const [sortConfigFirst, setSortConfigFirst] = useState({
    key: null,
    direction: null,
  });

  const [sortConfigSecond, setSortConfigSecond] = useState({
    key: null,
    direction: null,
  });

  const [sortConfigThird, setSortConfigThird] = useState({
    key: null,
    direction: null,
  });

  const fetchData = () => {
    setFirstTableData([]);
    setSecondTableData([]);
    setThirdTableData([]);
    setFirstTableSelectedRow([]);
    setrvNoVal("");
    setCustRefVal("");
    if (props && props.custCode.length !== 0) {
      let url1 = endpoints.partFirst + "?Cust_Code=" + props.custCode;
      getRequest(url1, (data) => {
        if (data?.length > 0) {
          setFirstTableData(data);
          setSecondTableData([]);

          //fetch second table data
          let url2 = endpoints.partSecond + "?Cust_Code=" + props.custCode;
          getRequest(url2, (data1) => {
            let newData = data1.filter((obj, index) => {
              return obj.RVId === Object.values(data)[0].RvID;
            });
            setAllData(data1);
          });
        } else {
          toast.warning("No parts data found for selected Customer");
        }
      });
    }
  };

  useEffect(() => {
    setSortConfigFirst({
      key: null,
      direction: null,
    });
    setSortConfigSecond({
      key: null,
      direction: null,
    });
    setSortConfigThird({
      key: null,
      direction: null,
    });

    fetchData();
  }, [props.custCode]);

  const selectRowFirstFunc = (rowData) => {
    //update second table data
    let newData = allData.filter((obj, index) => {
      return obj.RVId === rowData.RvID;
    });

    setSecondTableData(newData);

    setFirstTableSelectedRow(rowData);

    setrvNoVal(rowData.RV_No);
    setCustRefVal(rowData.CustDocuNo);
  };

  const selectRowSecondFunc = (rowData) => {
    const found = thirdTableData.some(
      (el) =>
        el.CustBOM_Id === rowData.CustBOM_Id &&
        el.RV_No === rowData.RV_No &&
        el.CustDocuNo === rowData.CustDocuNo &&
        el.Id === rowData.Id &&
        el.PartId === rowData.PartId &&
        el.RVId === rowData.RVId
    );

    if (found) {
      // deleting the element if found
      const newThirdTableData = thirdTableData.filter(
        (el) =>
          el.CustBOM_Id != rowData.CustBOM_Id ||
          el.RV_No != rowData.RV_No ||
          el.CustDocuNo != rowData.CustDocuNo ||
          el.Id != rowData.Id ||
          el.PartId != rowData.PartId ||
          el.RVId != rowData.RVId
      );

      let newArray = thirdTableRVIDs.filter((obj) => obj != rowData.RV_No);
      setThirdTableRVIDs(newArray);
      setThirdTableData(newThirdTableData);
    } else {
      let returnNew =
        rowData.QtyReceived - rowData.QtyUsed - rowData.QtyReturned;

      if (
        rowData.QtyReturned + returnNew + rowData.QtyUsed >
        rowData.QtyReceived
      ) {
        toast.error(
          "Greater then the quantity received, plus already returned/used."
        );
      } else if (returnNew <= 0) {
        toast.error("Stock is already returned");
      } else {
        rowData.PartIdNew = rowData.PartId + "/**Ref: " + rowData.CustDocuNo;
        if (rowData.QtyRejected > 0) {
          if (
            rowData.QtyReceived - rowData.QtyReturned - rowData.QtyUsed >
            rowData.QtyRejected
          ) {
            rowData.QtyReturnedNew = rowData.QtyRejected;
          } else {
            rowData.QtyReturnedNew =
              rowData.QtyReceived -
              rowData.QtyRejected -
              rowData.QtyReturned -
              rowData.QtyUsed;
          }
          rowData.Remarks = "Rejected";
        } else {
          rowData.QtyReturnedNew =
            rowData.QtyReceived -
            rowData.QtyRejected -
            rowData.QtyReturned -
            rowData.QtyUsed;
          rowData.Remarks = "Return Unused";
        }

        thirdTableRVIDs.push(rowData.RV_No);
        setThirdTableRVIDs(thirdTableRVIDs);
        setThirdTableData([...thirdTableData, rowData]);
      }
    }
  };

  const getDCNo = async () => {
    let Period = `${todayDate.getFullYear()}`;
    const UnitName = userData.UnitName;
    const srlType = "MaterialReturnIV";
    const ResetPeriod = "Year";
    const ResetValue = 0;
    const Length = 4;
    const EffectiveFrom_date = `${todayDate.getFullYear() + "-01-01"}`;
    const Reset_date = `${todayDate.getFullYear() + "-12-31"}`;

    postRequest(
      endpoints.insertAndGetRunningNo,
      {
        Period: Period,
        unitName: UnitName,
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

  const checkQtyForZero = () => {
    let flag = true;
    for (let i = 0; i < thirdTableData.length; i++) {
      const element = thirdTableData[i];
      if (parseInt(element.QtyReturnedNew) === 0) {
        toast.warning("Qty returned can't be zero");
        flag = false;
        break;
      }
    }
    return flag;
  };

  const createReturnVoucherValidationFunc = () => {
    if (props.custCode) {
      if (firstTableSelectedRow.length > 0 || secondTableData.length > 0) {
        if (thirdTableData.length > 0) {
          let arr = [];
          for (let i = 0; i < thirdTableData.length; i++) {
            const element = thirdTableData[i];
            if (element.QtyReturnedNew === "") {
              element.QtyReturnedNew = 0;
            }
            arr.push(element);
          }

          setThirdTableData(arr);

          if (checkQtyForZero()) {
            getDCNo();
            setConfirmModalOpen(true);
          }
        } else {
          toast.warning(
            "Select atleast one Part for creating the return voucher"
          );
        }
      } else {
        toast.warning("Select the Document for creating the return voucher");
      }
    } else {
      toast.warning("Select the Customer for creating the return voucher");
    }
  };

  const createReturnVoucherFunc = async () => {
    if (props.custCode) {
      if (firstTableSelectedRow.length > 0 || secondTableData.length > 0) {
        if (thirdTableData.length > 0) {
          if (runningNoData.Id) {
            toastId.createReturnVoucher = toast.loading(
              "Creating the Return Voucher"
            );
            let newNo = (parseInt(runningNoData.Running_No) + 1).toString();
            let series = "";

            for (let i = 0; i < runningNoData.Length; i++) {
              if (newNo.length < runningNoData.Length) {
                newNo = 0 + newNo;
              }
            }
            series =
              (runningNoData.Prefix || "") +
              newNo +
              (runningNoData.Suffix || "");
            let yy = formatDate(new Date(), 6).toString().substring(2);
            let no = yy + "/" + series;

            setIVNOVal(no);
            let newRowMaterialIssueRegister = {
              IV_No: no,
              IV_Date: formatDate(new Date(), 5),
              Cust_code: props.custCode,
              Customer: props.custName,
              CustCSTNo: props.custCST,
              CustTINNo: props.custTIN,
              CustECCNo: props.custECC,
              CustGSTNo: props.custGST,
              EMail: "",
              PkngDcNo: null,
              PkngDCDate: null,
              TotalWeight: parseFloat(0).toFixed(3),
              TotalCalculatedWeight: parseFloat(0).toFixed(3),
              UpDated: 0,
              IVStatus: "Draft",
              Dc_ID: 0,
              Type: "Parts",
            };

            //insert first table
            postRequest(
              endpoints.insertMaterialIssueRegister,
              newRowMaterialIssueRegister,
              async (data) => {
                setSrlIVID(data.insertId);

                if (data.affectedRows !== 0) {
                  for (let i = 0; i < thirdTableData.length; i++) {
                    let newRowPartIssueDetails = {
                      Iv_Id: data.insertId,
                      Srl: i + 1,
                      Cust_Code: props.custCode,
                      RVId: thirdTableData[i].RVId,
                      Mtrl_Rv_id: thirdTableData[i].Id,
                      PartId:
                        thirdTableData[i].PartId +
                        "/**Ref: " +
                        thirdTableData[i].CustDocuNo,
                      CustBOM_Id: thirdTableData[i].CustBOM_Id,
                      UnitWt: parseFloat(0).toFixed(3),
                      TotalWeight: parseFloat(0).toFixed(3),
                      QtyReturned: thirdTableData[i].QtyReturnedNew,
                      Remarks: thirdTableData[i].Remarks,
                    };
                    postRequest(
                      endpoints.insertPartIssueDetails,
                      newRowPartIssueDetails,
                      async (data) => {}
                    );
                    //update qtyReturned add
                    let updateQty = {
                      Id: thirdTableData[i].Id,
                      QtyReturned: thirdTableData[i].QtyReturnedNew,
                    };
                    postRequest(
                      endpoints.updateQtyReturnedPartReceiptDetails1,
                      updateQty,
                      async (data) => {}
                    );
                  }
                }
              }
            );
            const inputData = {
              runningNoData: runningNoData,

              newRunningNo: newNo,
            };
            postRequest(
              endpoints.getAndUpdateRunningNo,
              inputData,
              async (updateRunningNoData) => {
                if (updateRunningNoData.flag) {
                  toast.dismiss(toastId.createReturnVoucher);

                  setSrlMaterialType("part");
                  setShow(true);
                } else {
                  toast.error("unable to update running no");
                }
              }
            );
          } else {
            toast.error("Unable to create the running no");
          }
        } else {
          toast.error(
            "Select atleast one Material for creating the return voucher"
          );
        }
      } else {
        toast.error("Select the Document for creating the return voucher");
      }
    } else {
      toast.error("Select the Customer for creating the return voucher");
    }
  };

  return (
    <>
      <div>
        <div>
          <div className="row">
            <div className="col-md-9 p-0">
              <div className="row">
                <div className="  col-md-4">
                  <div className=" d-flex rvNO">
                    <div className="col-md-2">
                      <label className="form-label">RV No</label>
                    </div>
                    <div className="col-md-6">
                      <input
                        className="input-disabled mt-1"
                        type="text"
                        name="rvNo"
                        disabled
                        value={rvNoval}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="d-flex customerRef">
                    <div className="col-md-2">
                      <label className="form-label">Customer Ref</label>
                    </div>
                    <div className="col-md-5">
                      <input
                        className="input-disabled mt-1 "
                        type="text"
                        name="customerRef"
                        disabled
                        value={custRefval}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center justify-content-end">
                <button
                  className="button-style mx-0"
                  onClick={(e) => {
                    createReturnVoucherValidationFunc();
                  }}
                >
                  Create Return Voucher
                </button>
              </div>
            </div>
          </div>
          <div className="p-2"></div>

          <div className="row">
            <div className="col-md-2 col-sm-12">
              <div className="row-md-12 table-data">
                <div style={{ maxHeight: "400px", overflow: "auto" }}>
                  <FirstTable
                    firstTableData={firstTableData}
                    firstTableSelectedRow={firstTableSelectedRow}
                    selectRowFirstFunc={selectRowFirstFunc}
                    thirdTableRVIDs={thirdTableRVIDs}
                    setSortConfigFirst={setSortConfigFirst}
                    sortConfigFirst={sortConfigFirst}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6 col-sm-12">
              <div className="row-md-12 table-data">
                <div style={{ maxHeight: "400px", overflow: "auto" }}>
                  <SecondTable
                    secondTableData={secondTableData}
                    selectRowSecondFunc={selectRowSecondFunc}
                    thirdTableData={thirdTableData}
                    setSortConfigSecond={setSortConfigSecond}
                    sortConfigSecond={sortConfigSecond}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <div>
                <div style={{ maxHeight: "400px", overflow: "auto" }}>
                  <ThirdTable
                    thirdTableData={thirdTableData}
                    setThirdTableData={setThirdTableData}
                    sortConfigThird={sortConfigThird}
                    setSortConfigThird={setSortConfigThird}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReturnPartQtyCheckOk
          showOK={show}
          setShowOK={setShow}
          srlMaterialType={srlMaterialType}
          srlIVID={srlIVID}
          IVNOVal={IVNOVal}
        />

        <ConfirmationModal
          confirmModalOpen={confirmModalOpen}
          setConfirmModalOpen={setConfirmModalOpen}
          yesClickedFunc={createReturnVoucherFunc}
          message={"Are you sure to create the return voucher ?"}
        />
      </div>
    </>
  );
}

export default Parts;
