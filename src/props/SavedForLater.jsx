import { Row, Col } from 'react-bootstrap'
import { FiShoppingCart } from 'react-icons/fi'
import { useCart } from '../Context/CartContext'

const PINK = '#f0345d'

const SavedForLater = () => {
  const { savedItems, moveToCart, removeSaved } = useCart()

  return (
    <div
      className="rounded p-3 mt-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--line)' }}
    >
      <h5 className="mb-3" style={{ color: 'var(--heading)' }}>Saved for later</h5>

      {savedItems.length === 0 ? (
        <p className="mb-0" style={{ color: 'var(--muted-text)' }}>
          Nothing saved yet. Use "Save for later" on an item in your cart.
        </p>
      ) : (
        <Row xs={2} lg={4} className="g-3">
          {savedItems.map((item) => (
            <Col key={item.productId}>
              <div
                className="d-flex align-items-center justify-content-center rounded mb-2"
                style={{ background: 'var(--surface-soft)', height: 180 }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ maxWidth: '80%', maxHeight: '85%', objectFit: 'contain' }}
                />
              </div>

              <div className="fw-semibold" style={{ color: 'var(--heading)' }}>
                ${item.price.toFixed(2)}
              </div>
              <div className="small mb-2" style={{ color: 'var(--muted-text)' }}>{item.name}</div>

              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm d-inline-flex align-items-center gap-1"
                  style={{ background: 'transparent', color: PINK, border: `1px solid ${PINK}` }}
                  onClick={() => moveToCart(item)}
                >
                  <FiShoppingCart /> Move to cart
                </button>

                <button
                  type="button"
                  className="btn btn-sm btn-link"
                  style={{ color: 'var(--muted-text)' }}
                  onClick={() => removeSaved(item.productId)}
                >
                  Delete
                </button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}

export default SavedForLater