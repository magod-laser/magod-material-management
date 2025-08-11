import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import { toast } from "react-toastify";
import YesNoModal from "../../../../components/YesNoModal";
import { formatDate } from "../../../../../../utils";
import OkModal from "../../../../components/OkModal";

const { getRequest, postRequest } = require("../../../../../api/apiinstance");
const { endpoints } = require("../../../../../api/constants");

function UnitsMatAllotmentForm() {
  const nav = useNavigate();
  const location = useLocation();

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const [formHeader, setFormHeader] = useState({});
  const [firstTable, setFirstTable] = useState([]);
  const [secondTable, setSecondTable] = useState([]);
  const [firstTableRow, setFirstTableRow] = useState([]);
  const [secondTableRow, setSecondTableRow] = useState([]);
  const [issueidval, setissueidval] = useState("");
  const [firstTableSelectIndex, setFirstTableSelectIndex] = useState([]);
  const [secondTableSelectIndex, setSecondTableSelectIndex] = useState([]);
  const [selectedRowsInSecondTable, setSelectedRowsInSecondTable] = useState(
    []
  );
  const [loadingFirstTable, setLoadingFirstTable] = useState(true);

  const [show, setShow] = useState(false);
  const [showok, setShowok] = useState(false);

  const storedData = JSON.parse(localStorage.getItem("LazerUser"));
  let unitName = storedData.data[0]["UnitName"];

  const fetchData = async () => {
    //get formHeader data
    let url1 = endpoints.getRowByNCID + "?id=" + location.state.ncid;

    getRequest(url1, async (data) => {
      data["QtyAllottedTemp"] = data.QtyAllotted;

      setFormHeader(data);

      let url2 = endpoints.getCustomerByCustCode + "?code=" + data.Cust_Code;

      getRequest(url2, async (data1) => {
        setFormHeader({
          ...data,
          customer: data1.Cust_name,
        });
      });

      setLoadingFirstTable(true);

      //get first table data
      let url3 =
        endpoints.getMaterialAllotmentTable1 +
        "?MtrlCode=" +
        data.Mtrl_Code +
        "&CustCode=" +
        data.Cust_Code +
        "&CustMtrl=" +
        data.CustMtrl +
        "&shape=" +
        data.Shape +
        "&para1=" +
        data.Para1 +
        "&para2=" +
        data.Para2;
      getRequest(url3, async (data2) => {
        setFirstTable(data2);
        setLoadingFirstTable(false);
        if (data2.length == 0) {
          toast.warning(
            "There is no material to allot for this program. Check if you have added the material to customer stock?."
          );
        }
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns1 = [
    {
      text: "Id",
      dataField: "MtrlStockID",
      hidden: true,
    },
    {
      text: "Locked",
      dataField: "Locked",
      editable: false,
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={celContent === 0 ? false : true} />
          </lable>
        </div>
      ),
    },
    {
      text: "Stock Id",
      dataField: "MtrlStockID",
      sort: true,
    },
    {
      text: "Para1",
      dataField: "DynamicPara1",
      sort: true,
    },
    {
      text: "Para2",
      dataField: "DynamicPara2",
      sort: true,
    },
    {
      text: "Location",
      dataField: "",
    },
  ];

  const columns2 = [
    {
      text: "Id",
      dataField: "MtrlStockID",
      hidden: true,
    },
    {
      text: "Stock Id",
      dataField: "MtrlStockID",
      sort: true,
    },
    {
      text: "Para1",
      dataField: "DynamicPara1",
      sort: true,
    },
    {
      text: "Para2",
      dataField: "DynamicPara2",
      sort: true,
    },
    {
      text: "Selected",
      dataField: "",
    },
  ];

  const selectRow1 = {
    mode: "checkbox",
    clickToSelect: true,
    bgColor: "#98A8F8",
    selected: firstTableSelectIndex,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setFirstTableSelectIndex([...firstTableSelectIndex, row.MtrlStockID]);
        if (
          formHeader.QtyAllottedTemp + firstTableRow.length <
          formHeader.Qty
        ) {
          const updatedFirstTableRow = [...firstTableRow, row];
          setFirstTableRow(updatedFirstTableRow);
          setSecondTableRow(updatedFirstTableRow);
        } else {
        }
      } else {
        firstTableRow.forEach((obj) => {
          if (obj == row) {
            obj.Locked = 0;
          }
        });

        const updatedFirstTableRow = firstTableRow.filter(
          (obj) => obj.MtrlStockID !== row.MtrlStockID
        );
        setFirstTableRow(updatedFirstTableRow);
        setSecondTableRow(updatedFirstTableRow);
        setFirstTableSelectIndex(
          firstTableSelectIndex.filter((item) => item != row.MtrlStockID)
        );
      }
    },
    onSelectAll: async (isSelect, rows) => {
      if (isSelect) {
        let tempIndex = [];
        for (let i = 0; i < rows.length; i++) {
          tempIndex.push(rows[i].MtrlStockID);
        }

        let firstno = formHeader.QtyAllottedTemp + firstTableRow.length;
        let secondno = formHeader.Qty;
        let updatedFirstTableRow = [];

        for (let i = 0; i < rows.length && firstno < secondno; i++, firstno++) {
          updatedFirstTableRow.push(rows[i]);
        }
        await delay(100);
        setFirstTableSelectIndex(tempIndex);

        setFirstTableRow(updatedFirstTableRow);
        setSecondTableRow(updatedFirstTableRow);
      } else {
        firstTableRow.forEach((obj) => {
          obj.Locked = 0;
        });

        setFirstTableRow([]);
        setSecondTableRow([]);
        setFirstTableSelectIndex([]);
      }
    },
  };

  const selectRow2 = {
    mode: "checkbox",
    clickToSelect: true,
    bgColor: "#98A8F8",
    selected: secondTableSelectIndex,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setSecondTableSelectIndex([...secondTableSelectIndex, row.MtrlStockID]);

        setSelectedRowsInSecondTable((prevSelectedRows) => [
          ...prevSelectedRows,
          row,
        ]);
      } else {
        const updatedSecondTableSelectIndex = secondTableSelectIndex.filter(
          (item) => item !== row.MtrlStockID
        );
        setSecondTableSelectIndex(updatedSecondTableSelectIndex);

        setSelectedRowsInSecondTable((prevSelectedRows) =>
          prevSelectedRows.filter(
            (selectedRow) => selectedRow.MtrlStockID !== row.MtrlStockID
          )
        );
      }
    },
    onSelectAll: (isSelect, rows) => {
      if (isSelect) {
        const selectedRowIds = rows.map((row) => row.MtrlStockID);
        setSecondTableSelectIndex(selectedRowIds);
        setSelectedRowsInSecondTable([...rows]);
      } else {
        setSecondTableSelectIndex([]);
        setSelectedRowsInSecondTable([]);
      }
    },
  };

  const allotMaterial = async () => {
    setFormHeader({
      ...formHeader,
      QtyAllotted: parseInt(formHeader.QtyAllottedTemp) + firstTableRow.length,
    });

    setSecondTable(secondTableRow);

    firstTableRow.forEach((obj) => {
      obj.Locked = 1;
    });
    await delay(100);
    setFirstTableRow(firstTableRow);

    setSecondTableSelectIndex([]);
  };

  const uncheckSelectedRows = () => {
    const updatedFirstTable = firstTable.map((row) => {
      if (
        selectedRowsInSecondTable.some(
          (selectedRow) => selectedRow.MtrlStockID === row.MtrlStockID
        )
      ) {
        return {
          ...row,

          Locked: 0,
        };
      }
      return row;
    });
    setFirstTable(updatedFirstTable);
  };

  const CancelAllotMaterial = async () => {
    uncheckSelectedRows();

    const newAllottedValue =
      formHeader.QtyAllotted - selectedRowsInSecondTable.length;

    setFormHeader({
      ...formHeader,
      QtyAllotted: newAllottedValue,
    });

    let secondTableRowObj = secondTableRow.filter((obj1) => {
      return !selectedRowsInSecondTable.some(
        (obj2) => obj1.MtrlStockID === obj2.MtrlStockID
      );
    });

    setSecondTable(secondTableRowObj);
    setSecondTableRow(secondTableRowObj);
    setSelectedRowsInSecondTable([]);
    setSecondTableSelectIndex([]);
    await delay(200);

    const secondTableMtrlId = [];
    secondTableRowObj.forEach((obj) => {
      secondTableMtrlId.push(obj.MtrlStockID);
    });
    setFirstTableSelectIndex(secondTableMtrlId);

    let firstTableRowObj = [];
    firstTable.forEach((obj1) => {
      secondTableRowObj.forEach((obj2) => {
        if (obj1.MtrlStockID === obj2.MtrlStockID) {
          firstTableRowObj.push(obj1);
        }
      });
    });
    setFirstTableRow(firstTableRowObj);
  };

  let modalResponse = async (data) => {
    let ResetPeriod = "Year";
    if (data === "yes") {
      let yyyy = formatDate(new Date(), 6).toString();

      const url = `${endpoints.getNewRunningNo}?SrlType=ShopFloor_SheetIssueVoucher&Period=${yyyy}&VoucherNoLength=5&ResetValue=0&UnitName=${unitName}&&ResetPeriod=${ResetPeriod}`;

      getRequest(url, async (data) => {
        let newNo = parseInt(data.runningNo) + 1;

        let header1 = {
          IV_No: newNo,
          Issue_date: formatDate(new Date(), 2),
          NC_ProgramNo: formHeader.NCProgramNo,
          QtyIssued: secondTable.length,
          QtyReturned: 0,
          Ncid: formHeader.Ncid,
        };

        postRequest(
          endpoints.insertShopfloorMaterialIssueRegister,
          header1,
          async (data) => {
            if (data.affectedRows !== 0) {
              setissueidval(data.insertId);
              await delay(500);
              setissueidval(data.insertId);

              let header2 = {
                Id: formHeader.Ncid,
                Qty: secondTable.length,
              };
              postRequest(
                endpoints.updateQtyAllotedncprograms2,
                header2,
                async (data) => {
                  if (data.affectedRows !== 0) {
                  } else {
                  }
                }
              );

              let noreturn = 0;
              switch (formHeader.Shape) {
                case "Sheet":
                  noreturn = 0;
                  break;
                case "Units":
                  noreturn = 1;
                  break;
                case "Tube Round":
                  noreturn = 1;
                  break;
                case "Tube Square":
                  noreturn = 1;
                  break;
                case "Tube Rectangle":
                  noreturn = 1;
                  break;
                case "Tiles":
                  noreturn = 1;
                  break;
                case "Plate":
                  noreturn = 0;
                  break;
                case "Strip":
                  noreturn = 0;
                  break;
                default:
                  noreturn = 0;
                  break;
              }
              await delay(1000);
              setissueidval(data.insertId);

              for (let i = 0; i < secondTable.length; i++) {
                let header3 = {
                  id: secondTable[i].MtrlStockID,
                };
                postRequest(
                  endpoints.updateMtrlStockLock,
                  header3,
                  async (data) => {
                    if (data.affectedRows !== 0) {
                    } else {
                    }
                  }
                );

                let header4 = {
                  TaskNo: formHeader.TaskNo,
                  NCProgramNo: formHeader.NCProgramNo,
                  ShapeMtrlID: secondTable[i].MtrlStockID,
                  Mtrl_Code: secondTable[i].Mtrl_Code,
                  NCPara1: formHeader.Para1,
                  NCPara2: formHeader.Para2,
                  NCPara3: formHeader.Para3,
                  Para1: secondTable[i].DynamicPara1,
                  Para2: secondTable[i].DynamicPara2,
                  Para3: secondTable[i].DynamicPara3,
                  IssueId: data.insertId,
                  NoReturn: noreturn,
                  Ncid: formHeader.Ncid,
                };
                postRequest(
                  endpoints.insertncprogrammtrlallotmentlist,
                  header4,
                  async (data) => {
                    if (data.affectedRows !== 0) {
                    } else {
                    }
                  }
                );
              }

              const inputData = {
                SrlType: "ShopFloor_SheetIssueVoucher",
                Period: formatDate(new Date(), 6),
                RunningNo: newNo,
                UnitName: unitName,
              };
              postRequest(endpoints.updateRunNo, inputData, (data) => {});

              if (data.insertId > 0) {
                let series = "";
                for (let i = 0; i < 5 - newNo.toString().length; i++) {
                  series += "0";
                }
                series += newNo;

                localStorage.setItem(
                  "issuevoucer",
                  "Issue Voucher number is created: " + series
                );
                localStorage.issuevoucer =
                  "Issue Voucner number is created : " + series;
                setShowok(true);
              }
            } else {
            }
          }
        );
      });
    }
  };

  let modalResponseok = async (data) => {
    if (data === "ok") {
      nav(
        "/MaterialManagement/ShopFloorIssue/IVListProfileCutting/Closed/ShopMatIssueVoucher",
        {
          state: { issueIDVal: issueidval },
        }
      );
    } else {
    }
  };

  const issueToProduction = () => {
    if (secondTable.length === 0) {
      toast.error("Please Select material before alloting");
    } else {
      setShow(true);
    }
  };

  return (
    <>
      <OkModal
        show={showok}
        setShow={setShowok}
        modalMessage={localStorage.issuevoucer}
        modalResponseok={modalResponseok}
      />
      <YesNoModal
        show={show}
        setShow={setShow}
        message="Do you issue the selected material for production?"
        modalResponse={modalResponse}
      />

      <div>
        <h4 className="title">Material Allotment Form</h4>

        <div className="row">
          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Task No
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              value={formHeader.TaskNo}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Customer
            </label>

            <input
              className="input-disabled mt-1"
              type="text"
              value={formHeader.customer}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              NC Program No
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.NCProgramNo}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Material Code
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Mtrl_Code}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "12px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Priority
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Priority}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "25px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Para1
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Para1}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "50px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Machine
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Machine}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "40px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Quantity
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Qty}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "17px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Status
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.PStatus}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "30px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Para2
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Para2}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "55px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Process
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.MProcess}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "45px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Allotted
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.QtyAllotted}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "15px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Source
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.CustMtrl}
              disabled
            />
          </div>

          <div className="d-flex col-md-8 ">
            <button className="button-style " onClick={allotMaterial}>
              Allot Material
            </button>
            <button className="button-style " onClick={CancelAllotMaterial}>
              Cancel Allot
            </button>

            <button className="button-style " onClick={issueToProduction}>
              Issue to Production
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

        <div className="row mt-4">
          <div className="col-md-7">
            <div
              style={{
                height: "400px",
                overflowY: "scroll",
                marginTop: "10px",
              }}
            >
              <BootstrapTable
                keyField="MtrlStockID"
                columns={columns1}
                data={firstTable}
                striped
                hover
                condensed
                selectRow={selectRow1}
                headerClasses="header-class tableHeaderBGColor"
                noDataIndication={() =>
                  loadingFirstTable ? (
                    <div className="text-center py-2">Loading...</div>
                  ) : (
                    "No material data available"
                  )
                }
              />
            </div>
          </div>
          <div className="col-md-5">
            <div
              style={{
                height: "400px",
                overflowY: "scroll",
                marginTop: "10px",
              }}
            >
              <BootstrapTable
                keyField="MtrlStockID"
                columns={columns2}
                data={secondTable}
                striped
                hover
                condensed
                selectRow={selectRow2}
                headerClasses="header-class tableHeaderBGColor"
              ></BootstrapTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UnitsMatAllotmentForm;
