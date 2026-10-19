import { useEffect } from 'react'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Button from 'react-bootstrap/Button'
import { FaShoppingBag, FaTrash, FaMinus, FaPlus } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router'
import { useCart } from '../Context/CartContext'

const PINK = '#f0345d'

const CartOffcanvas = ({ show, onHide }) => {
  const navigate = useNavigate()
  const {
    cartItems,
    loadCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    subtotal,
  } = useCart()

  useEffect(() => {
    if (show) loadCart()
  }, [show])

  const handleCheckout = () => {
    onHide()
    navigate('/checkout')
  }

  const handleViewCart = () => {
    onHide()
    navigate('/cart')
  }

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" style={{ width: 420, maxWidth: '100vw' }}>
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title>Your Shopping Bag</Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body className="d-flex flex-column">
        {cartItems.length === 0 ? (
          <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mb-2"
              style={{ width: 120, height: 120, background: 'rgba(240, 52, 93, 0.12)', color: PINK }}
            >
              <FaShoppingBag size={52} />
            </div>

            <h5 className="mb-0">Your cart is empty</h5>
            <p className="mb-3" style={{ color: 'var(--muted-text)' }}>Looks like you haven't added anything yet.</p>

            <Button
              style={{ backgroundColor: PINK, borderColor: PINK }}
              onClick={() => {
                onHide()
                navigate('/products')
              }}
            >
              Start shopping
            </Button>
          </div>
        ) : (
          <>

            <div className="flex-grow-1 overflow-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="d-flex align-items-center gap-3 py-3 border-bottom">

                  <Link to={`/products/${item.product.id}`} onClick={onHide}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: 70, height: 70, objectFit: 'contain' }}
                    />
                  </Link>

                  <div className="flex-grow-1">
                    <h6 className="mb-2">
                      <Link
                        to={`/products/${item.product.id}`}
                        onClick={onHide}
                        className="text-decoration-none"
                        style={{ color: 'var(--heading)' }}
                      >
                        {item.product.name}
                      </Link>
                    </h6>

                    <div className="d-inline-flex align-items-center gap-3 border rounded px-2 py-1">
                      <button
                        type="button"
                        className="border-0 bg-transparent p-0"
                        style={{ color: PINK }}
                        onClick={() => decreaseQuantity(item)}
                      >
                        <FaMinus size={10} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        className="border-0 bg-transparent p-0"
                        style={{ color: PINK }}
                        onClick={() => increaseQuantity(item)}
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>
                  </div>

                  <div className="d-flex flex-column align-items-end gap-2">
                    <span className="fw-semibold" style={{ color: PINK }}>
                      ${Number(item.product.price) * item.quantity}
                    </span>
                    <button
                      type="button"
                      className="border-0 rounded px-2 py-1"
                      style={{ background: 'var(--deal-bg)', color: PINK }}
                      onClick={() => removeFromCart(item)}
                      aria-label="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-top pt-3">
              <div className="d-flex justify-content-between mb-3 fs-5">
                <span>SubTotal :</span>
                <strong style={{ color: PINK }}>${subtotal}</strong>
              </div>
              <Button
                className="w-100 py-2 mb-2"
                style={{ background: 'transparent', color: PINK, border: `1px solid ${PINK}` }}
                onClick={handleViewCart}
              >
                View full cart
              </Button>

              <Button
                className="w-100 py-2"
                style={{ backgroundColor: PINK, borderColor: PINK }}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          </>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  )
}

export default CartOffcanvas