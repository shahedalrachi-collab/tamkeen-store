import { Modal } from 'react-bootstrap'
import './Admin.css'

const AdminModal = ({ show, type = 'success', message, onClose }) => {
  const isError = type === 'error'

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Body className="text-center p-4">
        <div
          style={{
            fontSize: 48,
            lineHeight: 1,
            color: isError ? '#dc3545' : '#198754',
          }}
        >
          {isError ? '✕' : '✓'}
        </div>

        <h5 className="mt-3">{isError ? 'Something went wrong' : 'Done'}</h5>
        <p className="text-body-secondary">{message}</p>

        <button type="button" className="admin-btn px-4" onClick={onClose}>
          OK
        </button>
      </Modal.Body>
    </Modal>
  )
}

export default AdminModal