import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import ModalComp from "./ModalComp";
import { toast } from "react-toastify";
const { getRequest, postRequest } = require("../../../../api/apiinstance");
const { endpoints } = require("../../../../api/constants");

function LocationModel({ show, setShow, scrapModal }) {
  const [open, setOpen] = useState(false);

  const [row, setRow] = useState({
    scrapWeight: "",
    location: "",
  });

  //   const handleOpen = () => setOpen(true);
  const handleOpen = () => {
    // alert("The material will be altered as SCRAP, Continue?");
    var numberPattern = /^[0-9]+$/;
    if (!row.scrapWeight.match(numberPattern)) {
      toast.error("Enter Numeric Value");
    } else if (row.location.length === 0) {
      toast.error("Select Location");
    } else {
      setOpen(true);
      setShow(false);
    }
  };

  const handleClose = () => {
    toast.warning("Not saved as Scrap");
    setRow({
      scrapWeight: "",
      location: "",
    });
    setShow(false);
  };

  // const InputHeaderEvent = (e) => {
  //   const { value, name } = e.target;

  //   row[name] = value;
  // };

  const InputHeaderEvent = (e) => {
    const { value, name } = e.target;

    if (name === "scrapWeight") {
      const numericValue = value.replace(/[^0-9]/g, "");
      setRow((prevState) => ({
        ...prevState,
        [name]: numericValue,
      }));
    } else {
      setRow((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  let [locationData, setLocationData] = useState([]);

  useEffect(() => {
    getRequest(endpoints.getMaterialLocationList, (data) => {
      setLocationData(data);
    });
  }, []);

  // getRequest(endpoints.getMaterialLocationList, (data) => {
  //   setLocationData(data);
  // });

  return (
    <>
      <ModalComp
        open={open}
        setOpen={setOpen}
        row={row}
        scrapModal={scrapModal}
        setRow={setRow}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>Magod Material</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row mt-2">
              <div className="col-md-11 ">
                <label className="form-label">Scrap Weight</label>
                <input
                  type="text"
                  name="scrapWeight"
                  value={row.scrapWeight}
                  onChange={InputHeaderEvent}
                />
                 
              </div>
              <div className="col-md-12 ">
                <label className="form-label">Location</label>
              </div>
              <div className="col-md-11" style={{ marginTop: "8px" }}>
                <select
                  className="ip-select dropdown-field"
                  name="location"
                  onChange={InputHeaderEvent}
                >
                  <option value="" disabled selected>
                    Select Location
                  </option>
                  {locationData.map((location, index) => (
                    <option key={index} value={location.LocationNo}>
                      {location.LocationNo}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleOpen}>
            Save
          </Button> */}

          <button
            className="button-style"
            style={{ width: "80px", backgroundColor: "gray" }}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="button-style"
            style={{ width: "80px" }}
            onClick={handleOpen}
          >
            Save
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default LocationModel;
