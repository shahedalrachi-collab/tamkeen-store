import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import AdminLayout from '../Adminlayout'
import AdminModal from '../Adminmodal'
import { AdminOrderService } from '../../Services/Adminorderservice'

const statuses = ['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED', 'COMPLETED']

const statusClass = function (status) {
  if (status === 'ACCEPTED') return 'bg-info text-dark'
  if (status === 'COMPLETED') return 'bg-success'
  if (status === 'REJECTED') return 'bg-danger'
  if (status === 'CANCELED') return 'bg-secondary'
  return 'bg-warning text-dark'
}

const AdminOrderDetails = () => {
  const { id } = useParams()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [status, setStatus] = useState('PENDING')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [modal, setModal] = useState({ show: false, type: 'success', message: '' })

  const loadOrder = () => {
    return AdminOrderService.GetOrder(id)
      .then((data) => {
        setOrder(data)
        setStatus(data.status)
        setError('')
        return data
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    loadOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleUpdate = (e) => {
    e.preventDefault()
    setSaving(true)

    AdminOrderService.UpdateOrder(id, { status, notes })
      .then((response) => {
        setNotes('')

        return loadOrder().then((data) => {
          if (data && data.status !== status) {

            setModal({
              show: true,
              type: 'error',
              message: `The status was not changed to ${status}. The order is still ${data.status}.`,
            })
          } else {
            setModal({ show: true, type: 'success', message: response.message })
          }
        })
      })
      .catch((err) => {
        setModal({ show: true, type: 'error', message: err.message })
      })
      .finally(() => {
        setSaving(false)
      })
  }

  return (
    <AdminLayout title="Order details">
      <div className="mb-3">
        <Link to="/admin/orders" className="admin-btn-outline text-decoration-none">
          &larr; Back to orders
        </Link>
      </div>

      {loading && <div className="admin-card">Loading...</div>}

      {error && <div className="alert alert-warning">{error}</div>}

      {order && (
        <>
          <div className="row g-3">

            <div className="col-12 col-lg-6">
              <div className="admin-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Order #{order.id}</h4>
                  <span className={`badge ${statusClass(order.status)}`}>{order.status}</span>
                </div>

                <p className="mb-1">Payment: {order.payment_type} &middot; {order.payment_status}</p>
                <p className="mb-1">Subtotal: {order.subtotal}</p>
                <p className="mb-1">Discount: {order.discount}</p>
                <p className="mb-1">Shipping: {order.shipping}</p>
                <p className="mb-1">Total: {order.total}</p>
                <p className="mb-1"><strong>Grand total: {order.grand_total}</strong></p>
                <p className="mb-1">Coupon: {order.coupon ? `${order.coupon.name} (${order.coupon.code})` : '-'}</p>
                <p className="mb-0">Comment: {order.comment || '-'}</p>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="admin-card h-100">
                <h5>Customer</h5>
                <p>{order.customer ? `#${order.customer.id}` : '-'}</p>

                <h5>Address</h5>
                {!order.address && <p className="mb-0">No address</p>}
                {order.address && (
                  <>
                    <p className="mb-1">{order.address.name} &middot; {order.address.phone}</p>
                    <p className="mb-1">
                      {order.address.city}, {order.address.neighborhood}, {order.address.street}
                    </p>
                    <p className="mb-0">
                      Building: {order.address.building} &middot; Zip: {order.address.zip_code}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="admin-card p-0 table-responsive mt-3">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Discount</th>
                  <th>Line total</th>
                </tr>
              </thead>
              <tbody>
                {(!order.orderProducts || order.orderProducts.length === 0) && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No products in this order</td>
                  </tr>
                )}

                {order.orderProducts && order.orderProducts.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.product ? item.product.name : 'This product is no longer available'}
                    </td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.discount}</td>
                    <td>{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form className="admin-card mt-3" onSubmit={handleUpdate} style={{ maxWidth: 560 }}>
            <h5>Change status</h5>

            <label className="admin-label mt-0" htmlFor="status">Status</label>
            <select
              id="status"
              className="admin-input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <button className="admin-btn mt-3" disabled={saving}>
              {saving ? 'Saving...' : 'Update status'}
            </button>
          </form>
        </>
      )}

      <AdminModal
        show={modal.show}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </AdminLayout>
  )
}

export default AdminOrderDetails