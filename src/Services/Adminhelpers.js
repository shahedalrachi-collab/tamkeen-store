

export const getHeaders = function () {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
  }
}

export const handleResponse = function (res) {
  return res.json().catch(() => ({})).then((data) => {
    if (!res.ok) {
      console.error('Server error:', res.status, data.message)

      if (res.status >= 500) {
        throw new Error('Something went wrong on our side. Please try again in a moment.')
      }
      const error = new Error(data.message || 'Something went wrong!')
      error.errors = data.errors || {}
      throw error
    }
    return data
  })
}

export const sendRequest = function (url, options) {
  return fetch(url, options)
    .catch(() => {
      throw new Error("Can't reach the server. Check your internet connection.")
    })
    .then(handleResponse)
}