import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import ChangeLocationModal from "./ChangeLocationModal";
import { toast } from "react-toastify";
import BootstrapTable from "react-bootstrap-table-next";
import YesNoModal from "../../../components/YesNoModal";
import { useNavigate } from "react-router-dom";
import { Typeahead } from "react-bootstrap-typeahead";

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

  const [selectedCustForLocation, setSelectedCustForLocation] = useState();
  const [allData, setAllData] = useState([]);
  const [CustDataForLocation, setCustDataForLocation] = useState([]);

  const fetchData = async () => {
    getRequest(endpoints.getCustomers, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Cust_name;
      }

      setCustdata(data);
    });

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

  const PopupOpen = () => {
    // alert("open yaaa");
    setOpen(true);
  };

  const changeCustomer = async (e) => {
    //const { value, name } = e.target;
    setSelectedCustomer(e[0].Cust_Code);
  };
  const changeLocation = async (e) => {
    //const { value, name } = e.target;
    setSelectedLocation(e[0].LocationNo);
    setMsg(
      "Are you sure you want to shift a material " + e[0].LocationNo + "?"
    );
  };

  const fromLocationEvent = async (e) => {
    //const { value, name } = e.target;
    setFromLocation(e[0].LocationNo);
    //setMsg("Are you sure you want to shift a material " + value + "?");
  };

  const loadData = async () => {
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
          console.log("first table = ", data);
        });
      }
    } else if (props.type === "location") {
      if (fromLocation === "") {
        toast.error("Please select From Location");
      } else {
        let url1 =
          endpoints.getMoveStoreMtrlStockByLocation +
          "?location=" +
          fromLocation;
        getRequest(url1, async (data) => {
          setAllData(data);
          setFirstTable(data);
          console.log("first table = ", data);
        });
        let url2 =
          endpoints.getMoveStoreCustomerMtrlStockByLocation +
          "?location=" +
          fromLocation;
        getRequest(url2, async (data) => {
          // console.log("dataaaaa", data);
          for (let i = 0; i < data.length; i++) {
            data[i].label = data[i].Customer;
          }
          setCustDataForLocation(data);
          // setAllData(data);
          // setFirstTable(data);
          // console.log("first table = ", data);
        });
      }
    } else {
      let url1 = endpoints.getMoveStoreMtrlStockByAll;
      getRequest(url1, async (data) => {
        setFirstTable(data);
        console.log("first table = ", data);
      });
    }
    //console.log("selected customer = ", selectedCustomer);
  };

  const selectButton = () => {
    if (selectedRows.length <= 0) {
      toast.warning("No row is selected in first table");
    }
    setSecondTable(selectedRows);
  };

  const changeLocationButton = () => {
    if (secondTable.length === 0) {
      toast.error("Please select Material");
    } else if (selectedLocation.length === 0) {
      toast.error("Please select Location");
    } else {
      setShow(true);
    }
  };
  const modalResponse = (msg) => {
    console.log("message = ", msg);
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
            console.log("Location updated");
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
      //console.log("first row = ", row);
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
      // Handle select all rows
      if (isSelect) {
        // console.log("select all", selectedRows);
        // console.log("row", row);
        // console.log(
        //   "mtrlstckid",
        //   row.map((val, i) => {
        //     return val.MtrlStockID;
        //   })
        // );
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

  // console.log("allData", allData);
  const changeCustomerForLocation = async (e) => {
    setSecondTable([]);
    setSelectedIndex([]);

    // console.log("eeeeeeeeeeeee", e[0].Cust_Code.length);

    // console.log("e[0", e[0]);
    //const { value, name } = e.target;
    // setSelectedCustomer(e[0].Cust_Code);
    // setSelectedCustForLocation(e[0].Cust_Code);

    if (e[0].Cust_Code) {
      const newArray = allData.filter(
        (obj) => obj.Cust_Code === e[0].Cust_Code
      );
      setFirstTable(newArray);
    } else {
      setFirstTable(allData);
    }
    // console.log("new....", newArray);
  };

  const [sort, setSort] = React.useState({
    dataField: "MtrlStockID",
    order: "asc",
  });

  const onSortChange = (dataField, order) => {
    setSort({ dataField, order });
  };
  return (
    <div>
      {/* <ChangeLocationModal open={open} setOpen={setOpen} /> */}
      <YesNoModal
        show={show}
        setShow={setShow}
        message={msg}
        modalResponse={modalResponse}
      />
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

            {/* <select
                    className="ip-select"
                    name="customer"
                    onChange={fromLocationEvent}
                    // disabled={boolVal1}
                  >
                    <option value="" disabled selected>
                      Select Location
                    </option>
                    {locationData.map((location, index) => (
                      <option key={index} value={location.LocationNo}>
                        {location.LocationNo}
                      </option>
                    ))}
                  </select> */}

            <Typeahead
              id="basic-example"
              name="location"
              options={locationData}
              placeholder="Select Location"
              onChange={(label) => fromLocationEvent(label)}
              // className="mb-10"
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

            {/* <select
                    className="ip-select"
                    name="customer"
                    onChange={changeCustomer}
                    // disabled={boolVal1}
                  >
                    <option value="" disabled selected>
                      Select Customer
                    </option>
                    {custdata.map((customer, index) => (
                      <option key={index} value={customer.Cust_Code}>
                        {customer.Cust_name}
                      </option>
                    ))}
                  </select> */}

            <Typeahead
              id="basic-example"
              name="customer"
              options={CustDataForLocation}
              placeholder="Select Customer"
              onChange={(label) => changeCustomerForLocation(label)}
            />

            {/* cust dropdown */}
          </div>

          <div
            className={
              props.type === "customer" ? "d-flex col-md-2 " : "d-none"
            }
            // style={{ marginBottom: "15px" }}
            style={{ gap: "10px" }}
          >
            <label className="form-label mt-2" style={{ whiteSpace: "nowrap" }}>
              Customer
            </label>

            {/* <select
                    className="ip-select"
                    name="customer"
                    onChange={changeCustomer}
                    // disabled={boolVal1}
                  >
                    <option value="" disabled selected>
                      Select Customer
                    </option>
                    {custdata.map((customer, index) => (
                      <option key={index} value={customer.Cust_Code}>
                        {customer.Cust_name}
                      </option>
                    ))}
                  </select> */}

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

            {/* <select
                    className="ip-select"
                    name="customer"
                    onChange={changeLocation}
                    // disabled={boolVal1}
                  >
                    <option value="" disabled selected>
                      Select Location
                    </option>
                    {locationData.map((location, index) => (
                      <option key={index} value={location.LocationNo}>
                        {location.LocationNo}
                      </option>
                    ))}
                  </select> */}

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

      {/* <div className="row ">
          <div className="col-md-4">
            <div className="d-flex justify-content-between">
              <button className="button-style m-0" onClick={loadData}>
                Load Data
              </button>
              <button className="button-style m-0" onClick={selectButton}>
                Select
              </button>
              <button
                className="button-style m-0"
                onClick={changeLocationButton}
              >
                Change Location
              </button>
              <button
                className="button-style m-0"
                id="btnclose"
                type="submit"
                onClick={() => nav("/MaterialManagement")}
              >
                Close
              </button>
            </div>
          </div>
        </div> */}

      {/* <div className="row">
        <div className="row ">
          <div className="col-md-2"></div>
          <div className="col-md-8 ">
            <div
              className="row justify-content-center"
              style={{ border: "1px solid gray" }}
            >
              
              <div className="row ">
                <div className="col-md-3">
                  <button className="button-style" onClick={loadData}>
                    Load Data
                  </button>
                </div>
                <div className="col-md-3">
                  <button className="button-style" onClick={selectButton}>
                    Select
                  </button>
                </div>
                <div className="col-md-3">
                  <button
                    className="button-style"
                    onClick={changeLocationButton}
                  >
                    Change Location
                  </button>
                </div>
                <div className="col-md-3">
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
                <div
                  className={props.type === "location" ? "col-md-6" : "d-none"}
                >
                  <label className="form-label">From Location</label>

                  <Typeahead
                    id="basic-example"
                    name="location"
                    options={locationData}
                    placeholder="Select Location"
                    onChange={(label) => fromLocationEvent(label)}
                    className="mb-3"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">To Location</label>

                  <Typeahead
                    id="basic-example"
                    name="location"
                    options={locationData}
                    placeholder="Select Location"
                    onChange={(label) => changeLocation(label)}
                    className="mb-3"
                  />
                </div>
              </div>
              <div className="row   ">
                <div
                  className={props.type === "customer" ? "col-md-12" : "d-none"}
                  style={{ marginBottom: "15px" }}
                >
                  <label className="form-label">Customer</label>

                  <Typeahead
                    id="basic-example"
                    name="customer"
                    options={custdata}
                    placeholder="Select Customer"
                    onChange={(label) => changeCustomer(label)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div> */}

      <div className="row mt-3">
        <div className="col-md-6">
          <div style={{ height: "400px", overflowY: "scroll" }}>
            <BootstrapTable
              keyField="MtrlStockID"
              columns={columns1}
              data={firstTable}
              striped
              hover
              condensed
              selectRow={selectRow1}
              headerClasses="header-class tableHeaderBGColor"
              sort={sort}
              onSortChange={onSortChange}
            ></BootstrapTable>
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
              //selectRow={selectRow1}
              headerClasses="header-class tableHeaderBGColor"
            ></BootstrapTable>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaterialMoverForm;
