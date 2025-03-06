import * as yup from 'yup'

export const schemaCreateCategoryPost = yup.object().shape({
  name: yup.string().required('Category name is required').max(255, 'Category name must not exceed 255 characters'),

  description: yup.string().notRequired(),

  url: yup.string().required('URL is required'),

  display: yup.boolean().required('Display field is required'),

  homeDisplay: yup.boolean().required('Home display field is required'),

  image: yup.string().notRequired(),

  parentIds: yup.array().default([]),

  seo: yup.object().shape({
    title: yup.string().notRequired().max(255, 'SEO title must not exceed 255 characters'),

    description: yup.string().notRequired().max(255, 'SEO title must not exceed 255 characters')
  })
})
