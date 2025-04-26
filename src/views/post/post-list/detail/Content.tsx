/* eslint-disable @typescript-eslint/no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Controller, useForm, useFieldArray, useWatch } from 'react-hook-form'
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

import CustomQuill from 'src/components/CustomQuill'
import { createPost, getDetailPost, updatePost } from 'src/api/post.service'
import { getCategoryPost } from 'src/api/category-post.service'
import { getKeywordPost } from 'src/api/keyword-post.service'
import { schemaCreatePost } from '../schema/schema'

export default function PostDetailContent() {
  const [optionCategories, setOptionCategories] = useState([])
  const [optionKeywords, setOptionKeywords] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()
  const router = useRouter()

  // Lấy chi tiết sản phẩm
  const { data: postDetail } = useQuery(
    ['POSTS', router.query.id],
    () => (router.query.id !== 'add' ? getDetailPost(Number(router.query.id)) : null),
    { enabled: router.query.id !== 'add' }
  )

  // Lấy danh sách danh mục
  const { data: categories } = useQuery({
    queryKey: ['CATEGORIES_POST'],
    queryFn: () =>
      getCategoryPost({
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
    queryKey: ['KEYWORDS_POST'],
    queryFn: () =>
      getKeywordPost({
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
    resolver: yupResolver(schemaCreatePost),
    defaultValues: {
      name: '',
      content: '',
      url: '',
      display: false,
      homeDisplay: false,
      thumbnail: '',
      image: [],
      keywords: [],
      categories: [],
      seo: {
        title: '',
        description: ''
      }
    },
    mode: 'onChange'
  })

  // Reset form khi có dữ liệu chi tiết sản phẩm
  useEffect(() => {
    if (postDetail?.data) {
      reset(postDetail.data)

      setValue(
        'categories',
        postDetail?.data?.categories?.map((item: any) => item?.id)
      )
      setValue(
        'keywords',
        postDetail?.data?.keywords?.map((item: any) => item?.id)
      )
    }
  }, [postDetail, reset])

  // Mutation để tạo/cập nhật sản phẩm
  const { mutate: handleMutate } = useMutation(
    (data: any) => {
      setIsLoading(true)

      return router.query.id !== 'add' ? updatePost(data.id, data) : createPost(data)
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(['POSTS'])
        toast.success(response.message || 'Success!')
        setIsLoading(false)
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

  useEffect(() => {
    if (name) {
      const generatedCode = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // xóa dấu
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-') // thay ký tự đặc biệt bằng "-"
        .replace(/-+/g, '-') // gộp nhiều dấu "-" thành 1
        .replace(/^-|-$/g, '')

      setValue('url', generatedCode)
    }
  }, [name, setValue])

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>{postDetail?.data?.name || 'Add Post'}</Typography>
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
                    label='Post Name'
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
                    label='Post Url'
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                )}
              />

              <Controller
                name='content'
                control={control}
                render={({ field: { onChange, value } }) => (
                  <div>
                    <CustomQuill placeholder='Content' value={value} onChange={onChange} style={{ height: '200px' }} />
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
        </Grid>

        {/* Cột phụ */}
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          {/* Image Section */}
          <Card sx={{ p: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Image</Typography>
            <Typography variant='subtitle1'>Thumbnail</Typography>
            <CustomUploadSingle
              value={getValues('thumbnail')}
              onChange={(value: any) => {
                setValue('thumbnail', value)
              }}
            />
            <Typography variant='subtitle1' sx={{ mt: 2 }}>
              Post Images
            </Typography>

            <CustomUploadMultiple
              value={getValues('image')}
              onChange={value => {
                setValue('image', value)
              }}
            />
          </Card>

          <Card sx={{ p: 5, mt: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Status & Display</Typography>
            <Stack direction='column' gap={3}>
              <Controller
                name='display'
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Display' />
                )}
              />

              <Controller
                name='homeDisplay'
                control={control}
                render={({ field }) => (
                  <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Home Display' />
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
