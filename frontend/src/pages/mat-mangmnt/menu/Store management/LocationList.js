import React, { useState, useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import YesNoModal from "../../components/YesNoModal";

const { getRequest, postRequest } = require("../../../api/apiinstance");
const { endpoints } = require("../../../api/constants");

export default function LocationList() {
  const nav = useNavigate();

  const [tableData, setTableData] = useState([]);
  const [shape, setShape] = useState([]);

  const [inputData, setInputData] = useState({
    location: "",
    storage: "",
    capacity: "0",
  });
  const [selectedRow, setSelectedRow] = useState({});
  const [selectedIndex, setSelectedIndex] = useState([]);
  const [show, setShow] = useState(false);

  const columns = [
    {
      text: "id",
      dataField: "id",
      hidden: true,
    },
    {
      text: "LocationNo",
      dataField: "LocationNo",
      sort: true,
    },
    {
      text: "StorageType",
      dataField: "StorageType",
      sort: true,
    },
    {
      text: "Capacity",
      dataField: "Capacity",
      sort: true,
    },
    {
      text: "CapacityUtilised",
      dataField: "CapacityUtilised",
      sort: true,
    },
  ];

  const fetchData = async () => {
    //load shapes
    getRequest(endpoints.getAllShapeNames, async (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].label = data[i].Shape;
      }

      setShape(data);
    });

    // Fetch all material location list
    getRequest(endpoints.getMaterialLocationList, (data) => {
      for (let i = 0; i < data.length; i++) {
        data[i].id = i + 1;
      }
      setTableData(data);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeHandler = (e) => {
    const { value, name } = e.target;

    setInputData((preValue) => {
      return {
        ...preValue,
        [name]: value,
      };
    });
  };

  const addButton = () => {
    const found = tableData.some((obj) => {
      return obj.LocationNo === inputData.location;
    });

    if (found) {
      toast.error("The location number already exist");
    } else {
      if (inputData.location && inputData.storage && inputData.capacity) {
        let paraData1 = {
          LocationNo: inputData.location,
          StorageType: inputData.storage,
          Capacity: inputData.capacity,
        };
        postRequest(endpoints.insertMaterialLocationList, paraData1, (data) => {
          // Fetch all material location list
          getRequest(endpoints.getMaterialLocationList, (data) => {
            for (let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
            }
            setTableData(data);
          });
          setInputData({
            location: "",
            storage: "",
            capacity: "",
          });
          toast.success("Location data added successfully");
        });
      } else {
        toast.error("Please fill the data before adding");
      }
    }
  };
  const selectRow = {
    mode: "radio",
    clickToSelect: true,
    bgColor: "#98A8F8",
    selected: selectedIndex,
    onSelect: (row, isSelect, rowIndex, e) => {
      if (isSelect) {
        setSelectedRow(row);
        setSelectedIndex([row.id]);
        setInputData((preValue) => {
          return {
            location: row.LocationNo,
            storage: row.StorageType,
            capacity: row.Capacity,
          };
        });
      } else {
        setSelectedRow({});
        setSelectedIndex([]);
        setInputData({
          location: "",
          storage: "",
          capacity: "",
        });
      }
    },
  };
  const deleteButton = () => {
    if (selectedRow?.id) {
      let url1 =
        endpoints.getLocationListMtrlStockCount +
        "?location=" +
        selectedRow.LocationNo;
      getRequest(url1, async (data) => {
        if (data.count > 0) {
          toast.error(
            selectedRow.LocationNo +
              " has material in it. Clear / move material before deleting the storage loaction"
          );
        } else {
          setShow(true);
        }
      });
    } else {
      toast.error("Please select the row from the table");
    }
  };
  const modalResponse = (msg) => {
    if (msg === "yes") {
      let paraData1 = {
        LocationNo: selectedRow.LocationNo,
      };
      postRequest(endpoints.deleteMaterialLocationList, paraData1, (data) => {
        toast.success("Location Deleted");
        // Fetch all material location list
        getRequest(endpoints.getMaterialLocationList, (data) => {
          for (let i = 0; i < data.length; i++) {
            data[i].id = i + 1;
          }
          setTableData(data);
          setInputData({
            location: "",
            storage: "",
            capacity: "",
          });
          setSelectedIndex([]);
        });
      });
    }
  };

  const saveButton = () => {
    if (selectedRow?.id) {
      if (inputData.storage && inputData.capacity) {
        //update
        let paraData1 = {
          LocationNo: selectedRow.LocationNo,
          StorageType: inputData.storage,
          Capacity: inputData.capacity,
        };
        postRequest(endpoints.updateMaterialLocationList, paraData1, (data) => {
          // Fetch all material location list
          getRequest(endpoints.getMaterialLocationList, (data) => {
            for (let i = 0; i < data.length; i++) {
              data[i].id = i + 1;
            }
            setTableData(data);
          });
          toast.success("Location detail updated successfully");

          setInputData({
            location: "",
            storage: "",
            capacity: "",
          });
          setSelectedIndex([]);
        });
      } else {
        toast.error("Please fill the data before updating");
      }
    } else {
      toast.error("Please select the row from the table");
    }
  };

  const [sort, setSort] = React.useState({
    dataField: "id",
    order: "asc",
  });

  const onSortChange = (dataField, order) => {
    setSort({ dataField, order });
  };

  const numbValidations = (e) => {
    if (
      e.which === 38 ||
      e.which === 40 ||
      ["e", "E", "+", "-"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  return (
    <>
      <h4 className="title">Material Storage Location Manager</h4>
      <div className="row">
        <div className="col-md-7">
          <div style={{ maxHeight: "500px", overflow: "auto" }}>
            <BootstrapTable
              keyField="id"
              columns={columns}
              data={tableData}
              striped
              hover
              condensed
              selectRow={selectRow}
              headerClasses="header-class tableHeaderBGColor"
              sort={sort}
              onSortChange={onSortChange}
            ></BootstrapTable>
          </div>
        </div>
        <div className="col-md-5">
          <div className="ip-box form-bg">
            <div className="row mb-3">
              <div className="col-md-5">
                <label className="form-label mt-2">Location No/Name</label>
              </div>
              <div className="col-md-7">
                <input
                  className="input-disabled mt-2"
                  type="text"
                  name="location"
                  onChange={(e) => {
                    if (e.target.value?.length === 40) {
                      toast.warning(
                        "Location No/Name can be only 40 characters"
                      );
                      e.preventDefault();
                    } else {
                      changeHandler(e);
                    }
                  }}
                  value={inputData.location}
                  disabled={selectedRow?.id ? true : false}
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-5">
                <label className="form-label mt-2">Storage Type</label>
              </div>
              <div className="   col-md-7">
                {shape.length > 0 ? (
                  <select
                    name="storage"
                    className="input-disabled mt-2"
                    onChange={changeHandler}
                    value={inputData.storage}
                    style={{ width: "100%" }}
                  >
                    <option value="" selected disabled hidden>
                      Select Storage Type
                    </option>
                    {shape.map((val, i) => (
                      <option value={val.Shape}>{val.Shape}</option>
                    ))}
                  </select>
                ) : (
                  <p>Loading storage types...</p>
                )}
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-5">
                <label className="form-label mt-2">Storage Capacity</label>
              </div>
              <div className="col-md-7">
                <input
                  className="input-disabled mt-2"
                  name="capacity"
                  type="number"
                  value={inputData.capacity}
                  onKeyDown={numbValidations}
                  onChange={(e) => {
                    if (
                      e.target.value === "" ||
                      parseInt(e.target.value) === "NaN" ||
                      parseInt(e.target.value) === NaN
                    ) {
                      e.target.value = 0;
                    }
                    if (parseInt(e.target.value) < 0) {
                      e.target.value = parseInt(e.target.value) * -1;
                      toast.warning("Capacity can't be negative");
                    }

                    changeHandler(e);
                  }}
                />
              </div>
            </div>

            <div className="row mt-3 mb-3">
              <div className="col-md-3 col-sm-12">
                <button className="button-style " onClick={addButton}>
                  Add
                </button>
              </div>
              <div className="col-md-3 col-sm-12">
                <button className="button-style" onClick={deleteButton}>
                  Delete
                </button>
              </div>
              <div className="col-md-3 col-sm-12">
                <button className="button-style " onClick={saveButton}>
                  Save
                </button>
              </div>
              <div className="col-md-3 col-sm-12">
                <button
                  className="button-style"
                  id="btnclose"
                  type="submit"
                  onClick={() => nav("/MaterialManagement")}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <YesNoModal
        show={show}
        setShow={setShow}
        message="Do you want to remove this location?"
        modalResponse={modalResponse}
      />
    </>
  );
}
