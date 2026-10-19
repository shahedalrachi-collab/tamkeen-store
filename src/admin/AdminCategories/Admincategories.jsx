import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import AdminLayout from '../Adminlayout'
import AdminModal from '../Adminmodal'
import { AdminCategoryService } from '../../Services/Admincategoryservice'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState({ show: false, type: 'success', message: '' })

  useEffect(() => {
    setLoading(true)

    AdminCategoryService.GetCategories(page)
      .then((response) => {
        setCategories(response.data)
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
    if (!window.confirm('Delete this category?')) return

    AdminCategoryService.DeleteCategory(id)
      .then((response) => {

        setCategories(categories.filter((category) => category.id !== id))
        setTotal(total - 1)
        setModal({ show: true, type: 'success', message: response.message })
      })
      .catch((err) => {
        setModal({ show: true, type: 'error', message: err.message })
      })
  }

  return (
    <AdminLayout title="Categories">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-body-secondary">{total} categories</span>
        <Link to="/admin/categories/new" className="admin-btn text-decoration-none">
          + Add category
        </Link>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="admin-card p-0 table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Sub categories</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="text-center py-4">Loading...</td>
              </tr>
            )}

            {!loading && categories.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">No categories</td>
              </tr>
            )}

            {!loading && categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 8 }}
                    />
                  ) : (
                    '-'
                  )}
                </td>

                <td>
                  <Link
                    to={`/admin/categories/${category.id}`}
                    className="text-decoration-none"
                    style={{ color: 'var(--heading)' }}
                  >
                    {category.name || '(no name)'}
                  </Link>
                </td>

                <td>{category.categories_count}</td>
                <td className="text-end">
                  <Link
                    to={`/admin/categories/${category.id}/edit`}
                    className="admin-btn-outline text-decoration-none me-2"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="admin-btn-outline"
                    onClick={() => handleDelete(category.id)}
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

export default AdminCategories