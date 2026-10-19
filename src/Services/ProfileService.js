import { API_Config } from '../Config/Api-config'

const CUSTOMER_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CUSTOMER}`

const getHeaders = function () {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
  }
}

export const ProfileService = {

  GetProfile: function () {
    return fetch(CUSTOMER_URL, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not load your profile')
        }
        return res.json()
      })
      .then((data) => {

        const user = data.data.user || data.data
        return {
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          image: user.image || data.data.avatar || '',
        }
      })
  },

  UpdateProfile: function (profileData) {
    const formData = new FormData()
    formData.append('name', profileData.name)
    if (profileData.email) formData.append('email', profileData.email)
    if (profileData.phone) formData.append('phone', profileData.phone)
    if (profileData.image) formData.append('image', profileData.image)

    return fetch(CUSTOMER_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((serverError) => {
          const error = new Error(serverError.message || 'Could not update your information')
          error.errors = serverError.errors || {}
          throw error
        })
      }
      return res.json()
    })
  },
}