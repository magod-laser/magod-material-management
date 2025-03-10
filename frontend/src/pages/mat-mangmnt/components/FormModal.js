import React from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function FormModal(props) {
  const { show, setShow } = props;

  const handleClose = () => setShow(false);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>DC Number Updater</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Enter DC No</Form.Label>
              <Form.Control type="text" placeholder="Enter DC No" autoFocus />
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>PN No</Form.Label>
              <Form.Control type="text" placeholder="Enter DC No" autoFocus />
            </Form.Group>
          </Form>
          <div className="justify-content-center">
            <button
              className="button-style"
              onClick={handleClose}
              style={{ width: "145px" }}
            >
              Save
            </button>
            <button
              className="button-style"
              onClick={handleClose}
              style={{ width: "145px" }}
            >
              Clear
            </button>
            <button
              className="button-style"
              onClick={handleClose}
              style={{ width: "146px" }}
            >
              Cancel
            </button>
          </div>
        </Modal.Body>

        {/* <Modal.Footer>
          
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default FormModal;
