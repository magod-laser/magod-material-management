
import Modal from "react-bootstrap/Modal";

export default function ConfirmationModal(props) {
  const closeModal = () => {
    props.setConfirmModalOpen(false);
  };

  const yesClicked = () => {
    props.yesClickedFunc();
    closeModal();
  };

  return (
    <>
      <Modal
        show={props.confirmModalOpen}
        onHide={closeModal}
        style={{ background: "#4d4d4d57" }}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "14px" }}>
            Confirmation Message
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "12px" }}>
          <span>{props.message}</span>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-row justify-content-end">
          <button
            className="button-style m-0 me-3"
            style={{ width: "60px" }}
            onClick={yesClicked}
          >
            Yes
          </button>

          <button
            className="button-style m-0"
            style={{ width: "60px" }}
            onClick={closeModal}
          >
            No
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
