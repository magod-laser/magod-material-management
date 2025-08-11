import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { formatDate } from "../../../../../../../utils";

const {
  getRequest,
  postRequest,
} = require("../../../../../../api/apiinstance");

const { endpoints } = require("../../../../../../api/constants");

function MaterialAllotmentMain() {
  const location = useLocation();
  const nav = useNavigate();

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const [formHeader, setFormHeader] = useState({});
  const [firstTable, setFirstTable] = useState([]);
  const [secondTable, setSecondTable] = useState([]);
  const [custBOMId, setCustBOMId] = useState([]);
  const [row2, setRow2] = useState(
    secondTable.length > 0 ? secondTable[0] : {}
  );

  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [issuenowval, setissuenowval] = useState("");
  const [issueidval, setissueidval] = useState("");
  const [btnVisibility, setBtnVisibility] = useState(false);
  const [selectedFirstTableRow, setSelectedFirstTableRow] = useState(null);
  const [selectedSecondTableRows, setSelectedSecondTableRows] = useState([]);
  const [loadingFirstTable, setLoadingFirstTable] = useState(true);

  const storedData = JSON.parse(localStorage.getItem("LazerUser"));
  let unitName = storedData.data[0]["UnitName"];

  const fetchData = async () => {
    let url1 = endpoints.getRowByNCID + "?id=" + location.state?.ncid;
    getRequest(url1, async (data) => {
      setFormHeader(data);

      let url2 = endpoints.getCustomerByCustCode + "?code=" + data.Cust_Code;

      getRequest(url2, async (data1) => {
        setFormHeader({ ...data, customer: data1.Cust_name });
      });
    });

    delay(1000);
    //get first table data
    let url3 =
      endpoints.getShopFloorAllotmentPartFirstTable +
      "?id=" +
      location.state?.ncid;
    getRequest(url3, async (data) => {
      let tempArray = [];
      for (let i = 0; i < data.length; i++) {
        tempArray.push(data[i].CustBOM_Id);

        //find QtyAvailable
        let url5 =
          endpoints.getShopFloorAllotmentPartFirstTableQtyAvl +
          "?id=" +
          data[i].CustBOM_Id;

        getRequest(url5, async (data2) => {
          if (
            (data2 && data2[0] && data2[0]["QtyAvialable"] !== null) ||
            undefined
          ) {
            data[i].QtyAvailable = data2[0]["QtyAvialable"];
          } else {
            data[i].QtyAvailable = 0;
          }

          data[i].issueNow = 0;
          data[i].AlreadyUsed = 0;
          data[i].TotalUsed = 0;
        });
      }

      await delay(2000);
      setFirstTable(data);
      setLoadingFirstTable(false);

      if (data.length === 0) {
        toast.warning("There is no material data available.");
      }

      for (let i = 0; i < data.length; i++) {
        if (data[i].QtyAvailable === 0) {
          toast.warning(
            "There is no material to allot for this program. Check if you have added the material to customer stock?"
          );
          break;
        }
      }

      if (tempArray.length !== 0) {
        //fetch data in second table
        let url4 =
          endpoints.getShopFloorAllotmentPartSecondTableIds +
          "?bomids=" +
          tempArray;

        getRequest(url4, async (data) => {
          for (let i = 0; i < data.length; i++) {
            data[i].issueNow = 0;
          }

          setSecondTable(data);

          if (data.length > 0) {
            setRow2(data[0]);
          }
        });
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {}, [firstTable, secondTable]);

  let issuenowchange = (e) => {
    setissuenowval(e.target.value);
  };

  let issuenowonblur = async () => {
    if (issuenowval > formHeader.Qty - formHeader.QtyAllotted) {
      toast.error("Cannot Allot more material than Programmed Quantity");
      setBtnVisibility(true);
    } else {
      setBtnVisibility(false);

      let setQtyAvailable = issuenowval;

      for (const key in firstTable) {
        if (
          Math.floor(
            parseInt(firstTable[key].QtyAvailable) /
              parseInt(firstTable[key].QtyPerAssy)
          ) < parseInt(setQtyAvailable)
        ) {
          setQtyAvailable = Math.floor(
            parseInt(firstTable[key].QtyAvailable) /
              parseInt(firstTable[key].QtyPerAssy)
          );
        }
      }

      if (issuenowval > setQtyAvailable) {
        toast.error(
          "Sets Required : " +
            issuenowval +
            " Sets Available : " +
            setQtyAvailable
        );
      } else {
        const updatedFirstTable = firstTable.map((obj1) => {
          const newIssueNow = obj1.QtyPerAssy * setQtyAvailable;

          let remainingIssueNow = newIssueNow;

          const updatedSecondTable = secondTable.map((obj2) => {
            if (obj1.CustBOM_Id === obj2.CustBOM_Id) {
              let availableForIssue = obj2.QtyReceived - obj2.QtyIssued;

              availableForIssue = Math.max(0, availableForIssue);

              let issueNowForThisRow = Math.min(
                remainingIssueNow,
                availableForIssue
              );

              obj2.issueNow = issueNowForThisRow;

              remainingIssueNow -= issueNowForThisRow;
            }
            return obj2;
          });

          setSecondTable(updatedSecondTable);

          return { ...obj1, issueNow: newIssueNow };
        });

        const sumByCustBOM = {};
        secondTable.forEach((obj2) => {
          const { CustBOM_Id, issueNow } = obj2;
          sumByCustBOM[CustBOM_Id] = (sumByCustBOM[CustBOM_Id] || 0) + issueNow;
        });

        await delay(1000);
        setFirstTable(updatedFirstTable);
      }
    }
  };

  const releaseProduction = async () => {
    if (issuenowval.length === 0) {
      toast.warning("Please enter Issue Now Value");
      return;
    }

    const sumByCustBOM = {};

    secondTable.forEach((obj2) => {
      const { CustBOM_Id, issueNow } = obj2;
      sumByCustBOM[CustBOM_Id] = (sumByCustBOM[CustBOM_Id] || 0) + issueNow;
    });

    for (const key in sumByCustBOM) {
      const sumIssueNow = sumByCustBOM[key];
      const firstTableEntry = firstTable.find(
        (item) => item.CustBOM_Id === parseInt(key)
      );

      if (firstTableEntry && sumIssueNow !== firstTableEntry.issueNow) {
        toast.error(
          `Issue Quantity Mismatch ${firstTableEntry.PartId} Required: ${firstTableEntry.issueNow} Issuing: ${sumIssueNow}`
        );
        return;
      }
    }

    const hasZeroQtyAvailable = firstTable.some(
      (item) => item.QtyAvailable === 0
    );

    if (hasZeroQtyAvailable) {
      toast.error(`Set Required: ${issuenowval} Set Available: ${0}  `);
      return;
    }

    for (const secondTableRow of secondTable) {
      const firstTableEntry = firstTable.find(
        (item) => item.CustBOM_Id === secondTableRow.CustBOM_Id
      );

      if (firstTableEntry) {
        const acceptedMinusIssued =
          secondTableRow.QtyAccepted - secondTableRow.QtyIssued;
        const issueNowQuantity = parseInt(secondTableRow.issueNow);

        if (issueNowQuantity > acceptedMinusIssued) {
          toast.error(
            `Parts Not Available RV No ${secondTableRow.RV_No} Part Issue Now: ${firstTableEntry.PartId} Available for Issue: ${acceptedMinusIssued} `
          );
          return;
        }
      }
    }
    CreatePartsIssueVoucher();
  };

  function statusFormatter(cell, row, rowIndex, formatExtraData) {
    return formatDate(new Date(cell), 3);
  }

  const selectRow1 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",

    onSelect: (row, isSelect, rowIndex, e) => {
      setCustBOMId(row.CustBOM_Id);
      setSelectedFirstTableRow(isSelect ? row : null);

      const correspondingRows = secondTable.filter(
        (secondTableRow) => secondTableRow.CustBOM_Id === row.CustBOM_Id
      );
      setSelectedSecondTableRows(isSelect ? correspondingRows : []);
    },
  };

  const selectRow2 = {
    mode: "radio",
    clickToSelect: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      setRow2(row);
    },
  };

  function isSelectedCell(rowId, colId) {
    return (
      selectedCell &&
      selectedCell.rowId === rowId &&
      selectedCell.colId === colId
    );
  }

  const rowStyle1 = (row, rowIndex) => {
    const style = {};
    if (row.CustBOM_Id === custBOMId) {
      style.backgroundColor = "#98A8F8";
    }
    return style;
  };

  const rowStyle2 = (row, rowIndex) => {
    const style = {};
    if (row.CustBOM_Id === custBOMId) {
      style.backgroundColor = "#61f28a";
    }
    return style;
  };

  const CreatePartsIssueVoucher = async () => {
    let ResetPeriod = "Year";
    let yyyy = formatDate(new Date(), 6).toString();
    const url = `${endpoints.getNewRunningNo}?SrlType=ShopFloor_PartIssueVoucher&Period=${yyyy}&VoucherNoLength=4&ResetValue=0&UnitName=${unitName}&ResetPeriod=${ResetPeriod}`;

    getRequest(url, async (data) => {
      let newNo = parseInt(data.runningNo) + 1;

      let header1 = {
        IV_No: newNo,
        Issue_date: formatDate(new Date(), 2),
        NC_ProgramNo: formHeader.NCProgramNo,
        QtyIssued: issuenowval,
        QtyReturned: 0,
        QtyUsed: 0,
        Ncid: formHeader.Ncid,
      };

      // Insert the new issue register record
      postRequest(
        endpoints.insertShopfloorPartIssueRegister,
        header1,
        async (data) => {
          if (data.affectedRows !== 0) {
            await delay(100);
            setissueidval(data.insertId);

            // Insert BOM Issue Details
            for (let i = 0; i < secondTable.length; i++) {
              if (secondTable[i].issueNow > 0) {
                let header3 = {
                  IV_ID: data.insertId,
                  RV_Id: secondTable[i].RVId,
                  PartReceipt_DetailsID: secondTable[i].Id,
                  QtyIssued: secondTable[i].issueNow,
                  QtyReturned: 0,
                  QtyUsed: 0,
                };

                postRequest(
                  endpoints.insertShopfloorBOMIssueDetails,
                  header3,
                  async (data) => {
                    if (data.affectedRows !== 0) {
                    }
                  }
                );
              }

              let header5 = {
                Id: secondTable[i].Id,
                Qty: secondTable[i].issueNow,
              };

              postRequest(
                endpoints.updateQtyIssuedPartReceiptDetails2,
                header5,
                async (data) => {
                  if (data.affectedRows !== 0) {
                  }
                }
              );
            }
          }

          // Update NC Programs
          let header2 = {
            Id: formHeader.Ncid,
            Qty: issuenowval,
          };

          postRequest(
            endpoints.updateQtyAllotedncprograms1,
            header2,
            async (data) => {
              if (data.affectedRows !== 0) {
              }
            }
          );

          // Update Running Number
          const inputData = {
            SrlType: "ShopFloor_PartIssueVoucher",
            Period: formatDate(new Date(), 6),
            RunningNo: newNo,
            UnitName: unitName,
          };

          postRequest(endpoints.updateRunNo, inputData, (data) => {});

          // Navigate to the next page
          nav(
            "/MaterialManagement/ShopFloorIssue/IVListService/Issued/ShopMatIssueVoucher",
            {
              state: {
                issueIDVal: data.insertId,
              },
            }
          );
        }
      );
    });
  };

  const updateSumByCustBOM = (tableData) => {
    const sumByCustBOM = {};
    tableData.forEach((row) => {
      const { CustBOM_Id, issueNow } = row;
      if (!sumByCustBOM[CustBOM_Id]) {
        sumByCustBOM[CustBOM_Id] = 0;
      }
      sumByCustBOM[CustBOM_Id] += parseInt(issueNow);
    });

    return sumByCustBOM;
  };

  const handleIssueNowChange = (e, editedRow) => {
    const updatedSecondTable = secondTable.map((row) => {
      if (row.Id === editedRow.Id) {
        return { ...row, issueNow: parseInt(e.target.value) };
      }
      return row;
    });

    setSecondTable(updatedSecondTable);
    const sumByCustBOM = updateSumByCustBOM(updatedSecondTable);
  };

  const isAnyQtyAvailableZero = () => {
    return firstTable.some((row) => row.QtyAvailable === 0);
  };

  const blockInvalidQtyChar = (e) =>
    ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault();

  return (
    <div>
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

          <div className="d-flex col-md-3" style={{ gap: "15px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Machine
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Machine}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "50px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Quantity
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Qty}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "52px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Status
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.PStatus}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "12px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Process
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.Operation}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "16px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Allotted
            </label>

            <input
              className="input-disabled mt-1"
              value={formHeader.QtyAllotted}
              disabled
            />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "60px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Source
            </label>

            <input className="input-disabled mt-1" value="Customer" disabled />
          </div>

          <div className="d-flex col-md-3" style={{ gap: "30px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Issue Now
            </label>

            <input
              className="input-disabled mt-1"
              type="number"
              min="0"
              onChange={issuenowchange}
              value={issuenowval}
              onBlur={issuenowonblur}
              onKeyDown={blockInvalidQtyChar}
              disabled={isAnyQtyAvailableZero() || firstTable.length === 0}
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-11"></div>

        <div className="col-md-1">
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

      <div style={{ height: "220px", overflowY: "scroll" }}>
        <Table className="table custom-table " striped bordered hover>
          <thead className="header-class">
            <tr>
              <th>Part Id</th>
              <th>Qty / Assembly</th>
              <th>Required</th>
              <th>Already Used</th>
              <th>Total Used</th>
              <th>Rejected</th>
              <th>Available</th>
              <th>Issue Now</th>
            </tr>
          </thead>

          <tbody>
            {loadingFirstTable ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : firstTable.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center" }}>
                  No material data available.
                </td>
              </tr>
            ) : (
              firstTable.map((row) => (
                <tr
                  key={row.Id}
                  style={rowStyle1(row)}
                  onClick={() => selectRow1.onSelect(row, true)}
                >
                  <td>{row.PartId}</td>
                  <td>{row.QtyPerAssy}</td>
                  <td>{row.QtyRequired}</td>
                  <td>{row.AlreadyUsed}</td>
                  <td>{row.TotalUsed}</td>
                  <td>{row.QtyRejected}</td>
                  <td>{row.QtyAvailable}</td>
                  <td>{row.issueNow}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <div className="row mt-2">
        <div className="col-md-8 justify-content-center mb-3">
          <button
            className="button-style"
            style={{ width: "150px" }}
            disabled={btnVisibility}
            onClick={releaseProduction}
          >
            Release To Production
          </button>
        </div>

        <div className="col-md-7">
          <div style={{ height: "480px", overflowY: "scroll" }}>
            <Table className="table custom-table" striped bordered hover>
              <thead className="header-class">
                <tr>
                  <th>RV No</th>
                  <th>RV Date</th>
                  <th>Received</th>
                  <th>Accepted</th>
                  <th>Issued</th>
                  <th>Issue Now</th>
                </tr>
              </thead>
              <tbody>
                {secondTable.map((row, index) => (
                  <tr
                    key={row.Id}
                    style={rowStyle2(row)}
                    onClick={() => {
                      selectRow2.onSelect(row, true);
                    }}
                  >
                    <td
                      onClick={() => {
                        setSelectedCell({ rowId: row.Id, colId: "RV_No" });
                        setRow2(row);
                        setSelectedRow(null);
                      }}
                      className={
                        isSelectedCell(row.Id, "RV_No") ? "selected-row" : ""
                      }
                    >
                      {row.RV_No}
                    </td>

                    <td
                      onClick={() => {
                        setSelectedCell({ rowId: row.Id, colId: "RV_Date" });
                        setRow2(row);
                        setSelectedRow(null);
                      }}
                      className={
                        isSelectedCell(row.Id, "RV_Date") ? "selected-row" : ""
                      }
                    >
                      {formatDate(new Date(row.RV_Date), 3)}
                    </td>

                    <td
                      onClick={() => {
                        setSelectedCell({
                          rowId: row.Id,
                          colId: "QtyReceived",
                        });
                        setRow2(row);
                        setSelectedRow(null);
                      }}
                      className={
                        isSelectedCell(row.Id, "QtyReceived")
                          ? "selected-row"
                          : ""
                      }
                    >
                      {row.QtyReceived}
                    </td>

                    <td
                      onClick={() => {
                        setSelectedCell({
                          rowId: row.Id,
                          colId: "QtyAccepted",
                        });
                        setRow2(row);
                        setSelectedRow(null);
                      }}
                      className={
                        isSelectedCell(row.Id, "QtyAccepted")
                          ? "selected-row"
                          : ""
                      }
                    >
                      {row.QtyAccepted}
                    </td>

                    <td
                      onClick={() => {
                        setSelectedCell({ rowId: row.Id, colId: "QtyIssued" });
                        setRow2(row);
                        setSelectedRow(null);
                      }}
                      className={
                        isSelectedCell(row.Id, "QtyIssued")
                          ? "selected-row"
                          : ""
                      }
                    >
                      {row.QtyIssued}
                    </td>

                    <td
                      onClick={() => {
                        setSelectedCell({ rowId: row.Id, colId: "issueNow" });
                        setRow2(row);
                        setSelectedRow(null);
                      }}
                      className={
                        isSelectedCell(row.Id, "issueNow") ? "selected-row" : ""
                      }
                    >
                      <input
                        type="number"
                        min="0"
                        value={row.issueNow}
                        onChange={(e) => handleIssueNowChange(e, row)}
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "transparent",
                          border: "none",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <div className="col-md-5">
          <div className="form-bg mb-4">
            <div className="row">
              <div className="col-md-4 mt-2 ">
                <label className="form-label">RV No</label>
              </div>
              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-2"
                  type="text"
                  value={row2.RV_No}
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mt-2 ">
                <label className="form-label">Part ID</label>
              </div>

              <div className="col-md-8" style={{ marginTop: "8px" }}>
                <input
                  className="input-disabled mt-2"
                  type="text"
                  value={row2.PartId}
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mt-1">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Qty Received
                </label>
              </div>

              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-2"
                  type="text"
                  name="qtyReceived"
                  value={row2.QtyReceived}
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mt-1 ">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Qty Accepted
                </label>
              </div>

              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-2"
                  type="text"
                  value={row2.QtyAccepted}
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mt-1 ">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Qty Issued
                </label>
              </div>

              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-2"
                  type="text"
                  value={row2.QtyIssued}
                  disabled
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-4 mt-1 ">
                <label className="form-label" style={{ whiteSpace: "nowrap" }}>
                  Issue Now
                </label>
              </div>

              <div className="col-md-8 ">
                <input
                  className="input-disabled mt-2"
                  type="text"
                  value={row2.issueNow}
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialAllotmentMain;
