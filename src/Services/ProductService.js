import { API_Config } from '../Config/Api-config'

export const ProductService = {

  GetProducts: function () {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCTS}`

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!')
        }
        return res.json()
      })
      .then((data) => data.data || [])
  },

  GetFilteredProducts: function (filters) {
    const params = new URLSearchParams()
    params.append('page', filters.page)
    if (filters.categoryId) params.append('category_id', filters.categoryId)
    if (filters.priceFrom) params.append('price_from', filters.priceFrom)
    if (filters.priceTo) params.append('price_to', filters.priceTo)
    if (filters.sort) {
      params.append('order_by', filters.sort.order_by)
      params.append('order', filters.sort.order)
    }

    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCTS}?${params}`

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!')
        }
        return res.json()
      })
  },

  GetCategoriesPage: function (page) {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.CATEGORIES}?page=${page}`

    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Could not load categories')
        }
        return res.json()
      })
  },

  GetAllCategories: async function () {
    let allCategories = []
    let page = 1
    let lastPage = 1

    while (page <= lastPage) {
      const data = await ProductService.GetCategoriesPage(page)
      allCategories = [...allCategories, ...data.data]
      lastPage = data.meta.last_page
      page = page + 1
    }

    return allCategories.filter((cat) => cat.name)
  },
}
 