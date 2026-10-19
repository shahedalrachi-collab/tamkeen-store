import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import AdminLayout from '../Adminlayout'
import AdminModal from '../Adminmodal'
import { AdminProductService } from '../../Services/Adminproductservice'
import { AdminCategoryService } from '../../Services/Admincategoryservice'

const AdminProductForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    ar_name: '',
    ar_description: '',
    en_name: '',
    en_description: '',
    sku: '',
    category_id: '',
    price: '',
  })
  const [original, setOriginal] = useState({})
  const [image, setImage] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    AdminCategoryService.GetAllCategories()
      .then((list) => setCategories(list))
      .catch((err) => console.log(err.message))
  }, [])

  useEffect(() => {
    if (!isEdit) return

    AdminProductService.GetProduct(id)
      .then((product) => {
        const loaded = {
          en_name: product.name || '',
          en_description: product.description || '',
          sku: product.sku || '',
          category_id: product.category ? product.category.id : '',
          price: product.price,
        }
        setOriginal(loaded)
        setForm((old) => ({ ...old, ...loaded }))
      })
      .catch((err) => setError(err.message))
  }, [id, isEdit])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const request = isEdit
      ? AdminProductService.UpdateProduct(id, form, original)
      : AdminProductService.AddProduct({ ...form, image })

    request
      .then((response) => {

        setSuccessMessage(response.message || 'Saved successfully')
      })
      .catch((err) => {

        const firstFieldError = Object.values(err.errors || {})[0]
        setError(firstFieldError ? firstFieldError[0] : err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <AdminLayout title={isEdit ? 'Edit product' : 'Add product'}>
      <form className="admin-card" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <label className="admin-label" htmlFor="en_name">{isEdit ? 'Name' : 'Name (English)'}</label>
        <input
          id="en_name"
          name="en_name"
          className="admin-input"
          value={form.en_name}
          onChange={handleChange}
          required={!isEdit}
        />

        {!isEdit && (
          <>
        <label className="admin-label" htmlFor="ar_name">Name (Arabic)</label>
        <input
          id="ar_name"
          name="ar_name"
          className="admin-input"
          value={form.ar_name}
          onChange={handleChange}
          required={!isEdit}
        />
          </>
        )}

        <label className="admin-label" htmlFor="en_description">{isEdit ? 'Description' : 'Description (English)'}</label>
        <textarea
          id="en_description"
          name="en_description"
          rows="3"
          className="admin-input"
          value={form.en_description}
          onChange={handleChange}
          required={!isEdit}
        />

        {!isEdit && (
          <>
        <label className="admin-label" htmlFor="ar_description">Description (Arabic)</label>
        <textarea
          id="ar_description"
          name="ar_description"
          rows="3"
          className="admin-input"
          value={form.ar_description}
          onChange={handleChange}
          required={!isEdit}
        />
          </>
        )}

        <label className="admin-label" htmlFor="sku">SKU</label>
        <input
          id="sku"
          name="sku"
          className="admin-input"
          value={form.sku}
          onChange={handleChange}
          required
        />

        <label className="admin-label" htmlFor="category_id">Category</label>
        <select
          id="category_id"
          name="category_id"
          className="admin-input"
          value={form.category_id}
          onChange={handleChange}
          required={!isEdit}
        >
          <option value="">Choose a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <label className="admin-label" htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          className="admin-input"
          value={form.price}
          onChange={handleChange}
          required
        />

                {!isEdit && (
          <>
            <label className="admin-label" htmlFor="image">Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              className="admin-input"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </>
        )}

        {error && <div className="alert alert-warning mt-3 mb-0">{error}</div>}

        <div className="d-flex gap-2 mt-3">
          <button className="admin-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <Link to="/admin/products" className="admin-btn-outline text-decoration-none">
            Cancel
          </Link>
        </div>
      </form>

      <AdminModal
        show={successMessage !== ''}
        type="success"
        message={successMessage}
        onClose={() => navigate('/admin/products')}
      />
    </AdminLayout>
  )
}

export default AdminProductForm