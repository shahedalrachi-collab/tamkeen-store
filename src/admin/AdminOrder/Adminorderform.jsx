import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import AdminLayout from '../Adminlayout'
import AdminModal from '../Adminmodal'
import { AdminOrderService } from '../../Services/Adminorderservice'

const AdminOrderForm = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({ customer_id: '', address_id: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    AdminOrderService.AddOrder(form)
      .then((response) => {
        setCreated({ message: response.message, id: response.data.id })
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
    <AdminLayout title="Add order">
      <form className="admin-card" onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <label className="admin-label mt-0" htmlFor="customer_id">Customer ID</label>
        <input
          id="customer_id"
          name="customer_id"
          type="number"
          className="admin-input"
          value={form.customer_id}
          onChange={handleChange}
          required
        />

        <label className="admin-label" htmlFor="address_id">Address ID</label>
        <input
          id="address_id"
          name="address_id"
          type="number"
          className="admin-input"
          value={form.address_id}
          onChange={handleChange}
          required
        />

        {error && <div className="alert alert-warning mt-3 mb-0">{error}</div>}

        <div className="d-flex gap-2 mt-3">
          <button className="admin-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
          <Link to="/admin/orders" className="admin-btn-outline text-decoration-none">
            Cancel
          </Link>
        </div>
      </form>

            <AdminModal
        show={created !== null}
        type="success"
        message={created ? created.message : ''}
        onClose={() => navigate(`/admin/orders/${created.id}`)}
      />
    </AdminLayout>
  )
}

export default AdminOrderForm