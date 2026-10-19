import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import AdminLayout from '../Adminlayout'
import AdminModal from '../Adminmodal'
import { AdminOrderService } from '../../Services/Adminorderservice'

const statusClass = function (status) {
  if (status === 'ACCEPTED') return 'bg-info text-dark'
  if (status === 'COMPLETED') return 'bg-success'
  if (status === 'REJECTED') return 'bg-danger'
  if (status === 'CANCELED') return 'bg-secondary'
  return 'bg-warning text-dark'
}

const AdminOrders = () => {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState({ show: false, type: 'success', message: '' })

  useEffect(() => {
    setLoading(true)

    AdminOrderService.GetOrders(page)
      .then((response) => {
        setOrders(response.data)
        setLastPage(response.meta.last_page)
        setTotal(response.meta.total)
        setError('')
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page])

  const handleDelete = (id) => {
    if (!window.confirm('Delete this order?')) return

    AdminOrderService.DeleteOrder(id)
      .then((response) => {

        setOrders(orders.filter((order) => order.id !== id))
        setTotal(total - 1)
        setModal({ show: true, type: 'success', message: response.message })
      })
      .catch((err) => {
        setModal({ show: true, type: 'error', message: err.message })
      })
  }

  return (
    <AdminLayout title="Orders">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-body-secondary">{total} orders</span>
        <Link to="/admin/orders/new" className="admin-btn text-decoration-none">
          + Add order
        </Link>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="admin-card p-0 table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>City</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="text-center py-4">Loading...</td>
              </tr>
            )}

            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4">No orders</td>
              </tr>
            )}

            {!loading && orders.map((order) => (
              <tr key={order.id}>
                                <td>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="text-decoration-none"
                    style={{ color: 'var(--heading)' }}
                  >
                    #{order.id}
                  </Link>
                </td>
                <td>{order.customer ? `#${order.customer.id}` : '-'}</td>
                <td>{order.address ? order.address.city : '-'}</td>
                <td>{order.grand_total}</td>
                <td>
                  <span className={`badge ${statusClass(order.status)}`}>{order.status}</span>
                </td>
                <td>
                  {order.payment_type} &middot; {order.payment_status}
                </td>
                <td className="text-end">
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="admin-btn-outline text-decoration-none me-2"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    className="admin-btn-outline"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
        <button
          type="button"
          className="admin-btn-outline"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span>Page {page} of {lastPage}</span>

        <button
          type="button"
          className="admin-btn-outline"
          disabled={page >= lastPage}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      <AdminModal
        show={modal.show}
        type={modal.type}
        message={modal.message}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </AdminLayout>
  )
}

export default AdminOrders