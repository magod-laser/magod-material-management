import { useEffect, useState } from "react";
import { formatDate, getWeight } from "../../../../utils";
import { toast } from "react-toastify";
import CreateYesNoModal from "../../components/CreateYesNoModal";
import DeleteSerialYesNoModal from "../../components/DeleteSerialYesNoModal";
import DeleteRVModal from "../../components/DeleteRVModal";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { useLocation } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function OpenButtonDraftSheetUnit(props) {
  const location = useLocation();
  const nav = useNavigate();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const [show, setShow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRvModalOpen, setDeleteRvModalOpen] = useState(false);
  const currDate = new Date()
    .toJSON()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("/");

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");

  const [boolVal1, setBoolVal1] = useState(true);
  const [boolVal2, setBoolVal2] = useState(false);
  const [boolVal3, setBoolVal3] = useState(true);
  const [boolVal4, setBoolVal4] = useState(false);
  const [boolVal5, setBoolVal5] = useState(false);
  const [boolVal6, setBoolVal6] = useState(true);

  const [boolValStock, setBoolValStock] = useState("off");

  const [insCheck, setInsCheck] = useState(false);
  const [calcWeightVal, setCalcWeightVal] = useState(0);
  const [saveUpdateCount, setSaveUpdateCount] = useState(0);
  const [shape, setShape] = useState();

  const [rmvBtn, setRmvBtn] = useState(false);
  const [addBtn, setAddBtn] = useState(false);

  const [mtrlArray, setMtrlArray] = useState([]);
  const [mtrlStock, setMtrlStock] = useState({});
  const [formHeader, setFormHeader] = useState({
    rvId: "",
    receiptDate: "",
    rvNo: "",
    rvDate: "",
    status: "",
    customer: "",
    customerName: "",
    reference: "",
    weight: "",
    calcWeight: "",
    type: "",
    address: "",
  });

  const [selectedMtrl, setSelectedMtrl] = useState([]);

  let [para1Label, setPara1Label] = useState("Para 1");
  let [para2Label, setPara2Label] = useState("Para 2");
  let [para3Label, setPara3Label] = useState("Para 3");

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

  let [mtrlDetails, setMtrlDetails] = useState([]);
  let [locationData, setLocationData] = useState([]);

  const [partUniqueId, setPartUniqueId] = useState();
  const [materialArray, setMaterialArray] = useState([]);
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
    qty: 0,
    inspected: "",
    accepted: 0,
    totalWeightCalculated: 0.0,
    totalWeight: "",
    locationNo: "",
    updated: "",
    qtyRejected: 0,
    qtyUsed: 0,
    qtyReturned: 0,
  });

  const columns = [
    {
      text: "#",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Srl",
      dataField: "srl",
    },
    {
      text: "Mtrl Code",
      dataField: "mtrlCode",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: unitLabel1 !== "" ? para1Label : "",
      dataField: "dynamicPara1",
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent);
      },
    },
    {
      text: unitLabel2 !== "" ? para2Label : "",
      dataField: "dynamicPara2",
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent);
      },
    },
    {
      text: unitLabel3 !== "" ? para3Label : "",
      dataField: "dynamicPara3",
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent);
      },
    },
    {
      text: "Qty",
      dataField: "qty",
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent);
      },
    },
    {
      text: "Inspected",
      dataField: "inspected",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.inspected} />
          </lable>
        </div>
      ),
    },
    {
      text: "Location No",
      dataField: "locationNo",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "UpDated",
      dataField: "updated",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.updated == 1 ? true : false} />
          </lable>
        </div>
      ),
    },
  ];

  async function fetchData() {
    const url =
      endpoints.getByTypeMaterialReceiptRegisterByRvID +
      "?id=" +
      location.state.id;
    getRequest(url, (data) => {
      formHeader.rvId = data.RvID;
      formHeader.receiptDate = formatDate(new Date(data.ReceiptDate), 10);
      formHeader.rvNo = data.RV_No;
      formHeader.rvDate = formatDate(new Date(data.RV_Date), 3);
      formHeader.status = data.RVStatus;
      formHeader.customer = data.Cust_Code;
      formHeader.customerName = data.Customer;
      formHeader.reference = data.CustDocuNo;
      formHeader.weight = data.TotalWeight;
      formHeader.calcWeight = data.TotalCalculatedWeight;
      formHeader.type = data.Type;

      // Fetch all customers
      getRequest(endpoints.getCustomers, (data1) => {
        const found = data1.find((obj) => obj.Cust_Code === data.Cust_Code);
        formHeader.address = found.Address;

        setFormHeader(formHeader);
        setCalcWeightVal(data.TotalCalculatedWeight);
      });
      //get material details
      const url1 =
        endpoints.getMtrlReceiptDetailsByRvID + "?id=" + location.state.id;
      getRequest(url1, (data2) => {
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
          obj.upDated = obj.UpDated;
          obj.qtyRejected = obj.QtyRejected;
          obj.qtyUsed = obj.QtyUsed;
          obj.qtyReturned = obj.QtyReturned;
        });

        setMaterialArray(data2);

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
      });
    });

    // Fetch all material location list
    getRequest(endpoints.getMaterialLocationList, (data) => {
      setLocationData(data);
    });

    // Fetch all material data
    getRequest(endpoints.getMtrlData, (data) => {
      setMtrlDetails(data);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  // Updates selected material, sets related shape/parameters, and updates database & table
  const changeMtrl = async (name, value) => {
    const newSelectedMtrl = value ? [{ Mtrl_Code: value }] : [];
    setSelectedMtrl(newSelectedMtrl);

    mtrlDetails.map((material) => {
      if (material.Mtrl_Code === value) {
        let url1 = endpoints.getRowByMtrlCode + "?code=" + value;
        getRequest(url1, async (mtrlData) => {
          let Mtrlshape = mtrlData.Shape;
          setShape(Mtrlshape);

          inputPart.shapeMtrlId = mtrlData.ShapeMtrlID;

          let gradeID =
            endpoints.getGradeID + "?gradeid=" + mtrlData.MtrlGradeID;
          getRequest(gradeID, async (gradeData) => {
            inputPart.material = gradeData.Material;
          });

          let url2 = endpoints.getRowByShape + "?shape=" + mtrlData.Shape;
          getRequest(url2, async (shapeData) => {
            if (!shapeData.ShapeID) {
              toast.error(
                "ShapeID for MtrlCode doesnot exist please select other material"
              );
              return;
            }
            inputPart.shapeID = shapeData.ShapeID;
            setInputPart(inputPart);
          });
        });

        if (shape !== null && shape !== undefined && shape !== material.Shape) {
          toast.error("Please select a same type of part");
        }

        if (material.Shape === "Sheet") {
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

        if (material.Shape === "Plate") {
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

        if (
          material.Shape === "Tube Square" ||
          material.Shape === "Tube Rectangle" ||
          material.Shape === "Tube Round"
        ) {
          // Tube
          setPara1Label("Length");
          setPara2Label("");
          setPara3Label("");
          setUnitLabel1("mm");
          setTubeRowSelect(true);
        } else {
          setTubeRowSelect(false);
        }

        if (material.Shape === "Tiles" || material.Shape === "Strip") {
          // Titles, Strip
          setPara1Label("");
          setPara2Label("");
          setPara3Label("");
          setUnitLabel1("");
          setTilesStripRowSelect(true);
        } else {
          setTilesStripRowSelect(false);
        }

        if (material.Shape === "Block") {
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

        if (material.Shape === "Cylinder") {
          // Cylinder
          setPara1Label("Volume");
          setPara2Label("");
          setPara3Label("");
          setUnitLabel1("CubicMtr");
          setCylinderRowSelect(true);
        } else {
          setCylinderRowSelect(false);
        }

        if (material.Shape === "Units") {
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

    setInputPart((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });

    inputPart[name] = value;
    setInputPart(inputPart);

    await delay(500);

    postRequest(endpoints.updateMtrlReceiptDetails, inputPart, (data) => {
      if (data.affectedRows !== 0) {
      } else {
        toast.error("Record Not Updated");
      }
    });

    const newArray = materialArray.map((p) =>
      p.id === partUniqueId
        ? {
            ...p,
            [name]: value,
          }
        : p
    );
    setMaterialArray(newArray);
  };

  const InputHeaderEvent = (e) => {
    const { value, name } = e.target;

    const formattedValue =
      name === "weight" ? value.replace(/(\.\d{3})\d+/, "$1") : value;

    setFormHeader((preValue) => {
      return {
        ...preValue,
        [name]: formattedValue,
      };
    });
  };

  // Updates the header record and shows success/error message
  const updateHeaderFunction = () => {
    postRequest(
      endpoints.updateHeaderMaterialReceiptRegister,
      formHeader,
      (data) => {
        if (data.affectedRows !== 0) {
          setSaveUpdateCount(saveUpdateCount + 1);
          toast.success("Record Updated Successfully");

          setBoolVal1(false);
        } else {
          toast.error("Record Not Updated");
        }
      }
    );
  };

  const saveButtonState = async (e) => {
    e.preventDefault();
    if (formHeader.customer.length == 0) {
      toast.error("Please Select Customer");
    } else if (formHeader.reference.length == 0)
      toast.error("Please Enter Customer Document Material Reference");
    else if (formHeader.weight === "") {
      toast.error(
        "Enter the Customer Material Weight as per Customer Document"
      );
    } else if (parseFloat(inputPart.accepted) > parseFloat(inputPart.qty)) {
      toast.error("Accepted value should be less than or equal to Received");
    } else {
      if (saveUpdateCount == 0) {
        formHeader.receiptDate = formatDate(new Date(), 4);
        formHeader.rvDate = currDate;
        setFormHeader(formHeader);
        await delay(500);

        updateHeaderFunction();

        setBoolVal2(true);
      } else {
        let flag1 = 0;
        for (let i = 0; i < materialArray.length; i++) {
          if (
            materialArray[i].mtrlCode == "" ||
            materialArray[i].qty == "" ||
            materialArray[i].accepted == ""
          ) {
            flag1 = 1;
          }

          if (
            parseFloat(materialArray[i].accepted) >
            parseFloat(materialArray[i].qty)
          ) {
            flag1 = 2;
          }
        }
        if (flag1 == 1) {
          toast.error("Please fill correct Material details");
        } else if (flag1 === 2) {
          toast.error(
            "Accepted value should be less than or equal to Received"
          );
        } else {
          updateHeaderFunction();
        }
      }
    }
  };

  const getRVNo = async () => {
    const requestData = {
      unit: userData.UnitName,
      srlType: "MaterialReceiptVoucher",
      ResetPeriod: "Year",
      ResetValue: 0,
      VoucherNoLength: 4,
    };

    postRequest(endpoints.insertRunNoRow, requestData, async (data) => {});
  };

  const allotRVButtonState = (e) => {
    e.preventDefault();
    getRVNo();

    if (materialArray.length === 0) {
      toast.error("Add Details Before Saving");
    } else if (
      materialArray.length !== 0 &&
      (formHeader.weight == 0.0 ||
        formHeader.weight === "" ||
        formHeader.weight === null ||
        formHeader.weight === undefined)
    ) {
      toast.error(
        "Enter the Customer Material Weight as per Customer Document"
      );
    } else {
      let flag1 = 0;
      for (let i = 0; i < materialArray.length; i++) {
        if (materialArray[i].mtrlCode == "") {
          flag1 = 1;
          break;
        }

        if (
          materialArray[i].dynamicPara1 == "" ||
          materialArray[i].dynamicPara1 == "0" ||
          materialArray[i].dynamicPara1 == 0.0
        ) {
          flag1 = 2;

          break;
        }

        if (
          materialArray[i].qty === "" ||
          materialArray[i].qty === "0" ||
          materialArray[i].qty === 0.0 ||
          materialArray[i].qty === undefined
        ) {
          flag1 = 3;
        }

        if (
          materialArray[i].accepted == "" ||
          materialArray[i].accepted == "0" ||
          materialArray[i].accepted == 0.0 ||
          materialArray[i].accepted === undefined
        ) {
          flag1 = 4;
        }

        if (materialArray[i].locationNo == "") {
          flag1 = 5;
        }
        if (
          parseFloat(materialArray[i].accepted) >
          parseFloat(materialArray[i].qty)
        ) {
          flag1 = 6;
        }
      }

      if (flag1 === 1) {
        toast.error("Select Material");
      } else if (flag1 === 3) {
        toast.error("Received  Qty cannot be Zero");
      } else if (flag1 === 4) {
        toast.error("Accepted Qty cannot be Zero");
      } else if (flag1 === 5) {
        toast.error("Select Location");
      } else if (flag1 === 6) {
        toast.error("Accepted value should be less than or equal to Received");
      } else {
        setShow(true);
      }
    }
  };

  const allotRVYesButton = async (data) => {
    await delay(500);
    setFormHeader(data);
    setBoolVal4(true);
    setBoolVal6(false);
  };
  const deleteRVButton = async () => {
    setDeleteRvModalOpen(true);
  };
  const deleteRVButtonState = () => {
    postRequest(
      endpoints.deleteHeaderMaterialReceiptRegisterAndDetails,
      formHeader,
      (data) => {
        if (data.affectedRows !== 0) {
          toast.success("Record is Deleted");
          nav(
            "/MaterialManagement/Receipt/CustomerJobWork/SheetsAndOthers/New",
            {
              replace: true,
            }
          );
          window.location.reload();
        }
      }
    );
  };

  const addNewMaterial = (e) => {
    setBoolVal3(false);

    const isAnyMtrlCodeEmpty = materialArray.some(
      (item) => item.mtrlCode === ""
    );

    if (isAnyMtrlCodeEmpty) {
      toast.error("Select Material for the Inserted row");
      return;
    }

    let count = materialArray.length + 1;
    let srl = (count <= 9 ? "0" : "") + count;

    inputPart.rvId = formHeader.rvId;
    inputPart.srl = srl;
    inputPart.custCode = formHeader.customer;
    inputPart.mtrlCode = "";
    inputPart.material = "";
    inputPart.shapeMtrlId = 0;
    inputPart.shapeID = 0;
    inputPart.dynamicPara1 = 0.0;
    inputPart.dynamicPara2 = 0.0;
    inputPart.dynamicPara3 = 0.0;
    inputPart.qty = 0.0;
    inputPart.inspected = 0;
    inputPart.accepted = 0.0;
    inputPart.totalWeightCalculated = 0.0;
    inputPart.totalWeight = 0.0;
    inputPart.locationNo = "";
    inputPart.updated = 0;
    inputPart.qtyRejected = 0.0;
    inputPart.qtyUsed = 0.0;
    inputPart.qtyReturned = 0.0;

    setInsCheck(false);
    inputPart.inspected = 0;
    setBoolVal5(false);

    //insert blank row in table
    postRequest(endpoints.insertMtrlReceiptDetails, inputPart, (data) => {
      if (data.affectedRows !== 0) {
        let id = data.insertId;
        inputPart.id = id;

        setPartUniqueId(id);
        let newRow = {
          id: id,
          srl: srl,
          mtrlCode: "",
          dynamicPara1: 0,
          dynamicPara2: 0,
          dynamicPara3: 0,
          qty: 0,
          inspected: "",
          locationNo: "",
          updated: "",
          totalWeightCalculated: 0,
        };

        setMaterialArray([...materialArray, newRow]);
        setSelectedMtrl([]);
      } else {
        toast.error("Record Not Inserted");
      }
    });
  };

  const deleteButtonState = () => {
    setModalOpen(true);
  };

  const changeMaterialHandle = async (e, id) => {
    const { value, name } = e.target;

    const formattedValue =
      name === "totalWeight" ? value.replace(/(\.\d{3})\d+/, "$1") : value;

    for (let i = 0; i < materialArray.length; i++) {
      const element = materialArray[i];

      if (element.id === id) {
        element[name] = formattedValue;
      }
    }

    inputPart[name] = formattedValue;
    if (name === "inspected") {
      if (e.target.checked) {
        inputPart.inspected = true;
        setBoolVal5(true);
        setInsCheck(true);
      } else {
        inputPart.inspected = false;
        setBoolVal5(false);
        setInsCheck(false);
      }
    }
    if (name === "qty") {
      setBoolVal5(false);
      setInsCheck(false);
      inputPart.inspected = false;
      inputPart.accepted = 0;
    }
    setInputPart(inputPart);

    if (name === "accepted") {
      if (e.target.value) {
        let val = e.target.value;

        if (parseFloat(inputPart.accepted) > parseFloat(inputPart.qty)) {
          toast.error(
            "Accepted value should be less than or equal to Received"
          );
        } else {
          let url = endpoints.getSpecific_Wt + "?code=" + inputPart.mtrlCode;
          getRequest(url, async (data) => {
            let TotalWeightCalculated =
              parseFloat(inputPart.accepted) *
              getWeight(
                data,
                parseFloat(inputPart.dynamicPara1),
                parseFloat(inputPart.dynamicPara2),
                parseFloat(inputPart.dynamicPara3)
              );

            TotalWeightCalculated = TotalWeightCalculated / (1000 * 1000);

            inputPart.totalWeightCalculated = parseFloat(
              TotalWeightCalculated
            ).toFixed(3);

            inputPart.totalWeight = parseFloat(TotalWeightCalculated).toFixed(
              3
            );

            inputPart["TotalWeightCalculated"] = TotalWeightCalculated;
            inputPart["TotalWeight"] = TotalWeightCalculated;

            setInputPart(inputPart);

            postRequest(
              endpoints.updateHeaderMaterialReceiptRegister,
              formHeader,
              (data) => {}
            );

            const newArray = materialArray.map((p) =>
              p.id === id
                ? {
                    ...p,
                    [name]: formattedValue,
                    qty: inputPart.qty,
                    inspected: inputPart.inspected == true ? 1 : 0,
                    totalWeightCalculated: inputPart.totalWeightCalculated,
                  }
                : p
            );
            setMaterialArray(newArray);
            await delay(500);

            let totwt = 0;
            for (let i = 0; i < newArray.length; i++) {
              const element = newArray[i];
              totwt = totwt + parseFloat(element.totalWeightCalculated);
            }
            setCalcWeightVal(parseFloat(totwt).toFixed(3));
            formHeader.calcWeight = parseFloat(totwt).toFixed(3);
            setFormHeader(formHeader);
            delay(500);

            postRequest(
              endpoints.updateHeaderMaterialReceiptRegister,
              formHeader,
              (data) => {
                if (data.affectedRows !== 0) {
                }
              }
            );
          });
        }
      }
    }

    const newArray = materialArray.map((p) =>
      p.id === id
        ? {
            ...p,
            [name]: formattedValue,
            qty: inputPart.qty,
            inspected: inputPart.inspected == true ? 1 : 0,
          }
        : p
    );
    setMaterialArray(newArray);
    await delay(500);

    postRequest(
      endpoints.updateMtrlReceiptDetailsAfter,
      inputPart,
      (data) => {}
    );
    await delay(500);
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row) => {
      setSelectedMtrl([{ Mtrl_Code: row.mtrlCode }]);

      if (row.updated === 1) {
        setRmvBtn(true);
        setAddBtn(false);
      } else {
        setRmvBtn(false);
        setAddBtn(true);
      }

      const url1 = endpoints.getMtrlReceiptDetailsByID + "?id=" + row.id;
      getRequest(url1, async (data2) => {
        data2?.forEach((obj) => {
          obj.id = obj.Mtrl_Rv_id;
          obj.mtrlRvId = obj.Mtrl_Rv_id;
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
          obj.qty = obj.Qty;
          obj.inspected = obj.Inspected;
          obj.accepted = obj.Accepted;
          obj.totalWeightCalculated = obj.TotalWeightCalculated;
          obj.totalWeight = obj.TotalWeight;
          obj.locationNo = obj.LocationNo;
          obj.updated = obj.UpDated;
          obj.qtyRejected = obj.QtyRejected;
          obj.qtyUsed = obj.QtyUsed;
          obj.qtyReturned = obj.QtyReturned;
        });

        setMtrlArray(data2);
        data2?.map(async (obj) => {
          if (obj.id === row.id) {
            setMtrlStock(obj);
            setInputPart({
              qtyRejected: obj.QtyRejected,
              id: obj.Mtrl_Rv_id,
              srl: obj.Srl,
              mtrlCode: obj.Mtrl_Code,
              custCode: obj.Cust_Code,
              dynamicPara1: parseInt(obj.DynamicPara1),
              dynamicPara2: parseInt(obj.DynamicPara2),
              dynamicPara3: parseInt(obj.DynamicPara3),
              shapeID: obj.ShapeID,
              qty: parseInt(obj.Qty),
              inspected: obj.Inspected,
              locationNo: obj.LocationNo,
              updated: obj.UpDated,
              accepted: parseInt(obj.Accepted),
              totalWeightCalculated: obj.TotalWeightCalculated,
              totalWeight: obj.TotalWeight,
              qtyUsed: parseInt(obj.QtyUsed),
              qtyReturned: obj.QtyReturned,
            });

            if (obj.ShapeID === 1) {
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
      });
    },
  };

  const addToStock = async () => {
    if (Object.keys(mtrlStock).length === 0) {
      toast.error("Please Select Material");
    } else {
      let url = endpoints.getSpecific_Wt + "?code=" + inputPart.mtrlCode;
      getRequest(url, async (data) => {
        const weight = getWeight(
          data,
          parseFloat(inputPart.dynamicPara1),
          parseFloat(inputPart.dynamicPara2),
          parseFloat(inputPart.dynamicPara3)
        );

        const finalWeight = Math.round(weight * 0.000001 * 100) / 100;

        const newRow = {
          mtrlRvId: mtrlStock.Mtrl_Rv_id,
          custCode: mtrlStock.Cust_Code,
          customer: formHeader.customerName,
          custDocuNo: "",
          rvNo: formHeader.rvNo,
          mtrlCode: mtrlStock.Mtrl_Code,
          shapeID: mtrlStock.shapeID,
          shape: "",
          material: mtrlStock.material,
          dynamicPara1: mtrlStock.dynamicPara1,
          dynamicPara2: mtrlStock.dynamicPara2,
          dynamicPara3: mtrlStock.dynamicPara3,
          dynamicPara4: "0.00",
          locked: 0,
          scrap: 0,
          issue: 0,
          weight: finalWeight,
          scrapWeight: "0.00",
          srl: mtrlStock.Srl,
          ivNo: "",
          ncProgramNo: "",
          locationNo: mtrlStock.locationNo,
          accepted: mtrlStock.accepted,
        };

        postRequest(endpoints.insertMtrlStockList, newRow, async (data) => {
          if (data.affectedRows !== 0) {
            toast.success("Stock Added Successfully");

            setBoolValStock("on");

            setRmvBtn(true);
            setAddBtn(false);
          } else {
            toast.error("Stock Not Added");
          }
        });

        let updateObj = {
          id: mtrlStock.Mtrl_Rv_id,
          upDated: 1,
        };
        postRequest(
          endpoints.updateMtrlReceiptDetailsUpdated,
          updateObj,
          async (data) => {}
        );

        for (let i = 0; i < materialArray.length; i++) {
          if (materialArray[i].id === mtrlStock.id) {
            materialArray[i].updated = 1;
          }
        }
        await delay(500);
        setInputPart({ ...inputPart, updated: 1 });
        setMaterialArray(materialArray);
      });
    }
  };

  const removeStock = async () => {
    if (Object.keys(mtrlStock).length === 0) {
      toast.error("Please Select Material");
    } else {
      const requestData = {
        Mtrl_Rv_id: mtrlStock.Mtrl_Rv_id,
        Mtrl_Code: mtrlStock.Mtrl_Code,
        Accepted: inputPart.accepted,
      };

      postRequest(
        endpoints.deleteMtrlStockByRVNo,
        requestData,
        async (data) => {
          if (data.countResult[0].count < parseFloat(inputPart.accepted)) {
            toast.error(
              "Received Material Already used, to return create a Issue Voucher"
            );
            return;
          } else {
            if (data.inUseResult[0].inUseCount > 0) {
              toast.error(
                "Material already in use for production, cannot take out from stock"
              );
              return;
            } else {
              if (data.deletionResult.affectedRows !== 0) {
                toast.success("Stock Removed Successfully");

                setBoolValStock("off");
                setAddBtn(true);
                setRmvBtn(false);

                for (let i = 0; i < materialArray.length; i++) {
                  if (materialArray[i].id == mtrlStock.id) {
                    materialArray[i].updated = 0;
                  }
                }
                await delay(200);
                setInputPart({ ...inputPart, updated: 0 });
                setMaterialArray(materialArray);
              } else {
                toast.success("Stock Removed Successfully");
              }
            }
          }
        }
      );

      let updateObj = {
        id: mtrlStock.Mtrl_Rv_id,
        upDated: 0,
      };
      await postRequest(
        endpoints.updateMtrlReceiptDetailsUpdated,
        updateObj,
        async (data) => {}
      );

      await updateStockRegister();
    }
  };

  const updateStockRegister = async () => {
    try {
      const requestData = {
        rvId: formHeader.rvId,
        custCode: formHeader.customer,
      };

      const response = await postRequest(
        endpoints.updateAfterRemoveStock,
        requestData
      );
    } catch (error) {}
  };

  const handleYes = () => {
    if (inputPart?.id?.length === 0) {
      toast.error("Select Material");
    } else {
      postRequest(endpoints.deleteMtrlReceiptDetails, inputPart, (data) => {
        if (data.affectedRows !== 0) {
          const newArray = materialArray.filter((p) => p.id !== inputPart.id);
          setMaterialArray(newArray);
          toast.success("Material Deleted");
          setInputPart({
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
            qty: 0,
            inspected: "",
            accepted: 0,
            totalWeightCalculated: "",
            totalWeight: "",
            locationNo: "",
            updated: "",
            qtyRejected: 0,
            qtyUsed: 0,
            qtyReturned: 0,
          });

          setSelectedMtrl([]);

          const sumTotalWeightCalculated = newArray.reduce(
            (sum, obj) => sum + parseFloat(obj.totalWeightCalculated),
            0
          );

          setCalcWeightVal(sumTotalWeightCalculated.toFixed(3));

          formHeader.calcWeight = sumTotalWeightCalculated.toFixed(3);
          setFormHeader(formHeader);
          delay(500);

          postRequest(
            endpoints.updateHeaderMaterialReceiptRegister,
            formHeader,
            (data) => {
              if (data.affectedRows !== 0) {
              }
            }
          );
        }
      });
    }
    setModalOpen(false);
  };

  const handleRVYes = () => {
    deleteRVButtonState();
    setDeleteRvModalOpen(false);
  };

  const blockInvalidQtyChar = (e) =>
    ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  const filterMaterials = () => {
    if (location?.state?.type === "sheets") {
      return mtrlDetails.filter(
        (material) =>
          material.Shape !== "Units" &&
          material.Shape !== "Cylinder" &&
          material.Shape !== null &&
          material.Mtrl_Code !== ""
      );
    } else if (location?.state?.type === "units") {
      return mtrlDetails.filter(
        (material) =>
          material.Shape === "Units" &&
          material.Shape !== null &&
          material.Mtrl_Code !== ""
      );
    } else {
      return mtrlDetails.filter(
        (material) => material.Shape !== null && material.Mtrl_Code !== ""
      );
    }
  };

  return (
    <div>
      <CreateYesNoModal
        show={show}
        setShow={setShow}
        formHeader={formHeader}
        allotRVYesButton={allotRVYesButton}
      />

      <DeleteSerialYesNoModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        message="You want to delete material,are you sure ?"
        handleYes={handleYes}
      />
      <DeleteRVModal
        deleteRvModalOpen={deleteRvModalOpen}
        setDeleteRvModalOpen={setDeleteRvModalOpen}
        message="You want to delete RV,are you sure ?"
        handleRVYes={handleRVYes}
      />

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
              value={formHeader.receiptDate}
              readOnly
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
              value={formHeader.rvNo}
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
              value={formHeader.rvDate}
              readOnly
            />
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label
              className="form-label  mt-1"
              style={{ whiteSpace: "nowrap" }}
            >
              Status
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="status"
              value={formHeader.status}
              readOnly
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "70px" }}>
            <label className="form-label mt-1">Weight</label>

            <input
              className="input-disabled mt-1"
              type="number"
              onKeyDown={blockInvalidChar}
              min="0"
              autoComplete="off"
              name="weight"
              value={
                formHeader.weight === "0" || formHeader.weight === 0
                  ? ""
                  : formHeader.weight
              }
              onChange={InputHeaderEvent}
              disabled={boolVal4}
            />
          </div>
        </div>
        <div className="row">
          <div className="d-flex col-md-5" style={{ gap: "20px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Customer
            </label>

            <select className="ip-select mt-1" name="customer" disabled={true}>
              <option value={formHeader.customer} disabled selected>
                {formHeader.customerName}
              </option>
            </select>
          </div>

          <div className="d-flex col-md-4" style={{ gap: "10px" }}>
            <label className="form-label mt-1">Reference</label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="reference"
              value={formHeader.reference}
              onChange={InputHeaderEvent}
              disabled={boolVal2 && boolVal4}
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Calculated Weight
            </label>

            <input
              className="input-disabled mt-1"
              type="number"
              name="calculatedWeight"
              value={formHeader.calcWeight}
              readOnly
            />
          </div>
        </div>

        <div className="row">
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
            <button
              className="button-style"
              onClick={saveButtonState}
              disabled={boolVal4}
            >
              Save
            </button>

            <button
              className="button-style"
              disabled={boolVal4}
              onClick={allotRVButtonState}
            >
              Allot RV No
            </button>

            <button
              className="button-style"
              disabled={boolVal4}
              onClick={deleteRVButton}
            >
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
          <div className="col-md-8 col-sm-12">
            <div style={{ height: "400px", overflowY: "scroll" }}>
              <BootstrapTable
                keyField="id"
                columns={columns}
                data={materialArray}
                striped
                hover
                condensed
                selectRow={selectRow}
                headerClasses="header-class tableHeaderBGColor"
              ></BootstrapTable>
            </div>
          </div>
          <div
            className="col-md-4 col-sm-12"
            style={{ overflowY: "scroll", height: "400px" }}
          >
            <div className=" form-bg">
              <div
                className="d-flex justify-content-center mb-2"
                style={{ gap: "20px" }}
              >
                <button
                  className="button-style "
                  disabled={boolVal4}
                  onClick={addNewMaterial}
                >
                  Add Serial
                </button>

                <button
                  className="button-style "
                  disabled={boolVal4}
                  onClick={deleteButtonState}
                >
                  Delete Serial
                </button>
              </div>

              <div
                className="d-flex justify-content-center "
                style={{ gap: "20px" }}
              >
                <button
                  className="button-style "
                  disabled={rmvBtn || boolVal6}
                  onClick={addToStock}
                >
                  Add to stock
                </button>

                <button
                  className="button-style "
                  disabled={addBtn || boolVal6}
                  onClick={removeStock}
                >
                  Remove stock
                </button>
              </div>

              <div className="row">
                <div className="ip-box form-bg">
                  <label
                    className="form-label"
                    style={{ textDecoration: "underline" }}
                  >
                    Serial Details
                  </label>
                  <div className="row">
                    <div className="col-md-4">
                      <label
                        className="form-label mt-1"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Mtrl Code
                      </label>
                    </div>

                    <div className="col-md-6">
                      <Typeahead
                        id="mtrlCode"
                        className="input-disabled mt-1"
                        labelKey="Mtrl_Code"
                        options={filterMaterials()}
                        selected={selectedMtrl}
                        onChange={(selected) =>
                          changeMtrl("mtrlCode", selected[0]?.Mtrl_Code)
                        }
                        disabled={
                          boolVal3 ||
                          boolVal4 ||
                          boolVal5 ||
                          materialArray.length === 0
                        }
                        placeholder="Select Material"
                      />
                    </div>
                  </div>

                  {materialArray.length === 0 && (
                    <div>
                      <div className="row mt-1">
                        <div className="col-md-4">
                          <label className="form-label">Para 1</label>
                        </div>
                        <div className="col-md-6">
                          <input
                            className="input-disabled mt-2"
                            name="dynamicPara1"
                            disabled
                            min="0"
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">mm</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <label className="form-label">Para 2</label>
                        </div>
                        <div className="col-md-6">
                          <input
                            className="input-disabled mt-1"
                            name="dynamicPara2"
                            min="0"
                            disabled
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">mm</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <label className="form-label">Para 3</label>
                        </div>
                        <div className="col-md-6 ">
                          <input
                            className="input-disabled mt-1"
                            name="dynamicPara3"
                            min="0"
                            disabled
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">mm</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {sheetRowSelect && materialArray.length !== 0 && (
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
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5 || materialArray.length === 0}
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
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
                            value={
                              inputPart.dynamicPara2 === "0" ||
                              inputPart.dynamicPara2 === 0
                                ? ""
                                : inputPart.dynamicPara2
                            }
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
                            disabled={boolVal5}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">{unitLabel2}</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {plateRowSelect && materialArray.length !== 0 && (
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
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            min="0"
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
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
                            value={
                              inputPart.dynamicPara2 === "0" ||
                              inputPart.dynamicPara2 === 0
                                ? ""
                                : inputPart.dynamicPara2
                            }
                            min="0"
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
                            disabled={boolVal5}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">{unitLabel2}</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {tubeRowSelect && materialArray.length !== 0 && (
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
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            min="0"
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">{unitLabel1}</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {tilesStripRowSelect && materialArray.length !== 0 && (
                    <div></div>
                  )}

                  {blockRowSelect && materialArray.length !== 0 && (
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
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            min="0"
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
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
                            value={
                              inputPart.dynamicPara2 === "0" ||
                              inputPart.dynamicPara2 === 0
                                ? ""
                                : inputPart.dynamicPara2
                            }
                            min="0"
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
                            disabled={boolVal5}
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
                            value={
                              inputPart.dynamicPara3 === "0" ||
                              inputPart.dynamicPara3 === 0
                                ? ""
                                : inputPart.dynamicPara3
                            }
                            min="0"
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
                            disabled={boolVal5}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">{unitLabel3}</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {cylinderRowSelect && materialArray.length !== 0 && (
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
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            min="0"
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">{unitLabel1}</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {unitRowSelect && materialArray.length !== 0 && (
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
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            min="0"
                            onKeyDown={blockInvalidChar}
                            onChange={(e) => {
                              changeMaterialHandle(e, inputPart.id);
                            }}
                          />
                        </div>
                        <div className="col-md-2">
                          <label className="form-label">{unitLabel1}</label>
                        </div>
                      </div>
                    </div>
                  )}

                  <label
                    className="form-label"
                    style={{ textDecoration: "underline" }}
                  >
                    Quantity Details
                  </label>
                  <div className="d-flex col-md-12" style={{ gap: "10px" }}>
                    <div className=" d-flex col-md-6" style={{ gap: "10px" }}>
                      <label className="form-label mt-1">Received</label>
                      <input
                        className="input-disabled mt-1"
                        type="number"
                        name="qty"
                        value={
                          inputPart.qty === "0" || inputPart.qty === 0
                            ? ""
                            : inputPart.qty
                        }
                        disabled={boolVal4 || materialArray.length === 0}
                        onKeyDown={blockInvalidQtyChar}
                        min="0"
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                      />
                    </div>

                    <div className=" d-flex col-md-6" style={{ gap: "10px" }}>
                      <input
                        className="form-check-input mt-2"
                        type="checkbox"
                        id="flexCheckDefault"
                        name="inspected"
                        checked={inputPart.inspected}
                        disabled={boolVal4 || materialArray.length === 0}
                        onKeyDown={blockInvalidQtyChar}
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                      />
                      <label className="form-label  mt-2">Inspected</label>
                    </div>
                  </div>

                  <div className="d-flex col-md-12" style={{ gap: "10px" }}>
                    <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                      <label className="form-label mt-2">Accepted</label>
                      <input
                        className="input-disabled mt-2"
                        type="number"
                        name="accepted"
                        onKeyDown={blockInvalidQtyChar}
                        value={
                          inputPart.accepted === "0" || inputPart.accepted === 0
                            ? ""
                            : inputPart.accepted
                        }
                        disabled={boolVal4 || !boolVal5}
                        min="0"
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                      />
                    </div>

                    <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                      <input
                        className="form-check-input mt-3"
                        type="checkbox"
                        id="flexCheckDefault"
                        name="updated"
                        checked={inputPart.updated === 1 ? true : false}
                        disabled={
                          boolVal3 || boolVal4 || materialArray.length === 0
                        }
                        onChange={changeMaterialHandle}
                      />
                      <label className="form-label mt-2">Updated</label>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label
                        className="form-label"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Wt Calculated 2
                      </label>
                    </div>
                    <div className="col-md-6">
                      <input
                        className="input-disabled mt-1"
                        name="totalWeightCalculated"
                        value={
                          inputPart.totalWeightCalculated === "0" ||
                          inputPart.totalWeightCalculated === 0
                            ? ""
                            : inputPart.totalWeightCalculated
                        }
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Weight</label>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        className="input-disabled mt-1"
                        name="totalWeight"
                        min="0"
                        value={
                          inputPart.totalWeight === "0" ||
                          inputPart.totalWeight === 0
                            ? ""
                            : inputPart.totalWeight
                        }
                        onChange={changeMaterialHandle}
                        onKeyDown={blockInvalidChar}
                        disabled={boolVal4 || materialArray.length === 0}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 ">
                      <label className="form-label">Location</label>
                    </div>
                    <div className="col-md-6 mt-1">
                      <select
                        className="input-disabled mt-1"
                        style={{ width: "100%" }}
                        min="0"
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                        value={inputPart.locationNo}
                        disabled={boolVal4 || materialArray.length === 0}
                        name="locationNo"
                      >
                        <option value="" disabled selected>
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
      </div>
    </div>
  );
}

export default OpenButtonDraftSheetUnit;
