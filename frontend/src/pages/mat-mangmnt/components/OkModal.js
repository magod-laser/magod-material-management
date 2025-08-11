import Modal from "react-bootstrap/Modal";

function OkModal(props) {
  const { show, setShow, modalMessage, modalResponseok } = props;

  const handleClose = () => {
    setShow(false);
  };

  const handleOk = () => {
    modalResponseok("ok");
    setShow(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>Please Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <button
            className="button-style "
            style={{ width: "50px" }}
            onClick={handleOk}
          >
            Yes
          </button>

          <button
            className="button-style"
            style={{ width: "50px" }}
            onClick={handleClose}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default OkModal;
