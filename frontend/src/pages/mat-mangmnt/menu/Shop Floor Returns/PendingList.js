import React, { useState, useEffect } from "react";
import SideComponent from "./ReturnComponents/SideComponent";
import Table from "react-bootstrap/Table";
import LocationModel from "./ReturnComponents/LocationModel";
import ResizeModal from "./ReturnComponents/ResizeModal";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate";

import BootstrapTable from "react-bootstrap-table-next";
import { formatDate, getWeight } from "../../../../utils";
import { toast } from "react-toastify";
import YesNoModal from "../../components/YesNoModal";
import TreeView from "react-treeview";
import ResizeReturnModal from "./ReturnComponents/ResizeReturnModal";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

function PendingList(props) {
  const nav = useNavigate();

  const [showYesNo, setShowYesNo] = useState(false);
  const [show, setShow] = useState(false);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const [open1, setOpen1] = useState(false);
  const handleOpen1 = () => setOpen1(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [firstTable, setFirstTable] = useState([]);
  const [firstRowSelected, setFirstRowSelected] = useState([]);
  const [firstTableAll, setFirstTableAll] = useState([]);
  const [secondTable, setSecondTable] = useState([]);
  const [secondTableRow, setSecondTableRow] = useState({});
  const [selectSecondAll, setSelectSecondAll] = useState(false);
  const [rowValResize, setRowValResize] = useState({});
  const [treeData, setTreeData] = useState([]);
  let [selectedSecondTableRows, setSelectedSecondTableRows] = useState([]);
  const [secondTableSelectIndex, setSecondTableSelectIndex] = useState([]);

  const [filteredMachine, setFilteredMachine] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(500);
  const [isSecondTableLoading, setIsSecondTableLoading] = useState(false);

  const [isFirstRowSelected, setIsFirstRowSelected] = useState(false);

  const fetchData = () => {
    getRequest(endpoints.getFirstTableShopFloorReturn, (data) => {
      setFirstTable(data);
      setFirstTableAll(data);
      let newobj = {
        IV_No: 0,
        IssueID: 0,
        Issue_date: "2021-07-07T18:30:00.000Z",
        Machine: "Machine",
        NC_ProgramNo: "0",
        NcId: 0,
        QtyIssued: 0,
        QtyReturned: 0,
        Remarks: null,
        Status: "Created",
        cust_name: "",
        mtrl_code: "",
        shape: null,
      };

      const uniqueData = [
        newobj,
        ...new Map(data.map((item) => [item["Machine"], item])).values(),
      ];

      setTreeData(uniqueData);
    });
  };

  delay(1000);

  useEffect(() => {
    fetchData();
  }, []);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
    setFirstRowSelected([]);
    setSelectedSecondTableRows([]);
    setSecondTable([]);
  };

  const pageCount = Math.ceil(firstTable.length / perPage);

  function statusFormatter(cell, row, rowIndex, formatExtraData) {
    return formatDate(new Date(cell), 3);
  }

  const columns1 = [
    {
      text: "IssueID",
      dataField: "IssueID",
      hidden: true,
    },
    {
      text: "Customer",
      dataField: "cust_name",
      sort: true,
    },
    {
      text: "IV No",
      dataField: "IV_No",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "IV Date",
      dataField: "Issue_date",
      formatter: statusFormatter,
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Program No",
      dataField: "NC_ProgramNo",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Mtrl Code",
      dataField: "mtrl_code",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Issued",
      dataField: "QtyIssued",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Returned",
      dataField: "QtyReturned",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Used",
      dataField: "QtyUsed",
      formatter: (cell, row) =>
        cell !== null && cell !== undefined ? cell : 0,
      sort: true,
    },
    {
      text: "Remarks",
      dataField: "Remarks",
      sort: true,
    },
  ];

  const startIndex = currentPage * perPage;
  const endIndex = startIndex + perPage;
  const currentPageData = firstTable.slice(startIndex, endIndex);

  const columns2 = [
    {
      text: "NcPgmMtrlId",
      dataField: "NcPgmMtrlId",
      hidden: true,
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "ShapeMtrlID",
      dataField: "ShapeMtrlID",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Used",
      dataField: "Used",
      sort: true,
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Used == 1 ? true : false} />
          </lable>
        </div>
      ),
    },
    {
      text: "Rejected",
      dataField: "Rejected",
      sort: true,
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Rejected == 1 ? true : false} />
          </lable>
        </div>
      ),
    },
    {
      text: "Balance Length",
      dataField: "Para1",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Balance Width",
      dataField: "Para2",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];

  const selectRow1 = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      setIsFirstRowSelected(true);
      setSecondTableSelectIndex([]);
      setFirstRowSelected(row);
      setSelectedSecondTableRows([]);
      setSecondTable([]);

      let url1 = endpoints.getSecondTableShopFloorReturn + "?id=" + row.IssueID;
      setIsSecondTableLoading(true);
      getRequest(url1, (data) => {
        data.forEach((sheet) => {
          if (sheet.NCPara1 <= sheet.Para1 && sheet.NCPara2 <= sheet.Para2) {
            sheet.RemPara1 = sheet.Para1 - sheet.NCPara1;
            sheet.RemPara2 = sheet.Para2 - sheet.NCPara2;
          } else if (
            sheet.NCPara2 <= sheet.Para1 &&
            sheet.NCPara1 <= sheet.Para2
          ) {
            sheet.RemPara1 = sheet.Para1 - sheet.NCPara2;
            sheet.RemPara2 = sheet.Para2 - sheet.NCPara1;
          }
        });

        setSecondTable(data);
        setIsSecondTableLoading(false);
      });
    },
  };

  const selectRow2 = {
    mode: "checkbox",
    clickToSelect: true,
    bgColor: "#98A8F8",
    selected: secondTableSelectIndex,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setSecondTableRow(row);
        //store selected row data
        setSelectedSecondTableRows([...selectedSecondTableRows, row]);
        setSecondTableSelectIndex([...secondTableSelectIndex, row.NcPgmMtrlId]);
      } else {
        setSelectedSecondTableRows(
          selectedSecondTableRows.filter((obj) => {
            return obj.NcPgmMtrlId !== row.NcPgmMtrlId;
          })
        );
        setSecondTableSelectIndex(
          secondTableSelectIndex.filter((item) => item != row.NcPgmMtrlId)
        );
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      // Handle select all rows
      if (isSelect) {
        const selectedRowIds = rows.map((row) => row.NcPgmMtrlId);
        setSecondTableSelectIndex(selectedRowIds);
        setSelectedSecondTableRows([...selectedSecondTableRows, ...rows]);

        if (rows.length > 0) {
          // Set secondTableRow to the first row in the selected rows
          setSecondTableRow(rows[0]);
        }
      } else {
        setSecondTableSelectIndex([]);
        setSelectedSecondTableRows([]);
      }
    },
  };

  const treeViewclickMachine = (machine) => {
    setSecondTable([]);
    setSelectedSecondTableRows([]);
    setFilteredMachine(machine);

    if (machine === "Machine") {
      setFirstTable(firstTableAll);
    } else {
      const newTable = firstTableAll.filter((obj) => obj.Machine === machine);
      setFirstTable(newTable);
    }
  };

  function tableRefresh() {
    if (filteredMachine) {
      getRequest(endpoints.getFirstTableShopFloorReturn, (data) => {
        const filteredData = data.filter(
          (obj) => obj.Machine === filteredMachine
        );
        setFirstTable(filteredData);
        setFirstTableAll(data);
      });
    } else {
      // If no machine is selected, set the first table to the entire data
      getRequest(endpoints.getFirstTableShopFloorReturn, (data) => {
        setFirstTable(data);
        setFirstTableAll(data);
      });
    }

    //reset second table data
    let row = firstRowSelected;
    setSelectedSecondTableRows([]);
    let url1 = endpoints.getSecondTableShopFloorReturn + "?id=" + row.IssueID;
    getRequest(url1, (data) => {
      data.forEach((sheet) => {
        if (sheet.NCPara1 <= sheet.Para1 && sheet.NCPara2 <= sheet.Para2) {
          sheet.RemPara1 = sheet.Para1 - sheet.NCPara1;
          sheet.RemPara2 = sheet.Para2 - sheet.NCPara2;
        } else if (
          sheet.NCPara2 <= sheet.Para1 &&
          sheet.NCPara1 <= sheet.Para2
        ) {
          sheet.RemPara1 = sheet.Para1 - sheet.NCPara2;
          sheet.RemPara2 = sheet.Para2 - sheet.NCPara1;
        }
      });

      setSecondTable(data);
    });
  }

  const returnToStock = () => {
    if (selectedSecondTableRows.length === 0) {
      toast.error("Select Material to return to Stock");
    } else {
      // secondTableRow.ReminderPara1 = secondTableRow.RemPara1 - 10;
      // secondTableRow.ReminderPara2 = secondTableRow.RemPara2 - 10;
      // secondTableRow.location = "";

      setOpen1(true);
    }
  };

  const resizeModal = (msg, row) => {
    if (msg == "ok") {
      setShowYesNo(true);
      setRowValResize(row);
    }
  };

  const modalYesNoResponse = (msg) => {
    // console.log("msg", rowValResize);
    if (msg == "yes") {
      if (rowValResize.ReminderPara1 < 10 || rowValResize.ReminderPara2 < 10) {
        toast.error("Cannot Resize to less than 10 mm");
      } else {
        //get mtrl_data by mtrl_code
        let url =
          endpoints.getRowByMtrlCode + "?code=" + secondTableRow.Mtrl_Code;
        getRequest(url, async (data) => {
          let totwt = 0;
          totwt = getWeight(
            data,
            parseFloat(secondTableRow.Para1),
            parseFloat(secondTableRow.Para2),
            parseFloat(0)
          );

          totwt = Math.round(0.000001 * totwt, 2);

          for (let i = 0; i < selectedSecondTableRows.length; i++) {
            if (selectedSecondTableRows[i].Rejected === 1) {
              //return the sheet
              let paraData1 = {
                id: selectedSecondTableRows[i].IssueID,
              };
              postRequest(
                endpoints.updateShopfloorMaterialIssueRegisterQtyReturnedAddOne,
                paraData1,
                (data) => {
                  console.log(
                    "rejected : updated shopfloorregisterqtyreturned"
                  );
                }
              );

              //Set issued less by one
              let paraData2 = {
                Id: selectedSecondTableRows[i].NcID,
                Qty: 1,
              };
              postRequest(
                endpoints.updateQtyAllotedncprograms,
                paraData2,
                (data) => {
                  console.log("rejected : updated qtyallotted ncprograms");
                }
              );
            }
            if (selectedSecondTableRows[i].Used === 1) {
              //return the sheet
              let paraData1 = {
                id: selectedSecondTableRows[i].IssueID,
              };
              postRequest(
                endpoints.updateShopfloorMaterialIssueRegisterQtyReturnedAddOne,
                paraData1,
                (data) => {
                  console.log("used : updated shopfloorregisterqtyreturned");
                }
              );
            }

            //update stock list
            let paraData3 = {
              DynamicPara1: secondTableRow.Para1,
              DynamicPara2: secondTableRow.Para2,
              LocationNo: secondTableRow.location,
              Weight: totwt,
              MtrlStockID: selectedSecondTableRows[i].ShapeMtrlID,
            };
            postRequest(
              endpoints.updateMtrlStockLock1,
              paraData3,
              (data) => {}
            );

            //updatencprogrammtrlallotmentlistReturnStock
            let paraData4 = {
              id: selectedSecondTableRows[i].NcPgmMtrlId,
            };
            postRequest(
              endpoints.updatencprogrammtrlallotmentlistReturnStock,
              paraData4,
              (data) => {
                console.log("updated ncprogrammtrlallotmentreturnstock");
              }
            );

            tableRefresh();
          }
        });
        toast.success("Return to Stock Completed");
      }
    }
  };

  const returnScrap = () => {
    if (selectedSecondTableRows.length === 0) {
      toast.error("Select Material to return to Stock");
    } else {
      setShow(true);
    }
  };

  const scrapModal = (data) => {
    if (Object.keys(data).length !== 0) {
      for (let i = 0; i < selectedSecondTableRows.length; i++) {
        if (selectedSecondTableRows[i].Rejected === 1) {
          //return the sheet
          let paraData1 = {
            id: selectedSecondTableRows[i].IssueID,
          };
          postRequest(
            endpoints.updateShopfloorMaterialIssueRegisterQtyReturnedAddOne,
            paraData1,
            (data) => {
              console.log("rejected : updated shopfloorregisterqtyreturned");
            }
          );

          //Set issued less by one
          let paraData2 = {
            Id: selectedSecondTableRows[i].NcID,
            Qty: 1,
          };
          postRequest(
            endpoints.updateQtyAllotedncprograms,
            paraData2,
            (data) => {
              console.log("rejected : updated qtyallotted ncprograms");
            }
          );
        }
        if (selectedSecondTableRows[i].Used === 1) {
          //return the sheet
          let paraData1 = {
            id: selectedSecondTableRows[i].IssueID,
          };
          postRequest(
            endpoints.updateShopfloorMaterialIssueRegisterQtyReturnedAddOne,
            paraData1,
            (data) => {
              console.log("used : updated shopfloorregisterqtyreturned");
            }
          );
        }

        //update stock list
        let paraData3 = {
          ScrapWeight: data.scrapWeight,
          LocationNo: data.location,
          MtrlStockID: selectedSecondTableRows[i].ShapeMtrlID,
        };
        postRequest(endpoints.updateMtrlStockLock2, paraData3, (data) => {
          console.log("updated stock list");
        });

        //updatencprogrammtrlallotmentlistReturnStock
        let paraData4 = {
          id: selectedSecondTableRows[i].NcPgmMtrlId,
        };
        postRequest(
          endpoints.updatencprogrammtrlallotmentlistReturnStock,
          paraData4,
          (data) => {
            console.log("updated ncprogrammtrlallotmentreturnstock");
          }
        );

        tableRefresh();
      }
      toast.success("Return as Scrap Completed");
    } else {
      console.log("no data");
    }
  };

  const resetYesNoModalState = () => {
    setSecondTableRow((prevRow) => ({
      ...prevRow,
      ReminderPara1: (prevRow.RemPara1 || 0) - 10,
      ReminderPara2: (prevRow.RemPara2 || 0) - 10,
      location: "",
    }));
  };

  return (
    <>
      <YesNoModal
        show={showYesNo}
        setShow={setShowYesNo}
        message="The Material measurements will be altered. Continue ?"
        modalResponse={modalYesNoResponse}
        resetState={resetYesNoModalState}
      />
      <LocationModel show={show} setShow={setShow} scrapModal={scrapModal} />
      <ResizeReturnModal
        isOpen={isModalOpen}
        secondTableRow={selectedSecondTableRows}
        setSelectedSecondTableRows={setSelectedSecondTableRows}
        onClose={(isOpen) => setIsModalOpen(isOpen)}
        tableRefresh={tableRefresh}
        setIsModalOpen={setIsModalOpen}
        type="return"
      />
      <ResizeModal
        open1={open1}
        setOpen1={setOpen1}
        row={secondTableRow}
        resizeModal={resizeModal}
      />

      <h4 className="title">Shop Floor Material Issue List</h4>
      <div className="row">
        <div className="col-md-3">
          {/* <h4 className="form-title">
            <b>Shop Floor Material Return Form</b>
          </h4> */}
          <label className="form-label">Shop Floor Material Return Form</label>
          {/* <button className="button-style ">custname</button> */}
        </div>
        <div className="col-md-9">
          <button
            className="button-style mt-0"
            onClick={returnScrap}
            // style={{ width: "170px" }}
          >
            Return As Scrap
          </button>
          <button
            className="button-style"
            onClick={returnToStock}
            //style={{ width: "170px" }}
          >
            Return To Stock
          </button>

          <button
            className="button-style mt-0"
            onClick={() => {
              if (selectedSecondTableRows.length === 0) {
                toast.error("Select Material to return to Stock");
              } else if (
                selectedSecondTableRows.some(
                  (row) =>
                    row.Para1 <= 0 ||
                    row.Para2 <= 0 ||
                    row.Para1 < 10 ||
                    row.Para2 < 10
                )
              ) {
                toast.error("Selected materials cannot be split.");
              } else {
                setIsModalOpen(true);
              }
            }}
          >
            Resize and Return
          </button>

          <button
            className="button-style "
            id="btnclose"
            type="submit"
            onClick={() => nav("/MaterialManagement")}
            // style={{ width: "170px" }}
          >
            Close
          </button>
        </div>
      </div>
      <div className="row mt-2">
        <div className="col-md-2 mb-5">
          {/* <SideComponent /> */}
          {treeData.map((node, i) => {
            const machine = node.Machine;
            const label = (
              <span className="node" style={{ fontSize: "12px" }}>
                {machine}
              </span>
            );
            return (
              <TreeView
                key={machine + "|" + i}
                nodeLabel={label}
                defaultCollapsed={true}
                onClick={() => treeViewclickMachine(machine)}
              ></TreeView>
            );
          })}
        </div>
        <div className="col-md-6 mt-3">
          <div style={{ height: "400px", overflowY: "scroll" }}>
            <BootstrapTable
              keyField="IssueID"
              columns={columns1}
              // data={firstTable}
              data={currentPageData}
              striped
              hover
              condensed
              selectRow={selectRow1}
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageChange}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
            previousClassName={
              currentPage === 0 ? "pagination__link--disabled" : ""
            }
            nextClassName={
              currentPage === pageCount - 1 ? "pagination__link--disabled" : ""
            }
          />
        </div>
        <div className="col-md-4 mt-3">
          <div style={{ height: "400px", overflowY: "scroll" }}>
            {/* {isSecondTableLoading && <p>Loading...</p>}
            {!isSecondTableLoading && secondTable.length === 0 && (
              <p>No Data</p>
            )} */}
            <BootstrapTable
              keyField="NcPgmMtrlId"
              columns={columns2}
              data={secondTable}
              striped
              hover
              condensed
              selectRow={selectRow2}
              headerClasses="header-class tableHeaderBGColor"
              // noDataIndication={isSecondTableLoading ? "Loading..." : "No Data"}
              noDataIndication={
                isFirstRowSelected
                  ? isSecondTableLoading
                    ? "Loading..."
                    : "No Data"
                  : null
              }
            ></BootstrapTable>
          </div>
        </div>
      </div>
    </>
  );
}

export default PendingList;
