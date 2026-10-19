import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Container, Row, Col } from 'react-bootstrap'

import PageLayout from '../../layout/PageLayout'
import { OrderService } from '../../Services/OrderService'

const PINK = '#f0345d'
const money = (n) => `$${Number(n || 0).toFixed(2)}`

const statusColor = (status) => {
  if (status === 'PENDING') return '#f59e0b'
  if (status === 'CANCELED' || status === 'CANCELLED') return '#dc3545'
  if (status === 'REJECTED') return '#dc3545'
  return '#198754'
}

const boxStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--line)',
  color: 'var(--body-text)',
}

const statusLabel = (status) => {
  // if (status === 'CANCELED') return 'PENDING CANCELLATION'
  return status
}

const OrderDetails = () => {
  const { id } = useParams()
  const isLoggedIn = !!localStorage.getItem('auth_token')

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')
    OrderService.GetOrder(id)
      .then((data) => setOrder(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id, isLoggedIn])

  const products = order?.orderProducts || []

  return (
    <PageLayout>
      <Container className="py-4">
        <Link
          to="/orders"
          className="d-inline-block mb-3 text-decoration-none small"
          style={{ color: PINK }}
        >
          &larr; Back to orders
        </Link>

        {!isLoggedIn && (
          <div className="text-center my-5" style={{ color: 'var(--body-text)' }}>
            <p className="mb-3">Please log in to see this order.</p>
            <Link to="/login" className="btn text-white" style={{ backgroundColor: PINK }}>
              Login
            </Link>
          </div>
        )}

        {isLoggedIn && loading && (
          <p style={{ color: 'var(--body-text)' }}>Loading...</p>
        )}

        {error && <p className="text-danger">{error}</p>}

        {isLoggedIn && !loading && !error && order && (
          <>
            <div className="rounded p-3 mb-3" style={boxStyle}>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                <h4 className="mb-0" style={{ color: 'var(--heading)' }}>
                  Order #{order.id}
                </h4>
                <span
                  className="badge"
                  style={{ background: statusColor(order.status), color: '#fff' }}
                >
                  {statusLabel(order.status)}
                </span>
              </div>
              <div className="small" style={{ color: 'var(--muted-text)' }}>
                Payment: {order.payment_type} ({order.payment_status})
              </div>
            </div>

            <Row className="g-3 mb-3">
              <Col xs={12} lg={6}>
                <div className="rounded p-3 h-100" style={boxStyle}>
                  <h5 className="mb-3" style={{ color: 'var(--heading)' }}>
                    Delivery address
                  </h5>
                  {!order.address && (
                    <p className="mb-0" style={{ color: 'var(--muted-text)' }}>
                      No address
                    </p>
                  )}
                  {order.address && (
                    <>
                      <p className="mb-1" style={{ color: 'var(--body-text)' }}>
                        <strong>{order.address.name}</strong>
                        {order.address.phone ? ` · ${order.address.phone}` : ''}
                      </p>
                      <p className="mb-1 small" style={{ color: 'var(--body-text)' }}>
                        {[order.address.city, order.address.neighborhood, order.address.street]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                      <p className="mb-0 small" style={{ color: 'var(--muted-text)' }}>
                        Building: {order.address.building || '-'} · Zip:{' '}
                        {order.address.zip_code || '-'}
                      </p>
                    </>
                  )}
                </div>
              </Col>

              <Col xs={12} lg={6}>
                <div className="rounded p-3 h-100" style={boxStyle}>
                  <h5 className="mb-3" style={{ color: 'var(--heading)' }}>
                    Order summary
                  </h5>
                  <div className="d-flex justify-content-between small mb-1">
                    <span style={{ color: 'var(--muted-text)' }}>Subtotal</span>
                    <span>{money(order.subtotal)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span style={{ color: 'var(--muted-text)' }}>Discount</span>
                    <span>{money(order.discount)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span style={{ color: 'var(--muted-text)' }}>Shipping</span>
                    <span>{money(order.shipping)}</span>
                  </div>
                  <div className="d-flex justify-content-between small mb-1">
                    <span style={{ color: 'var(--muted-text)' }}>Total</span>
                    <span>{money(order.total)}</span>
                  </div>
                  <div
                    className="d-flex justify-content-between fw-semibold mt-2 pt-2"
                    style={{ borderTop: '1px solid var(--line)', color: PINK }}
                  >
                    <span>Grand total</span>
                    <span>{money(order.grand_total)}</span>
                  </div>
                  <p className="small mb-1 mt-3" style={{ color: 'var(--body-text)' }}>
                    <strong>Coupon:</strong>{' '}
                    {order.coupon
                      ? `${order.coupon.code}`
                      : '-'}
                  </p>
                  <p className="small mb-0" style={{ color: 'var(--body-text)' }}>
                    <strong>Comment:</strong> {order.comment || '-'}
                  </p>
                </div>
              </Col>
            </Row>

            <div className="rounded p-3" style={boxStyle}>
              <h5 className="mb-3" style={{ color: 'var(--heading)' }}>
                Products
              </h5>

              {products.length === 0 && (
                <p className="mb-0 small" style={{ color: 'var(--muted-text)' }}>
                  No products in this order.
                </p>
              )}

              {products.map((item) => (
                <div
                  key={item.id}
                  className="d-flex align-items-center gap-3 mb-3 pb-3"
                  style={{ borderBottom: '1px solid var(--line)' }}
                >
                  {item.product?.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: 56, height: 56, objectFit: 'contain' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        background: 'var(--line)',
                        borderRadius: 4,
                      }}
                    />
                  )}

                  <div className="flex-grow-1">
                    <div className="small" style={{ color: 'var(--heading)' }}>
                      {item.product
                        ? item.product.name
                        : 'This product is no longer available'}
                    </div>
                    <div className="small" style={{ color: 'var(--muted-text)' }}>
                      Qty: {item.quantity} · Price: {money(item.price)}
                      {Number(item.discount) > 0
                        ? ` · Discount: ${money(item.discount)}`
                        : ''}
                    </div>
                  </div>

                  <div className="fw-semibold small" style={{ color: PINK }}>
                    {money(Number(item.price) * Number(item.quantity))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </Container>
    </PageLayout>
  )
}

export default OrderDetails
