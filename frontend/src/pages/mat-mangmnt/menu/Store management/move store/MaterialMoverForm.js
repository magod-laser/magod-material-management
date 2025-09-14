import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import BootstrapTable from "react-bootstrap-table-next";
import YesNoModal from "../../../components/YesNoModal";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";
import ReactPaginate from "react-paginate";
import { HashLoader } from "react-spinners";

const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function MaterialMoverForm(props) {
  const nav = useNavigate();
  const [open, setOpen] = useState();
  let [locationData, setLocationData] = useState([]);

  let [show, setShow] = useState(false);
  let [msg, setMsg] = useState("");
  let [custdata, setCustdata] = useState([]);
  let [selectedCustomer, setSelectedCustomer] = useState("");
  let [selectedLocation, setSelectedLocation] = useState("");
  let [fromLocation, setFromLocation] = useState("");
  let [selectedRows, setSelectedRows] = useState([]);
  let [firstTable, setFirstTable] = useState([]);
  let [secondTable, setSecondTable] = useState([]);
  let [selectedIndex, setSelectedIndex] = useState([]);

  const [allData, setAllData] = useState([]);
  const [CustDataForLocation, setCustDataForLocation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(500);

  const pageCount = Math.ceil(firstTable.length / perPage);
  const offset = currentPage * perPage;
  const currentPageData = firstTable.slice(offset, offset + perPage);

  // Fetch all customers
  const fetchData = async () => {
    getRequest(endpoints.getCustomers, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);
    });

    // Fetch all material location list
    getRequest(endpoints.getMaterialLocationList, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].LocationNo;
      }

      setLocationData(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle customer selection (for customer type mode)
  const changeCustomer = async (e) => {
    setSelectedCustomer(e[0].Cust_Code);
  };

  // Handle "To Location" selection
  const changeLocation = async (e) => {
    setSelectedLocation(e[0].LocationNo);
    setMsg(
      "Are you sure you want to shift a material " + e[0].LocationNo + "?"
    );
  };

  // Handle "From Location" selection
  const fromLocationEvent = async (e) => {
    setFromLocation(e[0].LocationNo);
  };

  // Load material data based on selected customer/location/type
  const loadData = async () => {
    setLoading(true);
    if (props.type === "customer") {
      if (selectedCustomer === "") {
        toast.error("Please select Customer");
      } else {
        let url1 =
          endpoints.getMoveStoreMtrlStockByCustomer +
          "?code=" +
          selectedCustomer;
        getRequest(url1, async (data) => {
          if (data.length <= 0) {
            toast.warning("No data found for selected customer");
          }
          setFirstTable(data);
          setLoading(false);
        });
      }
    } else if (props.type === "location") {
      if (fromLocation === "") {
        toast.error("Please select From Location");
        setLoading(false);
      } else {
        let url1 =
          endpoints.getMoveStoreMtrlStockByLocation +
          "?location=" +
          fromLocation;
        getRequest(url1, async (data) => {
          setAllData(data);
          setFirstTable(data);
          setLoading(false);
        });
        let url2 =
          endpoints.getMoveStoreCustomerMtrlStockByLocation +
          "?location=" +
          fromLocation;
        getRequest(url2, async (data) => {
          for (let i = 0; i < data.length; i++) {
            data[i].label = data[i].Customer;
          }
          setCustDataForLocation(data);
        });
      }
    } else {
      let url1 = endpoints.getMoveStoreMtrlStockByAll;
      getRequest(url1, async (data) => {
        setFirstTable(data);
        setLoading(false);
      });
    }
  };

  // Move selected rows from first table to second table
  const selectButton = () => {
    if (selectedRows.length <= 0) {
      toast.warning("No row is selected in first table");
    }
    setSecondTable(selectedRows);
  };

  // Validate selections and open confirmation modal for location change
  const changeLocationButton = () => {
    if (secondTable.length === 0) {
      toast.error("Please select Material");
    } else if (selectedLocation.length === 0) {
      toast.error("Please select Location");
    } else {
      setShow(true);
    }
  };

  // Handle modal response and update material locations
  const modalResponse = (msg) => {
    if (msg === "yes") {
      for (let i = 0; i < secondTable.length; i++) {
        //update mtrl location
        let paraData1 = {
          LocationNo: selectedLocation,
          MtrlStockID: secondTable[i].MtrlStockID,
        };
        postRequest(
          endpoints.updateMtrlstockLocationByMtrlStockId,
          paraData1,
          (data) => {
            loadData();

            selectedRows.map((obj) => {
              obj.LocationNo = selectedLocation;
            });

            setSelectedRows(selectedRows);
            setSelectedIndex([]);
          }
        );
      }
      setSelectedRows([]);
      setSecondTable([]);
      toast.success("Location Updated");
    }
  };

  const columns1 = [
    {
      text: "Mtrl Stock ID",
      dataField: "MtrlStockID",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Mtrl Code",
      dataField: "Mtrl_Code",
      headerStyle: { whiteSpace: "nowrap" },
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
      text: "Locked",
      dataField: "Locked",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Locked !== 0 ? true : false} />
          </lable>
        </div>
      ),
      sort: true,
    },
    {
      text: "Scrap",
      dataField: "Scrap",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Scrap !== 0 ? true : false} />
          </lable>
        </div>
      ),
      sort: true,
    },
    {
      text: "Scrap Weight",
      dataField: "ScrapWeight",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
    {
      text: "Location No",
      dataField: "LocationNo",
      headerStyle: { whiteSpace: "nowrap" },
      sort: true,
    },
  ];
  const columns2 = [
    {
      text: "Mtrl Stock ID",
      dataField: "MtrlStockID",
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "Para1",
      dataField: "DynamicPara1",
    },
    {
      text: "Para2",
      dataField: "DynamicPara2",
    },
    {
      text: "Locked",
      dataField: "Locked",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Locked == 1 ? true : false} />
          </lable>
        </div>
      ),
    },
    {
      text: "Scrap",
      dataField: "Scrap",
      formatter: (celContent, row) => (
        <div className="checkbox">
          <lable>
            <input type="checkbox" checked={row.Scrap == 1 ? true : false} />
          </lable>
        </div>
      ),
    },
    {
      text: "Scrap Weight",
      dataField: "ScrapWeight",
      headerStyle: { whiteSpace: "nowrap" },
    },
    {
      text: "Location No",
      dataField: "LocationNo",
      headerStyle: { whiteSpace: "nowrap" },
    },
  ];

  const selectRow1 = {
    mode: "checkbox",
    clickToSelect: true,
    bgColor: "#98A8F8",
    selected: selectedIndex,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setSelectedRows([...selectedRows, row]);
        setSelectedIndex([...selectedIndex, row.MtrlStockID]);
      } else {
        setSelectedIndex(
          selectedIndex.filter((item) => item != row.MtrlStockID)
        );
        setSelectedRows(
          selectedRows.filter((obj) => {
            return obj.MtrlStockID !== row.MtrlStockID;
          })
        );
      }
    },
    onSelectAll: (isSelect, row, e) => {
      if (isSelect) {
        setSelectedRows(row);
        setSelectedIndex(
          row.map((val, i) => {
            return val.MtrlStockID;
          })
        );
      } else {
        setSelectedIndex([]);
        setSelectedRows([]);
      }
    },
  };

  // Handle customer filter inside location mode
  const changeCustomerForLocation = async (e) => {
    setSecondTable([]);
    setSelectedIndex([]);

    if (e[0].Cust_Code) {
      const newArray = allData.filter(
        (obj) => obj.Cust_Code === e[0].Cust_Code
      );
      setFirstTable(newArray);
    } else {
      setFirstTable(allData);
    }
  };

  const [sort, setSort] = React.useState({
    dataField: "MtrlStockID",
    order: "asc",
  });

  // Handle sorting of table columns
  const onSortChange = (dataField, order) => {
    setSort({ dataField, order });
  };

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div>
      <YesNoModal
        show={show}
        setShow={setShow}
        message={msg}
        modalResponse={modalResponse}
      />
      {loading && (
        <div className="full-page-loader">
          <HashLoader color="#3498db" loading={true} size={60} />
          <p className="mt-2">Loading, please wait...</p>
        </div>
      )}
      <h4 className="title"> Material Mover</h4>

      <div className="row">
        <div className="d-flex ">
          <div
            className={
              props.type === "location" ? "d-flex col-md-3 px-3" : "d-none"
            }
            style={{ gap: "10px" }}
          >
            <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
              From Location
            </label>

            <Typeahead
              id="basic-example"
              name="location"
              options={locationData}
              placeholder="Select Location"
              onChange={(label) => fromLocationEvent(label)}
            />
          </div>

          <div
            className={
              props.type === "location" ? " d-flex col-md-2 px-3" : "d-none"
            }
            style={{ gap: "10px" }}
          >
            <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
              Customer
            </label>

            <Typeahead
              id="basic-example"
              name="customer"
              options={CustDataForLocation}
              placeholder="Select Customer"
              onChange={(label) => changeCustomerForLocation(label)}
            />
          </div>

          <div
            className={
              props.type === "customer" ? "d-flex col-md-2 " : "d-none"
            }
            style={{ gap: "10px" }}
          >
            <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
              Customer
            </label>

            <Typeahead
              id="basic-example"
              name="customer"
              options={custdata}
              placeholder="Select Customer"
              onChange={(label) => changeCustomer(label)}
            />
          </div>

          <div className="d-flex col-md-3 px-3" style={{ gap: "10px" }}>
            <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
              To Location
            </label>

            <Typeahead
              id="basic-example"
              name="location"
              options={locationData}
              placeholder="Select Location"
              onChange={(label) => changeLocation(label)}
            />
          </div>

          <div className="d-flex col-md-5 ">
            <button className="button-style " onClick={loadData}>
              Load Data
            </button>
            <button className="button-style " onClick={selectButton}>
              Select
            </button>
            <button className="button-style" onClick={changeLocationButton}>
              Change Location
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

      <div className="row mt-3">
        <div className="col-md-6">
          <div style={{ height: "400px", overflowY: "scroll" }}>
            <BootstrapTable
              keyField="MtrlStockID"
              columns={columns1}
              data={currentPageData}
              striped
              hover
              condensed
              selectRow={selectRow1}
              headerClasses="header-class tableHeaderBGColor"
              sort={sort}
              onSortChange={onSortChange}
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
        <div className="col-md-6">
          <div style={{ height: "400px", overflowY: "scroll" }}>
            <BootstrapTable
              keyField="MtrlStockID"
              columns={columns2}
              data={secondTable}
              striped
              hover
              condensed
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialMoverForm;
