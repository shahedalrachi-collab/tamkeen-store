import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { FaCheck } from 'react-icons/fa'

const PINK = '#f0345d'

const SuccessModal = ({ show, onClose,title, message }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
            <Modal.Header
        closeButton
        closeVariant="white"
        className="border-0"
        style={{ background: PINK }}
      />

      <Modal.Body className="text-center px-4 pb-4">

        <div
          className="d-flex align-items-center justify-content-center rounded-circle mx-auto"
          style={{ width: 90, height: 90, background: '#0fd47a', color: 'white', marginTop: -60 }}
        >
          <FaCheck size={40} />

        </div>

          {title && <h4 className="mt-3 mb-1">{title}</h4>}

        <p className="fs-5 mt-3 mb-4">{message}</p>

        <Button
          className="w-100 py-2"
          style={{ background: PINK, borderColor: PINK }}
          onClick={onClose}
        >
          Continue
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default SuccessModal