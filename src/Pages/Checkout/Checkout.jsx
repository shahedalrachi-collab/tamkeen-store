import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Container, Row, Col } from 'react-bootstrap'

import PageLayout from '../../layout/PageLayout'
import AddressSelect from '../../props/AddressSelect'
import SuccessModal from '../../Components/Shared/SuccessModal'
import { OrderService } from '../../Services/OrderService'
import { useCart } from '../../Context/CartContext'

const PINK = '#f0345d'
const money = (n) => `$${Number(n).toFixed(2)}`

const panelInput = {
  background: 'rgba(255,255,255,0.12)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.3)',
}

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, subtotal, discount, tax, total, loadCart, coupon, applyCoupon, removeCoupon } = useCart()

  const isLoggedIn = !!localStorage.getItem('auth_token')

  const [addressId, setAddressId] = useState('')
  const [note, setNote] = useState('')
  const [couponInput, setCouponInput] = useState(coupon ? coupon.code : '')
  const [couponMessage, setCouponMessage] = useState('')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const handleApplyCoupon = () => {
    setCouponMessage('')
    if (!couponInput.trim()) return
    if (!applyCoupon(couponInput)) {
      setCouponMessage('This coupon is not available.')
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponInput('')
    setCouponMessage('')
  }

  const handleConfirm = () => {
    setSaving(true)
    setError('')
    setFieldErrors({})

    const orderData = { payment_type: 'CASH', address_id: addressId }
    if (note.trim()) orderData.note = note.trim()
    if (coupon) orderData.coupon_code = coupon.code

    OrderService.CreateOrder(orderData)
      .then(() => loadCart())
      .then(() => {
        removeCoupon()
        setShowSuccess(true)
      })
      .catch((err) => {
        if (err instanceof TypeError) {
          setError("Can't reach the server. Check your internet connection and try again.")
          return
        }
        setFieldErrors(err.errors || {})
        setError(err.message)
      })
      .finally(() => setSaving(false))
  }

  if (!isLoggedIn) {
    return (
      <PageLayout>
        <Container className="py-5 text-center" style={{ color: 'var(--body-text)' }}>
          <p className="mb-3">Please log in to continue to checkout.</p>
          <Link to="/login" className="btn text-white" style={{ backgroundColor: PINK }}>
            Login
          </Link>
        </Container>
      </PageLayout>
    )
  }

  if (cartItems.length === 0 && !showSuccess) {
    return (
      <PageLayout>
        <Container className="py-5 text-center" style={{ color: 'var(--body-text)' }}>
          <p className="mb-3">Your cart is empty.</p>
          <Link to="/products" className="btn text-white" style={{ backgroundColor: PINK }}>
            Start shopping
          </Link>
        </Container>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <Container className="py-4">
        <Row className="g-0 rounded overflow-hidden">

          <Col
            lg={6}
            className="p-4 p-lg-5 text-white"
            style={{ background: 'linear-gradient(135deg, #3b1717, #7a2a2a)' }}
          >
            <h5 className="mb-1">Payment Method</h5>
            <p className="small opacity-75 mb-3">Pick your payment method</p>

                        <div className="d-flex justify-content-between align-items-center py-2 mb-4">
              <span>Cash</span>
              <span
                style={{ width: 22, height: 22, borderRadius: '50%', background: PINK }}
                aria-label="Selected"
              ></span>
            </div>

                        <label className="small mb-1">Delivery address</label>
            <div className="mb-4">
              <AddressSelect selectedId={addressId} onSelect={setAddressId} />
            </div>

                        <label className="small mb-1" htmlFor="order-note">Note (optional)</label>
            <textarea
              id="order-note"
              className="form-control mb-4"
              style={{ ...panelInput, resize: 'none' }}
              rows={2}
              placeholder="Anything we should know?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

                        <label className="small mb-1" htmlFor="order-coupon">Discount Code</label>
            <div className="d-flex gap-2">
              <input
                id="order-coupon"
                className="form-control"
                style={panelInput}
                placeholder="Enter your code"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                disabled={!!coupon}
              />
              {coupon ? (
                <button
                  type="button"
                  className="btn"
                  style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.5)' }}
                  onClick={handleRemoveCoupon}
                >
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  className="btn text-white"
                  style={{ backgroundColor: PINK }}
                  onClick={handleApplyCoupon}
                >
                  Apply
                </button>
              )}
            </div>
            {coupon && (
              <small style={{ color: '#7ee2a8' }}>Coupon applied: {coupon.percent}% off</small>
            )}
            {couponMessage && <small className="text-warning">{couponMessage}</small>}
            {fieldErrors.coupon_code && (
              <small className="text-warning">{fieldErrors.coupon_code[0]}</small>
            )}
          </Col>

          <Col
            lg={6}
            className="p-4 p-lg-5"
            style={{ background: 'var(--surface-soft)', color: 'var(--body-text)' }}
          >
            {cartItems.map((item) => (
              <div key={item.id} className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  style={{ width: 60, height: 60, objectFit: 'contain' }}
                />
                <div className="flex-grow-1">
                  <div className="fw-semibold small" style={{ color: 'var(--heading)' }}>
                    {item.product.name}
                  </div>
                  <div className="small" style={{ color: 'var(--muted-text)' }}>
                    Qty: {item.quantity}
                  </div>
                </div>
                <div className="fw-semibold" style={{ color: PINK }}>
                  {money(Number(item.product.price) * item.quantity)}
                </div>
              </div>
            ))}

            <Link to="/cart" className="small" style={{ color: PINK }}>
              Edit cart
            </Link>

            <div className="mt-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Total</span>
                <span>{money(subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Discount</span>
                <span>{money(discount)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Tax</span>
                <span>{money(tax)}</span>
              </div>

              <hr style={{ borderColor: 'var(--line)', opacity: 1 }} />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fs-5" style={{ color: 'var(--heading)' }}>Net Total</span>
                <span className="fs-4 fw-semibold" style={{ color: PINK }}>{money(total)}</span>
              </div>

              <button
                type="button"
                className="btn w-100 text-white py-2 fw-semibold"
                style={{ backgroundColor: PINK }}
                onClick={handleConfirm}
                disabled={saving || !addressId || cartItems.length === 0}
              >
                {saving ? 'Processing...' : 'Confirm Payment'}
              </button>

              {!addressId && (
                <div className="small mt-2" style={{ color: 'var(--muted-text)' }}>
                  Choose or add a delivery address to continue.
                </div>
              )}

              {error && <div className="alert alert-warning mt-3 mb-0">{error}</div>}
            </div>
          </Col>
        </Row>
      </Container>

            <SuccessModal
        show={showSuccess}
        onClose={() => navigate('/orders')}
        message="your order has been placed successfully"
      />
    </PageLayout>
  )
}

export default Checkout