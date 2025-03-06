import axiosClient from '.'

export function getDiscount(params: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/discount', { params: filteredParams })
}

export function createDiscount(payload: any) {
  return axiosClient.post(`admin/discount`, payload)
}

export function updateDiscount(id: number, payload: any) {
  return axiosClient.put(`admin/discount/${id}`, payload)
}

export function getDetailDiscount(id: any) {
  return axiosClient.get(`admin/discount/${id}`)
}

export function deleteDiscount(id: number) {
  return axiosClient.delete(`admin/discount/${id}`)
}
