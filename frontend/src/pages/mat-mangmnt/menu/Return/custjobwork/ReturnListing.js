import { useState, useEffect } from "react";
import { dateToShort } from "../../../../../utils";
import BootstrapTable from "react-bootstrap-table-next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Typeahead } from "react-bootstrap-typeahead";
import { HashLoader } from "react-spinners";
import ReactPaginate from "react-paginate";

const { getRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function ReturnListing(props) {
  const nav = useNavigate();

  const [data, setdata] = useState([]);
  const [allData, setAllData] = useState([]);

  const [checkData, setCheckData] = useState([]);
  const [selectData, setSelectData] = useState();
  const [checkboxDisable, setCheckboxDisable] = useState("on");

  const [checkboxVal, setCheckboxVal] = useState("off");
  let [custdata, setCustdata] = useState([]);
  let [propsType, setPropsType] = useState(props.type);
  const [selectedCust, setSelectedCust] = useState();

  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(100);

  // Fetch all customers
  async function fetchData() {
    getRequest(endpoints.getCustomers, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);
    });

    if (props.type === "pendingDispatch") {
      setLoading(true);
      getRequest(endpoints.getReturnPendingList, async (data) => {
        setCheckData(data);
        setdata(data);
        setAllData(data);
        setLoading(false);
        setCurrentPage(0);
      });
    } else if (props.type === "returnSaleListing") {
      setLoading(true);
      getRequest(endpoints.getSalesIVList, async (data) => {
        setCheckData(data);
        setdata(data);
        setAllData(data);
        setLoading(false);
        setCurrentPage(0);
      });
    } else if (props.type === "customerIVList") {
      setLoading(true);
      getRequest(endpoints.getCustomerIVList, async (data) => {
        setCheckData(data);
        setdata(data);
        setAllData(data);
        setLoading(false);
        setCurrentPage(0);
      });
    } else if (props.type === "returnCancelled") {
      setLoading(true);
      getRequest(endpoints.getCancelledList, async (data) => {
        setCheckData(data);
        setdata(data);
        setAllData(data);
        setLoading(false);
        setCurrentPage(0);
      });
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      text: "Iv_Id",
      dataField: "Iv_Id",
      hidden: true,
    },

    {
      text: "IV No",
      dataField: "IV_No",
    },
    {
      text: "IV Date",
      dataField: "IV_Date",
      sort: true,
      formatter: statusFormatter,
    },
    {
      text: "Customer",
      dataField: "Customer",
    },
    {
      text: "Weight",
      dataField: "TotalWeight",
    },
    {
      text: "Type",
      dataField: "Type",
    },
  ];

  let changeCustomer = async (e) => {
    setSelectedCust(e[0].Cust_Code);

    const found = allData.filter((obj) => obj.Cust_code === e[0].Cust_Code);
    setdata(found);

    setCheckboxVal("on");
    setCheckboxDisable("off");

    if (e[0].Cust_Code.length > 0) {
      document.getElementById("filterCustCheckbox").checked = true;
    } else {
      document.getElementById("filterCustCheckbox").checked = false;
    }
  };

  function statusFormatter(cell, row, rowIndex, formatExtraData) {
    if (!cell) return;
    return dateToShort(cell);
  }

  let openClick = async (e) => {
    if (selectData && selectData.Type !== "Parts") {
      nav(
        "/MaterialManagement/Return/CustomerJobWork/OutwardMaterialIssueVoucher",
        {
          state: { selectData, propsType },
        }
      );
    } else if (selectData && selectData.Type === "Parts") {
      nav(
        "/MaterialManagement/Return/CustomerJobWork/OutwardPartIssueVoucher",
        {
          state: { selectData, propsType },
        }
      );
    } else {
      toast.error("Select IV");
    }
  };
  let changeCheckbox = (e) => {
    if (e.target.checked) {
      const found = allData.filter((obj) => obj.Cust_code === selectedCust);
      setdata(found);
    } else {
      setdata(allData);
    }
    setCurrentPage(0);
  };

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const pageCount = Math.ceil(data.length / perPage);
  const startIndex = currentPage * perPage;
  const currentPageData = data.slice(startIndex, startIndex + perPage);

  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#8A92F0",
    onSelect: (row, isSelect, rowIndex, e) => {
      setSelectData({
        Iv_Id: row.Iv_Id,
        IV_No: row.IV_No,
        IV_Date: row.IV_Date,
        Customer: row.Customer,
        TotalWeight: row.TotalWeight,
        TotalCalculatedWeight: row.TotalCalculatedWeight,
        Type: row.Type,
      });
    },
  };

  return (
    <>
      {loading && (
        <div className="full-page-loader">
          <HashLoader color="#3498db" loading={true} size={60} />
          <p className="mt-2">Loading, please wait...</p>
        </div>
      )}

      <h4 className="title">Material Return Issue Voucher</h4>
      <div className="row">
        <div className="d-flex col-md-12" style={{ gap: "10px" }}>
          <div className="d-flex col-md-6" style={{ gap: "10px" }}>
            <label className="form-label mt-1" style={{ whiteSpace: "nowrap" }}>
              Select Customer
            </label>

            <Typeahead
              className="ip-select "
              id="basic-example"
              name="customer"
              options={custdata}
              placeholder="Select Customer"
              onChange={(label) => changeCustomer(label)}
            />
          </div>

          <div className="d-flex col-md-2  mt-1" style={{ gap: "10px" }}>
            <input
              className="form-check-input "
              type="checkbox"
              id="filterCustCheckbox"
              onChange={changeCheckbox}
              disabled={!selectedCust}
            />

            <label className="form-label" style={{ whiteSpace: "nowrap" }}>
              Filter Customer
            </label>
          </div>

          <div className="d-flex  ">
            <button className="button-style" onClick={openClick}>
              Open IV
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
        <div className="col-md-12 mt-4">
          <div
            style={{ height: "420px", overflowY: "scroll" }}
            className="col-md-12 col-sm-12"
          >
            <BootstrapTable
              keyField="Iv_Id"
              columns={columns}
              data={currentPageData}
              striped
              hover
              condensed
              selectRow={selectRow}
              headerClasses="header-class tableHeaderBGColor"
            />
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
      </div>
    </>
  );
}

export default ReturnListing;
