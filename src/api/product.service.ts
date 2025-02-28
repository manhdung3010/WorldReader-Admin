import axiosClient from '.'

export function getProduct(params: {
  name: string
  code: string
  priceMin: string
  priceMax: string
  status: string | null
  isDiscount: boolean | null
  display: boolean | null
  page: number
  pageSize: number
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/products', { params: filteredParams })
}

export function createProduct(payload: any) {
  return axiosClient.post(`admin/products`, payload)
}

export function updateProduct(id: number, payload: any) {
  return axiosClient.put(`admin/products/${id}`, payload)
}

export function getDetailProduct(id: any) {
  return axiosClient.get(`admin/products/${id}`)
}

export function deleteProduct(id: number) {
  return axiosClient.delete(`admin/products/${id}`)
}
