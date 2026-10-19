import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { Container } from 'react-bootstrap'

import PageLayout from '../../layout/PageLayout'
import CancelOrderModal from '../../Components/Shared/CancelOrderModal'
import { OrderService } from '../../Services/OrderService'

const PINK = '#f0345d'
const money = (n) => `$${Number(n).toFixed(2)}`

const statusColor = (status) => {
  if (status === 'PENDING') return '#f59e0b'
  if (status === 'CANCELED' || status === 'CANCELLED') return '#dc3545'
  return '#198754'
}

const boxStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  color: 'var(--body-text)',
}

const canCancel = (status) => status === 'PENDING' || status === 'ACCEPTED'

const OrderCard = ({ order, onCancelClick }) => {
  return (
    <div className="rounded p-3 mb-3" style={boxStyle}>
            <div className="d-flex justify-content-between align-items-center mb-2">
        <strong style={{ color: 'var(--heading)' }}>Order #{order.id}</strong>
        <span
          className="badge"
          style={{ background: statusColor(order.status), color: '#fff' }}
        >
          {/* {order.status === 'CANCELED' ? 'PENDING CANCELLATION' : order.status} */}
          {order.status}
        </span>
      </div>

      <div className="small mb-3" style={{ color: 'var(--muted-text)' }}>
        Payment: {order.payment_type} ({order.payment_status})
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <span className="fw-semibold" style={{ color: PINK }}>
          {money(order.grand_total)}
        </span>

        <div className="d-flex gap-2">
          <Link
            to={`/orders/${order.id}`}
            className="btn btn-sm"
            style={{ background: 'transparent', color: PINK, border: `1px solid ${PINK}` }}
          >
            Details
          </Link>

          {canCancel(order.status) && (
            <button
              type="button"
              className="btn btn-sm text-white"
              style={{ backgroundColor: '#dc3545' }}
              onClick={() => onCancelClick(order)}
            >
              Cancel order
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const Orders = () => {
  const isLoggedIn = !!localStorage.getItem('auth_token')

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  const loadOrders = () => {
    return OrderService.GetOrders()
      .then((list) => setOrders(list))
      .catch((err) => setError(err.message))
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    loadOrders().finally(() => setLoading(false))
  }, [])

  const openCancelModal = (order) => {
    setCancelError('')
    setCancelTarget(order)
  }

  const closeCancelModal = () => {
    if (cancelling) return
    setCancelTarget(null)
    setCancelError('')
  }

  const confirmCancel = (comment) => {
    if (!cancelTarget) return

    setCancelling(true)
    setCancelError('')
    OrderService.CancelOrder(cancelTarget.id, comment)
      .then(() => {
        setCancelTarget(null)
        return loadOrders()
      })
      .catch((err) => setCancelError(err.message))
      .finally(() => setCancelling(false))
  }

  return (
    <PageLayout>
      <Container className="py-4">
        <h4 className="mb-3" style={{ color: 'var(--heading)' }}>My orders</h4>

        {!isLoggedIn && (
          <div className="text-center my-5" style={{ color: 'var(--body-text)' }}>
            <p className="mb-3">Please log in to see your orders.</p>
            <Link to="/login" className="btn text-white" style={{ backgroundColor: PINK }}>
              Login
            </Link>
          </div>
        )}

        {isLoggedIn && loading && <p style={{ color: 'var(--body-text)' }}>Loading...</p>}

        {error && <p className="text-danger">{error}</p>}
        {cancelError && <p className="text-danger">{cancelError}</p>}

        {isLoggedIn && !loading && !error && orders.length === 0 && (
          <div className="text-center my-5" style={{ color: 'var(--body-text)' }}>
            <p className="mb-3">You have no orders yet.</p>
            <Link to="/products" className="btn text-white" style={{ backgroundColor: PINK }}>
              Start shopping
            </Link>
          </div>
        )}

        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancelClick={openCancelModal}
          />
        ))}
      </Container>

      <CancelOrderModal
        show={!!cancelTarget}
        onClose={closeCancelModal}
        onConfirm={confirmCancel}
        loading={cancelling}
      />
    </PageLayout>
  )
}

export default Orders
