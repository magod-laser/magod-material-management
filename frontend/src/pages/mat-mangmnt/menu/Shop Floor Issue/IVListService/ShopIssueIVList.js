import { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../../utils";
import { toast } from "react-toastify";
import { HashLoader } from "react-spinners";
import ReactPaginate from "react-paginate";

const { getRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function ShopIssueIVList(props) {
  const nav = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [rowData, setRowData] = useState({});
  const [issueIDVal, setIssueIDVal] = useState("");
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(100);

  const fetchData = () => {
    setLoading(true);
    let url =
      props.type === "closed"
        ? endpoints.getPartIssueVoucherList + "?status=Closed"
        : endpoints.getPartIssueVoucherList + "?status=Created";
    getRequest(url, (data) => {
      setTableData(data);
      setLoading(false);
      setCurrentPage(0);
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
      sort: true,
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
      text: "Task No",
      dataField: "TaskNo",
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
      sort: true,
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
    },
  ];
  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    onSelect: (row, isSelect, rowIndex, e) => {
      setIssueIDVal(row.IssueID);
      setRowData({
        Cust_Name: row.Cust_Name,
        IV_No: row.IV_No,
        Issue_date: formatDate(new Date(row.Issue_date), 3),
        NC_ProgramNo: row.NC_ProgramNo,
        AssyName: row.AssyName,
        Operation: row.Operation,
        Mtrl_Code: row.Mtrl_Code,
        QtyIssued: row.QtyIssued,
        QtyReturned: row.QtyReturned,
      });
    },
  };

  const openButton = () => {
    if (issueIDVal === "") {
      toast.error("Please select Part");
    } else {
      nav(
        "/Materialmanagement/ShopFloorIssue/IVListService/Issued/ShopMatIssueVoucher", //ProductionMatIssueParts
        {
          state: { issueIDVal },
        }
      );
    }
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const pageCount = Math.ceil(tableData.length / perPage);
  const startIndex = currentPage * perPage;
  const currentPageData = tableData.slice(startIndex, startIndex + perPage);

  return (
    <div>
      {loading ? (
        <div className="full-page-loader">
          <HashLoader color="#3498db" loading={true} size={60} />
          <p className="mt-2">Loading, please wait...</p>
        </div>
      ) : (
        <>
          <h4 className="title">Parts Issue Vouchers List </h4>
          <div className="row">
            <div className="col-md-7 col-sm-12">
              <div style={{ height: "420px", overflowY: "scroll" }}>
                <BootstrapTable
                  keyField="IssueID"
                  columns={columns}
                  data={currentPageData}
                  striped
                  hover
                  condensed
                  selectRow={selectRow}
                  headerClasses="header-class tableHeaderBGColor"
                ></BootstrapTable>
              </div>
              {pageCount > 1 && (
                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageChange}
                  containerClassName={"pagination"}
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
              )}
            </div>

            <div className="col-md-5 col-sm-12">
              <div className="ip-box form-bg" style={{ height: "420px" }}>
                <div className="row justify-content-center mt-2">
                  <button
                    onClick={openButton}
                    className="col-md-6 button-style"
                    style={{ width: "55px" }}
                  >
                    Open
                  </button>
                  <button
                    className="col-md-6 button-style "
                    id="btnclose"
                    type="submit"
                    onClick={() => nav("/MaterialManagement")}
                    style={{ width: "55px" }}
                  >
                    Close
                  </button>
                </div>
                <div className="row">
                  <div className="col-md-4 mt-3">
                    <label className="form-label">Customer</label>
                  </div>
                  <div className="col-md-8">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.Cust_Name}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mt-2">
                    <label className="form-label">Issue Vr No</label>
                  </div>
                  <div className="col-md-8 ">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.IV_No}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mt-2">
                    <label className="form-label">Vr Date</label>
                  </div>
                  <div className="col-md-8 ">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.Issue_date}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mt-2">
                    <label className="form-label">Program No</label>
                  </div>
                  <div className="col-md-8 ">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.NC_ProgramNo}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mt-2">
                    <label
                      className="form-label"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      Assembly Name
                    </label>
                  </div>
                  <div className="col-md-8 ">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.AssyName}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mt-2">
                    <label className="form-label">Operation</label>
                  </div>

                  <div className="col-md-8 ">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.Operation}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mt-2">
                    <label className="form-label">Material</label>
                  </div>
                  <div className="col-md-8 ">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.Mtrl_Code}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-4 mt-2">
                    <label className="form-label">Allotted</label>
                  </div>
                  <div className="col-md-8 ">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.QtyIssued}
                    />
                  </div>
                </div>
                <div className="row mb-4 ">
                  <div className="col-md-4 mt-2">
                    <label className="form-label">Returned</label>
                  </div>
                  <div className="col-md-8  ">
                    <input
                      className="input-disabled mt-3"
                      disabled
                      value={rowData.QtyReturned}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ShopIssueIVList;
