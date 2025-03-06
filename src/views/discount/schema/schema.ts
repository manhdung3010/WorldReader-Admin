import * as yup from 'yup'

export const schemaCreateDiscount = yup.object().shape({
  name: yup.string().required('Discount name is required').max(255, 'Discount name must not exceed 255 characters'),

  code: yup.string().notRequired().max(50, 'Code must not exceed 50 characters'),

  active: yup.boolean().required(),

  display: yup.boolean().required(),

  discountType: yup
    .string()
    .oneOf(['PERCENTAGE', 'FIXED_AMOUNT'], 'Invalid discount type')
    .required('Discount type is required'),

  price: yup.number().min(0, 'Price must be at least 0').required('Price is required'),

  usageLimit: yup
    .number()
    .min(0, 'Usage limit must be at least 0')
    .integer('Usage limit must be an integer')
    .required('Usage limit is required'),

  maxDiscount: yup.number().min(0, 'Max discount must be at least 0').required('Max discount is required'),

  minPurchase: yup.number().min(0, 'Minimum purchase must be at least 0').required('Minimum purchase is required'),

  isFullDiscount: yup.boolean().required(),

  categoryDiscount: yup.array().of(yup.string()),

  startTime: yup.date().required('Start time is required').typeError('Invalid start time format'),

  endTime: yup
    .date()
    .required('End time is required')
    .typeError('Invalid end time format')
    .min(yup.ref('startTime'), 'End time must be after start time')
})
