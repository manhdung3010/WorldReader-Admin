import axiosClient from '.'

export function getAuthor(params: { name: string; nationality: string; page: number; pageSize: number }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/authors', { params: filteredParams })
}

export function createAuthor(payload: any) {
  return axiosClient.post(`admin/authors`, payload)
}

export function updateAuthor(id: number, payload: any) {
  return axiosClient.put(`admin/authors/${id}`, payload)
}

export function getDetailAuthor(id: any) {
  return axiosClient.get(`admin/authors/${id}`)
}

export function deleteAuthor(id: number) {
  return axiosClient.delete(`admin/authors/${id}`)
}
