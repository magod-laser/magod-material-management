import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DeleteSerialYesNoModal(props) {
  let { modalOpen, setModalOpen, message, handleYes } = props;
  const handleNo = () => {
    // modalResponse("no");
    setModalOpen(false);
  };

  return (
    <>
      <Modal show={modalOpen} onHide={handleNo}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'14px'}}>  Please Confirm Before Proceed</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize: '12px'}}>{message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleYes}
            style={{ backgroundColor: " #2b3a55" ,fontSize:'12px'}}
          >
            Yes
          </Button>
          <Button variant="secondary" onClick={handleNo} style={{fontSize:'12px'}}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteSerialYesNoModal;
