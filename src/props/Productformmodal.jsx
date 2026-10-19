import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { ProductService } from '../Services/ProductService'
import { MyProductService } from '../Services/Myproductservice'

const PINK = '#f0345d'

const fieldStyle = {
  background: 'var(--surface-soft)',
  color: 'var(--heading)',
  border: '1px solid var(--line)',
}

const ProductFormModal = ({ show, product, onClose, onSaved }) => {
  const isEdit = !!product

  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '' })
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    ProductService.GetAllCategories()
      .then((list) => setCategories(list))
      .catch((err) => console.log(err.message))
  }, [])

  useEffect(() => {
    if (!show) return

    setError('')
    setFieldErrors({})
    setImage(null)

    if (product) {

      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price ?? '',
        category_id: product.category ? product.category.id : '',
      })
    } else {

      setForm({ name: '', description: '', price: '', category_id: '' })
    }
  }, [show, product])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFieldErrors({})

    const request = isEdit
      ? MyProductService.UpdateProduct(product.id, form)
      : MyProductService.AddProduct({ ...form, image: image })

    request
      .then(() => {
        onSaved(
          isEdit
            ? 'your product has been updated successfully'
            : 'your product has been added successfully'
        )
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

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-5">{isEdit ? 'Edit product' : 'Add product'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={handleSubmit}>
                    <label className="small mb-1" htmlFor="product-name">Name</label>
          <input
            id="product-name"
            name="name"
            className="form-control mb-1"
            style={fieldStyle}
            value={form.name}
            onChange={handleChange}
            required
          />
          {fieldErrors.name && <small className="text-danger">{fieldErrors.name[0]}</small>}

                    <label className="small mb-1 mt-3" htmlFor="product-description">Description</label>
          <textarea
            id="product-description"
            name="description"
            className="form-control mb-1"
            style={{ ...fieldStyle, resize: 'none' }}
            rows={3}
            value={form.description}
            onChange={handleChange}
          />
          {fieldErrors.description && (
            <small className="text-danger">{fieldErrors.description[0]}</small>
          )}

          <div className="row g-3 mt-0">
                        <div className="col-md-6">
              <label className="small mb-1" htmlFor="product-price">Price ($)</label>
              <input
                id="product-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                className="form-control"
                style={fieldStyle}
                value={form.price}
                onChange={handleChange}
              />
              {fieldErrors.price && <small className="text-danger">{fieldErrors.price[0]}</small>}
            </div>

                        <div className="col-md-6">
              <label className="small mb-1" htmlFor="product-category">Category</label>
              <select
                id="product-category"
                name="category_id"
                className="form-select"
                style={fieldStyle}
                value={form.category_id}
                onChange={handleChange}
                required
              >
                <option value="">Choose a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {fieldErrors.category_id && (
                <small className="text-danger">{fieldErrors.category_id[0]}</small>
              )}
            </div>
          </div>

                    <label className="small mb-1 mt-3" htmlFor="product-image">Image</label>
          {isEdit ? (
            <div className="d-flex align-items-center gap-3">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: 60, height: 60, objectFit: 'contain' }}
                />
              )}
              <small style={{ color: 'var(--muted-text)' }}>
                Changing the image is not available yet.
              </small>
            </div>
          ) : (
            <input
              id="product-image"
              type="file"
              accept="image/*"
              className="form-control"
              style={fieldStyle}
              onChange={(e) => setImage(e.target.files[0] || null)}
            />
          )}
          {fieldErrors.image && <small className="text-danger">{fieldErrors.image[0]}</small>}

          <button
            type="submit"
            className="btn w-100 text-white mt-4"
            style={{ backgroundColor: PINK }}
            disabled={saving}
          >
            {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add product'}
          </button>

          {error && <div className="alert alert-warning mt-3 mb-0">{error}</div>}
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ProductFormModal