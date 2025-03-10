import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { getRequest, postRequest } = require("../../api/apiinstance");
const { endpoints } = require("../../api/constants");

function ReturnCancelIVModal(props) {
  const { show, setShow, handleShow } = props;
  const nav = useNavigate();
  const IVDetails = {
    Iv_Id: props.IV_ID,
    IV_No: props.IV_NO,
  };
  const handleClose = () => {
    if (props.type === "parts") {
      //parts

      for (let i = 0; i < props.outData.length; i++) {
        const updateQtyReturn = {
          QtyReturned: props.outData[i].QtyReturned,
          Id: props.outData[i].Mtrl_Rv_id,
        };

        //update Qty Returned
        postRequest(
          endpoints.updateQtyReturnedPartReceiptDetails,
          updateQtyReturn,
          async (data) => {
            console.log("updated qty");
          }
        );

        //update status cancel
        postRequest(
          endpoints.updateStatusCancel,
          IVDetails,
          async (data) => {}
        );
      }
    } else {
      //sheets
      //insert into mtrlstock by mtrlreturn
      postRequest(endpoints.insertByReturnDetails, IVDetails, async (data) => {
        if (data.affectedRows !== 0) {
          console.log("Record inserted");

          //delete by material return details
          postRequest(
            endpoints.deleteByIVNOMaterialReturnDetails,
            IVDetails,
            async (data) => {}
          );

          //update Iv null
          postRequest(endpoints.updateIVNoNULL, IVDetails, async (data) => {});

          //update status cancel
          postRequest(
            endpoints.updateStatusCancel,
            IVDetails,
            async (data) => {}
          );
        } else {
          //toast.error("Record Not Inserted");
        }
      });
    }
    toast.success("Current Iv cancelled and stock added to Material Stock");
    setShow(false);
  };
  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'14px'}}>
            Cancel IV {props.IV_NO} and {props.IV_ID}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{fontSize:'12px'}}>
          Current IV cancelled and stock added to Material Stock
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} style={{fontSize:'12px'}}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReturnCancelIVModal;
