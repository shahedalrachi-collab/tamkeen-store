import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import AdminLayout from '../Adminlayout'
import AdminModal from '../Adminmodal'
import { AdminProductService } from '../../Services/Adminproductservice'
import { AdminCategoryService } from '../../Services/Admincategoryservice'

const emptyFilters = { search: '', category_id: '', price_from: '', price_to: '' }

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState([])
  const [modal, setModal] = useState({ show: false, type: 'success', message: '' })

  const [filters, setFilters] = useState(emptyFilters)
  const [applied, setApplied] = useState(emptyFilters)

  useEffect(() => {
    AdminCategoryService.GetAllCategories()
      .then((list) => setCategories(list))
      .catch((err) => console.log(err.message))
  }, [])

  useEffect(() => {
    setLoading(true)

    AdminProductService.GetProducts(page, applied)
      .then((response) => {
        setProducts(response.data)
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
  }, [page, applied])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    setApplied(filters)
  }

  const handleClear = () => {
    setFilters(emptyFilters)
    setPage(1)
    setApplied(emptyFilters)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this product?')) return

    AdminProductService.DeleteProduct(id)
      .then((response) => {

        setProducts(products.filter((product) => product.id !== id))
        setTotal(total - 1)
        setModal({ show: true, type: 'success', message: response.message })
      })
      .catch((err) => {
        setModal({ show: true, type: 'error', message: err.message })
      })
  }

  return (
    <AdminLayout title="Products">

      <form className="admin-card mb-3" onSubmit={handleSearch}>
        <div className="row g-3 align-items-end">
          <div className="col-12 col-md-4">
            <label className="admin-label mt-0" htmlFor="search">Search</label>
            <input
              id="search"
              name="search"
              className="admin-input"
              placeholder="Product name..."
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-12 col-md-3">
            <label className="admin-label mt-0" htmlFor="category_id">Category</label>
            <select
              id="category_id"
              name="category_id"
              className="admin-input"
              value={filters.category_id}
              onChange={handleFilterChange}
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-2">
            <label className="admin-label mt-0" htmlFor="price_from">Price from</label>
            <input
              id="price_from"
              name="price_from"
              type="number"
              className="admin-input"
              placeholder="150"
              value={filters.price_from}
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-6 col-md-2">
            <label className="admin-label mt-0" htmlFor="price_to">Price to</label>
            <input
              id="price_to"
              name="price_to"
              type="number"
              className="admin-input"
              placeholder="200"
              value={filters.price_to}
              onChange={handleFilterChange}
            />
          </div>

          <div className="col-12 d-flex gap-2">
            <button className="admin-btn">Search</button>
            <button type="button" className="admin-btn-outline" onClick={handleClear}>
              Clear
            </button>
          </div>
        </div>
      </form>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-body-secondary">{total} products</span>
        <Link to="/admin/products/new" className="admin-btn text-decoration-none">
          + Add product
        </Link>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="admin-card p-0 table-responsive">
        <table className="table align-middle mb-0">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading...</td>
              </tr>
            )}

            {!loading && products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4">No products</td>
              </tr>
            )}

            {!loading && products.map((product) => (
              <tr key={product.id}>
                                <td>
                  <Link to={`/admin/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      width="48"
                      height="48"
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  </Link>
                </td>
                <td>
                  <Link
                    to={`/admin/products/${product.id}`}
                    className="text-decoration-none"
                    style={{ color: 'var(--heading)' }}
                  >
                    {product.name}
                  </Link>
                </td>
                <td>{product.sku}</td>
                <td>{product.price}</td>
                <td>{product.category ? product.category.name : '-'}</td>
                <td className="text-end">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="admin-btn-outline text-decoration-none me-2"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    className="admin-btn-outline"
                    onClick={() => handleDelete(product.id)}
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

export default AdminProducts