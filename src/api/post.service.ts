import axiosClient from '.'

export function getPost(params: {
  name: string
  url: string
  author: string
  homeDisplay: boolean | null
  display: boolean | null
  page: number
  pageSize: number
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/posts', { params: filteredParams })
}

export function createPost(payload: any) {
  return axiosClient.post(`admin/posts`, payload)
}

export function updatePost(id: number, payload: any) {
  return axiosClient.put(`admin/posts/${id}`, payload)
}

export function getDetailPost(id: any) {
  return axiosClient.get(`admin/posts/${id}`)
}

export function deletePost(id: number) {
  return axiosClient.delete(`admin/posts/${id}`)
}
