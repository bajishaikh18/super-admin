

import { Modal, Button } from 'react-bootstrap';
import { IoClose } from 'react-icons/io5';
import styles from './Delete.module.scss';



interface DeleteModalProps {
  showModal: boolean;
  handleClose: () => void;
  deleteLoading: boolean;
  handleDelete: () => Promise<void>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ showModal, handleClose, deleteLoading, handleDelete }) => {
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      centered
      backdrop="static"
    >
      <div className={styles.modalContainer}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h2>Delete Post Job</h2>
            <IoClose
              className={styles.closeButton}
              onClick={handleClose}
            />
          </div>
          {deleteLoading ? (
            <div className={styles.popupContent}>
              <p className={styles.loadingContent}>
                Your Posted Job is deleting, please wait.
              </p>
              <div className={styles.createSpinner}></div>
            </div>
          ) : (
            <div className={styles.deletePrompt}>
              <h3>Are you sure you want to delete the Posted Job?</h3>
              <p>This action is irreversible.</p>
            </div>
            
          )}
            <div className={styles.actions}>
          <Button
            className={`action-buttons ${!deleteLoading ? "" : styles.disabled}`}
            onClick={async () => {
              await handleDelete();
              handleClose();
            }}
          >
            Delete
          </Button>
        </div>
        </div>
      
      </div>
    </Modal>
  );
};

export default DeleteModal;
