import axiosClient from '.'

export function getReviewByProductId(id: number, page: number, limit: number) {
  return axiosClient.get(`admin/reviews-product/findByProductId/${id}`, {
    params: { page, limit }
  })
}

export function createReviewProduct(payload: any) {
  return axiosClient.post(`admin/reviews-product`, payload)
}

export function updateReviewProduct(id: number, payload: any) {
  return axiosClient.put(`admin/reviews-product/${id}`, payload)
}

export function getDetailReviewProduct(id: any) {
  return axiosClient.get(`admin/reviews-product/${id}`)
}

export function deleteReviewProduct(id: number) {
  return axiosClient.delete(`admin/reviews-product/${id}`)
}
