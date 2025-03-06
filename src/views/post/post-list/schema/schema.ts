import * as yup from 'yup'

export const schemaCreatePost = yup.object().shape({
  name: yup.string().required('Tên bài viết là bắt buộc'),
  content: yup.string().required('Nội dung bài viết là bắt buộc'),
  url: yup.string().required('URL là bắt buộc'),
  display: yup.boolean().default(false),
  homeDisplay: yup.boolean().default(false),
  thumbnail: yup.string().nullable(),
  image: yup.array().of(yup.string()).nullable(),
  keywords: yup.array().of(yup.string()).nullable(),
  categories: yup.array().of(yup.number()).nullable(),
  seo: yup
    .object()
    .shape({
      title: yup.string().nullable(),
      description: yup.string().nullable()
    })
    .nullable()
})
