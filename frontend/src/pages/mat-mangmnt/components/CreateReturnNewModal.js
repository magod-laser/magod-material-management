import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";

function CreateReturnNewModal(props) {
  // console.log("props", props);
  const { show, setShow, handleShow } = props;
  const nav = useNavigate();

  const handleClose = () => {
    if (props.srlMaterialType === "material") {
      let selectData = {
        Iv_Id: props.srlIVID,
      };
      nav(
        "/MaterialManagement/Return/CustomerJobWork/OutwardMaterialIssueVoucher",
        {
          state: { selectData },
        }
      );
    }
    if (props.srlMaterialType === "part") {
      let selectData = {
        Iv_Id: props.srlIVID,
      };
      nav(
        "/MaterialManagement/Return/CustomerJobWork/OutwardPartIssueVoucher",
        {
          state: { selectData },
        }
      );
    }
    setShow(false);
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="p-3 ">
          <Modal.Title style={{fontSize:'14px'}}>Confirmation Message</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3" style={{fontSize:'12px'}}>
          <span>IV No. {props.IVNOVal} Created Successfully</span>
        </Modal.Body>
        <Modal.Footer className="p-2 px-3">
          <button
            className="button-style m-0"
            onClick={handleClose}
            style={{ width: "15%" , fontSiz:"12px"}}
          >
            Ok
          </button>
          {/* <Button variant="secondary" onClick={handleClose}>
            Ok
          </Button> */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CreateReturnNewModal;
