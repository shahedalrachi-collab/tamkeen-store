import { API_Config } from '../Config/Api-config'

const FAVORITE_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.FAVORITE}`

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

export const FavoriteService = {

  GetFavorites: function () {
    return fetch(FAVORITE_URL, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then(handleResponse)
      .then((data) => data.data || [])
  },

  AddFavorite: function (productId) {
    return fetch(FAVORITE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ product_id: productId }),
    }).then(handleResponse)
  },

  RemoveFavorite: function (productId) {
    return fetch(`${FAVORITE_URL}/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse)
  },
}