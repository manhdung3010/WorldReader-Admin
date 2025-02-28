import axiosClient from '.'

export function getCategory(params: {
  name: string
  url: string
  display: boolean | null
  homeDisplay: boolean | null
  page: number
  pageSize: number
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/category-product', { params: filteredParams })
}

export function createCategory(payload: any) {
  return axiosClient.post(`admin/category-product`, payload)
}

export function updateCategory(id: number, payload: any) {
  return axiosClient.put(`admin/category-product/${id}`, payload)
}

export function getDetailCategory(id: any) {
  return axiosClient.get(`admin/category-product/${id}`)
}

export function deleteCategory(id: number) {
  return axiosClient.delete(`admin/category-product/${id}`)
}
