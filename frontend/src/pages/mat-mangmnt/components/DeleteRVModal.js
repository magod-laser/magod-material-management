import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DeleteRVModal(props) {
  let { deleteRvModalOpen, setDeleteRvModalOpen, message, handleRVYes } = props;
  const handleNo = () => {
    // modalResponse("no");
    setDeleteRvModalOpen(false);
  };

  return (
    <>
      <Modal show={deleteRvModalOpen} onHide={handleNo}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'14px'}}>Please Confirm Before Proceed</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize:'12px'}}>{message}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleRVYes}
            style={{ backgroundColor: " #2b3a55", fontSize:'12px' }}
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

export default DeleteRVModal;
