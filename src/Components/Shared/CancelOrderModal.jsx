import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const PINK = '#f0345d'

const CancelOrderModal = ({ show, onClose, onConfirm, loading }) => {
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (show) setComment('')
  }, [show])

  const handleConfirm = () => {
    onConfirm(comment.trim())
  }

  return (
    <Modal show={show} onHide={loading ? undefined : onClose} centered>
      <Modal.Header
        closeButton={!loading}
        closeVariant="white"
        className="border-0"
        style={{ background: PINK }}
      >
        <Modal.Title className="text-white fs-5">Cancel order</Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-4">
        <p className="mb-3" style={{ color: 'var(--body-text)' }}>
          Are you sure you want to cancel this order?
        </p>

        <label
          className="form-label small mb-1"
          htmlFor="cancel-comment"
          style={{ color: 'var(--muted-text)' }}
        >
          Reason (optional)
        </label>
        <textarea
          id="cancel-comment"
          className="form-control"
          rows={3}
          placeholder="Why are you cancelling?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
          style={{
            background: 'var(--surface)',
            color: 'var(--body-text)',
            borderColor: 'var(--line)',
          }}
        />
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 px-4 pb-4">
        <Button
          variant="outline-secondary"
          onClick={onClose}
          disabled={loading}
        >
          Keep order
        </Button>
        <Button
          className="text-white"
          style={{ backgroundColor: '#dc3545', borderColor: '#dc3545' }}
          onClick={handleConfirm}
          disabled={loading}
        >
          {loading ? 'Cancelling...' : 'Confirm cancellation'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CancelOrderModal
