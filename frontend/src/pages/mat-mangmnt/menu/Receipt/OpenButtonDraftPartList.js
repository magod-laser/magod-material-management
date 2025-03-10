import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import BootstrapTable from "react-bootstrap-table-next";
import Table from "react-bootstrap/Table";
import CreateYesNoModal from "../../components/CreateYesNoModal";
import DeleteSerialYesNoModal from "../../components/DeleteSerialYesNoModal";
import DeleteRVModal from "../../components/DeleteRVModal";
import { formatDate } from "../../../../utils";
import { useLocation } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function OpenButtonDraftPartList() {
  const location = useLocation();

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

  const [partUniqueId, setPartUniqueId] = useState();
  const [partArray, setPartArray] = useState([]);

  const [partVal, setPartVal] = useState([]);
  const [inputPart, setInputPart] = useState({
    id: "",
    partId: "",
    unitWeight: "",
    custBomId: "",
    qtyReceived: "",
    qtyAccepted: "",
    qtyRejected: "0",
    qtyUsed: 0,
    qtyReturned: 0,
    qtyIssued: 0,
  });

  //const [custDetailVal, setCustDetailVal] = useState("");
  const [calcWeightVal, setCalcWeightVal] = useState(0);

  //const currDateTime = new Date();
  let [custdata, setCustdata] = useState([]);
  let [mtrlDetails, setMtrlDetails] = useState([]);
  const [saveUpdateCount, setSaveUpdateCount] = useState(0);
  const [selectedPart, setSelectedPart] = useState([]);

  let [formHeader, setFormHeader] = useState({
    rvId: "",
    receiptDate: "", //formatDate(new Date(), 4), //currDate, //.split("/").reverse().join("-"),
    rvNo: "", //"Draft",
    rvDate: "", //currDate, //.split("/").reverse().join("-"),
    status: "", //"Created",
    customer: "",
    customerName: "",
    reference: "",
    weight: "",
    calcWeight: "",
    type: "", //"Parts",
    address: "",
  });

  console.log("formHeader.customer", formHeader.customer);

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

      //get customer details for address
      getRequest(endpoints.getCustomers, (data1) => {
        const found = data1.find((obj) => obj.Cust_Code === data.Cust_Code);
        formHeader.address = found.Address;
        setFormHeader(formHeader);
        setCalcWeightVal(data.TotalCalculatedWeight);

        //get part details
        const url1 =
          endpoints.getPartReceiptDetailsByRvID + "?id=" + location.state.id;
        getRequest(url1, (data2) => {
          data2.forEach((obj) => {
            obj["id"] = obj["Id"];
            obj["partId"] = obj["PartId"];
            obj["unitWeight"] = obj["UnitWt"];
            obj["qtyReceived"] = obj["QtyReceived"];
            obj["qtyAccepted"] = obj["QtyAccepted"];
            obj["qtyRejected"] = obj["QtyRejected"];
          });
          setPartArray(data2);
        });
      });

      //fetch part names from bomlist
      getRequest(endpoints.getCustBomList, (data3) => {
        const foundPart = data3.filter(
          (obj) => obj.Cust_code == data.Cust_Code
        );
        setMtrlDetails(foundPart);
      });
    });
  }

  useEffect(() => {
    fetchData();
    //setPartArray(partArray);
  }, []); //[inputPart]);

  const columns = [
    {
      text: "#",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Part Id",
      dataField: "partId",
      sort: true,
    },
    {
      text: "Unit Wt",
      dataField: "unitWeight",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Qty Received",
      dataField: "qtyReceived",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Qty Accepted",
      dataField: "qtyAccepted",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Qty Rejected",
      dataField: "qtyRejected",
      // formatter: (celContent, row) => <div className="">{qtyRejected}</div>,
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];

  // const changePartID = (selected) => {
  //   setSelectedPart(selected);

  //   setInputPart((prevInputPart) => ({
  //     ...prevInputPart,
  //     partId: selected.length > 0 ? selected[0].PartId : "",
  //   }));

  //   // Use the updated inputPart inside the postRequest callback
  //   postRequest(
  //     endpoints.updatePartReceiptDetails,
  //     {
  //       ...inputPart,
  //       partId: selected.length > 0 ? selected[0].PartId : "",
  //     },
  //     (data) => {
  //       if (data.affectedRows !== 0) {
  //         // Handle success, if needed
  //       } else {
  //         toast.error("Record Not Updated");
  //       }
  //     }
  //   );

  //   const newArray = partArray.map((p) =>
  //     p.id === partUniqueId
  //       ? {
  //           ...p,
  //           partId: selected.length > 0 ? selected[0].PartId : "",
  //         }
  //       : p
  //   );

  //   setPartArray(newArray);
  // };

  const changePartID = (selected) => {
    setSelectedPart(selected);

    // Update partId in inputPart state
    setInputPart((prevInputPart) => ({
      ...prevInputPart,
      partId: selected.length > 0 ? selected[0].PartId : "",
    }));

    // First, call the getCustBomId endpoint to get the custBomId based on the selected partId
    if (selected.length > 0) {
      const partId = selected[0].PartId;
      const cust_Code = formHeader.customer;

      postRequest(endpoints.getCustBomId, { partId, cust_Code }, (data) => {
        if (data) {
          console.log("response.data", data);
          // Update the inputPart with custBomId from the response
          setInputPart((prevInputPart) => ({
            ...prevInputPart,
            custBomId: data[0].Id,
          }));

          // Now, call the updatePartReceiptDetails endpoint with the updated inputPart
          postRequest(
            endpoints.updatePartReceiptDetails,
            {
              ...inputPart,
              partId,
              custBomId: data[0].Id,
            },
            (data) => {
              if (data.affectedRows !== 0) {
                // Handle success, if needed
              } else {
                toast.error("Record Not Updated");
              }
            }
          );
        }
      });
    }

    // Update partArray with the selected partId
    const newArray = partArray.map((p) =>
      p.id === partUniqueId
        ? {
            ...p,
            partId: selected.length > 0 ? selected[0].PartId : "",
          }
        : p
    );

    setPartArray(newArray);
  };

  const changePartHandle = (e) => {
    const { value, name } = e.target;
    if (name === "unitWeight" && parseFloat(value) < 0) {
      toast.error("unitWeight should be a positive value");
      return;
    }

    const formattedValue =
      name === "unitWeight" ? value.replace(/(\.\d{3})\d+/, "$1") : value;
    setInputPart((preValue) => {
      return {
        ...preValue,
        [name]: formattedValue,
      };
    });
    inputPart[name] = formattedValue;
    // inputPart.custBomId = formHeader.customer;
    inputPart.rvId = formHeader.rvId;
    // inputPart.qtyRejected = 0;
    inputPart.qtyRejected =
      parseFloat(inputPart.qtyReceived) - parseFloat(inputPart.qtyAccepted);
    inputPart.qtyUsed = 0;
    inputPart.qtyReturned = 0;
    inputPart.qtyIssued = 0;
    setInputPart(inputPart);

    //update blank row with respected to modified part textfield
    postRequest(endpoints.updatePartReceiptDetails, inputPart, (data) => {
      if (data?.affectedRows !== 0) {
      } else {
        toast.error("Record Not Updated");
      }
    });

    // const newArray = partArray.map((p) =>
    //   p.id === partUniqueId
    //     ? {
    //         ...p,
    //         [name]: formattedValue,

    //       }
    //     : p
    // );

    const newArray = partArray.map((p) => {
      if (p.id === partUniqueId) {
        // Calculate the updated qtyRejected based on the new qtyReceived and qtyAccepted values
        const qtyReceived =
          name === "qtyReceived" ? formattedValue : p.qtyReceived;
        const qtyAccepted =
          name === "qtyAccepted" ? formattedValue : p.qtyAccepted;
        const qtyRejected = parseFloat(qtyReceived) - parseFloat(qtyAccepted);

        return {
          ...p,
          [name]: formattedValue,
          qtyRejected: isNaN(qtyRejected) ? 0 : qtyRejected,
        };
      } else {
        return p;
      }
    });

    setPartArray(newArray);

    let totwt = 0;
    newArray.map((obj) => {
      totwt =
        parseFloat(totwt) +
        // parseFloat(obj.unitWeight) * parseFloat(obj.qtyReceived);
        parseFloat(obj.unitWeight) * parseFloat(obj.qtyAccepted);
    });

    setCalcWeightVal(parseFloat(totwt).toFixed(3));
    setFormHeader({ ...formHeader, calcWeight: parseFloat(totwt).toFixed(3) });
  };

  let { partId, unitWeight, qtyReceived, qtyAccepted, qtyRejected } = inputPart;

  const addNewPart = (e) => {
    const isAnyPartIDEmpty = partArray.some((item) => item.partId === "");

    if (isAnyPartIDEmpty) {
      toast.error("Select Part ID for the Inserted row");
      return;
    }

    setBoolVal3(false);

    //clear all part fields
    inputPart.rvId = formHeader.rvId;
    inputPart.partId = "";
    inputPart.qtyAccepted = 0;
    inputPart.qtyReceived = 0;
    inputPart.qtyRejected = 0;
    inputPart.qtyUsed = 0;
    inputPart.qtyReturned = 0;
    inputPart.qtyIssued = 0;
    inputPart.unitWeight = 0;
    inputPart.custBomId = formHeader.customer;

    //insert blank row in table
    postRequest(endpoints.insertPartReceiptDetails, inputPart, (data) => {
      if (data.affectedRows !== 0) {
        let id = data.insertId;
        inputPart.id = id;
        setPartArray([
          ...partArray,
          { id, partId, unitWeight, qtyReceived, qtyAccepted, qtyRejected },
        ]);
        //const newWeight = calcWeightVal + unitWeight * qtyReceived;
        //setCalcWeightVal(parseFloat(newWeight).toFixed(2));

        //let uniqueid = uuid();
        setPartUniqueId(id);
        let newRow = {
          id: id,
          partId: "",
          unitWeight: "",
          qtyReceived: "",
          qtyAccepted: "",
          qtyRejected: "",
        };
        //setPartArray(newRow);
        setPartArray([...partArray, newRow]);
        setSelectedPart([]);
        setInputPart(inputPart);
      } else {
        toast.error("Record Not Inserted");
      }
    });
  };

  const deleteButtonState = () => {
    if (!inputPart?.id) {
      toast.error("Select Part");
    } else {
      setModalOpen(true);
    }
  };

  //delete part
  const handleDelete = () => {
    //minus calculated weight

    postRequest(endpoints.deletePartReceiptDetails, inputPart, (data) => {
      if (data.affectedRows !== 0) {
        const newArray = partArray.filter((p) => p.id !== inputPart.id);

        setPartArray(newArray);
        toast.success("Material Deleted");
        setInputPart({
          id: "",
          partId: "",
          unitWeight: "",
          qtyReceived: "",
          qtyAccepted: "",
          qtyRejected: "0",
        });
        setSelectedPart([]);

        let totwt = 0;
        newArray.map((obj) => {
          totwt =
            parseFloat(totwt) +
            // parseFloat(obj.unitWeight) * parseFloat(obj.qtyReceived);
            parseFloat(obj.unitWeight) * parseFloat(obj.qtyAccepted);
        });
        setCalcWeightVal(parseFloat(totwt).toFixed(3));
        formHeader.calcWeight = parseFloat(totwt).toFixed(3);
        setFormHeader(formHeader);

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
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row, isSelect, rowIndex, e) => {
      setPartUniqueId(row.id);
      // console.log("row draft", row);
      setInputPart({
        id: row.id,
        partId: row.partId,
        // partId: isSelect ? row.partId : "",
        unitWeight: row.unitWeight,
        qtyAccepted: row.qtyAccepted,
        qtyRejected: row.qtyRejected,
        qtyReceived: row.qtyReceived,
        custBomId: formHeader.customer,
        qtyUsed: row.QtyUsed,
        qtyReturned: row.QtyReturned,
        qtyIssued: row.QtyIssued,
      });
      setSelectedPart([{ PartId: row.partId }]);
    },
  };

  //input header change event
  // const InputHeaderEvent = (e) => {
  //   const { value, name } = e.target;
  //   setFormHeader((preValue) => {
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

    setFormHeader((prevFormHeader) => ({
      ...prevFormHeader,
      [name]: formattedValue,
      [formHeader.calcWeight]: calcWeightVal,
    }));
  };

  const updateHeaderFunction = () => {
    postRequest(
      endpoints.updateHeaderMaterialReceiptRegister,
      formHeader,
      (data) => {
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

  const saveButtonState = (e) => {
    e.preventDefault();
    if (formHeader.customer.length == 0) {
      toast.error("Please Select Customer");
    } else if (formHeader.reference.length == 0) {
      toast.error("Please Enter Customer Document Material Reference");
    } else if (formHeader.weight === "") {
      toast.error(
        "Enter the Customer Material Weight as per Customer Document"
      );
    } else if (
      parseFloat(inputPart.qtyAccepted) > parseFloat(inputPart.qtyReceived)
    ) {
      toast.error("QtyAccepted should be less than or equal to QtyReceived");
    }
    // else {
    //   updateHeaderFunction();
    // }
    else {
      //checl part array table valid data

      let flag1 = 0;

      for (let i = 0; i < partArray.length; i++) {
        if (
          partArray[i].partId === "" ||
          partArray[i].unitWeight === "" ||
          partArray[i].qtyReceived === "" ||
          partArray[i].qtyAccepted === ""
        ) {
          flag1 = 1;
        }

        if (
          parseFloat(partArray[i].qtyAccepted) >
          parseFloat(partArray[i].qtyReceived)
        ) {
          flag1 = 2;
        }
      }
      if (flag1 === 1) {
        toast.error("Please fill correct Part details");
      } else if (flag1 === 2) {
        toast.error("QtyAccepted should be less than or equal to QtyReceived");
      } else {
        //to update data
        updateHeaderFunction();
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

  const allotRVButtonState = (e) => {
    e.preventDefault();
    getRVNo();

    if (partArray.length === 0) {
      toast.error("Add Details Before Saving");
    } else if (
      partArray.length !== 0 &&
      (formHeader.weight == 0.0 ||
        formHeader.weight === null ||
        formHeader.weight === "" ||
        formHeader.weight === undefined)
    ) {
      toast.error(
        "Enter the Customer Material Weight as per Customer Document"
      );
    } else {
      //NEW CODE FOR FORM VALIDATION
      let flag1 = 0;
      for (let i = 0; i < partArray.length; i++) {
        if (partArray[i].mtrlCode == "") {
          flag1 = 1;
          break;
        }

        if (
          partArray[i].dynamicPara1 == "" ||
          partArray[i].dynamicPara1 == "0" ||
          partArray[i].dynamicPara1 == 0.0
        ) {
          flag1 = 2;

          break; // Add a break to ensure this condition is not overwritten by subsequent checks
        }

        if (
          partArray[i].qtyReceived === "" ||
          partArray[i].qtyReceived === "0" ||
          partArray[i].qtyReceived === 0.0 ||
          partArray[i].qtyReceived === undefined
        ) {
          flag1 = 3;
        }

        if (
          partArray[i].qtyAccepted == "" ||
          partArray[i].qtyAccepted == "0" ||
          partArray[i].qtyAccepted == 0.0 ||
          partArray[i].qtyAccepted === undefined
        ) {
          flag1 = 4;
        }

        if (partArray[i].locationNo == "") {
          flag1 = 5;
        }
        if (partArray[i].qtyAccepted > partArray[i].qtyReceived) {
          flag1 = 6;
        }
      }

      if (flag1 === 1) {
        toast.error("Select Material");
      } else if (flag1 === 2) {
        toast.error("Parameters cannot be Zero");
      } else if (flag1 === 4) {
        toast.error("Received and Accepted Qty cannot be Zero");
      } else if (flag1 === 5) {
        toast.error("Select Location");
      } else if (flag1 === 6) {
        toast.error("QtyAccepted should be less than or equal to QtyReceived");
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
          nav("/MaterialManagement/Receipt/CustomerJobWork/Parts/New", {
            replace: true,
          });
          window.location.reload();
        }
      }
    );
  };
  const handleYes = () => {
    handleDelete();
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

  console.log("inputPart", inputPart);
  console.log("partArray", partArray);
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
        <h4 className="title">Customer Parts Receipt Voucher </h4>

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

          <div className="d-flex col-md-2" style={{ gap: "19px" }}>
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
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
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
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Weight
            </label>

            <input
              className="input-disabled mt-1"
              type="number"
              onKeyDown={blockInvalidChar}
              min="0"
              name="weight"
              value={formHeader.weight}
              onChange={InputHeaderEvent}
              disabled={boolVal4}
            />
          </div>
        </div>

        <div className="row">
          <div className="d-flex col-md-5" style={{ gap: "28px" }}>
            <label className="form-label mt-1">Customer</label>

            <select
              className="ip-select mt-1"
              name="customer"
              //onChange={changeCustomer}
              disabled={boolVal1}
            >
              <option value={formHeader.customer} disabled selected>
                {formHeader.customerName}
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
              // value={calcWeightVal}
              readOnly
            />
          </div>
        </div>

        <div className="row mt-2">
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
      </div>
      <div className="row">
        <div
          style={{ height: "238px", overflowY: "scroll" }}
          className="col-md-8 col-sm-12"
        >
          <BootstrapTable
            keyField="id"
            columns={columns}
            data={partArray}
            striped
            hover
            condensed
            selectRow={selectRow}
            headerClasses="header-class tableHeaderBGColor"
          ></BootstrapTable>
        </div>

        <div className="col-md-4 col-sm-12 ">
          <div className=" form-bg ">
            <div className="d-flex   mt-2 justify-content-center">
              <button
                className="button-style "
                onClick={addNewPart}
                //disabled={boolVal1 | boolVal4}
                disabled={boolVal4}
              >
                Add New
              </button>

              <button
                className="button-style "
                disabled={boolVal4}
                onClick={deleteButtonState}
              >
                Delete
              </button>
            </div>
            <div className="row">
              {/* <label className="form-label">Srl Details</label> */}
              {/* <p className="form-title-deco mt-1">
                <h5>Serial Details</h5>
              </p> */}
              <label
                className="form-label"
                style={{ textDecoration: "underline" }}
              >
                Serial Details
              </label>
              <div className="col-md-4">
                <label className="form-label mt-2">Part ID</label>
                {/* </div>
              <div className="col-md-8" style={{ marginTop: "8px" }}> */}
              </div>
              {/* <div className="col-md-8">
                <select
                  className="ip-select dropdown-field"
                  name="partId"
                  value={inputPart.partId}
                  onChange={changePartID}
                  disabled={boolVal4}
                >
                  <option value="" disabled selected>
                    Select Part
                  </option>
                  {mtrlDetails.map((part, index) => (
                    <option key={index} value={part.PartId}>
                      {part.PartId}
                    </option>
                  ))}
                </select>
              </div> */}
              <div className="col-md-8">
                <Typeahead
                  className="input-disabled mt-1"
                  id="partId"
                  labelKey="PartId"
                  options={mtrlDetails}
                  selected={selectedPart}
                  onChange={changePartID}
                  disabled={boolVal4}
                  placeholder="Select Part"
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ">
                <label className="form-label mt-1">Unit Wt</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="number"
                  name="unitWeight"
                  value={inputPart.unitWeight}
                  onChange={changePartHandle}
                  //onKeyUp={changePartHandle1}
                  onKeyDown={blockInvalidChar}
                  min="0"
                  disabled={boolVal4}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ">
                <label className="form-label mt-1">QtyReceived</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="number"
                  name="qtyReceived"
                  min="0"
                  //value={tempVal}
                  value={inputPart.qtyReceived}
                  onChange={changePartHandle}
                  onKeyDown={blockInvalidQtyChar}
                  disabled={boolVal4}
                />
              </div>
              <div className="col-md-8 "></div>
            </div>
            <div className="row">
              <div className="col-md-4 ">
                <label className="form-label mt-1">QtyAccepted</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="number"
                  name="qtyAccepted"
                  value={inputPart.qtyAccepted}
                  onChange={changePartHandle}
                  onKeyDown={blockInvalidQtyChar}
                  min="0"
                  disabled={boolVal4}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 ">
                <label className="form-label mt-1">QtyRejected</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="number"
                  // value={inputPart.qtyReceived - inputPart.qtyAccepted}
                  value={
                    parseFloat(inputPart.qtyReceived) -
                    parseFloat(inputPart.qtyAccepted)
                  }
                  name="qtyRejected"
                  readOnly
                />
              </div>
              <div className="col-md-8 "></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpenButtonDraftPartList;
