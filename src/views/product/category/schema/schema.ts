import * as yup from 'yup'

export const schemaCreateCategory = yup.object().shape({
  name: yup.string().required('Category name is required').max(255, 'Category name must not exceed 255 characters'),

  description: yup.string().notRequired(),

  url: yup.string().required('URL is required'),

  display: yup.boolean().required('Display field is required'),

  homeDisplay: yup.boolean().required('Home display field is required'),

  image: yup.string().nullable(),

  parentIds: yup.array().notRequired().default([]),

  seo: yup.object().shape({
    title: yup.string().notRequired().max(255, 'SEO title must not exceed 255 characters'),

    description: yup.string().notRequired().max(255, 'SEO title must not exceed 255 characters')
  })
})
