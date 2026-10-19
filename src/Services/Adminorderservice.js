import { API_Config } from '../Config/Api-config'
import { getHeaders, sendRequest } from './Adminhelpers'

const ORDERS_URL = `${API_Config.BASE_URL}/${API_Config.ENDPOINTS.ADMIN_ORDERS}`

const STATUS_VALUES = {
  PENDING: 1,
  ACCEPTED: 2,
  REJECTED: 3,
  CANCELED: 4,
  COMPLETED: 5,
}

export const AdminOrderService = {

  GetOrders: function (page) {
    return sendRequest(`${ORDERS_URL}?page=${page}`, {
      method: 'GET',
      headers: getHeaders(),
    })
  },

  GetOrder: function (id) {
    return sendRequest(`${ORDERS_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    })
      .then((data) => data.data)
  },

  AddOrder: function (o) {
    return sendRequest(ORDERS_URL, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: Number(o.customer_id),
        address_id: Number(o.address_id),
      }),
    })
  },

  UpdateOrder: function (id, o) {
    const body = { status: STATUS_VALUES[o.status] }
    if (o.notes) body.notes = o.notes

    return sendRequest(`${ORDERS_URL}/${id}`, {
      method: 'PUT',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  },

  DeleteOrder: function (id) {
    return sendRequest(`${ORDERS_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    })
  },
}