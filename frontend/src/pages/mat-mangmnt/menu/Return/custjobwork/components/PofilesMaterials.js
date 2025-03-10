import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { formatDate, get_Iv_DetailsEntry } from "../../../../../../utils";
import CreateReturnNewModal from "../../../../components/CreateReturnNewModal";
import FirstTable from "./Tables/FirstTable";
import SecondTable from "./Tables/SecondTable";
import ThirdTable from "./Tables/ThirdTable";
import ConfirmationModal from "./Modals/ConfimationModal";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function PofilesMaterials(props) {
  const todayDate = new Date();
  const toastId = useRef(null);

  const [show, setShow] = useState(false);
  const [srlMaterialType, setSrlMaterialType] = useState("");
  const [srlIVID, setSrlIVID] = useState("");
  const [IVNOVal, setIVNOVal] = useState("");

  const [firstTableData, setFirstTableData] = useState([]);
  const [secondTableData, setSecondTableData] = useState([]);
  const [thirdTableData, setThirdTableData] = useState([]);
  let [objShape, setObjShape] = useState({});
  let [objMaterial, setObjMaterial] = useState({});

  let [firstTableSelectedRow, setFirstTableSelectedRow] = useState([]);
  let [allData, setAllData] = useState([]);
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
    if (props && props.custCode.length !== 0) {
      let url1 =
        endpoints.profileMaterialFirst + "?Cust_Code=" + props.custCode;
      getRequest(url1, (data) => {
        if (data?.length > 0) {
          data.forEach((item, i) => {
            item.id = i + 1;
            item.Issue = false;
          });
          setFirstTableData(data);
        } else {
          toast.warning("No materials data found for selected Customer");
        }
      });

      //fetch second table data
      let url2 =
        endpoints.profileMaterialSecond + "?Cust_Code=" + props.custCode;
      getRequest(url2, (data) => {
        setAllData(data);
        // console.log("all data...", data);
      });

      // getAllMaterial for create return vocuher
      getRequest(endpoints.getMtrlData, async (MtrlData) => {
        setObjMaterial(MtrlData);
      });

      // getAllShapes for create return vocuher
      getRequest(endpoints.getAllShapes, async (shapeData) => {
        setObjShape(shapeData);
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

  //   postRequest(
  //     endpoints.getAndInsertRunningNo,
  //     insertRunningNoVal,
  //     (runningNo) => {
  //       setRunningNo(runningNo);
  //     }
  //   );
  // };

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

  const selectRowFirstFun = (rowData) => {
    setFirstTableSelectedRow([]);
    setFirstTableSelectedRow([rowData]);
    const newArray = allData.filter(
      (obj) =>
        obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
        obj.Mtrl_Code === rowData.Mtrl_Code &&
        obj.DynamicPara1 === rowData.DynamicPara1 &&
        obj.DynamicPara2 === rowData.DynamicPara2 &&
        obj.Scrap === rowData.Scrap
      // {
      //   return (
      //     obj.Mtrl_Rv_id === rowData.Mtrl_Rv_id &&
      //     obj.RV_No === rowData.RV_No &&
      //     obj.Mtrl_Code === rowData.Mtrl_Code &&
      //     obj.DynamicPara1 === rowData.DynamicPara1 &&
      //     obj.DynamicPara2 === rowData.DynamicPara2
      //   );
      // }
    );
    setSecondTableData([]);
    setSecondTableData(newArray);
  };

  const selectRowSecondFun = (rowData) => {
    const found = thirdTableData.some(
      (el) => el.MtrlStockID === rowData.MtrlStockID
    );
    if (found) {
      // deleting the element if found
      const newThirdTableData = thirdTableData.filter(
        (data) => data !== rowData
      );
      setThirdTableData(newThirdTableData);
    } else {
      // inserting the element if not found
      setThirdTableData([...thirdTableData, rowData]);
    }
  };

  const createReturnVoucherValidationFunc = () => {
    if (props.custCode) {
      if (firstTableSelectedRow.length > 0 || secondTableData.length > 0) {
        if (thirdTableData.length > 0) {
          // getRunningNo();
          getDCNo();
          setConfirmModalOpen(true);
        } else {
          toast.warning(
            "Select atleast one Material for creating the return voucher"
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
            //adding last 2 digit of year
            let yy = formatDate(new Date(), 6).toString().substring(2);
            let no = yy + "/" + series;
            setIVNOVal(no);
            // creating the merged array for details
            let dataToPost = [];
            for (let i = 0; i < thirdTableData.length; i++) {
              const element = thirdTableData[i];
              if (dataToPost.length === 0) {
                dataToPost.push({
                  ...element,
                  SrlNo: i + 1,
                  Qty: 1,
                  MtrlStockID: element.MtrlStockID,
                });
              } else {
                const filterData = dataToPost.filter(
                  (obj) =>
                    obj.Cust_Docu_No === element.Cust_Docu_No &&
                    obj.DynamicPara1 === element.DynamicPara1 &&
                    obj.DynamicPara2 === element.DynamicPara2 &&
                    obj.DynamicPara3 === element.DynamicPara3 &&
                    obj.Material === element.Material &&
                    obj.Mtrl_Code === element.Mtrl_Code &&
                    obj.RV_No === element.RV_No &&
                    obj.Scrap === element.Scrap
                );
                if (filterData.length > 0) {
                  let changeRow = filterData[0];
                  changeRow.Qty = changeRow.Qty + 1;
                  changeRow.Weight = (
                    parseFloat(changeRow.Weight) + parseFloat(element.Weight)
                  ).toFixed(3);
                  changeRow.ScrapWeight = (
                    parseFloat(changeRow.ScrapWeight) +
                    parseFloat(element.ScrapWeight)
                  ).toFixed(3);
                  dataToPost[changeRow.SrlNo - 1] = changeRow;
                } else {
                  dataToPost.push({
                    ...element,
                    SrlNo: i + 1,
                    Qty: 1,
                    // MtrlStockID: element.MtrlStockID,
                  });
                }
              }
            }
            let detailsFilteredData = [];
            const abc = dataToPost.filter((obj) => obj != undefined);
            for (let i = 0; i < abc.length; i++) {
              const element = abc[i];
              if (detailsFilteredData.length === 0) {
                detailsFilteredData.push(element);
              } else {
                if (
                  !(
                    detailsFilteredData.filter(
                      (obj) =>
                        obj.Cust_Docu_No === element.Cust_Docu_No &&
                        obj.DynamicPara1 === element.DynamicPara1 &&
                        obj.DynamicPara2 === element.DynamicPara2 &&
                        obj.DynamicPara3 === element.DynamicPara3 &&
                        obj.Material === element.Material &&
                        obj.Mtrl_Code === element.Mtrl_Code &&
                        obj.RV_No === element.RV_No &&
                        obj.Scrap === element.Scrap
                    ).length > 0
                  )
                ) {
                  detailsFilteredData.push(element);
                }
              }
            }
            console.log("detailsFilteredData", detailsFilteredData);
            // creating var for register starts
            // calculating the total weights for selected materials in third table for register
            let RVTotalWeight = 0;
            let RVTotalCalWeight = 0;
            for (let i = 0; i < detailsFilteredData.length; i++) {
              const element = detailsFilteredData[i];
              // console.log("element...", element);
              if (element.Scrap != 0) {
                RVTotalCalWeight =
                  RVTotalCalWeight + parseFloat(element.ScrapWeight);
                RVTotalWeight = RVTotalWeight + parseFloat(element.Weight);
              } else {
                RVTotalCalWeight =
                  RVTotalCalWeight + parseFloat(element.Weight);
                RVTotalWeight = RVTotalWeight + parseFloat(element.ScrapWeight);
              }
              // RVTotalWeight =
              //   parseFloat(RVTotalWeight) + parseFloat(element.ScrapWeight);
              // // parseFloat(RVTotalWeight) + parseFloat(element.TotalWeight);
              // RVTotalCalWeight =
              //   parseFloat(RVTotalCalWeight) + parseFloat(element.Weight);
              // // parseFloat(element.TotalCalculatedWeight);
            }
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
              TotalWeight: RVTotalWeight,
              TotalCalculatedWeight: RVTotalCalWeight,
              UpDated: 0,
              IVStatus: "Draft",
              Dc_ID: 0,
              Type: thirdTableData[0].Type,
            };
            console.log(
              "newRowMaterialIssueRegister",
              newRowMaterialIssueRegister
            );
            // creating var for register ends now post to BE
            postRequest(
              endpoints.insertMaterialIssueRegister,
              newRowMaterialIssueRegister,
              (respRegister) => {
                // console.log("first post done in register...", data);
                if (respRegister.insertId) {
                  setSrlIVID(respRegister.insertId);
                  // // creating var for details starts
                  // let dataToPost = [];
                  // for (let i = 0; i < thirdTableData.length; i++) {
                  //   const element = thirdTableData[i];
                  //   if (dataToPost.length === 0) {
                  //     dataToPost.push({
                  //       ...element,
                  //       SrlNo: i + 1,
                  //       Qty: 1,
                  //       MtrlStockID: element.MtrlStockID,
                  //     });
                  //   } else {
                  //     const filterData = dataToPost.filter(
                  //       (obj) => obj.Cust_Docu_No === element.Cust_Docu_No
                  //     );
                  //     if (filterData.length > 0) {
                  //       let changeRow = filterData[0];
                  //       changeRow.Qty = changeRow.Qty + 1;
                  //       dataToPost[changeRow.SrlNo - 1] = changeRow;
                  //     } else {
                  //       dataToPost.push({
                  //         ...element,
                  //         SrlNo: i + 1,
                  //         Qty: 1,
                  //         MtrlStockID: element.MtrlStockID,
                  //       });
                  //     }
                  //   }
                  // }
                  // let detailsFilteredData = [];
                  // const abc = dataToPost.filter((obj) => obj != undefined);
                  // for (let i = 0; i < abc.length; i++) {
                  //   const element = abc[i];
                  //   if (detailsFilteredData.length === 0) {
                  //     detailsFilteredData.push(element);
                  //   } else {
                  //     if (
                  //       !(
                  //         detailsFilteredData.filter(
                  //           (obj) => obj.RVId === element.RVId
                  //         ).length > 0
                  //       )
                  //     ) {
                  //       detailsFilteredData.push(element);
                  //     }
                  //   }
                  // }
                  for (let j = 0; j < detailsFilteredData.length; j++) {
                    const element = detailsFilteredData[j];
                    let MtrlData;
                    let ShapeData;
                    // get mtrl data
                    for (let m = 0; m < objMaterial.length; m++) {
                      const mtrlElement = objMaterial[m];
                      if (mtrlElement.Mtrl_Code === element.Mtrl_Code) {
                        MtrlData = mtrlElement;
                        break;
                      }
                    }
                    // get shape data
                    for (let s = 0; s < objShape.length; s++) {
                      const shapeElement = objShape[s];
                      if (shapeElement.Shape === MtrlData.Shape) {
                        ShapeData = shapeElement;
                        break;
                      }
                    }
                    // generate the mtrl description
                    let mtrlDescription =
                      get_Iv_DetailsEntry(
                        element.Scrap,
                        element.DynamicPara1,
                        element.DynamicPara2,
                        element.DynamicPara3,
                        element.Material,
                        MtrlData.Shape,
                        ShapeData,
                        MtrlData
                      ) +
                      " /** " +
                      element.Cust_Docu_No;
                    let newRowMtrlIssueDetails = {
                      Iv_Id: respRegister.insertId,
                      Srl: j + 1,
                      IV_Date: null,
                      IV_No: no || "",
                      Cust_Code: props.custCode,
                      Customer: props.custName || "",
                      MtrlDescription: mtrlDescription,
                      Mtrl_Code: element.Mtrl_Code,
                      Material: element.Material,
                      PkngDCNo: "",
                      cust_docu_No: element.Cust_Docu_No,
                      RV_No: element.RV_No,
                      RV_Srl: "",
                      Qty: element.Qty,
                      // parseFloat(element.Qty) *
                      TotalWeightCalculated: parseFloat(
                        element.Scrap === 0
                          ? element.Weight
                          : element.ScrapWeight
                      )
                        // parseFloat(element.TotalCalculatedWeight)
                        .toFixed(3),
                      // parseFloat(element.Qty) *
                      TotalWeight: parseFloat(
                        element.Scrap != 0
                          ? element.Weight
                          : element.ScrapWeight
                      )
                        // parseFloat(element.TotalWeight)
                        .toFixed(3),
                      UpDated: 0,
                      RvId: element.RvID || 0,
                      Mtrl_Rv_id: element.Mtrl_Rv_id,
                    };
                    console.log(
                      "newRowMtrlIssueDetails",
                      newRowMtrlIssueDetails
                    );
                    // post to details...
                    postRequest(
                      endpoints.insertMtrlIssueDetails,
                      newRowMtrlIssueDetails,
                      async (issueDetailsData) => {
                        if (issueDetailsData.affectedRows !== 0) {
                        } else {
                          toast.error("Uncaught Error (002)");
                        }
                      }
                    );
                  }
                  // udpdating the mtrlstock...
                  for (let i = 0; i < thirdTableData.length; i++) {
                    const element = thirdTableData[i];
                    const mtrlstockData = {
                      Issue: 1,
                      Iv_No: no,
                      MtrlStockID: element.MtrlStockID,
                    };
                    postRequest(
                      endpoints.updateIssueIVNo,
                      mtrlstockData,
                      async (mtrlUpdateData) => {
                        // console.log("doneeeeeeeeee");
                        const inputData = {
                          runningNoData: runningNoData,

                          newRunningNo: newNo,

                          // SrlType: "MaterialReturnIV",
                          // Period: formatDate(new Date(), 6),
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
                              setSrlMaterialType("material");
                              setShow(true);
                            } else {
                              toast.error("unable to update running no");
                            }
                          }
                        );
                      }
                    );
                  }
                } else {
                  toast.error("Uncaught error while posting data (001)");
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
        {/* <div className="pb-1"></div> */}
        <div className="row py-1">
          <div className="col-md-9 "></div>
          <div className="col-md-3">
            <div className="d-flex align-items-center justify-content-end">
              <button
                className="button-style m-0"
                style={{ width: "auto" }}
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
        {/* <div className="pb-1"></div> */}

        <div className="row pb-1">
          <div className="col-md-12">
            <div
              style={{
                height: "200px",
                overflow: "auto",
              }}
              className="border rounded bg-light"
            >
              <FirstTable
                firstTableData={firstTableData}
                selectRowFirstFun={selectRowFirstFun}
                firstTableSelectedRow={firstTableSelectedRow}
                thirdTableData={thirdTableData}
                setThirdTableData={setThirdTableData}
                allData={allData}
                sortConfigFirst={sortConfigFirst}
                setSortConfigFirst={setSortConfigFirst}
              />
            </div>
          </div>
        </div>
        <div className="row pb-2">
          <div className="col-md-6">
            <div
              style={{
                height: "400px",
                overflow: "auto",
              }}
              className="border rounded bg-light"
            >
              <SecondTable
                secondTableData={secondTableData}
                selectRowSecondFun={selectRowSecondFun}
                thirdTableData={thirdTableData}
                sortConfigSecond={sortConfigSecond}
                setSortConfigSecond={setSortConfigSecond}
              />
            </div>
          </div>
          <div className="col-md-6">
            <div
              style={{
                height: "400px",
                overflow: "auto",
              }}
              className="border rounded bg-light"
            >
              <ThirdTable
                thirdTableData={thirdTableData}
                sortConfigThird={sortConfigThird}
                setSortConfigThird={setSortConfigThird}
              />
            </div>
          </div>
        </div>
      </div>

      {/* create return voucher modal  */}
      <CreateReturnNewModal
        show={show}
        setShow={setShow}
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
    </>
  );
}

export default PofilesMaterials;
