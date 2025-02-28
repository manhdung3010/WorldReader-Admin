import * as yup from 'yup'

export const schemaCreateProduct = yup.object().shape({
  name: yup.string().required('Tên sản phẩm là bắt buộc'),
  code: yup.string().required('Mã sản phẩm là bắt buộc'),
  description: yup.string(),
  url: yup.string(),
  display: yup.boolean(),
  status: yup.string().oneOf(['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'], 'Trạng thái không hợp lệ'),
  avatar: yup.string(),
  price: yup.number().min(0, 'Giá phải lớn hơn hoặc bằng 0'),
  perDiscount: yup.number().min(0).max(100, 'Giảm giá từ 0 đến 100'),
  image: yup.array().of(yup.string()),
  information: yup.array().of(
    yup.object({
      name: yup.string().required('Tên thông tin là bắt buộc'),
      content: yup.string().required('Nội dung là bắt buộc')
    })
  ),
  categories: yup.array().of(yup.number()),
  productWarehouse: yup.object({
    quantityInStock: yup.number().min(0, 'Số lượng trong kho phải lớn hơn hoặc bằng 0'),
    quantityInUse: yup.number().min(0, 'Số lượng đang dùng phải lớn hơn hoặc bằng 0')
  }),
  flashSale: yup.object({
    flashSaleStartTime: yup.date().nullable(),
    flashSaleEndTime: yup.date().nullable(),
    flashSaleDiscount: yup.number().min(0).max(100, 'Giảm giá từ 0 đến 100')
  }),
  keywords: yup.array().of(yup.string()),
  seo: yup.object({
    title: yup.string(),
    description: yup.string()
  })
})
