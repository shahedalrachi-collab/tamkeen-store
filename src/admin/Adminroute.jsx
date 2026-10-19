import { Navigate } from 'react-router'
import { useAdminAuth } from '../Context/Adminauthcontext'

const AdminRoute = ({ children }) => {
  const { admin } = useAdminAuth()

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminRoute