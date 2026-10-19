import { API_Config } from '../Config/Api-config'

const LOGIN_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.ADMIN_LOGIN}`
const LOGOUT_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.ADMIN_LOGOUT}`

export const AdminAuthService = {
  Login: function (email, password) {
    return fetch(LOGIN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      const data = await res.json()

      if (!res.ok || data.code !== 1) {
        const error = new Error(data.message || 'Login failed')
        error.errors = data.errors || data.data
        throw error
      }

      return data
    })
  },

  Logout: function () {
    return fetch(LOGOUT_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
      },
    }).then((res) => res.json())
  },
}