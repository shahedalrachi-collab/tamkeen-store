import { NavLink, useNavigate } from 'react-router'
import { FiHome, FiBox, FiGrid, FiShoppingBag } from 'react-icons/fi'
import { useAdminAuth } from '../Context/Adminauthcontext'
import './Admin.css'

const menu = [
  { label: 'Home', to: '/admin', icon: <FiHome /> },
  { label: 'Products', to: '/admin/products', icon: <FiBox /> },
  { label: 'Categories', to: '/admin/categories', icon: <FiGrid /> },
  { label: 'Orders', to: '/admin/orders', icon: <FiShoppingBag /> },
]

const AdminLayout = ({ title, children }) => {
  const navigate = useNavigate()
  const { admin, logoutAdmin } = useAdminAuth()

  const handleLogout = () => {
    logoutAdmin().then(() => {
      navigate('/admin/login')
    })
  }

  return (
    <div className="admin-shell">

      <aside className="admin-sidebar">
        <h5 className="admin-brand">Borcelle Admin</h5>

        <nav className="admin-menu">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) => `admin-menu-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <h4 className="mb-0">{title}</h4>

          <div className="d-flex align-items-center gap-3">
            <span className="admin-user">{admin?.name}</span>
            <span className="admin-avatar">{admin?.name ? admin.name[0].toUpperCase() : 'A'}</span>
            <button type="button" className="admin-btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout