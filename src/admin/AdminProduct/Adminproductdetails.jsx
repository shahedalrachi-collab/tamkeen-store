import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import AdminLayout from '../Adminlayout'
import { AdminProductService } from '../../Services/Adminproductservice'

const AdminProductDetails = () => {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    AdminProductService.GetProduct(id)
      .then((data) => {
        setProduct(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  return (
    <AdminLayout title="Product details">
      <div className="mb-3">
        <Link to="/admin/products" className="admin-btn-outline text-decoration-none">
          &larr; Back to products
        </Link>
      </div>

      {loading && <div className="admin-card">Loading...</div>}

      {error && <div className="alert alert-warning">{error}</div>}

      {product && (
        <div className="admin-card">
          <div className="row g-4">

            <div className="col-12 col-md-5">
              <img
                src={product.image}
                alt={product.name}
                className="w-100"
                style={{ borderRadius: 12, objectFit: 'cover', maxHeight: 360 }}
              />

              {product.images && product.images.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {product.images.map((url) => (
                    <img
                      key={url}
                      src={url}
                      alt={product.name}
                      width="72"
                      height="72"
                      style={{ borderRadius: 8, objectFit: 'cover' }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="col-12 col-md-7">
              <h3 className="mb-1">{product.name}</h3>
              <p className="text-body-secondary">SKU: {product.sku}</p>

              <h4 style={{ color: '#f0345d' }}>{product.price}</h4>

              <p className="mb-1">
                <strong>Category: </strong>
                {product.category ? product.category.name : '-'}
              </p>
              <p className="mb-3">
                <strong>Brand: </strong>
                {product.brand ? product.brand.name : '-'}
              </p>

              <p className="mb-1"><strong>Description</strong></p>
              <p>{product.description}</p>

              <div className="d-flex gap-2 mt-3">
                <Link
                  to={`/admin/products/${product.id}/edit`}
                  className="admin-btn text-decoration-none"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminProductDetails