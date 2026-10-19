import { API_Config } from '../Config/Api-config'

const ADDRESS_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.ADDRESS}`

const getHeaders = function () {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
  }
}

const handleResponse = function (res) {
  return res.json().catch(() => ({})).then((data) => {
    if (!res.ok) {
      const error = new Error(data.message || 'Something went wrong!')
      error.errors = data.errors || {}
      throw error
    }
    return data
  })
}

export const AddressService = {

  GetAddresses: function () {
    return fetch(ADDRESS_URL, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then(handleResponse)
      .then((data) => data.data || [])
  },

  AddAddress: function (address) {
    return fetch(ADDRESS_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(address),
    }).then(handleResponse)
  },
}