import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Controller, useForm, useWatch } from 'react-hook-form'
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
  MenuItem,
  Autocomplete
} from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { createDiscount, getDetailDiscount, updateDiscount } from 'src/api/discount.service'
import { schemaCreateDiscount } from '../schema/schema'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { getCategory } from 'src/api/category.service'

export default function DiscountDetailContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [optionCategories, setOptionCategories] = useState([])

  const queryClient = useQueryClient()
  const router = useRouter()
  const discountId = router.query.id && router.query.id !== 'add' ? Number(router.query.id) : null

  // Lấy chi tiết discount nếu có id
  const { data: discountDetail } = useQuery(
    ['DISCOUNT', discountId],
    () => (discountId ? getDetailDiscount(discountId) : null),
    { enabled: !!discountId }
  )

  const { data: categories } = useQuery({
    queryKey: ['CATEGORIES'],
    queryFn: () =>
      getCategory({
        name: '',
        url: '',
        display: null,
        homeDisplay: null,
        page: 1,
        pageSize: 999
      }),
    keepPreviousData: true,
    retry: 1
  })

  useEffect(() => {
    if (categories?.data) {
      setOptionCategories(categories.data)
    }
  }, [categories])

  const {
    setValue,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: yupResolver(schemaCreateDiscount),
    mode: 'onChange',
    defaultValues: {
      name: '',
      code: '',
      active: false,
      display: false,
      discountType: 'PERCENTAGE',
      price: 0,
      maxDiscount: 0,
      usageLimit: 0,
      minPurchase: 0,
      isFullDiscount: false,
      categoryDiscount: [],
      startTime: undefined,
      endTime: undefined
    }
  })

  useEffect(() => {
    if (discountDetail?.data) {
      reset(discountDetail.data)
      setValue(
        'categoryDiscount',
        discountDetail?.data?.categoryDiscount?.map((item: any) => item?.id)
      )
    }
  }, [discountDetail, reset])

  const { mutate: handleMutate } = useMutation(
    (data: any) => {
      setIsLoading(true)

      return discountId ? updateDiscount(discountId, data) : createDiscount(data)
    },
    {
      onSuccess: async (response: any) => {
        console.log('Success response:', response)
        await queryClient.invalidateQueries(['DISCOUNT']) // Cập nhật cache danh sách discount
        toast.success(response.message || 'Success!')
        setIsLoading(false)
        router.push('/discount/list')
      },
      onError: (error: Error) => {
        console.error('Error submitting form:', error)
        toast.error(error.message || 'Failed!')
        setIsLoading(false)
      }
    }
  )

  const onSubmit = (data: any) => {
    console.log('Form data before processing:', data)

    // Kiểm tra lỗi validation
    if (Object.keys(errors).length > 0) {
      console.error('Validation errors:', errors)
      toast.error('Please fix validation errors before submitting')

      return
    }

    // Chuyển đổi giá trị số từ string sang number
    const formData = {
      ...data,
      price: Number(data.price),
      maxDiscount: Number(data.maxDiscount),
      usageLimit: Number(data.usageLimit),
      minPurchase: Number(data.minPurchase),
      active: Boolean(data.active),
      display: Boolean(data.display),
      isFullDiscount: Boolean(data.isFullDiscount),
      categoryDiscount: data.categoryDiscount || [],
      startTime: data.startTime ? new Date(data.startTime).toISOString() : undefined,
      endTime: data.endTime ? new Date(data.endTime).toISOString() : undefined
    }

    console.log('Form data after processing:', formData)
    handleMutate(formData)
  }

  const name = useWatch({ control, name: 'name' })

  useEffect(() => {
    if (name) {
      const generatedCode = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-') // thay ký tự đặc biệt bằng "-"
        .replace(/-+/g, '-') // gộp nhiều dấu "-" thành 1
        .replace(/^-|-$/g, '')

      setValue('code', generatedCode)
    }
  }, [name, setValue])

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>{discountId ? 'Edit Discount' : 'Add Discount'}</Typography>
        <Stack direction='row' justifyContent='end' gap={5}>
          <Button
            onClick={() => router.back()}
            variant='outlined'
            color='inherit'
            sx={{ whiteSpace: 'nowrap', height: '44px' }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            variant='contained'
            color='primary'
            sx={{ whiteSpace: 'nowrap', height: '44px', display: 'flex', alignItems: 'center' }}
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? (
              <CircularProgress size={20} sx={{ color: 'inherit', mr: 1 }} />
            ) : discountId ? (
              'Edit'
            ) : (
              'Add'
            )}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4} mt={3}>
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
          {/* Basic Information Card */}
          <Card sx={{ p: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Basic Information</Typography>
            <Stack direction='column' gap={3}>
              {/* Name */}
              <Controller
                name='name'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Name'
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />

              {/* Code */}
              <Controller
                name='code'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Code'
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </Stack>
          </Card>

          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Date</Typography>

            <Stack direction='row' gap={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name='startTime'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value ? dayjs(field.value as string | number | Date) : null}
                      onChange={(date: any) => field.onChange(date ? date.format('YYYY-MM-DD') : null)}
                      label='Start Time'
                      sx={{ width: '50%' }}
                    />
                  )}
                />

                <Controller
                  name='endTime'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value ? dayjs(field.value as string | number | Date) : null}
                      onChange={(date: any) => field.onChange(date ? date.format('YYYY-MM-DD') : null)}
                      label='End Time'
                      sx={{ width: '50%' }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Stack>
          </Card>

          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Discount Information</Typography>
            <Controller
              name='discountType'
              control={control}
              defaultValue={discountDetail?.data?.discountType || 'PERCENTAGE'}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label='Discount Type'
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  sx={{ width: '100%', mb: 5 }}
                >
                  <MenuItem value='PERCENTAGE'>Percent</MenuItem>
                  <MenuItem value='FIXED_AMOUNT'>Amount</MenuItem>
                </TextField>
              )}
            />

            {watch('discountType') && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller
                    name='price'
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Price'
                        type='number'
                        error={!!errors.price}
                        helperText={errors.price?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name='maxDiscount'
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Max Discount'
                        type='number'
                        error={!!errors.maxDiscount}
                        helperText={errors.maxDiscount?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name='usageLimit'
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Usage Limit'
                        type='number'
                        error={!!errors.usageLimit}
                        helperText={errors.usageLimit?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name='minPurchase'
                    control={control}
                    defaultValue={0}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label='Minimum Purchase'
                        type='number'
                        error={!!errors.minPurchase}
                        helperText={errors.minPurchase?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card sx={{ p: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Active & Display</Typography>
            <Stack direction='row' gap={3}>
              {/* Active */}
              <Controller
                name='active'
                control={control}
                defaultValue={false}
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Active' />
                )}
              />

              <Controller
                name='display'
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Display' />
                )}
              />
            </Stack>
          </Card>

          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Discount Settings</Typography>

            <Controller
              name='isFullDiscount'
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ mb: 3 }}
                  control={<Switch {...field} checked={field.value} />}
                  label='Discount All'
                />
              )}
            />

            {!watch('isFullDiscount') && (
              <Controller
                name='categoryDiscount'
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    multiple
                    options={optionCategories}
                    getOptionLabel={(option: any) => option.name}
                    value={optionCategories.filter((opt: any) => field.value?.includes(opt.id)) || []}
                    onChange={(event, newValue) => field.onChange(newValue.map((item: any) => item.id))}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Category Discount'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                )}
              />
            )}
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
