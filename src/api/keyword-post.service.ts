import axiosClient from '.'

export function getKeywordPost(params: { name: string; code: string; page: number; pageSize: number }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/keyword-post', { params: filteredParams })
}

export function createKeywordPost(payload: any) {
  return axiosClient.post(`admin/keyword-post`, payload)
}

export function updateKeywordPost(id: number, payload: any) {
  return axiosClient.put(`admin/keyword-post/${id}`, payload)
}

export function getDetailKeywordPost(id: any) {
  return axiosClient.get(`admin/keyword-post/${id}`)
}

export function deleteKeywordPost(id: number) {
  return axiosClient.delete(`admin/keyword-post/${id}`)
}
