import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { AdminAuthService } from '../Services/Adminauthservice'
import { useAdminAuth } from '../Context/Adminauthcontext'
import "./Admin.css"

const AdminLogin = () => {
  const navigate = useNavigate()
  const { admin, loginAdmin } = useAdminAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (admin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    AdminAuthService.Login(email, password)
      .then((response) => {
        loginAdmin(response.data)
        navigate('/admin')
      })
      .catch((err) => {
        if (err instanceof TypeError) {
          setError("Can't reach the server. Check your internet connection.")
          return
        }

        const firstFieldError = Object.values(err.errors || {})[0]
        setError(firstFieldError ? firstFieldError[0] : err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <div className="admin-login-page">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <div className="admin-login-bar"></div>

        <div className="admin-login-body">
          <h2 className="admin-login-title">Dashboard login</h2>
          <p className="admin-login-subtitle">Sign in with your admin account</p>

          <label className="admin-label" htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            className="admin-input"
            placeholder="admin@candy.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="admin-label" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            className="admin-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <div className="alert alert-warning mt-3 mb-0">{error}</div>}

          <button className="admin-btn w-100 mt-3" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminLogin