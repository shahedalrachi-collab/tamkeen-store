import { useContext } from 'react'
import { Link } from 'react-router'
import { FaUserCircle } from 'react-icons/fa'
import { MdPhone, MdEmail } from 'react-icons/md'
import { AuthContext } from '../Context/AuthContext'
import { useCart } from '../Context/CartContext'
import { useFavorites } from '../Context/Favoritescontext'

const UserBox = () => {
  const { user, logout } = useContext(AuthContext)
  const { loadCart } = useCart()
  const { loadFavorites } = useFavorites()

  const handleLogout = () => {
    logout()
    loadCart()
    loadFavorites()
  }

  if (!user) {
    return (
      <div className="user py-2 px-2 rounded-3">
        <div className="d-flex gap-2 align-items-center mb-2">
          <FaUserCircle className="avataricon" style={{ color: '#C7E1FF', fontSize: '80px' }} />
          <span className="fs-6 fw-semibold">Hi, user let’s get started</span>
        </div>
        <div className="user-btns d-flex flex-column gap-2">
          <Link className="btn-join-now text-center" to="/signup">Join now</Link>
          <Link className="btn-log-in text-center" to="/login">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="user py-2 px-2 rounded-3">
      <div className="d-flex gap-2 align-items-center mb-2">
        <FaUserCircle className="avataricon" style={{ color: '#C7E1FF', fontSize: '80px' }} />
        <span className="fs-6 fw-semibold text-break">Hi, {user.name || 'there'}</span>
      </div>

      {user.phone && (
        <div className="small d-flex align-items-center gap-2 mb-1">
          <MdPhone />
          <span dir="ltr">{user.phone}</span>
        </div>
      )}

      {user.email && (
        <div className="small d-flex align-items-center gap-2 mb-1">
          <MdEmail />
          <span className="text-break">{user.email}</span>
        </div>
      )}

      <div className="user-btns d-flex flex-column gap-2 mt-2">
        <Link className="btn-join-now text-center" to="/products">View products</Link>
        <button type="button" className="btn-log-in text-center" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  )
}

export default UserBox