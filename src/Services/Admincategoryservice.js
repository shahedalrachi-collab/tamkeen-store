import { API_Config } from '../Config/Api-config'
import { getHeaders, sendRequest } from './Adminhelpers'

const CATEGORIES_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.ADMIN_CATEGORIES}`

export const AdminCategoryService = {

  GetCategories: function (page) {
    return sendRequest(`${CATEGORIES_URL}?page=${page}`, {
      method: 'GET',
      headers: getHeaders(),
    })
  },

  GetAllCategories: function () {
    const loadPage = function (page, soFar) {
      return AdminCategoryService.GetCategories(page).then((response) => {
        const all = soFar.concat(response.data)

        if (page < response.meta.last_page) {
          return loadPage(page + 1, all)
        }

        return all.filter((category) => category.name)
      })
    }

    return loadPage(1, [])
  },

  GetCategory: function (id) {
    return sendRequest(`${CATEGORIES_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then((data) => data.data)
  },

  AddCategory: function (c) {
    const formData = new FormData()
    formData.append('en[name]', c.en_name)
    formData.append('ar[name]', c.ar_name)
    if (c.image) formData.append('image', c.image)

    return sendRequest(CATEGORIES_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    })
  },

  UpdateCategory: function (id, c) {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('en[name]', c.en_name)
    if (c.image) formData.append('image', c.image)

    return sendRequest(`${CATEGORIES_URL}/${id}`, {
      method: 'POST',
      headers: getHeaders(),
      body: formData,
    })
  },

  DeleteCategory: function (id) {
    return sendRequest(`${CATEGORIES_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
  },
}