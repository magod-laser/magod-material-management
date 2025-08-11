import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CreateYesNoModal from "../../../../components/CreateYesNoModal";
import DeleteSerialYesNoModal from "../../../../components/DeleteSerialYesNoModal";
import DeleteRVModal from "../../../../components/DeleteRVModal";
import BootstrapTable from "react-bootstrap-table-next";
import { formatDate } from "../../../../../../utils";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function PurchasePartsNew() {
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

  const [boolVal1, setBoolVal1] = useState(true);
  const [boolVal2, setBoolVal2] = useState(false);
  const [boolVal3, setBoolVal3] = useState(true);
  const [boolVal4, setBoolVal4] = useState(false);
  const [partUniqueId, setPartUniqueId] = useState();
  const [partArray, setPartArray] = useState([]);

  const [inputPart, setInputPart] = useState({
    id: "",
    partId: "",
    unitWeight: "",
    qtyReceived: "",
    qtyAccepted: "",
    qtyRejected: "0",
  });

  const [calcWeightVal, setCalcWeightVal] = useState(0);
  let [custdata, setCustdata] = useState([]);
  let [mtrlDetails, setMtrlDetails] = useState([]);
  const [saveUpdateCount, setSaveUpdateCount] = useState(0);

  let [formHeader, setFormHeader] = useState({
    rvId: "",
    receiptDate: "",
    rvNo: "Draft",
    rvDate: "",
    status: "Created",
    customer: "0000",
    customerName: "",
    reference: "",
    weight: "0",
    calcWeight: "0",
    type: "Parts",
    address: "",
  });

  async function fetchCustData() {
    getRequest(endpoints.getCustomers, (data) => {
      setCustdata(data);

      const found = data.find((obj) => obj.Cust_Code == 0);
      setFormHeader((preValue) => {
        return {
          ...preValue,
          customerName: found.Cust_name,
          customer: found.Cust_Code,
          address: found.Address,
        };
      });
    });

    getRequest(endpoints.getCustBomList, (data) => {
      const foundPart = data.filter((obj) => obj.Cust_code == 0);
      setMtrlDetails(foundPart);
    });
  }

  useEffect(() => {
    fetchCustData();
  }, []);

  const columns = [
    {
      text: "#",
      dataField: "id",
      hidden: true,
    },
    {
      text: "Part Id",
      dataField: "partId",
      headerStyle: { whiteSpace: "nowrap" },
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
      formatter: (cellContent) => {
        return parseInt(cellContent);
      },
    },
    {
      text: "Qty Accepted",
      dataField: "qtyAccepted",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
      formatter: (cellContent) => {
        return parseInt(cellContent);
      },
    },
    {
      text: "Qty Rejected",
      dataField: "qtyRejected",
      formatter: (celContent, row) => <div className="">{qtyRejected}</div>,
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];

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
    inputPart.custBomId = formHeader.customer;
    inputPart.rvId = formHeader.rvId;
    // inputPart.qtyRejected = 0;
    inputPart.qtyRejected = inputPart.qtyReceived - inputPart.qtyAccepted;
    inputPart.qtyUsed = 0;
    inputPart.qtyReturned = 0;
    inputPart.qtyIssued = 0;
    setInputPart(inputPart);

    postRequest(endpoints.updatePartReceiptDetails, inputPart, (data) => {
      if (data.affectedRows !== 0) {
      } else {
        toast.error("Record Not Updated");
      }
    });

    const newArray = partArray.map((p) => {
      if (p.id === partUniqueId) {
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
    partArray.map((obj) => {
      totwt =
        parseFloat(totwt) +
        parseFloat(obj.unitWeight) * parseFloat(obj.qtyAccepted);
    });

    setCalcWeightVal(parseFloat(totwt).toFixed(3));
    setFormHeader({ ...formHeader, calcWeight: parseFloat(totwt).toFixed(3) });
  };

  //add new part
  let { partId, unitWeight, qtyReceived, qtyAccepted, qtyRejected } = inputPart;
  const addNewPart = (e) => {
    setBoolVal3(false);

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

        setPartUniqueId(id);
        let newRow = {
          id: id,
          partId: "",
          unitWeight: 0,
          qtyReceived: 0,
          qtyAccepted: 0,
          qtyRejected: 0,
        };
        setPartArray([...partArray, newRow]);
        setInputPart(inputPart);
      } else {
        toast.error("Record Not Inserted");
      }
    });
  };

  const deleteButtonState = () => {
    setModalOpen(true);
  };
  //delete part
  const handleDelete = () => {
    postRequest(endpoints.deletePartReceiptDetails, inputPart, (data) => {
      if (data.affectedRows !== 0) {
        const newArray = partArray.filter((p) => p.id !== inputPart.id);
        setPartArray(newArray);
        toast.success("Material Deleted");
      }
    });

    //cal weight
    let totwt = 0;
    partArray.map((obj) => {
      totwt =
        parseFloat(totwt) +
        parseFloat(obj.unitWeight) * parseFloat(obj.qtyReceived);
    });
    setCalcWeightVal(parseFloat(totwt).toFixed(2));
  };

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row, isSelect, rowIndex, e) => {
      setPartUniqueId(row.id);
      setInputPart({
        id: row.id,
        partId: row.partId,
        unitWeight: row.unitWeight,
        qtyAccepted: row.qtyAccepted,
        qtyRejected: row.qtyRejected,
        qtyReceived: row.qtyReceived,
      });
    },
  };

  //input header change event
  const InputHeaderEvent = (e) => {
    const { value, name } = e.target;

    const formattedValue =
      name === "weight" ? value.replace(/(\.\d{3})\d+/, "$1") : value;
    setFormHeader((preValue) => {
      return {
        ...preValue,
        [name]: formattedValue,
        [formHeader.calcWeight]: calcWeightVal,
      };
    });
  };

  const insertHeaderFunction = () => {
    //to save data
    postRequest(
      endpoints.insertHeaderMaterialReceiptRegister,
      formHeader,
      (data) => {
        if (data.affectedRows !== 0) {
          setFormHeader((preValue) => {
            return {
              ...preValue,
              rvId: data.insertId,
            };
          });
          setSaveUpdateCount(saveUpdateCount + 1);
          toast.success("Record Saved Successfully");
          setBoolVal1(false);
        } else {
          toast.error("Record Not Inserted");
        }
      }
    );
  };

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
    } else if (formHeader.reference.length === 0) {
      toast.error("Please Enter Customer Document Material Reference");
    } else if (formHeader.weight === "") {
      toast.error(
        "Enter the Customer Material Weight as per Customer Document"
      );
    } else if (
      parseFloat(inputPart.qtyAccepted) > parseFloat(inputPart.qtyReceived)
    ) {
      toast.error("QtyAccepted should be less than or equal to QtyReceived");
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
          toast.error(
            "QtyAccepted should be less than or equal to QtyReceived"
          );
        } else {
          //to update data
          updateHeaderFunction();
        }
      }
    }
  };

  const allotRVButtonState = (e) => {
    e.preventDefault();

    if (partArray.length === 0) {
      toast.error("Add Details Before Saving");
    } else if (
      partArray.length !== 0 &&
      (formHeader.weight == 0.0 ||
        formHeader.weight == "0" ||
        formHeader.weight === null ||
        formHeader.weight === undefined)
    ) {
      toast.error(
        "Enter the Customer Material Weight as per Customer Document"
      );
    } else {
      let flag1 = 0;
      for (let i = 0; i < partArray.length; i++) {
        if (
          partArray[i].partId == "" ||
          partArray[i].unitWeight == "" ||
          partArray[i].qtyReceived == "" ||
          partArray[i].qtyAccepted == ""
        ) {
          flag1 = 1;
        }
        if (partArray[i].qtyAccepted > partArray[i].qtyReceived) {
          flag1 = 2;
        }
      }
      if (flag1 == 1) {
        toast.error("Please fill correct Part details");
      } else if (flag1 === 2) {
        toast.error("QtyAccepted should be less than or equal to QtyReceived");
      } else {
        setShow(true);
      }
    }
  };

  const allotRVYesButton = (data) => {
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
          nav("/MaterialManagement/Receipt/Purchase/Parts/New", {
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
        <h4 className="title">Customer Parts Receipt Voucher</h4>

        <div className="row">
          <div className="d-flex col-md-2" style={{ gap: "20px" }}>
            <label
              className="form-label mt-1 "
              style={{ whiteSpace: "nowrap" }}
            >
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

          <div className="d-flex col-md-2" style={{ gap: "20px" }}>
            <label
              className="form-label mt-1 "
              style={{ whiteSpace: "nowrap" }}
            >
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

          <div className="d-flex col-md-4" style={{ gap: "80px" }}>
            <label
              className="form-label mt-1 "
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

          <div className="d-flex col-md-2">
            <div className="col-md-4">
              <label className="form-label">Weight</label>
            </div>
            <div className="col-md-8">
              <input
                className="input-disabled mt-1"
                type="text"
                name="weight"
                value={
                  formHeader.weight === "0" || formHeader.weight === 0
                    ? ""
                    : formHeader.weight
                }
                onChange={InputHeaderEvent}
                onKeyDown={blockInvalidChar}
                disabled={boolVal4}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="d-flex col-md-4" style={{ gap: "35px" }}>
            <label
              className="form-label mt-1 "
              style={{ whiteSpace: "nowrap" }}
            >
              Customer
            </label>

            <select
              className="ip-select mt-1"
              name="customer"
              disabled={boolVal1}
            >
              {custdata.map((customer, index) =>
                customer.Cust_Code == 0 ? (
                  <option key={index} value={customer.Cust_Code}>
                    {customer.Cust_name}
                  </option>
                ) : (
                  ""
                )
              )}
            </select>
          </div>

          <div className="d-flex col-md-2" style={{ gap: "10px" }}>
            <label
              className="form-label mt-1 "
              style={{ whiteSpace: "nowrap" }}
            >
              Reference{" "}
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              autoComplete="off"
              name="reference"
              value={formHeader.reference}
              onChange={InputHeaderEvent}
              disabled={boolVal2 & boolVal4}
            />
          </div>

          <div className="d-flex col-md-4" style={{ gap: "10px" }}>
            <label
              className="form-label mt-1 "
              style={{ whiteSpace: "nowrap" }}
            >
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

        <div className="row">
          <div className="col-md-8 ">
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
              disabled={boolVal1 | boolVal4}
              onClick={allotRVButtonState}
            >
              Allot RV No
            </button>
            <button
              className="button-style"
              disabled={boolVal1 | boolVal4}
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
          style={{ height: "223px", overflowY: "scroll" }}
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

        <div className="col-md-4 col-sm-12">
          <div className=" form-bg">
            <div className="d-flex justify-content-center mt-2 mb-3">
              <button
                className="button-style "
                onClick={addNewPart}
                disabled={boolVal1 | boolVal4}
              >
                Add New
              </button>

              <button
                className="button-style "
                disabled={boolVal3 | boolVal4}
                onClick={deleteButtonState}
              >
                Delete
              </button>
            </div>
            <div className="row">
              <div className="col-md-4 ">
                <label className="form-label mt-1">Part ID</label>
              </div>
              <div className="col-md-8">
                <select
                  className="input-disabled mt-1"
                  name="partId"
                  value={inputPart.partId}
                  onChange={changePartHandle}
                  disabled={boolVal3 | boolVal4}
                  style={{ width: "100%" }}
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
              </div>
              <div className="col-md-4">
                <label className="form-label mt-1">Unit Wt</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="number"
                  name="unitWeight"
                  value={
                    inputPart.unitWeight === "0" || inputPart.unitWeight === 0
                      ? ""
                      : inputPart.unitWeight
                  }
                  onChange={changePartHandle}
                  onKeyDown={blockInvalidChar}
                  min="0"
                  disabled={boolVal3 | boolVal4}
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
                  value={
                    inputPart.qtyReceived === "0" || inputPart.qtyReceived === 0
                      ? ""
                      : inputPart.qtyReceived
                  }
                  onKeyDown={blockInvalidQtyChar}
                  onChange={changePartHandle}
                  disabled={boolVal3 | boolVal4}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label mt-1">QtyAccepted</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="number"
                  name="qtyAccepted"
                  value={
                    inputPart.qtyAccepted === "0" || inputPart.qtyAccepted === 0
                      ? ""
                      : inputPart.qtyAccepted
                  }
                  onKeyDown={blockInvalidQtyChar}
                  onChange={changePartHandle}
                  min="0"
                  disabled={boolVal3 | boolVal4}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <label className="form-label mt-1">QtyRejected</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-1"
                  type="number"
                  value={inputPart.qtyReceived - inputPart.qtyAccepted}
                  name="qtyRejected"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchasePartsNew;
