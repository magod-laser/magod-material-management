import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import CreateReturnNewModal from "./CreateReturnNewModal";

function ReturnPartQtyCheckOk(props) {
  const { showOK, setShowOK, handleShow } = props;
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShowOK(false);
    setShow(true);
  };
  return (
    <>
      <CreateReturnNewModal
        show={show}
        setShow={setShow}
        srlMaterialType={props.srlMaterialType}
        srlIVID={props.srlIVID}
        IVNOVal={props.IVNOVal}
      />
      <Modal show={showOK} onHide={handleClose}>
        <Modal.Header closeButton className="p-3 ">
          <Modal.Title style={{ fontSize: "14px" }}>
            Confirmation Message
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-3">
          <span style={{ fontSize: "12px" }}>Quantity Check Ok</span>
        </Modal.Body>
        <Modal.Footer className="p-2 px-3">
          <button
            className="button-style m-0"
            onClick={handleClose}
            style={{ width: "15%" }}
          >
            Ok
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ReturnPartQtyCheckOk;
