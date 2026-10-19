import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FiShoppingBag, FiBox, FiGrid } from 'react-icons/fi'
import AdminLayout from './Adminlayout'
import { useAdminAuth } from '../Context/Adminauthcontext'
import { AdminOrderService } from '../Services/Adminorderservice'
import { AdminProductService } from '../Services/Adminproductservice'
import { AdminCategoryService } from '../Services/Admincategoryservice'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const salesData = [12, 19, 15, 25, 22, 30, 28, 35, 32, 40, 38, 45]

const weeklyOrders = [
  { day: 'Mon', value: 24 },
  { day: 'Tue', value: 38 },
  { day: 'Wed', value: 30 },
  { day: 'Thu', value: 52 },
  { day: 'Fri', value: 44 },
  { day: 'Sat', value: 61 },
  { day: 'Sun', value: 35 },
]

const statusStats = [
  { label: 'Completed', value: 45, color: '#22c55e' },
  { label: 'Pending', value: 25, color: '#f59e0b' },
  { label: 'Accepted', value: 15, color: '#3b82f6' },
  { label: 'Canceled', value: 15, color: '#ef4444' },
]

const statusClass = function (status) {
  if (status === 'ACCEPTED') return 'bg-info text-dark'
  if (status === 'COMPLETED') return 'bg-success'
  if (status === 'REJECTED') return 'bg-danger'
  if (status === 'CANCELED') return 'bg-secondary'
  return 'bg-warning text-dark'
}

const getLatest = function (getPage) {
  return getPage(1).then((first) => {
    const lastPage = first.meta.last_page

    const pages = [lastPage - 1, lastPage].filter((p) => p > 1)

    return Promise.all(pages.map((p) => getPage(p))).then((others) => {
      let all = [...first.data]
      others.forEach((response) => {
        all = all.concat(response.data)
      })

      all.sort((a, b) => b.id - a.id)

      return { total: first.meta.total, latest: all.slice(0, 5) }
    })
  })
}

