import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useCart } from '../Context/CartContext'

const PINK = '#f0345d'
const money = (n) => `$${Number(n).toFixed(2)}`

const boxStyle = { background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--body-text)' }
const mutedStyle = { color: 'var(--muted-text)' }

const CartSummary = () => {
  const { cartItems, subtotal, discount, tax, total, coupon, applyCoupon, removeCoupon } = useCart()
  const navigate = useNavigate()

  const [couponInput, setCouponInput] = useState(coupon ? coupon.code : '')
  const [couponError, setCouponError] = useState('')

  const handleApplyCoupon = () => {
    setCouponError('')

    if (!couponInput.trim()) {
      removeCoupon()
      return
    }

    if (!applyCoupon(couponInput)) {
      setCouponError('This coupon is not available.')
    }
  }

  const handleRemoveCoupon = () => {
    removeCoupon()
    setCouponInput('')
    setCouponError('')
  }

  return (
    <>
            <div className="rounded p-3 mb-3" style={boxStyle}>
        <div className="small mb-2" style={mutedStyle}>Have a coupon?</div>

        <div
          className="d-flex rounded overflow-hidden"
          style={{ border: '1px solid var(--line)' }}
        >
          <input
            className="form-control border-0 shadow-none"
            style={{ background: 'transparent', color: 'var(--heading)' }}
            placeholder="Add coupon"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            disabled={!!coupon}
          />

          {coupon ? (
            <button
              type="button"
              className="btn border-0 rounded-0"
              style={{ background: 'transparent', color: PINK, borderLeft: '1px solid var(--line)' }}
              onClick={handleRemoveCoupon}
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              className="btn border-0 rounded-0"
              style={{ background: 'transparent', color: PINK, borderLeft: '1px solid var(--line)' }}
              onClick={handleApplyCoupon}
            >
              Apply
            </button>
          )}
        </div>

        {coupon && (
          <div className="small mt-2 text-success">Coupon applied: {coupon.percent}% off</div>
        )}
        {couponError && <div className="small mt-2 text-danger">{couponError}</div>}
      </div>

            <div className="rounded p-3" style={boxStyle}>
        <div className="d-flex justify-content-between mb-2">
          <span style={mutedStyle}>Subtotal:</span>
          <span>{money(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="d-flex justify-content-between mb-2">
            <span style={mutedStyle}>Discount ({coupon.percent}%):</span>
            <span className="text-danger">- {money(discount)}</span>
          </div>
        )}

        {tax > 0 && (
          <div className="d-flex justify-content-between mb-2">
            <span style={mutedStyle}>Tax:</span>
            <span className="text-success">+ {money(tax)}</span>
          </div>
        )}

        <hr style={{ borderColor: 'var(--line)', opacity: 1 }} />

        <div className="d-flex justify-content-between align-items-center mb-3">
          <strong style={{ color: 'var(--heading)' }}>Total:</strong>
          <strong className="fs-4" style={{ color: 'var(--heading)' }}>{money(total)}</strong>
        </div>

        <button
          type="button"
          className="btn w-100 text-white fw-semibold py-2"
          style={{ backgroundColor: '#00b517' }}
          disabled={cartItems.length === 0}
          onClick={() => navigate('/checkout')}
        >
          Checkout
        </button>
      </div>
    </>
  )
}

export default CartSummary