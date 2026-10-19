import { API_Config } from '../Config/Api-config'

export const ContactService = {

  SendMessage: function (messageData) {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CONTACT}`

    const formData = new FormData()
    formData.append('type', 'EMAIL')
    formData.append('email', messageData.email)
    formData.append('message', messageData.message)

    const headers = { Accept: 'application/json' }
    const token = localStorage.getItem('auth_token')
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: formData,
    }).then((res) => {
      if (!res.ok) {
        return res.json().then((serverError) => {
          const error = new Error(serverError.message || 'Could not send your message')
          error.errors = serverError.errors || {}
          throw error
        })
      }
      return res.json()
    })
  },
}