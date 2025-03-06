import axiosClient from '.'

export function getOrder(params: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/orders', { params: filteredParams })
}

export function createOrder(payload: any) {
  return axiosClient.post(`admin/orders`, payload)
}

export function updateOrder(id: number, payload: any) {
  return axiosClient.put(`admin/orders/${id}`, payload)
}

export function getDetailOrder(id: any) {
  return axiosClient.get(`admin/orders/${id}`)
}

export function deleteOrder(id: number) {
  return axiosClient.delete(`admin/orders/${id}`)
}
