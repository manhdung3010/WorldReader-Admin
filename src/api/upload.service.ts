import axiosClient from './index'

export function uploadFile(file: any) {
  const formData = new FormData()
  formData.append('files', file)

  return axiosClient.post('files/uploads', formData, {
    headers: { 'content-type': 'multipart/form-data' }
  })
}

export function deleteFile(fileName: any) {
  return axiosClient.delete(`files/uploads/${fileName}`)
}
