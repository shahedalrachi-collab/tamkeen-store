import { createContext, useContext, useState } from 'react'
import { AdminAuthService } from '../Services/Adminauthservice'

export const AdminAuthContext = createContext()

const getSavedAdmin = () => {
  try {
    if (!localStorage.getItem('admin_token')) return null
    return JSON.parse(localStorage.getItem('admin_info'))
  } catch {
    return null
  }
}

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(getSavedAdmin)

  const loginAdmin = (data) => {
    localStorage.setItem('admin_token', data.token)
    localStorage.setItem('admin_info', JSON.stringify(data))
    setAdmin(data)
  }

  const logoutAdmin = () => {
    return AdminAuthService.Logout()
      .catch((err) => console.log(err.message))
      .finally(() => {
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_info')
        setAdmin(null)
      })
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const useAdminAuth = () => useContext(AdminAuthContext)