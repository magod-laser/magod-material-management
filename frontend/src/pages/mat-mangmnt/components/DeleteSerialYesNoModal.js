import Modal from "react-bootstrap/Modal";

function DeleteSerialYesNoModal(props) {
  let { modalOpen, setModalOpen, message, handleYes } = props;
  const handleNo = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Modal show={modalOpen} onHide={handleNo}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            {" "}
            Please Confirm Before Proceed
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>{message}</Modal.Body>
        <Modal.Footer>
          <button className="button-style" onClick={handleYes}>
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

export default DeleteSerialYesNoModal;
