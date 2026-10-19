import { Link, useNavigate } from 'react-router'
import { Row, Col, Container } from 'react-bootstrap'
import { FaCaretLeft } from 'react-icons/fa'

import SettingLayout from '../../layout/SettingLayout'
import FavoriteButton from '../../props/Favoritebutton'
import { useFavorites } from '../../Context/Favoritescontext'

const PINK = '#f0345d'

const Favorites = () => {
  const navigate = useNavigate()
  const { favorites, loading } = useFavorites()

  const isLoggedIn = !!localStorage.getItem('auth_token')

  return (
    <SettingLayout>
        <Container className="py-5">
              <div
        className="d-flex align-items-center gap-3 px-4 text-white"
        style={{
          height: 54,
          borderRadius: '8px 8px 0 0',
          background: 'linear-gradient(90deg, #f3355f, #d89aa8)',
        }}
      >
        <button
          type="button"
          className="border-0 bg-transparent text-white p-0"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <FaCaretLeft size={24} />
        </button>
        <span className="small">Favorites</span>
      </div>

      <div
        className="p-4"
        style={{
          background: 'var(--surface)',
          color: 'var(--body-text)',
          borderRadius: '0 0 8px 8px',
          minHeight: 250,
        }}
      >
                {!isLoggedIn && (
          <div className="text-center my-5">
            <p className="mb-3">Please log in to see your favorites.</p>
            <Link to="/login" className="btn text-white" style={{ backgroundColor: PINK }}>
              Login
            </Link>
          </div>
        )}

        {isLoggedIn && loading && <p className="text-center my-5">Loading...</p>}

                {isLoggedIn && !loading && favorites.length === 0 && (
          <div className="text-center my-5">
            <p className="mb-3">You have no favorites yet.</p>
            <Link to="/products" className="btn text-white" style={{ backgroundColor: PINK }}>
              Start shopping
            </Link>
          </div>
        )}

                {isLoggedIn && !loading && favorites.length > 0 && (
          <Row xs={1} sm={2} lg={4} className="g-3">
            {favorites.map((item) => (
              <Col key={item.product.id}>
                <div
                  className="rounded h-100 p-2"
                  style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}
                >
                  <Link to={`/products/${item.product.id}`}>
                    <div
                      className="d-flex align-items-center justify-content-center rounded mb-3"
                      style={{ background: 'var(--surface-soft)', height: 190 }}
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        style={{ maxWidth: '85%', maxHeight: '90%', objectFit: 'contain' }}
                      />
                    </div>
                  </Link>

                  <div className="d-flex justify-content-between align-items-start">
                    <div className="fw-semibold" style={{ color: 'var(--heading)' }}>
                      ${Number(item.product.price).toFixed(2)}
                    </div>
                    <FavoriteButton productId={item.product.id} />
                  </div>

                  <Link
                    to={`/products/${item.product.id}`}
                    className="text-decoration-none"
                    style={{ color: 'var(--heading)' }}
                  >
                    {item.product.name}
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </div>

        </Container>

    </SettingLayout>
  )
}

export default Favorites