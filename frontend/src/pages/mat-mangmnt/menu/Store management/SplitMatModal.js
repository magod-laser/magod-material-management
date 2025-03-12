import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function SplitMatModal({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Magod Material Accounting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ fontSize: "12px" }}>
            {" "}
            Are you sure you want to shift a material "material" ?
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* variant="secondary" */}
          <button className="button-style" onClick={handleClose}>
            yes
          </button>
          {/* variant="primary" */}
          <button className="button-style" onClick={handleClose}>
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default SplitMatModal;
