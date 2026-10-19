import { API_Config } from '../Config/Api-config'

export const SearchService = {

  SearchProducts: function (query) {
    const url = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.PRODUCTS}?search=${encodeURIComponent(query)}`

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
}