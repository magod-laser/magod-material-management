import React, { useEffect, useState } from "react";
import { formatDate, getWeight } from "../../../../utils";
import { toast } from "react-toastify";
import CreateYesNoModal from "../../components/CreateYesNoModal";
import DeleteSerialYesNoModal from "../../components/DeleteSerialYesNoModal";
import DeleteRVModal from "../../components/DeleteRVModal";
import { useNavigate } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function NewSheetsUnits(props) {
  const nav = useNavigate();
  const [show, setShow] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteRvModalOpen, setDeleteRvModalOpen] = useState(false);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const currDate = new Date()
    .toJSON()
    .slice(0, 10)
    .split("-")
    .reverse()
    .join("/");

  //initial disable
  const [boolVal1, setBoolVal1] = useState(true);
  //after clicking save button
  const [boolVal2, setBoolVal2] = useState(false);
  //after clicking add button
  const [boolVal3, setBoolVal3] = useState(true);
  //after clicking allot rv button
  const [boolVal4, setBoolVal4] = useState(false);
  //falg for add to stock and remove stock
  const [boolValStock, setBoolValStock] = useState("off");

  //after selecting material disable dynamic para 1 2 3
  const [boolPara1, setBoolPara1] = useState(false);
  const [boolPara2, setBoolPara2] = useState(false);
  const [boolPara3, setBoolPara3] = useState(false);

  const [mtrlArray, setMtrlArray] = useState([]);
  const [checkboxState, setCheckboxState] = useState();
  const [mtrlStock, setMtrlStock] = useState({});
  //after clicking inspected checkbox
  const [boolVal5, setBoolVal5] = useState(false);

  //after clicking alllotrv enable add to stock / remove stock
  const [boolVal6, setBoolVal6] = useState(true);
  const [boolVal7, setBoolVal7] = useState(true);

  // enable add to stock / remove stock
  // const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [rmvBtn, setRmvBtn] = useState(false);
  const [addBtn, setAddBtn] = useState(false);

  const [insCheck, setInsCheck] = useState(false);
  const [calcWeightVal, setCalcWeightVal] = useState(0);
  const [saveUpdateCount, setSaveUpdateCount] = useState(0);
  const [shape, setShape] = useState();

  const [formHeader, setFormHeader] = useState({
    rvId: "",
    receiptDate: "", //formatDate(new Date(), 4),
    rvNo: "Draft",
    rvDate: "", //currDate,
    status: "Created",
    customer: props.type2 === "purchase" ? "0000" : "",
    customerName:
      props.type2 === "purchase" ? "MAGOD LASER MACHINING PVT LTD" : "",
    reference: "",
    weight: "0",
    calcWeight: "0",
    type: props.type === "sheets" ? "Sheets" : "Units",
    // address: "",
    address:
      props.type2 === "purchase"
        ? "Plot No 72 , Phase II KAIDB Indl  Area KAIDB Indl  Area Jigani Anekal Taluk"
        : "",
  });

  const [selectedMtrl, setSelectedMtrl] = useState([]);

  let [custdata, setCustdata] = useState([]);
  let [mtrlDetails, setMtrlDetails] = useState([]);
  let [locationData, setLocationData] = useState([]);
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

  // State to keep track of selected rows
  const [selectedRows, setSelectedRows] = useState([]);

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
    totalWeightCalculated: "",
    totalWeight: "",
    locationNo: "",
    upDated: "",
    // qtyAccepted: 0,
    // qtyReceived: 0,
    qtyRejected: 0,
    qtyUsed: 0,
    qtyReturned: 0,
  });

  const [serialNumber, setSerialNumber] = useState(materialArray.length);

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
      sort: true,
    },
    {
      text: unitLabel1 !== "" ? para1Label : "",
      dataField: "dynamicPara1",
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent); // Converts the value to an integer, truncating decimals
      },
    },
    // + "(" + unitLabel1 + ")"
    {
      text: unitLabel2 !== "" ? para2Label : "",
      dataField: "dynamicPara2",
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent); // Converts the value to an integer, truncating decimals
      },
    },
    {
      text: unitLabel3 !== "" ? para3Label : "",
      dataField: "dynamicPara3",
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent); // Converts the value to an integer, truncating decimals
      },
    },
    {
      text: "Qty",
      dataField: "qty",
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent); // Converts the value to an integer, truncating decimals
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
    getRequest(endpoints.getCustomers, (data) => {
      if (props.type2 === "purchase") {
        data = data.filter((obj) => obj.Cust_Code == 0);
      }
      //Cust_Code == 0
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }
      setCustdata(data);
    });
    getRequest(endpoints.getMaterialLocationList, (data) => {
      setLocationData(data);
    });
    getRequest(endpoints.getMtrlData, (data) => {
      setMtrlDetails(data);
    });
    // console.log("data = ", custdata);
  }

  useEffect(() => {
    fetchData();
    //setPartArray(partArray);
  }, []); //[inputPart]);

  // useEffect(() => {
  //   setFormHeader(formHeader);
  // }, [formHeader]); //[inputPart]);

  // console.log(formHeader);
  let changeCustomer = async (e) => {
    //e.preventDefault();
    //const { value, name } = e.target;
    // console.log(custdata);
    const found = custdata.find((obj) => obj.Cust_Code === e[0].Cust_Code);
    // setCustDetailVal(found.Address);
    // console.log("found.Address", found.Address);

    setFormHeader((preValue) => {
      // console.log(preValue);
      return {
        ...preValue,
        //[name]: value,
        customerName: found.Cust_name,
        customer: found.Cust_Code,
        address: found.Address,
      };
    });

    // getRequest(endpoints.getCustBomList, (data) => {
    //   const foundPart = data.filter((obj) => obj.Cust_code == value);
    //   setMtrlDetails(foundPart);
    // });
  };

  let changeCustomer1 = async (e) => {
    e.preventDefault();
    const { value, name } = e.target;
    // console.log("e.target", e.target);
    const found = custdata.find((obj) => obj.Cust_Code === value);
    //setCustDetailVal(found.Address);

    // console.log("found.Address", found.Address);
    setFormHeader((preValue) => {
      //console.log(preValue)
      return {
        ...preValue,
        [name]: value,
        customerName: found.Cust_name,
        customer: found.Cust_Code,
        address: found.Address,
      };
    });

    // getRequest(endpoints.getCustBomList, (data) => {
    //   const foundPart = data.filter((obj) => obj.Cust_code == value);
    //   setMtrlDetails(foundPart);
    // });
  };

  // console.log("customerName", formHeader);
  // let changeMtrl = async (e) => {
  //   e.preventDefault();
  //   const { value, name } = e.target;
  //   //console.log("value = ", value);
  //   mtrlDetails.map((material) => {
  //     if (material.Mtrl_Code === value) {
  //       //update the mtrl_data related columns
  //       let url1 = endpoints.getRowByMtrlCode + "?code=" + value;
  //       getRequest(url1, async (mtrlData) => {
  //         // console.log("mtrldata= ", mtrlData.Shape);
  //         let Mtrlshape = mtrlData.Shape;
  //         setShape(Mtrlshape);
  //         inputPart.material = mtrlData.Mtrl_Type;
  //         inputPart.shapeMtrlId = mtrlData.ShapeMtrlID;
  //         let url2 = endpoints.getRowByShape + "?shape=" + mtrlData.Shape;
  //         getRequest(url2, async (shapeData) => {
  //           //console.log("shapedata = ", shapeData);
  //           inputPart.shapeID = shapeData.ShapeID;
  //           setInputPart(inputPart);

  //           // if (shape !== material.Shape) {
  //           //   toast.error("Please select a same type of part");
  //           //   console.log("Please select a same type of part");
  //           // }
  //         });
  //       });
  //       // console.log("material.Shape", material.Shape);

  //       if (shape !== null && shape !== undefined && shape !== material.Shape) {
  //         toast.error("Please select a same type of part");
  //       }

  //       // if (material.Shape === "Units") {
  //       //   setPara1Label("Qty"); //Nos
  //       //   setPara2Label("");
  //       //   setPara3Label("");
  //       //   setBoolPara1(false);
  //       //   setBoolPara2(true);
  //       //   setBoolPara3(true);
  //       //   setUnitLabel1("Nos");
  //       //   setUnitLabel2("");
  //       //   setUnitLabel3("");
  //       // } else if (material.Shape === "Block") {
  //       //   setPara1Label("Length"); //mm
  //       //   setPara2Label("Width");
  //       //   setPara3Label("Height");
  //       //   setBoolPara1(false);
  //       //   setBoolPara2(false);
  //       //   setBoolPara3(false);
  //       //   setUnitLabel1("mm");
  //       //   setUnitLabel2("mm");
  //       //   setUnitLabel3("mm");
  //       // } else if (material.Shape === "Plate") {
  //       //   setPara1Label("Length"); //mm
  //       //   setPara2Label("Width");
  //       //   setPara3Label("");
  //       //   setBoolPara1(false);
  //       //   setBoolPara2(false);
  //       //   setBoolPara3(true);
  //       //   setUnitLabel1("mm");
  //       //   setUnitLabel2("mm");
  //       //   setUnitLabel3("");
  //       // } else if (material.Shape === "Sheet") {
  //       //   setPara1Label("Width"); //mm
  //       //   setPara2Label("Length"); //mm
  //       //   setPara3Label("");
  //       //   setBoolPara1(false);
  //       //   setBoolPara2(false);
  //       //   setBoolPara3(true);
  //       //   setUnitLabel1("mm");
  //       //   setUnitLabel2("mm");
  //       //   setUnitLabel3("");
  //       // } else if (material.Shape === "Tiles") {
  //       //   setPara1Label("");
  //       //   setPara2Label("");
  //       //   setPara3Label("");
  //       //   setBoolPara1(true);
  //       //   setBoolPara2(true);
  //       //   setBoolPara3(true);
  //       //   setUnitLabel1("");
  //       //   setUnitLabel2("");
  //       //   setUnitLabel3("");
  //       // } else if (material.Shape.includes("Tube")) {
  //       //   setPara1Label("Length"); //mm
  //       //   setPara2Label("");
  //       //   setPara3Label("");
  //       //   setBoolPara1(false);
  //       //   setBoolPara2(true);
  //       //   setBoolPara3(true);
  //       //   setUnitLabel1("mm");
  //       //   setUnitLabel2("");
  //       //   setUnitLabel3("");
  //       // } else if (material.Shape.includes("Cylinder")) {
  //       //   setPara1Label("Volume"); //CubicMtr
  //       //   setPara2Label("");
  //       //   setPara3Label("");
  //       //   setBoolPara1(false);
  //       //   setBoolPara2(true);
  //       //   setBoolPara3(true);
  //       //   setUnitLabel1("CubicMtr");
  //       //   setUnitLabel2("");
  //       //   setUnitLabel3("");
  //       // }

  //       if (material.Shape === "Sheet") {
  //         // Sheet
  //         setPara1Label("Width");
  //         setPara2Label("Length");
  //         setUnitLabel1("mm");
  //         setUnitLabel2("mm");
  //         setSheetRowSelect(true);
  //       } else {
  //         setSheetRowSelect(false);
  //       }

  //       if (material.Shape === "Plate") {
  //         // Plate
  //         setPara1Label("Length");
  //         setPara2Label("Width");
  //         setUnitLabel1("mm");
  //         setUnitLabel2("mm");
  //         setPlateRowSelect(true);
  //       } else {
  //         setPlateRowSelect(false);
  //       }

  //       if (material.Shape.includes("Tube")) {
  //         // Tube
  //         setPara1Label("Length");
  //         setUnitLabel1("mm");
  //         setTubeRowSelect(true);
  //       } else {
  //         setTubeRowSelect(false);
  //       }

  //       if (material.Shape === "Tiles" || material.Shape === "Strip") {
  //         // Titles, Strip
  //         setPara1Label("");
  //         setUnitLabel1("");
  //         setTilesStripRowSelect(true);
  //       } else {
  //         setTilesStripRowSelect(false);
  //       }

  //       if (material.Shape === "Block") {
  //         // Block
  //         setPara1Label("Length");
  //         setPara2Label("Width");
  //         setPara3Label("Height");
  //         setUnitLabel1("mm");
  //         setUnitLabel2("mm");
  //         setUnitLabel3("mm");
  //         setBlockRowSelect(true);
  //       } else {
  //         setBlockRowSelect(false);
  //       }

  //       if (material.Shape === "Cylinder") {
  //         // Cylinder
  //         setPara1Label("Volume");
  //         setUnitLabel1("CubicMtr");
  //         setCylinderRowSelect(true);
  //       } else {
  //         setCylinderRowSelect(false);
  //       }

  //       if (material.Shape === "Units") {
  //         // Units
  //         setPara1Label("Qty");
  //         setUnitLabel1("Nos");
  //         setUnitRowSelect(true);
  //       } else {
  //         setUnitRowSelect(false);
  //       }
  //     }
  //   });
  //   //set inputPart set material code
  //   setInputPart((preValue) => {
  //     //console.log(preValue)
  //     return {
  //       ...preValue,
  //       [name]: value,
  //     };
  //   });

  //   inputPart[name] = value;
  //   setInputPart(inputPart);

  //   // console.log("Before update = ", inputPart.shapeMtrlId);
  //   console.log("inputPart ..... ", inputPart);

  //   await delay(500);
  //   //update database row
  //   postRequest(endpoints.updateMtrlReceiptDetails, inputPart, (data) => {
  //     if (data.affectedRows !== 0) {
  //     } else {
  //       toast.error("Record Not Updated");
  //     }
  //   });

  //   //update table grid
  //   const newArray = materialArray.map((p) =>
  //     //p.id === "d28d67b2-6c32-4aae-a7b6-74dc985a3cff"
  //     p.id === partUniqueId
  //       ? {
  //           ...p,
  //           [name]: value,
  //         }
  //       : p
  //   );
  //   setMaterialArray(newArray);
  // };

  console.log("mtrlStock", mtrlStock);

  let changeMtrl = async (name, value) => {
    const newSelectedMtrl = value ? [{ Mtrl_Code: value }] : [];
    setSelectedMtrl(newSelectedMtrl);
    mtrlDetails.map((material) => {
      if (material.Mtrl_Code === value) {
        //update the mtrl_data related columns
        let url1 = endpoints.getRowByMtrlCode + "?code=" + value;
        getRequest(url1, async (mtrlData) => {
          console.log("mtrldata= ", mtrlData.Shape);
          let Mtrlshape = mtrlData.Shape;
          setShape(Mtrlshape);
          inputPart.shapeMtrlId = mtrlData.ShapeMtrlID;

          // inputPart.material = mtrlData.Mtrl_Type;
          // console.log("mtrlData.MtrlGradeID", mtrlData.MtrlGradeID);

          let gradeID =
            endpoints.getGradeID + "?gradeid=" + mtrlData.MtrlGradeID;
          getRequest(gradeID, async (gradeData) => {
            console.log("gradeData = ", gradeData);
            inputPart.material = gradeData.Material;
          });
          let url2 = endpoints.getRowByShape + "?shape=" + mtrlData.Shape;
          getRequest(url2, async (shapeData) => {
            console.log("shapedata = ", shapeData);
            console.log("ShapeID = ", shapeData.ShapeID);

            if (!shapeData.ShapeID) {
              toast.error(
                "ShapeID for MtrlCode doesnot exist please select other material"
              );
              return;
            }

            inputPart.shapeID = shapeData.ShapeID;
            setInputPart(inputPart);

            // if (shape !== material.Shape) {
            //   toast.error("Please select a same type of part");
            //   console.log("Please select a same type of part");
            // }
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
    //set inputPart set material code
    setInputPart((preValue) => {
      //console.log(preValue)
      return {
        ...preValue,
        [name]: value,
      };
    });

    inputPart[name] = value;
    setInputPart(inputPart);

    // console.log("Before update = ", inputPart.shapeMtrlId);
    // console.log("inputPart ..... ", inputPart);

    await delay(500);
    //update database row
    postRequest(endpoints.updateMtrlReceiptDetails, inputPart, (data) => {
      if (data.affectedRows !== 0) {
      } else {
        toast.error("Record Not Updated");
      }
    });

    //update table grid
    const newArray = materialArray.map((p) =>
      //p.id === "d28d67b2-6c32-4aae-a7b6-74dc985a3cff"
      p.id === partUniqueId
        ? {
            ...p,
            [name]: value,
          }
        : p
    );
    setMaterialArray(newArray);
  };

  //input header change event

  // const InputHeaderEvent = (e) => {
  //   const { value, name } = e.target;
  //   setFormHeader((preValue) => {
  //     //console.log(preValue)
  //     return {
  //       ...preValue,
  //       [name]: value,
  //     };
  //   });
  // };

  const InputHeaderEvent = (e) => {
    const { value, name } = e.target;

    const formattedValue =
      name === "weight" ? value.replace(/(\.\d{3})\d+/, "$1") : value;

    setFormHeader((preValue) => {
      //console.log(preValue)
      return {
        ...preValue,
        [name]: formattedValue,
      };
    });
  };

  const insertHeaderFunction = () => {
    //to save data
    postRequest(
      endpoints.insertHeaderMaterialReceiptRegister,
      formHeader,
      (data) => {
        // console.log("data = ", data);
        if (data.affectedRows !== 0) {
          setFormHeader((preValue) => {
            return {
              ...preValue,
              rvId: data.insertId,
            };
          });
          setSaveUpdateCount(saveUpdateCount + 1);

          toast.success("Record Saved Successfully");
          //enable part section and other 2 buttons
          setBoolVal1(false);
        } else {
          toast.error("Record Not Inserted");
        }
      }
    );
  };
  const updateHeaderFunction = () => {
    //console.log("update formheader = ", formHeader);
    postRequest(
      endpoints.updateHeaderMaterialReceiptRegister,
      formHeader,
      (data) => {
        // console.log("data = ", data);
        if (data.affectedRows !== 0) {
          setSaveUpdateCount(saveUpdateCount + 1);
          toast.success("Record Updated Successfully");
          //enable part section and other 2 buttons
          setBoolVal1(false);
        } else {
          toast.error("Record Not Updated");
        }
      }
    );
  };
  const saveButtonState = async (e) => {
    e.preventDefault();
    // console.log("formHeader.customer", formHeader);

    if (formHeader.customer.length == 0) {
      toast.error("Please Select Customer");
    } else if (formHeader.reference.length == 0) {
      toast.error("Please Enter Customer Document Material Reference");
    } else if (formHeader.weight === "") {
      toast.error(
        "Enter the Customer Material Weight as per Customer Document"
      );
    } else if (parseFloat(inputPart.accepted) > parseFloat(inputPart.qty)) {
      toast.error("Accepted value should be less than or equal to Received");
    } else if (parseFloat(inputPart.totalWeight) === 0) {
      toast.error("Total weight should not be 0, Please check");
      return;
    } else {
      if (saveUpdateCount == 0) {
        formHeader.receiptDate = formatDate(new Date(), 10);
        formHeader.rvDate = currDate;
        setFormHeader(formHeader);
        await delay(500);
        insertHeaderFunction();
        setBoolVal2(true);
      } else {
        let flag1 = 0;
        for (let i = 0; i < materialArray.length; i++) {
          if (
            materialArray[i].mtrlCode == "" ||
            // materialArray[i].locationNo == "" ||
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
          if (materialArray.totalWeight === 0.0) {
            flag1 = 3;
          }
        }
        if (flag1 == 1) {
          toast.error("Please fill correct Material details");
        } else if (flag1 === 2) {
          toast.error(
            "Accepted value should be less than or equal to Received"
          );
        } else if (flag1 === 3) {
          toast.error("Total weight should not be 0, Please check");
        } else {
          //to update data
          updateHeaderFunction();
        }
      }
    }
  };

  const getRVNo = async () => {
    const requestData = {
      unit: "Jigani",
      srlType: "MaterialReceiptVoucher",
      ResetPeriod: "Year",
      ResetValue: 0,
      VoucherNoLength: 4,
    };

    postRequest(endpoints.insertRunNoRow, requestData, async (data) => {
      console.log("RV NO Response", data);
    });
  };

  // console.log("part array = ", materialArray);
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
      //NEW CODE FOR FORM VALIDATION
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
          // console.log("Setting flag1 to 2");
          break; // Add a break to ensure this condition is not overwritten by subsequent checks
        }

        if (
          materialArray[i].qty === "" ||
          materialArray[i].qty === "0" ||
          materialArray[i].qty === 0.0 ||
          materialArray[i].qty === 0 ||
          materialArray[i].qty === undefined
        ) {
          flag1 = 3;
          // console.log("Setting flag1 to 3");
        }

        if (
          materialArray[i].accepted == "" ||
          materialArray[i].accepted == "0" ||
          materialArray[i].accepted == 0.0 ||
          materialArray[i].accepted == 0 ||
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
      } else if (flag1 === 2) {
        toast.error("Parameters cannot be Zero");
      } else if (flag1 === 3) {
        toast.error("Received  Qty cannot be Zero");
      } else if (flag1 === 4) {
        toast.error("Accepted Qty cannot be Zero");
      } else if (flag1 === 5) {
        toast.error("Select Location");
      } else if (flag1 === 6) {
        toast.error("Accepted value should be less than or equal to Received");
      } else {
        // Show model form
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

  const deleteButtonState = () => {
    setModalOpen(true);
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
          if (props.type === "units") {
            toast.success("Record is Deleted");
            nav("/MaterialManagement/Receipt/CustomerJobWork/Units/New", {
              replace: true,
            });
            window.location.reload();
          } else {
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
      }
    );
  };

  let {
    id,
    srl,
    mtrlCode,
    dynamicPara1,
    dynamicPara2,
    dynamicPara3,
    qty,
    inspected,
    locationNo,
    updated,
  } = inputPart;

  const addNewMaterial = (e) => {
    setBoolVal3(false);

    const isAnyMtrlCodeEmpty = materialArray.some(
      (item) => item.mtrlCode === ""
    );

    if (isAnyMtrlCodeEmpty) {
      toast.error("Select Material for the Inserted row");
      return;
    }

    // let count = materialArray.length + 1;
    // let srl = (count <= 9 ? "0" : "") + count;
    let newSerialNumber = serialNumber + 1;
    let srl = (newSerialNumber <= 9 ? "0" : "") + newSerialNumber;

    setSerialNumber(newSerialNumber);

    //clear all part fields
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
    // inputPart.qtyAccepted = 0.0;
    // inputPart.qtyReceived = 0.0;
    inputPart.qtyRejected = 0.0;
    inputPart.qtyUsed = 0.0;
    inputPart.qtyReturned = 0.0;

    //uncheck inspected
    setInsCheck(false);
    inputPart.inspected = 0;
    setBoolVal5(false);
    // console.log("partarray = ", partArray);
    // console.log("inputPart = ", inputPart);

    //insert blank row in table
    postRequest(endpoints.insertMtrlReceiptDetails, inputPart, (data) => {
      if (data.affectedRows !== 0) {
        //toast.success("Record added");
        let id = data.insertId;
        inputPart.id = id;

        //set inserted id

        setPartUniqueId(id);
        let newRow = {
          id: id,
          srl: srl,
          mtrlCode: "",
          dynamicPara1: "",
          dynamicPara2: "",
          dynamicPara3: "",
          qty: "",
          inspected: "",
          locationNo: "",
          updated: "",
        };

        //setPartArray(newRow);
        setMaterialArray([...materialArray, newRow]);
        setInputPart(inputPart);
        setSelectedMtrl([]);
      } else {
        toast.error("Record Not Inserted");
      }
    });
  };

  // const changeMaterialHandle = async (e, id) => {
  //   const { value, name } = e.target;

  //   for (let i = 0; i < materialArray.length; i++) {
  //     const element = materialArray[i];

  //     if (element.id === id) {
  //       element[name] = value;
  //     }
  //   }

  //   inputPart[name] = value;
  //   //checkbox update
  //   if (name === "inspected") {
  //     if (e.target.checked) {
  //       inputPart.inspected = true;
  //       setBoolVal5(true);
  //       setInsCheck(true);
  //     } else {
  //       inputPart.inspected = false;
  //       setBoolVal5(false);
  //       setInsCheck(false);
  //     }
  //   }
  //   if (name === "qty") {
  //     // setInsCheck(false);
  //     setBoolVal5(false);
  //     setInsCheck(false);
  //     inputPart.inspected = false;
  //     inputPart.accepted = 0;
  //   }
  //   setInputPart(inputPart);

  //   if (name === "accepted") {
  //     //calculate weight
  //     if (e.target.value) {
  //       let val = e.target.value;
  //       //get mtrl_data by mtrl_code

  //       if (parseFloat(inputPart.accepted) > parseFloat(inputPart.qty)) {
  //         toast.error(
  //           "Accepted value should be less than or equal to Received"
  //         );
  //       } else {
  //         // let url = endpoints.getRowByMtrlCode + "?code=" + inputPart.mtrlCode;
  //         // getRequest(url, async (data) => {
  //         let url = endpoints.getSpecific_Wt + "?code=" + inputPart.mtrlCode;
  //         getRequest(url, async (data) => {
  //           let TotalWeightCalculated =
  //             parseFloat(inputPart.accepted) *
  //             getWeight(
  //               data,
  //               parseFloat(inputPart.dynamicPara1),
  //               parseFloat(inputPart.dynamicPara2),
  //               parseFloat(inputPart.dynamicPara3)
  //             );

  //           console.log("TotalWeightCalculated...", TotalWeightCalculated);

  //           TotalWeightCalculated = TotalWeightCalculated / (1000 * 1000);
  //           console.log("TotalWeightCalculated", TotalWeightCalculated);

  //           inputPart.totalWeightCalculated = parseFloat(
  //             TotalWeightCalculated
  //           ).toFixed(2);

  //           inputPart.totalWeight = parseFloat(TotalWeightCalculated).toFixed(
  //             2
  //           );
  //           inputPart["TotalWeightCalculated"] = TotalWeightCalculated;
  //           inputPart["TotalWeight"] = TotalWeightCalculated;

  //           setInputPart(inputPart);
  //           // console.log("formHeader", formHeader);
  //           //update forheader in database
  //           postRequest(
  //             endpoints.updateHeaderMaterialReceiptRegister,
  //             formHeader,
  //             (data) => {}
  //           );

  //           //update material array:
  //           const newArray = materialArray.map((p) =>
  //             //p.id === "d28d67b2-6c32-4aae-a7b6-74dc985a3cff"
  //             p.id === id
  //               ? {
  //                   ...p,
  //                   [name]: value,
  //                   qty: inputPart.qtyReceived,
  //                   // inspected: inputPart.inspected,
  //                   inspected: inputPart.inspected == true ? 1 : 0,
  //                   totalWeightCalculated: inputPart.totalWeightCalculated,
  //                 }
  //               : p
  //           );
  //           setMaterialArray(newArray);
  //           // console.log("material array = ", materialArray);
  //           await delay(500);

  //           //find calculateweight

  //           let totwt = 0;
  //           for (let i = 0; i < newArray.length; i++) {
  //             const element = newArray[i];
  //             totwt = totwt + parseFloat(element.totalWeightCalculated);
  //           }

  //           setCalcWeightVal(parseFloat(totwt).toFixed(2));

  //           formHeader.calcWeight = parseFloat(totwt).toFixed(2);
  //           setFormHeader(formHeader);
  //           delay(500);

  //           //update calc weight in header
  //           postRequest(
  //             endpoints.updateHeaderMaterialReceiptRegister,
  //             formHeader,
  //             (data) => {
  //               if (data.affectedRows !== 0) {
  //               }
  //             }
  //           );
  //         });
  //       }
  //     }
  //   }
  //   const newArray = materialArray.map((p) =>
  //     //p.id === "d28d67b2-6c32-4aae-a7b6-74dc985a3cff"
  //     p.id === id
  //       ? {
  //           ...p,
  //           [name]: value,
  //           qty: inputPart.qty,
  //           // inspected: inputPart.inspected == "on" ? 1 : 0,
  //           inspected: inputPart.inspected == true ? 1 : 0,
  //           // inspected: inputPart.inspected,
  //         }
  //       : p
  //   );
  //   setMaterialArray(newArray);
  //   await delay(500);

  //   console.log("materialarray", materialArray);

  //   //update blank row with respected to modified part textfield
  //   postRequest(endpoints.updateMtrlReceiptDetailsAfter, inputPart, (data) => {
  //     if (data?.affectedRows !== 0) {
  //     } else {
  //       toast.error("Record Not Updated");
  //     }
  //   });
  //   await delay(500);
  // };

  const changeMaterialHandle = async (e, id) => {
    const { value, name } = e.target;

    const formattedValue =
      name === "totalWeight" ? value.replace(/(\.\d{3})\d+/, "$1") : value;

    for (let i = 0; i < materialArray.length; i++) {
      const element = materialArray[i];

      if (element.id === id) {
        // element[name] = value;
        element[name] = formattedValue;
      }
    }

    // inputPart[name] = value;
    inputPart[name] = formattedValue;

    //checkbox update
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
      // setInsCheck(false);
      setBoolVal5(false);
      setInsCheck(false);
      inputPart.inspected = false;
      inputPart.accepted = 0;
    }
    setInputPart(inputPart);

    if (name === "accepted") {
      //calculate weight
      if (e.target.value) {
        let val = e.target.value;

        if (parseFloat(inputPart.accepted) > parseFloat(inputPart.qty)) {
          toast.error(
            "Accepted value should be less than or equal to Received"
          );
        }
        //  else if (parseFloat( inputPart.totalWeight) === 0.0 ) {
        //     toast.error(
        //       "totalWeight should not be 0"
        //     );
        //   }
        else {
          // let url = endpoints.getRowByMtrlCode + "?code=" + inputPart.mtrlCode;
          // getRequest(url, async (data) => {
          let url = endpoints.getSpecific_Wt + "?code=" + inputPart.mtrlCode;
          getRequest(url, async (data) => {
            // console.log("data", data);
            //setCustdata(data);

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

            //update material array:
            const newArray = materialArray.map((p) =>
              //p.id === "d28d67b2-6c32-4aae-a7b6-74dc985a3cff"
              p.id === id
                ? {
                    ...p,
                    [name]: formattedValue,
                    qty: inputPart.qty,
                    // inspected: inputPart.inspected,
                    inspected: inputPart.inspected == true ? 1 : 0,
                    totalWeightCalculated: inputPart.totalWeightCalculated,
                  }
                : p
            );
            setMaterialArray(newArray);

            console.log("NewArray", newArray);

            await delay(500);

            let totwt = 0;
            for (let i = 0; i < newArray.length; i++) {
              const element = newArray[i];
              totwt = totwt + parseFloat(element.totalWeightCalculated);
            }

            // console.log("totwt", totwt);

            setCalcWeightVal(parseFloat(totwt).toFixed(3));

            formHeader.calcWeight = parseFloat(totwt).toFixed(3);
            setFormHeader(formHeader);
            delay(500);
            // ////console.log("form header = ", formHeader);
            //update calc weight in header

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

    if (name === "totalWeight") {
      if (parseFloat(inputPart.totalWeight) === 0) {
        toast.error("total weight should not be 0");
      }
    }

    const newArray = materialArray.map((p) =>
      p.id === id
        ? {
            ...p,
            [name]: formattedValue,
            qty: inputPart.qty,
            // inspected: inputPart.inspected == "on" ? 1 : 0,
            inspected: inputPart.inspected == true ? 1 : 0,
            // inspected: inputPart.inspected,
          }
        : p
    );
    setMaterialArray(newArray);
    await delay(500);

    postRequest(endpoints.updateMtrlReceiptDetailsAfter, inputPart, (data) => {
      // if (data?.affectedRows !== 0) {
      // } else {
      //   toast.error("Record Not Updated");
      // }
    });
    await delay(500);
  };

  // console.log("Input Part", inputPart);

  // row selection
  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row, isSelect, rowIndex, e) => {
      // setIsButtonEnabled(row.updated === 1);
      // console.log("Row = ", row);
      setSelectedMtrl([{ Mtrl_Code: row.mtrlCode }]);

      setCheckboxState(row.updated);

      // console.log("row", row);
      // setSelectedRows(row);
      // setInputPart(row);

      if (row.updated === 1) {
        setRmvBtn(true);
        setAddBtn(false);
      } else {
        setRmvBtn(false);
        setAddBtn(true);
      }

      // let accepted = "";
      // let totalWeightCalculated = "";
      const url1 = endpoints.getMtrlReceiptDetailsByID + "?id=" + row.id;
      getRequest(url1, async (data2) => {
        // console.log("data2 ........", data2);
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
          obj.updated = obj.Updated;
          // obj.qtyAccepted = obj.QtyAccepted;
          // obj.qtyReceived = obj.QtyReceived;
          obj.qtyRejected = obj.QtyRejected;
          obj.qtyUsed = obj.QtyUsed;
          obj.qtyReturned = obj.QtyReturned;
        });
        // console.log("data2", data2);
        setMtrlArray(data2);
        data2?.map(async (obj) => {
          if (obj.id == row.id) {
            setMtrlStock(obj);
            // setInputPart({
            //   // qtyAccepted: row.qtyAccepted,
            //   qtyRejected: obj.qtyRejected,
            //   qtyReceived: obj.qtyReceived,
            //   id: obj.id,
            //   srl: obj.srl,
            //   mtrlCode: obj.mtrlCode,
            //   dynamicPara1: obj.dynamicPara1,
            //   dynamicPara2: obj.dynamicPara2,
            //   dynamicPara3: obj.dynamicPara3,
            //   qty: obj.qty,
            //   inspected: obj.inspected,
            //   locationNo: obj.locationNo,
            //   updated: obj.updated,
            //   accepted: obj.accepted,
            //   totalWeightCalculated: obj.totalWeightCalculated,
            //   totalWeight: obj.totalWeight,
            // });
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

  // const addToStock = async () => {
  //   if (Object.keys(mtrlStock).length === 0) {
  //     toast.error("Please Select Material");
  //   } else {
  //     const newRow = {
  //       //mtrlStockId :
  //       mtrlRvId: mtrlStock.Mtrl_Rv_id,
  //       custCode: mtrlStock.Cust_Code,
  //       customer: formHeader.customerName,
  //       custDocuNo: "",
  //       rvNo: formHeader.rvNo,
  //       mtrlCode: mtrlStock.Mtrl_Code,
  //       shapeID: mtrlStock.shapeID,
  //       shape: "",
  //       material: mtrlStock.material,
  //       dynamicPara1: mtrlStock.dynamicPara1,
  //       dynamicPara2: mtrlStock.dynamicPara2,
  //       dynamicPara3: mtrlStock.dynamicPara3,
  //       dynamicPara4: "0.00",
  //       locked: 0,
  //       scrap: 0,
  //       issue: 0,
  //       weight: formHeader.weight,
  //       scrapWeight: "0.00",
  //       srl: mtrlStock.Srl,
  //       ivNo: "",
  //       ncProgramNo: "",
  //       locationNo: mtrlStock.locationNo,
  //       accepted: mtrlStock.accepted,
  //       // qtyAccepted: mtrlStock.qtyAccepted,
  //     };

  //     postRequest(endpoints.insertMtrlStockList, newRow, async (data) => {
  //       if (data.affectedRows !== 0) {
  //         //enable remove stock buttons
  //         toast.success("Stock Added Successfully");

  //         setBoolValStock("on");

  //         setRmvBtn(true);
  //         setAddBtn(false);
  //       } else {
  //         toast.error("Stock Not Added");
  //       }
  //     });
  //     // console.log("mtrlstock = ", mtrlStock);

  //     //update updated status = 1
  //     let updateObj = {
  //       id: mtrlStock.Mtrl_Rv_id,
  //       upDated: 1,
  //     };
  //     console.log("updateObj", updateObj);
  //     postRequest(
  //       endpoints.updateMtrlReceiptDetailsUpdated,
  //       updateObj,
  //       async (data) => {
  //         console.log("updated", data.upDated);
  //       }
  //     );
  //     //update checkbox
  //     for (let i = 0; i < materialArray.length; i++) {
  //       // if (materialArray[i].mtrlCode == mtrlStock.Mtrl_Code) {
  //       if (materialArray[i].id === mtrlStock.id) {
  //         materialArray[i].updated = 1;
  //       }
  //     }
  //     await delay(500);
  //     setInputPart({ ...inputPart, updated: 1 });
  //     setMaterialArray(materialArray);
  //   }
  // };

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
        // const finalWeight = (weight * 0.000001).toFixed(3);
        const finalWeight = Math.round(weight * 0.000001 * 100) / 100;

        const newRow = {
          //mtrlStockId :
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
          // qtyAccepted: mtrlStock.qtyAccepted,
        };

        console.log("newRow", newRow);

        postRequest(endpoints.insertMtrlStockList, newRow, async (data) => {
          if (data.affectedRows !== 0) {
            //enable remove stock buttons
            toast.success("Stock Added Successfully");

            setBoolValStock("on");

            setRmvBtn(true);
            setAddBtn(false);
          } else {
            toast.error("Stock Not Added");
          }
        });

        //update updated status = 1
        let updateObj = {
          id: mtrlStock.Mtrl_Rv_id,
          upDated: 1,
        };
        console.log("updateObj", updateObj);
        postRequest(
          endpoints.updateMtrlReceiptDetailsUpdated,
          updateObj,
          async (data) => {
            console.log("updated", data.upDated);
          }
        );
        //update checkbox
        for (let i = 0; i < materialArray.length; i++) {
          // if (materialArray[i].mtrlCode == mtrlStock.Mtrl_Code) {
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

  // const removeToStock
  // const removeStock = () => {
  //   if (Object.keys(mtrlStock).length === 0) {
  //     toast.error("Please Select Material");
  //   } else {
  //     postRequest(endpoints.deleteMtrlStockByRVNo, formHeader, async (data) => {
  //       if (data.affectedRows !== 0) {
  //         //enable remove stock buttons
  //         toast.success("Stock Removed Successfully");
  //         //setBoolVal2(false);
  //         //setBoolVal3(true);
  //         setBoolValStock("off");
  //         // setBoolVal6(false);
  //         // setBoolVal7(true);
  //         setAddBtn(true);
  //         setRmvBtn(false);

  //         //update checkbox
  //         for (let i = 0; i < materialArray.length; i++) {
  //           // if (materialArray[i].mtrlCode == mtrlStock.Mtrl_Code) {
  //           if (materialArray[i].id === mtrlStock.id) {
  //             materialArray[i].updated = 0;
  //           }
  //           // setMaterialArray(materialArray);
  //         }
  //         await delay(500);
  //         setMaterialArray(materialArray);
  //         setInputPart({ ...inputPart, updated: 0 });
  //       } else {
  //         toast.error("Stock Not Removed");
  //       }
  //     });
  //   }
  //   // // Update checkboxState based on materialArray
  //   // const updatedCheckboxState = materialArray.map(
  //   //   (item) => item.updated === 0
  //   // );
  //   // setCheckboxState(updatedCheckboxState);
  // };

  const removeStock = async () => {
    if (Object.keys(mtrlStock).length === 0) {
      toast.error("Please Select Material");
    } else {
      const requestData = {
        Mtrl_Rv_id: mtrlStock.Mtrl_Rv_id,
        Mtrl_Code: mtrlStock.Mtrl_Code,
        Accepted: inputPart.accepted,
      };

      // postRequest(
      //   endpoints.deleteMtrlStockByRVNo,
      //   requestData,
      //   async (data) => {
      //     // console.log("Remove stock data = ", data);
      //     console.log("countResult", data.countResult[0].count);
      //     console.log("affectedRows", data.deletionResult.affectedRows);
      //     console.log("inUseResult", data.inUseResult[0].inUseCount);

      //     if (data.countResult[0].count < parseFloat(inputPart.accepted)) {
      //       toast.error(
      //         "Received Material Already used, to return create a Issue Voucher"
      //       );
      //       return;
      //     }

      //     // Validate if the material is already in use for production
      //     if (data.inUseResult[0].inUseCount > 0) {
      //       toast.error(
      //         "Material already in use for production, cannot take out from stock"
      //       );
      //       return;
      //     }

      //     if (data.deletionResult.affectedRows !== 0) {
      //       //enable remove stock buttons
      //       toast.success("Stock Removed Successfully");
      //       // Update UI state here
      //       setBoolValStock("off");
      //       setAddBtn(true);
      //       setRmvBtn(false);
      //       //update checkbox
      //       for (let i = 0; i < materialArray.length; i++) {
      //         if (materialArray[i].id == mtrlStock.id) {
      //           materialArray[i].updated = 0;
      //         }
      //       }
      //       await delay(200);
      //       setInputPart({ ...inputPart, updated: 0 });
      //       setMaterialArray(materialArray);
      //     } else {
      //       toast.success("Stock Removed Successfully");
      //     }
      //   }
      // );

      postRequest(
        endpoints.deleteMtrlStockByRVNo,
        requestData,
        async (data) => {
          console.log("Remove stock data = ", data);

          if (data.countResult[0].count < parseFloat(inputPart.accepted)) {
            toast.error(
              "Received Material Already used, to return create a Issue Voucher"
            );
            return;
          } else {
            // Validate if the material is already in use for production
            if (data.inUseResult[0].inUseCount > 0) {
              toast.error(
                "Material already in use for production, cannot take out from stock"
              );
              return;
            } else {
              // Only execute this block if the first two conditions are validated
              if (data.deletionResult.affectedRows !== 0) {
                //enable remove stock buttons
                toast.success("Stock Removed Successfully");
                // Update UI state here
                setBoolValStock("off");
                setAddBtn(true);
                setRmvBtn(false);
                //update checkbox
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
        async (data) => {
          // console.log("updated = 0");
        }
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

      // console.log("response", response);
    } catch (error) {
      // console.error("Error updating Stock Register:", error);
    }
  };

  const handleYes = () => {
    if (inputPart.id.length === 0) {
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
            // qtyAccepted: 0,
            // qtyReceived: 0,
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

          // console.log("formHeader.calcWeight", formHeader.calcWeight);
          setFormHeader(formHeader);
          delay(500);

          //update calc weight in header

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
    if (props.type === "sheets") {
      return mtrlDetails.filter(
        (material) =>
          material.Shape !== "Units" &&
          material.Shape !== "Cylinder" &&
          material.Shape !== null &&
          material.Mtrl_Code !== ""
      );
    } else if (props.type === "units") {
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

  console.log("Input Part", inputPart);
  console.log("formHeader", formHeader);
  console.log("rvId", formHeader.rvId);
  console.log("materialArray", materialArray);

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
          <div className=" d-flex col-md-2" style={{ gap: "10px" }}>
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

          <div className="d-flex col-md-2" style={{ gap: "18px" }}>
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

          <div className="d-flex col-md-4" style={{ gap: "90px" }}>
            <label className="form-label mt-1">Status</label>

            <input
              className="input-disabled mt-1"
              type="text"
              name="status"
              value={formHeader.status}
              readOnly
            />
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label className="form-label mt-1">Weight</label>

            <input
              className="input-disabled mt-1"
              type="number"
              name="weight"
              autoComplete="off"
              onKeyDown={blockInvalidChar}
              min="0"
              required
              // value={formHeader.weight}
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
          <div className="d-flex col-md-4" style={{ gap: "26px" }}>
            <label className="form-label">Customer</label>
            {props.type2 !== "purchase" ? (
              <Typeahead
                className="ip-select"
                id="basic-example"
                name="customer"
                options={custdata}
                //disabled={props.type2 === "purchase" ? true : boolVal2}
                placeholder="Select Customer"
                onChange={(label) => changeCustomer(label)}
                disabled={boolVal2}
              />
            ) : (
              <select
                className="ip-select"
                name="customer"
                disabled={props.type2 === "purchase" ? true : boolVal2}
                onChange={changeCustomer1}
              >
                {props.type2 === "purchase" ? (
                  ""
                ) : (
                  <option value="" disabled selected>
                    Select Customer
                  </option>
                )}

                {props.type2 === "purchase"
                  ? custdata.map((customer, index) =>
                      customer.Cust_Code == 0 ? (
                        <option key={index} value={customer.Cust_Code}>
                          {customer.Cust_name}
                        </option>
                      ) : (
                        ""
                      )
                    )
                  : custdata.map((customer, index) => (
                      <option key={index} value={customer.Cust_Code}>
                        {customer.Cust_name}
                      </option>
                    ))}
              </select>
            )}
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label className="form-label mt-1">Reference</label>

            <input
              className="input-disabled mt-1"
              type="text"
              autoComplete="off"
              name="reference"
              value={formHeader.reference}
              onChange={InputHeaderEvent}
              disabled={boolVal2 && boolVal4}
            />
          </div>

          <div className="d-flex col-md-4" style={{ gap: "20px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Calculated Weight
            </label>

            <input
              className="input-disabled mt-1"
              type="number"
              name="calculatedWeight"
              value={calcWeightVal}
              readOnly
            />
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-md-8 ">
            {/* <label className="form-label"></label> */}
            <textarea
              className="input-disabled mt-1"
              id="exampleFormControlTextarea1"
              rows="2"
              style={{ width: "100%", height: "60px" }}
              // className="form-control"
              value={formHeader.address}
              readOnly
            ></textarea>
          </div>
          <div className="col-md-4 justify-content-center">
            <button
              className="button-style"
              // style={{ width: "120px" }}
              onClick={saveButtonState}
              disabled={boolVal4}
            >
              Save
            </button>
            <button
              className="button-style"
              // style={{ width: "150px" }}
              disabled={boolVal1 || boolVal4}
              onClick={allotRVButtonState}
            >
              Allot RV No
            </button>

            <button
              className="button-style"
              // style={{ width: "196px" }}
              disabled={boolVal1 || boolVal4}
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
                className="d-flex  justify-content-center mb-2"
                style={{ gap: "20px" }}
              >
                <button
                  className="button-style "
                  //onClick={addNewPart}
                  disabled={boolVal1 || boolVal4}
                  onClick={addNewMaterial}
                >
                  Add Serial
                </button>

                <button
                  className="button-style "
                  disabled={boolVal3 || boolVal4}
                  // onClick={handleDelete}
                  onClick={deleteButtonState}
                >
                  Delete Serial
                </button>
              </div>

              <div
                className="d-flex  justify-content-center"
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
                  {/* <p className="form-title-deco mt-1">
                    <h5>Serial Details</h5>
                  </p> */}
                  <label
                    className="form-label"
                    style={{ textDecoration: "underline" }}
                  >
                    Serial Details
                  </label>
                  <div className="row  ">
                    <div className="col-md-4">
                      <label
                        className="form-label mt-1"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Mtrl Code
                      </label>
                    </div>

                    {/* <select
                        className="ip-select dropdown-field"
                        onChange={changeMtrl}
                        defaultValue={" "}
                        value={inputPart.mtrlCode}
                        name="mtrlCode"
                        disabled={boolVal3 || boolVal4 || boolVal5}
                      >
                        <option value="" disabled selected>
                          Select Material
                        </option>

                        {props.type === "sheets"
                          ? mtrlDetails.map((material, index) =>
                              (material.Shape !== "Units") &
                              (material.Shape !== "Cylinder") &
                              (material.Shape !== null) &
                              (material.Mtrl_Code !== "") ? (
                                <option key={index} value={material.Mtrl_Code}>
                                  {material.Mtrl_Code}
                                </option>
                              ) : (
                                ""
                              )
                            )
                          : props.type === "units"
                          ? mtrlDetails.map((material, index) =>
                              (material.Shape === "Units") &
                              //(material.Shape !== "Cylinder") &
                              (material.Shape !== null) &
                              (material.Mtrl_Code !== "") ? (
                                <option key={index} value={material.Mtrl_Code}>
                                  {material.Mtrl_Code}
                                </option>
                              ) : (
                                ""
                              )
                            )
                          : mtrlDetails.map((material, index) =>
                              (material.Shape !== null) &
                              (material.Mtrl_Code !== "") ? (
                                <option key={index} value={material.Mtrl_Code}>
                                  {material.Mtrl_Code}
                                </option>
                              ) : (
                                ""
                              )
                            )}
                      </select> */}
                    <div className="col-md-6">
                      <Typeahead
                        id="mtrlCode"
                        className="input-disabled mt-2"
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
                      <div className="row ">
                        <div className="col-md-4">
                          <label
                            className="form-label mt-2"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Para 1
                          </label>
                        </div>
                        <div className="col-md-6">
                          <input
                            className="input-disabled mt-2"
                            name="dynamicPara1"
                            disabled
                            min="0"
                          />
                        </div>
                        <div className="col-md-1">
                          <label className="form-label mt-2">mm</label>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4">
                          <label
                            className="form-label mt-2"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Para 2
                          </label>{" "}
                        </div>

                        <div className="col-md-6">
                          <input
                            className="input-disabled mt-1"
                            name="dynamicPara2"
                            min="0"
                            disabled
                          />
                        </div>
                        <div className="col-md-1">
                          <label className="form-label mt-1">mm</label>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4">
                          <label
                            className="form-label mt-2"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            Para 3
                          </label>
                        </div>

                        <div className="col-md-6">
                          <input
                            className="input-disabled mt-1"
                            name="dynamicPara3"
                            min="0"
                            disabled
                          />
                        </div>

                        <div className="col-md-2">
                          <label className="form-label mt-1">mm</label>
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
                        <div className="col-md-6 ">
                          <input
                            type="number"
                            className="input-disabled mt-2"
                            name="dynamicPara1"
                            // value={inputPart.dynamicPara1}
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5 || materialArray.length === 0}
                            min="0"
                            onKeyDown={blockInvalidQtyChar}
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
                            // value={inputPart.dynamicPara2}
                            value={
                              inputPart.dynamicPara2 === "0" ||
                              inputPart.dynamicPara2 === 0
                                ? ""
                                : inputPart.dynamicPara2
                            }
                            min="0"
                            onKeyDown={blockInvalidQtyChar}
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
                        <div className="col-md-6 ">
                          <input
                            type="number"
                            className="input-disabled mt-2"
                            name="dynamicPara1"
                            // value={inputPart.dynamicPara1}
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            min="0"
                            onKeyDown={blockInvalidQtyChar}
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
                            // value={inputPart.dynamicPara2}
                            value={
                              inputPart.dynamicPara2 === "0" ||
                              inputPart.dynamicPara2 === 0
                                ? ""
                                : inputPart.dynamicPara2
                            }
                            min="0"
                            onKeyDown={blockInvalidQtyChar}
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
                            // value={inputPart.dynamicPara1}
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            min="0"
                            onKeyDown={blockInvalidQtyChar}
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
                            // value={inputPart.dynamicPara1}
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            min="0"
                            onKeyDown={blockInvalidQtyChar}
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
                            // value={inputPart.dynamicPara2}
                            value={
                              inputPart.dynamicPara2 === "0" ||
                              inputPart.dynamicPara2 === 0
                                ? ""
                                : inputPart.dynamicPara2
                            }
                            min="0"
                            onKeyDown={blockInvalidQtyChar}
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
                            // value={inputPart.dynamicPara3}
                            value={
                              inputPart.dynamicPara3 === "0" ||
                              inputPart.dynamicPara3 === 0
                                ? ""
                                : inputPart.dynamicPara3
                            }
                            min="0"
                            onKeyDown={blockInvalidQtyChar}
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
                            // value={inputPart.dynamicPara1}
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            disabled={boolVal5}
                            onKeyDown={blockInvalidQtyChar}
                            min="0"
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
                            // value={inputPart.dynamicPara1}
                            value={
                              inputPart.dynamicPara1 === "0" ||
                              inputPart.dynamicPara1 === 0
                                ? ""
                                : inputPart.dynamicPara1
                            }
                            onKeyDown={blockInvalidQtyChar}
                            disabled={boolVal5}
                            min="0"
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

                  {/* <p className="form-title-deco mt-2">
                    <h5>Quantity Details</h5>
                  </p> */}
                  <label
                    className="form-label"
                    style={{ textDecoration: "underline" }}
                  >
                    Quantity Details
                  </label>
                  <div className="d-flex col-md-12" style={{ gap: "10px" }}>
                    <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                      <label className="form-label mt-2">Received</label>

                      <input
                        className="input-disabled mt-2"
                        type="number"
                        name="qty"
                        // defaultValue={0}
                        // value={inputPart.qty}
                        value={
                          inputPart.qty === "0" || inputPart.qty === 0
                            ? ""
                            : inputPart.qty
                        }
                        // value={(inputPart.qty = Math.floor(inputPart.qty))}
                        onKeyDown={blockInvalidQtyChar}
                        disabled={
                          boolVal3 || boolVal4 || materialArray.length === 0
                        }
                        // min="0"
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
                        name="inspected"
                        checked={inputPart.inspected}
                        disabled={
                          boolVal3 || boolVal4 || materialArray.length === 0
                        }
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                      />
                      <label className="form-label mt-2">Inspected</label>
                    </div>
                  </div>

                  <div className="d-flex col-md-12" style={{ gap: "10px" }}>
                    <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                      <label className="form-label mt-2">Accepted</label>
                      <input
                        className="input-disabled mt-2"
                        type="number"
                        name="accepted"
                        // defaultValue={0}
                        // value={inputPart.accepted}
                        value={
                          inputPart.accepted === "0" || inputPart.accepted === 0
                            ? ""
                            : inputPart.accepted
                        }
                        disabled={boolVal3 || boolVal4 || !boolVal5}
                        min="0"
                        onKeyDown={blockInvalidQtyChar}
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                      />
                    </div>

                    <div className="d-flex col-md-6" style={{ gap: "10px" }}>
                      <input
                        // className="checkBoxStyle mt-2"
                        // type="checkbox"
                        className="form-check-input mt-3"
                        type="checkbox"
                        id="flexCheckDefault"
                        name="updated"
                        checked={inputPart.updated === 1 ? true : false}
                        disabled={
                          boolVal3 || boolVal4 || materialArray.length === 0
                        }
                        // disabled={true}
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                      />
                      <label className="form-label mt-2">Updated</label>
                    </div>
                  </div>

                  <div className="row mt-2">
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
                        // value={inputPart.totalWeightCalculated}
                        value={
                          inputPart.totalWeightCalculated === "0" ||
                          inputPart.totalWeightCalculated === 0
                            ? ""
                            : inputPart.totalWeightCalculated
                        }
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
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
                        autoComplete="off"
                        // value={inputPart.totalWeight}
                        value={
                          inputPart.totalWeight === "0" ||
                          inputPart.totalWeight === 0
                            ? ""
                            : inputPart.totalWeight
                        }
                        onKeyDown={blockInvalidChar}
                        min="0"
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                        disabled={
                          boolVal3 || boolVal4 || materialArray.length === 0
                        }
                      />
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-md-6 ">
                      <label className="form-label">Location</label>
                    </div>
                    <div className="col-md-6 mt-1">
                      <select
                        // className="ip-select dropdown-field"
                        style={{ width: "100%" }}
                        className="input-disabled mt-1"
                        onChange={(e) => {
                          changeMaterialHandle(e, inputPart.id);
                        }}
                        value={inputPart.locationNo}
                        disabled={
                          boolVal3 || boolVal4 || materialArray.length === 0
                        }
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
                  <div className="row justify-content-center mt-3 mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewSheetsUnits;
