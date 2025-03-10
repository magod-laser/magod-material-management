import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import BootstrapTable from "react-bootstrap-table-next";
import { formatDate } from "../../../../../../utils";
import CreateReturnNewModal from "../../../../components/CreateReturnNewModal";
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

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState({ unitName: "Jigani" });
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
    //console.log("props = ", props);
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
            // setSecondTableData(newData);
          });
        } else {
          toast.warning("No parts data found for selected Customer");
        }
      });
    }
  };

  // const getRunningNo = async () => {
  //   let SrlType = "MaterialReturnIV";
  //   let yyyy = formatDate(new Date(), 6).toString();
  //   let UnitName = "Jigani";
  //   const insertRunningNoVal = {
  //     UnitName: UnitName,
  //     SrlType: SrlType,
  //     ResetPeriod: "Year",
  //     ResetValue: "0",
  //     EffectiveFrom_date: `${yyyy}-01-01`,
  //     Reset_date: `${yyyy}-12-31`,
  //     Running_No: "0",
  //     UnitIntial: "0",
  //     Prefix: "",
  //     Suffix: "",
  //     Length: "4",
  //     Period: yyyy,
  //   };

  //   // var runningNo = [];
  //   postRequest(
  //     endpoints.getAndInsertRunningNo,
  //     insertRunningNoVal,
  //     (runningNo) => {
  //       // console.log("post done", runningNo);
  //       setRunningNo(runningNo);
  //       // runningNo = runningNo;
  //     }
  //   );
  //   // await delay(30);
  //   // console.log("runningNo", runningNo);
  // };

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
    //setPropsValue(props.custCode);
    fetchData();
    //console.log("S props value = ", propsValue);
  }, [props.custCode]);

  // const columnsFirst = [
  //   {
  //     text: "RvID",
  //     dataField: "RvID",
  //     hidden: true,
  //   },
  //   {
  //     text: "RV No",
  //     dataField: "RV_No",
  //     //hidden: true,
  //   },
  // ];
  // const columnsSecond = [
  //   {
  //     text: "Id",
  //     dataField: "Id",
  //     hidden: true,
  //   },
  //   {
  //     text: "PartId",
  //     dataField: "PartId",
  //   },
  //   {
  //     text: "Received",
  //     dataField: "QtyReceived",
  //   },
  //   {
  //     text: "Rejected",
  //     dataField: "QtyRejected",
  //   },
  //   {
  //     text: "Issued",
  //     dataField: "QtyIssued",
  //   },
  //   {
  //     text: "Used",
  //     dataField: "QtyUsed",
  //   },
  //   {
  //     text: "Returned",
  //     dataField: "QtyReturned",
  //   },
  // ];
  // const columnsThird = [
  //   {
  //     text: "Id",
  //     dataField: "Id",
  //     hidden: true,
  //   },
  //   {
  //     text: "PartId",
  //     dataField: "PartIdNew",
  //   },
  //   {
  //     text: "Return",
  //     dataField: "QtyReturnedNew",
  //   },
  //   {
  //     text: "Remarks",
  //     dataField: "Remarks",
  //   },
  // ];

  // console.log("firstTableSelectedRow", firstTableSelectedRow);

  const selectRowFirstFunc = (rowData) => {
    // mode: "checkbox",
    // clickToSelect: true,
    // selectColumnPosition: "right",
    // selectionHeaderRenderer: () => "Select",
    // bgColor: "#8A92F0",
    // onSelect: (row, isSelect, rowIndex) => {
    // console.log("first..", rowData);

    //update second table data
    let newData = allData.filter((obj, index) => {
      return obj.RVId === rowData.RvID;
    });

    setSecondTableData(newData);

    // console.log(
    //   "RV_No",
    //   rowData.RV_No,
    //   "Customer Ref",
    //   rowData.CustDocuNo + rowData.RV_Date
    // );
    // firstTableSelectedRow.each((obj, i) => {
    //   console.log("inside...", obj);
    // });
    // setFirstTableSelectedRow([]);
    setFirstTableSelectedRow(rowData);

    setrvNoVal(rowData.RV_No);
    setCustRefVal(rowData.CustDocuNo);

    // setrvNoVal(row.RV_No);
    // setCustRefVal(row.CustDocuNo);
    // if (isSelect) {
    //   setFirstTableSelectedRow(
    //     //firstTableSelectedRow.push.apply(firstTableSelectedRow, row)
    //     [...firstTableSelectedRow, firstTableData[rowIndex]]
    //   );

    //   //update second table data
    //   let newData = allData.filter((obj, index) => {
    //     return obj.RVId === row.RvID;
    //   });
    //   setSecondTableData(newData);

    //   console.log("new data  =", newData);
    //   //prepare third table
    //   newData.forEach((item, i) => {
    //     //set second table default checkbox selection
    //     setSecondSelectedRow({
    //       selected: [...secondSelectedRow.selected, item.Id],
    //     });
    //     //console.log(" secondSelectedRow = ", secondSelectedRow);
    //     if (
    //       item.QtyReceived -
    //         item.QtyRejected -
    //         item.QtyReturned -
    //         item.QtyUsed >
    //       0
    //     ) {
    //       item.PartIdNew = item.PartId + "/**Ref: " + row.CustDocuNo;
    //       if (item.QtyRejected > 0) {
    //         if (
    //           item.QtyReceived - item.QtyReturned - item.QtyUsed >
    //           item.QtyRejected
    //         ) {
    //           item.QtyReturnedNew = item.QtyRejected;
    //         } else {
    //           item.QtyReturnedNew =
    //             item.QtyReceived -
    //             item.QtyRejected -
    //             item.QtyReturned -
    //             item.QtyUsed;
    //         }
    //         item.Remarks = "Rejected";
    //       } else {
    //         item.QtyReturnedNew =
    //           item.QtyReceived -
    //           item.QtyRejected -
    //           item.QtyReturned -
    //           item.QtyUsed;
    //         item.Remarks = "Returned Unused";
    //       }
    //     }
    //   });
    //   //concat to prev to new
    //   thirdTableData.push.apply(thirdTableData, newData);
    //   setThirdTableData(thirdTableData);
    // } else {
    //   //remove row in selectedTRow array
    //   setFirstTableSelectedRow(
    //     firstTableSelectedRow.filter((obj) => {
    //       return obj.RV_No !== row.RV_No;
    //     })
    //   );

    //   let newData = thirdTableData.filter((obj, index) => {
    //     return obj.RVId !== row.RvID;
    //   });
    //   //console.log("second table = ", secondTableData);
    //   //console.log("before = ", secondSelectedRow);
    //   //remove check selection in second table
    //   secondTableData.forEach((item, i) => {
    //     setSecondSelectedRow({
    //       selected: secondSelectedRow.selected.filter((ele) => {
    //         return ele !== item.Id;
    //       }),
    //     });
    //   });

    //   setThirdTableData(newData);
    // }
    // }
  };

  // const selectRowSecond = {
  //   mode: "checkbox",
  //   clickToSelect: true,
  //   bgColor: "#8A92F0",
  //   selected: secondSelectedRow.selected,
  //   selectionHeaderRenderer: () => "Select",
  //   onSelect: (row, isSelect) => {
  //     if (isSelect) {
  //       let newData = allData.filter((obj, index) => {
  //         return obj.RVId === row.RVId;
  //       });

  //       //prepare third table
  //       newData.forEach((item, i) => {
  //         //set check in second table
  //         setSecondSelectedRow({
  //           selected: [...secondSelectedRow.selected, item.Id],
  //         });
  //         if (
  //           item.QtyReceived -
  //             item.QtyRejected -
  //             item.QtyReturned -
  //             item.QtyUsed >
  //           0
  //         ) {
  //           item.PartIdNew = item.partId + "/**Ref: " + row.CustDocuNo;
  //           if (item.QtyRejected > 0) {
  //             if (
  //               item.QtyReceived - item.QtyReturned - item.QtyUsed >
  //               item.QtyRejected
  //             ) {
  //               item.QtyReturnedNew = item.QtyRejected;
  //             } else {
  //               item.QtyReturnedNew =
  //                 item.QtyReceived -
  //                 item.QtyRejected -
  //                 item.QtyReturned -
  //                 item.QtyUsed;
  //             }
  //             item.Remarks = "Rejected";
  //           } else {
  //             item.QtyReturnedNew =
  //               item.QtyReceived -
  //               item.QtyRejected -
  //               item.QtyReturned -
  //               item.QtyUsed;
  //             item.Remarks = "Returned Unused";
  //           }
  //         }
  //       });
  //       console.log("new data = ", newData);
  //       //concat to prev to new
  //       thirdTableData.push.apply(thirdTableData, newData);
  //       setThirdTableData(thirdTableData);
  //     } else {
  //       console.log("third table = ", thirdTableData);
  //       console.log("row = ", row);
  //       let newData = thirdTableData.filter((obj, index) => {
  //         return obj.RVId !== row.RVId;
  //       });
  //       secondTableData.forEach((item, i) => {
  //         setSecondSelectedRow({
  //           selected: secondSelectedRow.selected.filter((ele) => {
  //             return ele !== item.Id;
  //           }),
  //         });
  //       });

  //       setThirdTableData(newData);
  //     }
  //   },
  // };

  const selectRowSecondFunc = (rowData) => {
    // console.log("rowData in second", rowData);

    // let newData = allData.filter((obj, index) => {
    //   return obj.RVId === rowData.RVId;
    // });

    // console.log("newData", newData);

    const found = thirdTableData.some(
      (el) =>
        el.CustBOM_Id === rowData.CustBOM_Id &&
        el.RV_No === rowData.RV_No &&
        el.CustDocuNo === rowData.CustDocuNo &&
        el.Id === rowData.Id &&
        el.PartId === rowData.PartId &&
        el.RVId === rowData.RVId
    );

    // console.log("found...", found);

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
      // console.log("newthirdtabedata", newThirdTableData);
      // console.log("thirdTableRVIDs remomve", thirdTableRVIDs);
      // console.log("rowData remove", rowData);

      let newArray = thirdTableRVIDs.filter((obj) => obj != rowData.RV_No);
      // console.log("newArray", newArray);
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
        // toast.success("good to go!!!");

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

        // console.log("after some operation...", rowData);

        thirdTableRVIDs.push(rowData.RV_No);
        setThirdTableRVIDs(thirdTableRVIDs);
        setThirdTableData([...thirdTableData, rowData]);
      }
    }

    // //prepare third table
    // newData.forEach((item, i) => {
    //   //set check in second table
    //   setSecondSelectedRow({
    //     selected: [...secondSelectedRow.selected, item.Id],
    //   });
    //   if (
    //     item.QtyReceived -
    //       item.QtyRejected -
    //       item.QtyReturned -
    //       item.QtyUsed >
    //     0
    //   ) {
    //     item.PartIdNew = item.partId + "/**Ref: " + row.CustDocuNo;
    //     if (item.QtyRejected > 0) {
    //       if (
    //         item.QtyReceived - item.QtyReturned - item.QtyUsed >
    //         item.QtyRejected
    //       ) {
    //         item.QtyReturnedNew = item.QtyRejected;
    //       } else {
    //         item.QtyReturnedNew =
    //           item.QtyReceived -
    //           item.QtyRejected -
    //           item.QtyReturned -
    //           item.QtyUsed;
    //       }
    //       item.Remarks = "Rejected";
    //     } else {
    //       item.QtyReturnedNew =
    //         item.QtyReceived -
    //         item.QtyRejected -
    //         item.QtyReturned -
    //         item.QtyUsed;
    //       item.Remarks = "Returned Unused";
    //     }
    //   }
    // });
    // console.log("new data = ", newData);
    // //concat to prev to new
    // thirdTableData.push.apply(thirdTableData, newData);
    // setThirdTableData(thirdTableData);
  };

  const getDCNo = async () => {
    // console.log("todayDate", todayDate);

    let Period = `${todayDate.getFullYear()}`;

    // console.log("Period", Period);

    const srlType = "MaterialReturnIV";
    const ResetPeriod = "Year";
    const ResetValue = 0;
    const Length = 4;
    const EffectiveFrom_date = `${todayDate.getFullYear() + "-01-01"}`;
    const Reset_date = `${todayDate.getFullYear() + "-12-31"}`;
    // const prefix = "";

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
        // prefix: prefix,
      },
      (res) => {
        setRunningNoData(res.runningNoData);
        console.log("getDCNo Response", res);
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
          // checkQtyForZero()
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

            // let newNo = parseInt(runningNo[0].Running_No) + 1;
            // //let no = "23/000" + newNo;
            // let series = "";
            // if (newNo < 1000) {
            //   //add prefix zeros
            //   for (
            //     let i = 0;
            //     i < parseInt(runningNo[0].Length) - newNo.toString().length;
            //     i++
            //   ) {
            //     series = series + "0";
            //   }
            //   series = series + "" + newNo;
            // } else {
            //   series = newNo;
            // }
            // //console.log("series = ", series);
            // //get last 2 digit of year
            // let yy = formatDate(new Date(), 6).toString().substring(2);
            // let no = yy + "/" + series;
            // // console.log("noonono", no);
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
              TotalWeight: parseFloat(0).toFixed(3), // firstTableSelectedRow[0].TotalWeight,
              TotalCalculatedWeight: parseFloat(0).toFixed(3), // thirdTableData[0].TotalCalculatedWeight,
              UpDated: 0,
              IVStatus: "Draft",
              Dc_ID: 0,
              Type: "Parts",
            };
            // console.log("newwwwwwwwwww.....", newRowMaterialIssueRegister);
            //insert first table
            postRequest(
              endpoints.insertMaterialIssueRegister,
              newRowMaterialIssueRegister,
              async (data) => {
                setSrlIVID(data.insertId);
                //console.log("data = ", data);
                if (data.affectedRows !== 0) {
                  // console.log("Record inserted 1 : materialIssueRegister");
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
                      async (data) => {
                        // console.log("Part issue details inserted");
                      }
                    );
                    //update qtyReturned add
                    let updateQty = {
                      Id: thirdTableData[i].Id,
                      QtyReturned: thirdTableData[i].QtyReturnedNew,
                    };
                    postRequest(
                      endpoints.updateQtyReturnedPartReceiptDetails1,
                      updateQty,
                      async (data) => {
                        // console.log("Return Qty updated");
                      }
                    );
                  }
                }
              }
            );
            const inputData = {
              runningNoData: runningNoData,

              newRunningNo: newNo,
              // SrlType: "MaterialReturnIV",
              // Period: formatDate(new Date(), 6),
              // RunningNo: newNo,
            };
            postRequest(
              endpoints.getAndUpdateRunningNo,
              inputData,
              async (updateRunningNoData) => {
                if (updateRunningNoData.flag) {
                  console.log(
                    "updateRunningNoData",
                    updateRunningNoData.message
                  );
                  toast.dismiss(toastId.createReturnVoucher);

                  setSrlMaterialType("part");
                  setShow(true);
                } else {
                  toast.error("unable to update running no");
                }
              }
            );
            // console.log("srlivid = ", srlIVID);
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
          {/* <CreateReturnNewModal
        show={show}
        setShow={setShow}
        srlMaterialType={srlMaterialType}
        srlIVID={srlIVID}
        IVNOVal={IVNOVal}
      /> */}

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
                        // className="in-field"
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
                  // style={{ width: "200px" }}
                  // onClick={createReturnVoucherFunc}
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

                  {/* <BootstrapTable
                keyField="RvID"
                columns={columnsFirst}
                data={firstTableData}
                striped
                hover
                condensed
                selectRow={selectRowFirst}
                headerClasses="header-class tableHeaderBGColor"
              ></BootstrapTable> */}
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

                  {/* <BootstrapTable
                keyField="Id"
                columns={columnsSecond}
                data={secondTableData}
                striped
                hover
                condensed
                selectRow={selectRowSecond}
                headerClasses="header-class tableHeaderBGColor"
                //</div>selectRow={selectRowFirst}
              ></BootstrapTable> */}
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              {/* <div className="ip-box form-bg">
            <div className="row mb-3">
              <div className="col-md-4">
                <label className="form-label">RV_No</label>
                <input
                  type="text"
                  name="rvNo"
                  disabled
                  value={rvNoval}
                  className="in-field"
                />
              </div>
              <div className="col-md-7">
                <label className="form-label">Customer Ref</label>
                <input
                  className="in-field"
                  type="text"
                  name="customerRef"
                  disabled
                  value={custRefval}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              className="button-style"
              style={{ width: "200px" }}
              onClick={createReturnVoucherFunc}
            >
              Create Return Voucher
            </button>
          </div> */}
              <div>
                <div style={{ maxHeight: "400px", overflow: "auto" }}>
                  <ThirdTable
                    thirdTableData={thirdTableData}
                    setThirdTableData={setThirdTableData}
                    sortConfigThird={sortConfigThird}
                    setSortConfigThird={setSortConfigThird}
                  />

                  {/* <BootstrapTable
                keyField="Id"
                columns={columnsThird}
                data={thirdTableData}
                striped
                hover
                condensed
                //selectRow={selectRowSecond}
                headerClasses="header-class tableHeaderBGColor"
              ></BootstrapTable> */}
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

        {/* confirmation modal */}
        <ConfirmationModal
          confirmModalOpen={confirmModalOpen}
          setConfirmModalOpen={setConfirmModalOpen}
          // yesClickedFunc={cancelPN}
          yesClickedFunc={createReturnVoucherFunc}
          message={"Are you sure to create the return voucher ?"}
        />
      </div>
    </>
  );
}

export default Parts;
