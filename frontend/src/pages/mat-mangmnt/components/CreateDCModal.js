import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
 import Modal from 'react-bootstrap/Modal';

function CreateDCModal(props) {

  const {show, setShow, handleShow}=props;


    const handleClose = () => setShow(false);
  return (
    <>
      

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'14px'}}>Create Return Vocher</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize:'12px'}}>Vocher Created</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} style={{fontSize:'12px'}}>
            okay
          </Button>
          
        </Modal.Footer>
      </Modal>
    </>

  )
}

export default CreateDCModal