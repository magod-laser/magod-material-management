import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function ChangeLocationModal({ open, setOpen }) {
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
          <Form>Are you sure you want to shift a material "material" ?</Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-style"
            onClick={handleClose}
            style={{ fontSize: "12px" }}
          >
            yes
          </button>
          <button
            className="button-style"
            onClick={handleClose}
            style={{ fontSize: "12px" }}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ChangeLocationModal;
