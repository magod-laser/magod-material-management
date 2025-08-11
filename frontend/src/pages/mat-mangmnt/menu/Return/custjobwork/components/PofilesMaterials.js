import { useEffect, useState, useRef } from "react";
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
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  let [firstTableSelectedRow, setFirstTableSelectedRow] = useState([]);
  let [allData, setAllData] = useState([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [formData, setFormData] = useState({ unitName: userData.UnitName });
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

  const getDCNo = async () => {
    let Period = `${todayDate.getFullYear()}`;
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
    );
    setSecondTableData([]);
    setSecondTableData(newArray);
  };

  const selectRowSecondFun = (rowData) => {
    const found = thirdTableData.some(
      (el) => el.MtrlStockID === rowData.MtrlStockID
    );
    if (found) {
      const newThirdTableData = thirdTableData.filter(
        (data) => data !== rowData
      );
      setThirdTableData(newThirdTableData);
    } else {
      setThirdTableData([...thirdTableData, rowData]);
    }
  };

  const createReturnVoucherValidationFunc = () => {
    if (props.custCode) {
      if (firstTableSelectedRow.length > 0 || secondTableData.length > 0) {
        if (thirdTableData.length > 0) {
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

            let yy = formatDate(new Date(), 6).toString().substring(2);
            let no = yy + "/" + series;
            setIVNOVal(no);

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

            let RVTotalWeight = 0;
            let RVTotalCalWeight = 0;
            for (let i = 0; i < detailsFilteredData.length; i++) {
              const element = detailsFilteredData[i];

              if (element.Scrap != 0) {
                RVTotalCalWeight =
                  RVTotalCalWeight + parseFloat(element.ScrapWeight);
                RVTotalWeight = RVTotalWeight + parseFloat(element.Weight);
              } else {
                RVTotalCalWeight =
                  RVTotalCalWeight + parseFloat(element.Weight);
                RVTotalWeight = RVTotalWeight + parseFloat(element.ScrapWeight);
              }
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

            postRequest(
              endpoints.insertMaterialIssueRegister,
              newRowMaterialIssueRegister,
              (respRegister) => {
                if (respRegister.insertId) {
                  setSrlIVID(respRegister.insertId);

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
                      TotalWeightCalculated: parseFloat(
                        element.Scrap === 0
                          ? element.Weight
                          : element.ScrapWeight
                      ).toFixed(3),

                      TotalWeight: parseFloat(
                        element.Scrap != 0
                          ? element.Weight
                          : element.ScrapWeight
                      ).toFixed(3),
                      UpDated: 0,
                      RvId: element.RvID || 0,
                      Mtrl_Rv_id: element.Mtrl_Rv_id,
                    };

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
        <div className="row py-1">
          <div className="col-md-9 "></div>
          <div className="col-md-3">
            <div className="d-flex align-items-center justify-content-end">
              <button
                className="button-style m-0"
                style={{ width: "auto" }}
                onClick={(e) => {
                  createReturnVoucherValidationFunc();
                }}
              >
                Create Return Voucher
              </button>
            </div>
          </div>
        </div>

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

      <CreateReturnNewModal
        show={show}
        setShow={setShow}
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
    </>
  );
}

export default PofilesMaterials;
