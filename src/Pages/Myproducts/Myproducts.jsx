import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Row, Col, Container } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { FaCaretLeft } from 'react-icons/fa'

import SettingLayout from '../../layout/SettingLayout'
import ProductFormModal from '../../props/ProductFormModal'
import SuccessModal from '../../Components/Shared/SuccessModal'
import { MyProductService } from '../../Services/Myproductservice'

const PINK = '#f0345d'

const Myproducts = () => {
  const navigate = useNavigate()
  const isLoggedIn = !!localStorage.getItem('auth_token')

  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [formProduct, setFormProduct] = useState(null)
  const [editingId, setEditingId] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const [successMessage, setSuccessMessage] = useState('')

  const loadProducts = (pageNumber) => {
    setLoading(true)
    setError('')

    return MyProductService.GetMyProducts(pageNumber)
      .then((data) => {
        setProducts(data.data)
        setLastPage(data.meta.last_page)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false)
      return
    }
    loadProducts(page)
  }, [page])

  const handleAdd = () => {
    setFormProduct(null)
    setShowForm(true)
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setError('')

    MyProductService.GetProduct(product.id)
      .then((fullProduct) => {
        setFormProduct(fullProduct)
        setShowForm(true)
      })
      .catch((err) => setError(err.message))
      .finally(() => setEditingId(null))
  }

  const handleSaved = (message) => {
    setShowForm(false)
    setSuccessMessage(message)
    loadProducts(page)
  }

  const handleConfirmDelete = () => {
    setDeleting(true)
    setDeleteError('')

    MyProductService.DeleteProduct(deleteTarget.id)
      .then(() => {
        setDeleteTarget(null)
        setSuccessMessage('your product has been deleted successfully')

        if (products.length === 1 && page > 1) {
          setPage(page - 1)
        } else {
          loadProducts(page)
        }
      })
      .catch((err) => setDeleteError(err.message))
      .finally(() => setDeleting(false))
  }

  if (!isLoggedIn) {
    return (
      <SettingLayout>
        <div
          className="rounded p-5 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--body-text)' }}
        >
          <p className="mb-3">Please log in to see your products.</p>
          <Link to="/login" className="btn text-white" style={{ backgroundColor: PINK }}>
            Login
          </Link>
        </div>
      </SettingLayout>
    )
  }

  return (
    <SettingLayout>
        <Container className="py-5">
                     <div
        className="d-flex align-items-center justify-content-between gap-3 px-4 text-white"
        style={{
          height: 54,
          borderRadius: '8px 8px 0 0',
          background: 'linear-gradient(90deg, #f3355f, #d89aa8)',
        }}
      >
        <div className="d-flex align-items-center gap-3">
          <button
            type="button"
            className="border-0 bg-transparent text-white p-0"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <FaCaretLeft size={24} />
          </button>
          <span className="small">My products</span>
        </div>

        <button
          type="button"
          className="btn btn-sm"
          style={{ background: 'transparent', color: '#fff', border: '1px solid #fff' }}
          onClick={handleAdd}
        >
          + Add product
        </button>
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
        {loading && <p className="text-center my-5">Loading...</p>}

        {error && <p className="text-center text-danger my-3">{error}</p>}

                {!loading && !error && products.length === 0 && (
          <div className="text-center my-5">
            <p className="mb-3">You have no products yet.</p>
            <button
              type="button"
              className="btn text-white"
              style={{ backgroundColor: PINK }}
              onClick={handleAdd}
            >
              Add your first product
            </button>
          </div>
        )}

                {!loading && products.length > 0 && (
          <Row xs={1} sm={2} lg={3} className="g-3">
            {products.map((product) => (
              <Col key={product.id}>
                <div
                  className="rounded h-100 p-2 d-flex flex-column"
                  style={{ border: '1px solid var(--line)', background: 'var(--surface)' }}
                >
                  <Link to={`/products/${product.id}`}>
                    <div
                      className="d-flex align-items-center justify-content-center rounded mb-2"
                      style={{ background: 'var(--surface-soft)', height: 180 }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{ maxWidth: '85%', maxHeight: '90%', objectFit: 'contain' }}
                        />
                      ) : (
                        <span className="small" style={{ color: 'var(--muted-text)' }}>No image</span>
                      )}
                    </div>
                  </Link>

                  <div className="fw-semibold" style={{ color: 'var(--heading)' }}>
                    {product.name}
                  </div>
                  <div className="small" style={{ color: 'var(--muted-text)' }}>
                    {product.category ? product.category.name : 'No category'}
                  </div>
                  <div className="fw-semibold mb-2" style={{ color: PINK }}>
                    ${Number(product.price).toFixed(2)}
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    <button
                      type="button"
                      className="btn btn-sm"
                      style={{ background: 'transparent', color: PINK, border: `1px solid ${PINK}` }}
                      onClick={() => handleEdit(product)}
                      disabled={editingId === product.id}
                    >
                      {editingId === product.id ? 'Loading...' : 'Edit'}
                    </button>

                    <button
                      type="button"
                      className="btn btn-sm text-white"
                      style={{ backgroundColor: '#dc3545' }}
                      onClick={() => {
                        setDeleteError('')
                        setDeleteTarget(product)
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

                {lastPage > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button
              type="button"
              className="btn btn-sm"
              style={{ background: 'transparent', color: PINK, border: `1px solid ${PINK}` }}
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>

            <span className="small">Page {page} of {lastPage}</span>

            <button
              type="button"
              className="btn btn-sm"
              style={{ background: 'transparent', color: PINK, border: `1px solid ${PINK}` }}
              onClick={() => setPage(page + 1)}
              disabled={page === lastPage}
            >
              Next
            </button>
          </div>
        )}
      </div>

            <ProductFormModal
        show={showForm}
        product={formProduct}
        onClose={() => setShowForm(false)}
        onSaved={handleSaved}
      />

            <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">Delete product</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete <strong>{deleteTarget?.name}</strong>?
          {deleteError && <div className="alert alert-warning mt-3 mb-0">{deleteError}</div>}
        </Modal.Body>

        <Modal.Footer>
          <button
            type="button"
            className="btn btn-sm"
            style={{ background: 'transparent', color: PINK, border: `1px solid ${PINK}` }}
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-sm text-white"
            style={{ backgroundColor: '#dc3545' }}
            onClick={handleConfirmDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </Modal.Footer>
      </Modal>

            <SuccessModal
        show={!!successMessage}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />

        </Container>

    </SettingLayout>
  )
}

export default Myproducts