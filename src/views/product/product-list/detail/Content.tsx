/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Controller, useForm, useFieldArray, useWatch } from 'react-hook-form'
import { createProduct, getProduct, getDetailProduct, updateProduct } from 'src/api/product.service' // Giả sử API
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
  Autocomplete,
  CircularProgress,
  MenuItem
} from '@mui/material'
import CustomUploadSingle from 'src/components/CustomUploadSingle'
import CustomUploadMultiple from 'src/components/CustomUploadMultiple'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { schemaCreateProduct } from '../schema/schema'
import { getCategory } from 'src/api/category.service'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import dayjs from 'dayjs'
import { getKeywordProduct } from 'src/api/keyword-product.service'
import CustomQuill from 'src/components/CustomQuill'
import { Delete } from 'mdi-material-ui'

export default function ProductDetailContent() {
  const [optionCategories, setOptionCategories] = useState([])
  const [optionKeywords, setOptionKeywords] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()
  const router = useRouter()

  // Lấy chi tiết sản phẩm
  const { data: productDetail } = useQuery(
    ['PRODUCT_DETAIL', router.query.id],
    () => (router.query.id !== 'add' ? getDetailProduct(Number(router.query.id)) : null),
    { enabled: router.query.id !== 'add' }
  )

  // Lấy danh sách danh mục
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

  const { data: keywords } = useQuery({
    queryKey: ['KEYWORDS_PRODUCT'],
    queryFn: () =>
      getKeywordProduct({
        name: '',
        code: '',
        page: 1,
        pageSize: 9999
      }),
    keepPreviousData: true,
    retry: 1
  })

  useEffect(() => {
    if (categories?.data) {
      setOptionCategories(categories.data)
    }
  }, [categories])

  useEffect(() => {
    if (keywords?.data) {
      setOptionKeywords(keywords.data)
    }
  }, [keywords])

  // Cấu hình form
  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaCreateProduct),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      url: '',
      display: true,
      status: 'IN_STOCK',
      avatar: '',
      price: 0,
      perDiscount: 0,
      image: [],
      information: [],
      categories: [],
      productWarehouse: { quantityInStock: 0, quantityInUse: 0 },
      flashSale: { flashSaleStartTime: null, flashSaleEndTime: null, flashSaleDiscount: 0 },
      keywords: [],
      seo: { title: '', description: '' }
    },
    mode: 'onChange'
  })

  // Quản lý mảng information
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'information'
  })

  // Reset form khi có dữ liệu chi tiết sản phẩm
  useEffect(() => {
    if (productDetail?.data) {
      reset(productDetail.data)

      setValue(
        'categories',
        productDetail?.data?.categories?.map((item: any) => item?.id)
      )
      setValue(
        'keywords',
        productDetail?.data?.keywords?.map((item: any) => item?.id)
      )
    }
  }, [productDetail, reset])

  // Mutation để tạo/cập nhật sản phẩm
  const { mutate: handleMutate } = useMutation(
    (data: any) => {
      setIsLoading(true)

      return router.query.id !== 'add' ? updateProduct(data.id, data) : createProduct(data)
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(['PRODUCTS'])
        toast.success(response.message || 'Success!')
        setIsLoading(false)
        router.back()
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed!')
      }
    }
  )

  const onSubmit = (data: any) => {
    handleMutate(data)
  }

  const name = useWatch({ control, name: 'name' })
  const description = useWatch({ control, name: 'description' })

  useEffect(() => {
    if (name) {
      const generatedCode = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-') // thay ký tự đặc biệt bằng "-"
        .replace(/-+/g, '-') // gộp nhiều dấu "-" thành 1
        .replace(/^-|-$/g, '')

      const plainDescription = description?.replace(/<[^>]*>/g, '').trim() || ''

      setValue('code', generatedCode)
      setValue('url', generatedCode)
      setValue('seo.title', name)
      setValue('seo.description', plainDescription)
    }
  }, [name, setValue])

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>{productDetail?.data?.name || 'Add Product'}</Typography>
        <Stack direction='row' justifyContent='end' gap={5}>
          <Button onClick={() => router.back()} variant='outlined' color='inherit' sx={{ height: '44px' }}>
            Hủy
          </Button>
          <Button onClick={handleSubmit(onSubmit)} variant='contained' color='primary' sx={{ height: '44px' }}>
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: 'text.primary' }} />
            ) : router.query.id !== 'add' ? (
              'Update'
            ) : (
              'Add'
            )}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4} mt={3}>
        {/* Cột chính */}
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
          {/* Basic Information Card */}
          <Card sx={{ p: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Basic Information</Typography>
            <Stack direction='column' gap={3}>
              <Controller
                name='name'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Product Name'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name='code'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Product Code'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name='url'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='URL'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name='description'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <CustomQuill
                      placeholder='Description'
                      value={value}
                      onChange={onChange}
                      style={{ height: '200px' }}
                    />
                  </div>
                )}
              />
            </Stack>
          </Card>

          {/* Category Card */}
          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Category</Typography>
            <Controller
              name='categories'
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
                      label='Category'
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              )}
            />
          </Card>

          {/* Flash Sale Section */}
          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Flash Sale</Typography>
            <Stack direction='row' gap={3}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name='flashSale.flashSaleStartTime'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={date => field.onChange(date ? date.format('YYYY-MM-DD') : null)}
                      label='Start Time'
                    />
                  )}
                />

                <Controller
                  name='flashSale.flashSaleEndTime'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={date => field.onChange(date ? date.format('YYYY-MM-DD') : null)}
                      label='End Time'
                    />
                  )}
                />
              </LocalizationProvider>

              <Controller
                name='flashSale.flashSaleDiscount'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='Discount'
                    type='number'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Stack>
          </Card>

          {/* Product Information Card */}
          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Product Information</Typography>
            {fields.map((field, index) => (
              <Stack key={field.id} direction='row' gap={2} sx={{ mb: 2 }}>
                <Controller
                  name={`information.${index}.name`}
                  control={control}
                  render={({ field: fieldProps, fieldState }) => (
                    <TextField
                      {...fieldProps}
                      label='Name'
                      sx={{ flex: 1 }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  name={`information.${index}.content`}
                  control={control}
                  render={({ field: fieldProps, fieldState }) => (
                    <TextField
                      {...fieldProps}
                      label='Content'
                      sx={{ flex: 1 }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
                <Button onClick={() => remove(index)} color='error'>
                  <Delete />
                </Button>
              </Stack>
            ))}
            <Button onClick={() => append({ name: '', content: '' })} variant='outlined'>
              Add Information
            </Button>
          </Card>
        </Grid>

        {/* Cột phụ */}
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          {/* Image Section */}
          <Card sx={{ p: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Image</Typography>
            <Typography variant='subtitle1'>Avatar</Typography>
            <CustomUploadSingle
              value={getValues('avatar')}
              onChange={(value: any) => {
                setValue('avatar', value)
              }}
            />
            <Typography variant='subtitle1' sx={{ mt: 2 }}>
              Product Images
            </Typography>

            <CustomUploadMultiple
              value={getValues('image')}
              onChange={value => {
                setValue('image', value)
              }}
            />
          </Card>

          {/* Price and Stock Section */}
          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Price & Stock</Typography>
            <Stack direction='column' gap={3}>
              <Controller
                name='price'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='Price'
                    type='number'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name='perDiscount'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='Discount Percentage'
                    type='number'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name='productWarehouse.quantityInStock'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='Stock Quantity'
                    type='number'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
              <Controller
                name='productWarehouse.quantityInUse'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label='Quantity in Use'
                    type='number'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />
            </Stack>
          </Card>

          {/* Status and Display Section */}
          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Status & Display</Typography>
            <Stack direction='column' gap={3}>
              <Controller
                name='status'
                control={control}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    select
                    label='Status'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  >
                    <MenuItem value='IN_STOCK'>In Stock</MenuItem>
                    <MenuItem value='OUT_OF_STOCK'>Out of Stock</MenuItem>
                  </TextField>
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

          {/* SEO and Keywords Section */}
          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>SEO & Keywords</Typography>
            <Stack direction='column' gap={3}>
              <Controller
                name='seo.title'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='SEO Title' />}
              />
              <Controller
                name='seo.description'
                control={control}
                render={({ field }) => <TextField {...field} fullWidth label='SEO Description' multiline rows={3} />}
              />
              <Controller
                name='keywords'
                control={control}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    multiple
                    options={optionKeywords}
                    getOptionLabel={(option: any) => option.name}
                    value={optionKeywords.filter((opt: any) => field.value?.includes(opt.id)) || []}
                    onChange={(event, newValue) => field.onChange(newValue.map((item: any) => item.id))}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Keywords'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                )}
              />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
