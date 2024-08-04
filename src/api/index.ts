import axios from 'axios'

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

axiosClient.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`
    }

    return config
  },
  error => {
    // Handle request errors if needed
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  response => response?.data,
  error => {
    // Handle response errors
    console.error('API request error:', error.response?.data || error.message)

    return Promise.reject(error.response?.data)
  }
)

export default axiosClient
