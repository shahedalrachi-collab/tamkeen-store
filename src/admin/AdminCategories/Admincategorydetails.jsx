import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import AdminLayout from '../Adminlayout'
import { AdminCategoryService } from '../../Services/Admincategoryservice'

const AdminCategoryDetails = () => {
  const { id } = useParams()

  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)

    AdminCategoryService.GetCategory(id)
      .then((data) => {
        setCategory(data)
        setError('')
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  return (
    <AdminLayout title="Category details">
      <div className="mb-3">
        <Link to="/admin/categories" className="admin-btn-outline text-decoration-none">
          &larr; Back to categories
        </Link>
      </div>

      {loading && <div className="admin-card">Loading...</div>}

      {error && <div className="alert alert-warning">{error}</div>}

      {!loading && category && (
        <div className="admin-card">
          {category.image && (
            <img
              src={category.image}
              alt={category.name}
              className="rounded mb-3"
              style={{ width: '100%', maxWidth: 480, display: 'block' }}
            />
          )}

          <h3 className="mb-1">{category.name}</h3>
          <p className="text-body-secondary">
            ID: {category.id} &middot; {category.categories_count} sub categories
          </p>

          <p className="mb-2"><strong>Sub categories</strong></p>

          {(!category.categories || category.categories.length === 0) && (
            <p className="text-body-secondary">No sub categories</p>
          )}

          <div className="d-flex flex-wrap gap-2">
            {category.categories && category.categories.map((child) => (
              <Link
                key={child.id}
                to={`/admin/categories/${child.id}`}
                className="admin-btn-outline text-decoration-none"
              >
                {child.name}
              </Link>
            ))}
          </div>

          <div className="d-flex gap-2 mt-4">
            <Link
              to={`/admin/categories/${category.id}/edit`}
              className="admin-btn text-decoration-none"
            >
              Edit
            </Link>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminCategoryDetails