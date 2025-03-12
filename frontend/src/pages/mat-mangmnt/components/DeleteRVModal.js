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
          <Modal.Title style={{ fontSize: "14px" }}>
            Please Confirm Before Proceed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>{message}</Modal.Body>
        <Modal.Footer>
          <button
            // variant="secondary"
            className="button-style"
            onClick={handleRVYes}
            // style={{ backgroundColor: " #2b3a55", fontSize:'12px' }}
          >
            Yes
          </button>
          <button
            className="button-style"
            onClick={handleNo}
            style={{ fontSize: "12px" }}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteRVModal;
