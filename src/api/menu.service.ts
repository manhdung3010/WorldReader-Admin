import axiosClient from '.'

export function getMenu(params: {
  name: string
  url: string
  display: boolean | null
  homeDisplay: boolean | null
  page: number
  pageSize: number
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== ''))

  return axiosClient.get('admin/menu', { params: filteredParams })
}

export function createMenu(payload: any) {
  return axiosClient.post(`admin/menu`, payload)
}

export function updateMenu(id: number, payload: any) {
  return axiosClient.put(`admin/menu/${id}`, payload)
}

export function getDetailMenu(id: any) {
  return axiosClient.get(`admin/menu/${id}`)
}

export function deleteMenu(id: number) {
  return axiosClient.delete(`admin/menu/${id}`)
}
