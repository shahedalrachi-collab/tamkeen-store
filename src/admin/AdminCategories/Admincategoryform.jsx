import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router'
import AdminLayout from '../Adminlayout'
import AdminModal from '../Adminmodal'
import { AdminCategoryService } from '../../Services/Admincategoryservice'

const AdminCategoryForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ en_name: '', ar_name: '', image: null })
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!isEdit) return

    AdminCategoryService.GetCategory(id)
      .then((category) => {
        setForm((old) => ({ ...old, en_name: category.name || '' }))
        setPreview(category.image || '')
      })
      .catch((err) => setError(err.message))
  }, [id, isEdit])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setForm({ ...form, image: file })
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const request = isEdit
      ? AdminCategoryService.UpdateCategory(id, form)
      : AdminCategoryService.AddCategory(form)

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
    <AdminLayout title={isEdit ? 'Edit category' : 'Add category'}>
      <form className="admin-card" onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
        <label className="admin-label mt-0" htmlFor="en_name">
          {isEdit ? 'Name' : 'Name (English)'}
        </label>
        <input
          id="en_name"
          name="en_name"
          className="admin-input"
          value={form.en_name}
          onChange={handleChange}
          required
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
              required
            />
          </>
        )}

        <label className="admin-label" htmlFor="image">Image</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className="admin-input"
          onChange={handleImage}
        />
        {preview && (
          <img
            src={preview}
            alt="Category"
            className="mt-2 rounded"
            style={{ width: '100%', maxWidth: 320, display: 'block' }}
          />
        )}

        {error && <div className="alert alert-warning mt-3 mb-0">{error}</div>}

        <div className="d-flex gap-2 mt-3">
          <button className="admin-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <Link to="/admin/categories" className="admin-btn-outline text-decoration-none">
            Cancel
          </Link>
        </div>
      </form>

      <AdminModal
        show={successMessage !== ''}
        type="success"
        message={successMessage}
        onClose={() => navigate('/admin/categories')}
      />
    </AdminLayout>
  )
}

export default AdminCategoryForm