import { API_Config } from '../Config/Api-config'

const ORDER_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.ORDER}`

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

export const OrderService = {

  GetOrders: function () {
    return fetch(ORDER_URL, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then(handleResponse)
      .then((data) => data.data || [])
  },

  GetOrder: function (orderId) {
    return fetch(`${ORDER_URL}/${orderId}`, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then(handleResponse)
      .then((data) => data.data)
  },

  CreateOrder: function (orderData) {
    return fetch(ORDER_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    }).then(handleResponse)
  },

  CancelOrder: function (orderId, comment) {
    return fetch(`${ORDER_URL}/${orderId}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ comment: comment }),
    }).then(handleResponse)
  },
}