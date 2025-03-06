import axiosClient from '.'

export function getCategoryPost(params: {
  name: string
  url: string
  display: boolean | null
  homeDisplay: boolean | null
  page: number
  pageSize: number
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/category-posts', { params: filteredParams })
}

export function createCategoryPost(payload: any) {
  return axiosClient.post(`admin/category-posts`, payload)
}

export function updateCategoryPost(id: number, payload: any) {
  return axiosClient.put(`admin/category-posts/${id}`, payload)
}

export function getDetailCategoryPost(id: any) {
  return axiosClient.get(`admin/category-posts/${id}`)
}

export function deleteCategoryPost(id: number) {
  return axiosClient.delete(`admin/category-posts/${id}`)
}
