
import { Link } from 'react-router'
const Discount = () => {
  return (
    <>

    <div className="discount-banner d-flex flex-wrap align-items-center justify-content-between gap-3 mt-4">
          <div>
            <h3 className="discount-title">Super discount on more than 100 USD</h3>
            <p className="discount-text">Have you ever finally just write dummy info</p>
          </div>
          <Link to="/products" className="discount-btn">Shop now</Link>
        </div>

    </>
  )
}

export default Discount