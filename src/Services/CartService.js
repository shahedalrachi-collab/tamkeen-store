import { API_Config } from '../Config/Api-config'

const CART_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CART}`

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
      throw new Error(data.message || 'Something went wrong!')
    }
    return data
  })
}

export const CartService = {

  GetCart: function () {
    return fetch(CART_URL, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then(handleResponse)
      .then((data) => data.data || [])
  },

  AddToCart: function (productId, quantity) {
    return fetch(CART_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId, quantity: quantity }),
    }).then(handleResponse)
  },

  RemoveFromCart: function (cartId) {
    return fetch(`${CART_URL}/${cartId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse)
  },
}