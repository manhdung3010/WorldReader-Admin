import * as yup from 'yup'

export const schemaCreateCategory = yup.object().shape({
  name: yup.string().required('Keyword name is required').max(255, 'Keyword name must not exceed 255 characters'),

  code: yup.string().notRequired()
})
