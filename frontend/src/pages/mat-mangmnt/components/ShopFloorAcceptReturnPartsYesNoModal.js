import React, { useState } from "react";
import { toast } from "react-toastify";

import Button from "react-bootstrap/Button";

import Modal from "react-bootstrap/Modal";

import SecondModelAcceptReturn from "./SecondModelAcceptReturn";

const { getRequest, postRequest } = require("../../api/apiinstance");

const { endpoints } = require("../../api/constants");

function ShopFloorAcceptReturnPartsYesNoModal(props) {
  const {
    showYN,
    setShowYN,
    handleShow,
    formHeader,
    setFormHeader,
    tableData,
  } = props;

  const [showSecondModal, setShowSecondModal] = useState(false);

  const openSecondModal = () => {
    setShowSecondModal(true);
  };

  const handleYes = () => {
    for (let i = 0; i < tableData.length; i++) {
      let update1 = {
        Id: tableData[i].PartReceipt_DetailsID,

        Qty: tableData[i].QtyReturned,
      };

      //update QtyIssue mtrlpartreceiptdetails

      postRequest(
        endpoints.updateQtyIssuedPartReceiptDetails,
        update1,
        (data) => {
          console.log("update1");
        }
      );

      //update ncprogram qtyalloated

      let update3 = {
        Id: formHeader.NcId,
        Qty: formHeader.QtyReturned,
      };
      postRequest(endpoints.updateQtyAllotedncprograms, update3, (data) => {
        console.log("update3");
      });
    }

    //update shopfloorpartissueregiser stats closed

    let update4 = {
      Id: formHeader.IssueID,
      status: "Closed",
    };

    postRequest(
      endpoints.updateStatusShopfloorPartIssueRegister,
      update4,
      (data) => {
        console.log("update4");
        setFormHeader({ ...formHeader, Status: "Closed" });
        toast.success("Issue voucher closed");
      }
    );

    setShowYN(false);

    // openSecondModal();
  };

  const handleNo = () => {
    setShowYN(false);
  };

  return (
    <>
      <SecondModelAcceptReturn
        showSecondModal={showSecondModal}
        handleCloseSecondModal={() => setShowSecondModal(false)}
      />

      <Modal show={showYN} onHide={handleNo}>
        <Modal.Header closeButton>
          <Modal.Title style={{fontSize:'14px'}}>Please Confirm</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{fontSize:'12px'}}>
          All returned quantity will be taken on stock, for rejecting parts use
          Material receipt voucher. Proceed ?
        </Modal.Body>

        <Modal.Footer>
          <button
            className="button-style "
            style={{ width: "50px", fontSize:'12px' }}
            onClick={handleYes}
          >
            Yes
          </button>
          {/* backgroundColor: "gray", */}
          <button
            className="button-style"
            style={{ width: "50px",  fontSize:'12px' }}
            onClick={handleNo}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ShopFloorAcceptReturnPartsYesNoModal;