const AdminHome = () => {
  const { admin } = useAdminAuth()

  const [totalOrders, setTotalOrders] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalCategories, setTotalCategories] = useState(0)
  const [latestOrders, setLatestOrders] = useState([])
  const [latestProducts, setLatestProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {

    Promise.all([
      getLatest((page) => AdminOrderService.GetOrders(page)),
      getLatest((page) => AdminProductService.GetProducts(page)),
      AdminCategoryService.GetCategories(1),
    ])
      .then(([orders, products, categories]) => {
        setTotalOrders(orders.total)
        setLatestOrders(orders.latest)
        setTotalProducts(products.total)
        setLatestProducts(products.latest)
        setTotalCategories(categories.meta.total)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const maxSales = Math.max(...salesData)
  const step = 600 / (salesData.length - 1)
  const points = salesData
    .map((value, index) => `${index * step},${190 - (value / maxSales) * 170}`)
    .join(' ')
  const areaPoints = `0,200 ${points} 600,200`

  const maxWeekly = Math.max(...weeklyOrders.map((item) => item.value))

  let start = 0
  const parts = statusStats.map((item) => {
    const end = start + item.value
    const part = `${item.color} ${start}% ${end}%`
    start = end
    return part
  })
  const donutStyle = { background: `conic-gradient(${parts.join(', ')})` }

  const show = (number) => (loading ? '...' : number)

  return (
    <AdminLayout title="Dashboard">

      <div className="admin-welcome">
        <h4>Welcome back, {admin?.name} 👋</h4>
        <p>Here is what is happening in your store today.</p>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="admin-stat">
            <div className="admin-stat-icon pink"><FiShoppingBag /></div>
            <div>
              <div className="admin-stat-label">Total orders</div>
              <div className="admin-stat-number">{show(totalOrders)}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="admin-stat">
            <div className="admin-stat-icon violet"><FiBox /></div>
            <div>
              <div className="admin-stat-label">Total products</div>
              <div className="admin-stat-number">{show(totalProducts)}</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="admin-stat">
            <div className="admin-stat-icon blue"><FiGrid /></div>
            <div>
              <div className="admin-stat-label">Categories</div>
              <div className="admin-stat-number">{show(totalCategories)}</div>
            </div>
          </div>
        </div>
      </div>

      <h5 className="admin-section-title">Latest updates</h5>

      <div className="row g-3">
                <div className="col-12 col-lg-6">
          <div className="admin-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="admin-card-title mb-0">Newest products</h6>
              <Link to="/admin/products" className="text-decoration-none" style={{ color: 'var(--admin-pink)' }}>
                View all
              </Link>
            </div>

            {loading && <p className="text-body-secondary mb-0">Loading...</p>}
            {!loading && latestProducts.length === 0 && <p className="text-body-secondary mb-0">No products yet</p>}

            {latestProducts.map((product) => (
              <Link key={product.id} to={`/admin/products/${product.id}`} className="admin-list-row">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="admin-list-img" />
                ) : (
                  <div className="admin-list-img" />
                )}
                <div className="flex-grow-1">
                  <div className="admin-list-title">{product.name || `Product #${product.id}`}</div>
                  <div className="admin-list-sub">{product.category ? product.category.name : 'No category'}</div>
                </div>
                <strong style={{ color: 'var(--heading)' }}>{product.price}</strong>
              </Link>
            ))}
          </div>
        </div>

                <div className="col-12 col-lg-6">
          <div className="admin-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="admin-card-title mb-0">Latest orders</h6>
              <Link to="/admin/orders" className="text-decoration-none" style={{ color: 'var(--admin-pink)' }}>
                View all
              </Link>
            </div>

            {loading && <p className="text-body-secondary mb-0">Loading...</p>}
            {!loading && latestOrders.length === 0 && <p className="text-body-secondary mb-0">No orders yet</p>}

            {latestOrders.map((order) => (
              <Link key={order.id} to={`/admin/orders/${order.id}`} className="admin-list-row">
                <div className="flex-grow-1">
                  <div className="admin-list-title">Order #{order.id}</div>
                  <div className="admin-list-sub">
                    {order.customer ? `Customer #${order.customer.id}` : 'No customer'}
                  </div>
                </div>
                <span className={`badge ${statusClass(order.status)}`}>{order.status}</span>
                <strong style={{ color: 'var(--heading)' }}>{order.grand_total}</strong>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 admin-section-title">
        <span>Statistics</span>
        <span className="admin-badge-sample">Sample data</span>
      </div>

      <div className="row g-3">

        <div className="col-12 col-lg-8">
          <div className="admin-card h-100">
            <h6 className="admin-card-title">Sales overview</h6>

            <svg className="admin-line-chart" viewBox="0 0 600 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f0345d" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#f0345d" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon points={areaPoints} fill="url(#salesFill)" />
              <polyline
                points={points}
                fill="none"
                stroke="#f0345d"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
            </svg>

            <div className="admin-chart-labels">
              {months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="admin-card h-100">
            <h6 className="admin-card-title">Orders by status</h6>

            <div className="admin-donut" style={donutStyle}></div>

            {statusStats.map((item) => (
              <div key={item.label} className="admin-legend">
                <span>
                  <span className="admin-dot" style={{ background: item.color }}></span>
                  {item.label}
                </span>
                <strong style={{ color: 'var(--heading)' }}>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12">
          <div className="admin-card">
            <h6 className="admin-card-title">Orders this week</h6>

            <div className="admin-bars">
              {weeklyOrders.map((item) => (
                <div key={item.day} className="admin-bar-col">
                  <strong style={{ color: 'var(--heading)' }}>{item.value}</strong>
                  <div className="admin-bar" style={{ height: `${(item.value / maxWeekly) * 80}%` }}></div>
                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminHome