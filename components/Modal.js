import ReactModal from 'react-modal';
import styles from '@/styles/modal.module.css'
// Estilos para o modal (pode ser colocado em um arquivo CSS separado)
const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #ccc',
    background: '#fff',
    borderRadius: '4px',
    padding: '20px',
    overflow: 'auto'
  }
};

// Componente Modal
const Modal = ({ isOpen, onRequestClose, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      className={styles.modal}
      ariaHideApp={false}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;