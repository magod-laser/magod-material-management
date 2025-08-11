import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function LocationLisModal({ open, setOpen }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Modal show={open} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Magod Material Accounting
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>
          <Form>Location Information Saved </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-style"
            onClick={handleClose}
            style={{ fontSize: "12px" }}
          >
            Okay
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default LocationLisModal;
