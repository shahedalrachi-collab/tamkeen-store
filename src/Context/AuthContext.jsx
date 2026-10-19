import { createContext, useState } from 'react'

export const AuthContext = createContext()

const getUserFromResponse = (data) => {
  const raw = data?.data?.user || data?.data?.current_user || data?.data || data || {}
  return {
    name: raw.name,
    phone: raw.phone,
    email: raw.email,
  }
}

const getSavedUser = () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return null

    const profile = JSON.parse(localStorage.getItem('profile_info'))
    if (profile) return profile

    const saved = JSON.parse(localStorage.getItem('user_info'))
    return saved ? getUserFromResponse(saved) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getSavedUser)

  const login = (data) => {
    localStorage.setItem('user_info', JSON.stringify(data))
    localStorage.setItem('auth_token', data.data.token)
    localStorage.removeItem('profile_info')
    setUser(getUserFromResponse(data))
  }

  const updateUser = (newInfo) => {
    localStorage.setItem('profile_info', JSON.stringify(newInfo))
    setUser(newInfo)
  }

  const logout = () => {
    localStorage.removeItem('user_info')
    localStorage.removeItem('profile_info')
    localStorage.removeItem('auth_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}