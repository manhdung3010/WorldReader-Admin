import axiosClient from '.'

export function getUser(params: {
  username: string
  email: string
  gender: string
  role: string
  status: string
  page: number
  pageSize: number
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/users', { params: filteredParams })
}

export function getUserStats() {
  return axiosClient.get('admin/users/getStats')
}

export function createUser(payload: any) {
  return axiosClient.post(`admin/users`, payload)
}

export function updateUser(id: number, payload: any) {
  return axiosClient.put(`admin/users/${id}`, payload)
}

export function getDetailUser(id: number) {
  return axiosClient.get(`admin/users/${id}`)
}


export function deleteUser(id: number) {
  return axiosClient.delete(`admin/users/${id}`)
}

