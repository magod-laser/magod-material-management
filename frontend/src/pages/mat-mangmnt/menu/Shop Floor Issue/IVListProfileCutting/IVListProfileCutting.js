import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import Table from "react-bootstrap/Table";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../../utils";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function IVListProfileCutting(props) {
  const nav = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [issueIDVal, setIssueIDVal] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(1000);

  const fetchData = () => {
    let url =
      props.type === "closed"
        ? endpoints.getMaterialIssueVoucherList + "?status=Closed"
        : endpoints.getMaterialIssueVoucherList + "?status=Created";
    getRequest(url, (data) => {
      console.log("table data = ", data);
      console.log("Qty Used", data[0].QtyUsed);

      for (let i = 0; i < data.length; i++) {
        if (data[i].QtyUsed === null || data[i].QtyUsed === undefined) {
          data[i].QtyUsed = 0;
        }
      }

      setTableData(data);
    });
  };
  useEffect(() => {
    fetchData();
  }, []);

  function statusFormatter(cell, row, rowIndex, formatExtraData) {
    return formatDate(new Date(cell), 3);
  }

  const columns = [
    {
      text: "IssueID",
      dataField: "IssueID",
      hidden: true,
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "IV No",
      dataField: "IV_No",
      sort: true,
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "Issue Date",
      dataField: "Issue_date",
      formatter: statusFormatter,
      sort: true,
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "NC Program No",
      dataField: "NC_ProgramNo",
      sort: true,
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "Qty Issued",
      dataField: "QtyIssued",
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "Qty Used",
      dataField: "QtyUsed",
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "Qty Returned",
      dataField: "QtyReturned",
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "Remarks",
      dataField: "Remarks",
      headerStyle: { whiteSpace: "nowrap" },
    },
  ];
  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      console.log("Row", row);
      setIssueIDVal(row.IssueID);
      setRowData({
        Cust_Name: row.Cust_Name,
        IV_No: row.IV_No,
        Issue_date: formatDate(new Date(row.Issue_date), 3),
        NC_ProgramNo: row.NC_ProgramNo,
        AssyName: row.AssyName,
        Operation: row.Operation,
        TaskNo: row.TaskNo,
        Mtrl_Code: row.Mtrl_Code,
        QtyIssued: row.QtyIssued,
        QtyUsed: row.QtyUsed,
        QtyReturned: row.QtyReturned,
        //RV_Date: formatDate(new Date(row.RV_Date), 3), //dateToShort(row.RV_Date),
      });
    },
  };

  const pageCount = Math.ceil(tableData.length / perPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * perPage;
  const currentPageData = tableData.slice(offset, offset + perPage);

  const openButton = () => {
    if (issueIDVal === "") {
      toast.error("Please select Part");
    } else {
      nav(
        "/MaterialManagement/ShopFloorIssue/IVListProfileCutting/Closed/ShopMatIssueVoucher",
        {
          state: { issueIDVal },
        }
      );
    }
  };
  return (
    <div>
      <>
        <h4 className="title">Material Issue Vouchers List</h4>
        <div className="row">
          <div className="col-md-7 col-sm-12">
            <div style={{ height: "400px", overflowY: "scroll" }}>
              <BootstrapTable
                keyField="IssueID"
                //keyField="id"
                columns={columns}
                // data={tableData}
                data={currentPageData}
                striped
                hover
                condensed
                //pagination={paginationFactory()}
                selectRow={selectRow}
                headerClasses="header-class tableHeaderBGColor"
              ></BootstrapTable>
            </div>

            <div>
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
                  currentPage === pageCount - 1
                    ? "pagination__link--disabled"
                    : ""
                }
              />
            </div>
          </div>

          <div className="col-md-5 col-sm-12">
            <div className="ip-box form-bg" style={{ height: "400px" }}>
              <div className="row justify-content-center mt-2">
                <button
                  onClick={openButton} /*() =>
                            nav(
                              "/materialmanagement/shopfloorissue/ivlistprofilecutting/closed/shopmatissuevocher"
                            )
                          }*/
                  className="button-style"
                  style={{ width: "55px" }}
                >
                  Open
                </button>
                <button
                  className=" button-style "
                  id="btnclose"
                  type="submit"
                  onClick={() => nav("/MaterialManagement")}
                  style={{ width: "55px" }}
                >
                  Close
                </button>
              </div>

              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Customer</label>
                </div>
                <div className="col-md-8" style={{ marginTop: "8px" }}>
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.Cust_Name}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Issue Vr No</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.IV_No}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Vr Date</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.Issue_date}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Program No</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.NC_ProgramNo}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Task No</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.TaskNo}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Operation</label>
                </div>

                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.Operation}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Material</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.Mtrl_Code}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Allotted</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.QtyIssued}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-4 mt-1">
                  <label className="form-label">Used</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    value={rowData.QtyUsed}
                    disabled
                  />
                </div>
              </div>
              <div className="row mb-4">
                <div className="col-md-4 mt-1 ">
                  <label className="form-label">Returned</label>
                </div>
                <div className="col-md-8 ">
                  <input
                    className="input-disabled mt-1"
                    disabled
                    value={rowData.QtyReturned}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default IVListProfileCutting;
