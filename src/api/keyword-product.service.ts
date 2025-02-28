import axiosClient from '.'

export function getKeywordProduct(params: { name: string; code: string; page: number; pageSize: number }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/keyword-product', { params: filteredParams })
}

export function createKeywordProduct(payload: any) {
  return axiosClient.post(`admin/keyword-product`, payload)
}

export function updateKeywordProduct(id: number, payload: any) {
  return axiosClient.put(`admin/keyword-product/${id}`, payload)
}

export function getDetailKeywordProduct(id: any) {
  return axiosClient.get(`admin/keyword-product/${id}`)
}

export function deleteKeywordProduct(id: number) {
  return axiosClient.delete(`admin/keyword-product/${id}`)
}
