import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

// Return As Scrap
function ModalComp({ open, setOpen, setShow, row, scrapModal, setRow }) {
  const handleClose = () => {
    scrapModal({});
    setRow({
      scrapWeight: "",
      location: "",
    });
    setOpen(false);
  };
  const handleYes = () => {
    scrapModal(row);
    setRow({
      scrapWeight: "",
      location: "",
    });
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
        <Modal.Body>
          <Form style={{ fontSize: "12px" }}>
            The Material will be altered as SCRAP, Continue?
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="button-style"
            style={{ width: "80px" }}
            onClick={handleYes}
          >
            Yes
          </button>
          <button
            className="button-style"
            style={{ width: "80px" }}
            onClick={handleClose}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalComp;
