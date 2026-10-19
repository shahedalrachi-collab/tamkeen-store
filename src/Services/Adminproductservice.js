import { API_Config } from '../Config/Api-config'
import { getHeaders, sendRequest } from './Adminhelpers'

const PRODUCTS_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.ADMIN_PRODUCTS}`

export const AdminProductService = {

  GetProducts: function (page, filters) {
    const params = new URLSearchParams()
    params.append('page', page)

    if (filters) {
      if (filters.search) params.append('search', filters.search)
      if (filters.category_id) params.append('category_id', filters.category_id)
      if (filters.price_from) params.append('price_from', filters.price_from)
      if (filters.price_to) params.append('price_to', filters.price_to)
    }

    return sendRequest(`${PRODUCTS_URL}?${params.toString()}`, {
      method: 'GET',
      headers: getHeaders(),
    })
  },

  GetProduct: function (id) {
    return sendRequest(`${PRODUCTS_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then((data) => data.data)
  },

  AddProduct: function (p) {
    const formData = new FormData()
    formData.append('ar[name]', p.ar_name)
    formData.append('ar[description]', p.ar_description)
    formData.append('en[name]', p.en_name)
    formData.append('en[description]', p.en_description)
    formData.append('sku', p.sku)
    formData.append('category_id', p.category_id)
    formData.append('price', p.price)
    if (p.image) formData.append('image', p.image)

    return sendRequest(PRODUCTS_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    })
  },

  UpdateProduct: function (id, p, original) {
    const changed = function (key) {
      return p[key] !== '' && String(p[key]) !== String(original[key])
    }

    const body = {}
    if (p.en_name) body.name = p.en_name
    if (p.en_description) body.description = p.en_description
    if (changed('sku')) body.sku = p.sku
    if (changed('category_id')) body.category_id = Number(p.category_id)
    if (changed('price')) body.price = Number(p.price)

    return sendRequest(`${PRODUCTS_URL}/${id}`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  },

  DeleteProduct: function (id) {
    return sendRequest(`${PRODUCTS_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
  },
}