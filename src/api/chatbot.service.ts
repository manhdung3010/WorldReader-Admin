import axiosClient from "."

const BASE_URL = '/ai/chatbot'

export const uploadChatbotFile = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosClient.post(`${BASE_URL}/load-document`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return response.data
}

export const getChatbotFiles = async () => {
  const response = await axiosClient.get(`${BASE_URL}/files`)

  return response.data
}

export const deleteAllChatbotFiles = async () => {
  const response = await axiosClient.delete(`${BASE_URL}/files`)

  return response.data
}

export const deleteChatbotFile = async (filename: string) => {
  const response = await axiosClient.delete(`${BASE_URL}/files/${filename}`)

  return response.data
}
