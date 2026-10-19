import { Container, Row, Col } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import { FiArrowLeft, FiLock, FiMessageSquare, FiTruck } from 'react-icons/fi'
import { FaShoppingBag } from 'react-icons/fa'

import CartLayout from '../../layout/CartLayout'
import CartSummary from '../../props/CartSummary'
import SavedForLater from '../../props/SavedForLater'
import { useCart } from '../../Context/CartContext'

const PINK = '#f0345d'
const money = (n) => `$${Number(n).toFixed(2)}`

const boxStyle = { background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--body-text)' }
const rowStyle = { borderBottom: '1px solid var(--line)' }
const outlineButton = { background: 'transparent', color: PINK, border: `1px solid ${PINK}` }

const trustItems = [
  { icon: <FiLock />, title: 'Secure payment', text: 'Your payment details are protected' },
  { icon: <FiMessageSquare />, title: 'Customer support', text: 'We are here to help you' },
  { icon: <FiTruck />, title: 'Free delivery', text: 'On orders over $50' },
]

const CartPage = () => {
  const navigate = useNavigate()
  const { cartItems, setQuantity, removeFromCart, saveForLater, removeAll } = useCart()

  const isLoggedIn = !!localStorage.getItem('auth_token')

  const quantityOptions = (current) => {
    const max = Math.max(10, current)
    return Array.from({ length: max }, (_, i) => i + 1)
  }

  return (
    <CartLayout>
      <Container className="py-4">
        <h4 className="mb-3" style={{ color: 'var(--heading)' }}>My cart ({cartItems.length})</h4>

        {!isLoggedIn ? (
          <div className="rounded p-5 text-center" style={boxStyle}>
            <p className="mb-3">Please log in to see your cart.</p>
            <Link to="/login" className="btn text-white" style={{ backgroundColor: PINK }}>
              Login
            </Link>
          </div>
        ) : (
          <Row className="g-3">

            <Col lg={9}>
              <div className="rounded" style={boxStyle}>
                {cartItems.length === 0 ? (
                  <div className="text-center p-5">
                    <FaShoppingBag size={48} style={{ color: PINK }} />
                    <h5 className="mt-3" style={{ color: 'var(--heading)' }}>Your cart is empty</h5>
                    <p style={{ color: 'var(--muted-text)' }}>
                      Looks like you haven't added anything yet.
                    </p>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={item.id} className="d-flex gap-3 p-3" style={rowStyle}>

                      <Link
                        to={`/products/${item.product.id}`}
                        className="rounded d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: 80, height: 80, border: '1px solid var(--line)' }}
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                        />
                      </Link>

                      <div className="flex-grow-1">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="fw-semibold text-decoration-none"
                          style={{ color: 'var(--heading)' }}
                        >
                          {item.product.name}
                        </Link>
                        {item.product.sku && (
                          <div className="small mb-2" style={{ color: 'var(--muted-text)' }}>
                            SKU: {item.product.sku}
                          </div>
                        )}

                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={outlineButton}
                            onClick={() => removeFromCart(item)}
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={outlineButton}
                            onClick={() => saveForLater(item)}
                          >
                            Save for later
                          </button>
                        </div>
                      </div>

                      <div className="text-end">
                        <div className="fw-semibold mb-2" style={{ color: 'var(--heading)' }}>
                          {money(Number(item.product.price) * item.quantity)}
                        </div>
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 100 }}
                          value={item.quantity}
                          onChange={(e) => setQuantity(item, Number(e.target.value))}
                          aria-label="Quantity"
                        >
                          {quantityOptions(item.quantity).map((q) => (
                            <option key={q} value={q}>
                              Qty: {q}
                            </option>
                          ))}
                        </select>
                        {item.quantity > 1 && (
                          <div className="small mt-1" style={{ color: 'var(--muted-text)' }}>
                            {money(item.product.price)} each
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}

                <div className="d-flex justify-content-between align-items-center p-3">
                  <button
                    type="button"
                    className="btn text-white d-inline-flex align-items-center gap-2"
                    style={{ backgroundColor: PINK }}
                    onClick={() => navigate('/products')}
                  >
                    <FiArrowLeft /> Back to shop
                  </button>

                  {cartItems.length > 0 && (
                    <button type="button" className="btn" style={outlineButton} onClick={removeAll}>
                      Remove all
                    </button>
                  )}
                </div>
              </div>
            </Col>

            <Col lg={3}>
              <CartSummary />
            </Col>
          </Row>
        )}

        <Row className="g-3 my-3">
          {trustItems.map((t) => (
            <Col md={4} key={t.title}>
              <div className="d-flex align-items-center gap-3">
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{ width: 40, height: 40, background: 'var(--surface-soft)', color: 'var(--muted-text)' }}
                >
                  {t.icon}
                </span>
                <div>
                  <div className="small fw-semibold" style={{ color: 'var(--heading)' }}>{t.title}</div>
                  <div className="small" style={{ color: 'var(--muted-text)' }}>{t.text}</div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <SavedForLater />

        <div
          className="d-flex flex-wrap align-items-center justify-content-between gap-3 text-white rounded p-4 mt-4"
          style={{ background: 'linear-gradient(90deg, #d6405f, #9b2540)' }}
        >
          <div>
            <h5 className="mb-1">Super discount on more than 100 USD</h5>
            <div className="small opacity-75">Have you ever finally just write dummy info</div>
          </div>
          <Link to="/products" className="btn text-white" style={{ backgroundColor: '#fd8c00' }}>
            Shop now
          </Link>
        </div>
      </Container>
    </CartLayout>
  )
}

export default CartPage