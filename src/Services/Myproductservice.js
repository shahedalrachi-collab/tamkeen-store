import { API_Config } from '../Config/Api-config'

const PRODUCTS_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCTS}`

const getHeaders = function () {
  return {
    Accept: 'application/json',
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

export const MyProductService = {

  GetMyProducts: function (page) {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.MY_PRODUCTS}&page=${page}`

    return fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    }).then(handleResponse)
  },

  GetProduct: function (id) {
    return fetch(`${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCT_DETAILS(id)}`, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then(handleResponse)
      .then((data) => data.data)
  },

  AddProduct: function (productData) {
    const formData = new FormData()
    formData.append('name', productData.name)
    formData.append('category_id', productData.category_id)
    if (productData.description) formData.append('description', productData.description)
    if (productData.image) formData.append('image', productData.image)

    return fetch(PRODUCTS_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    })
      .then(handleResponse)
      .then((data) => {

        if (productData.price !== '' && productData.price !== undefined) {
          return MyProductService.UpdateProduct(data.data.id, { price: productData.price })
        }
        return data
      })
  },

  UpdateProduct: function (id, productData) {
    const body = {}
    if (productData.name) body.name = productData.name
    if (productData.description) body.description = productData.description
    if (productData.price !== '' && productData.price !== undefined) body.price = Number(productData.price)
    if (productData.category_id) body.category_id = Number(productData.category_id)

    return fetch(`${PRODUCTS_URL}/${id}`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then(handleResponse)
  },

  DeleteProduct: function (id) {
    return fetch(`${PRODUCTS_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse)
  },
}