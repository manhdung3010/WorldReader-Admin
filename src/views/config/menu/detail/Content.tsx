import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
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
  CircularProgress
} from '@mui/material'
import CustomUploadSingle from 'src/components/CustomUploadSingle'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { schemaCreateMenu } from '../schema/schema'
import { createMenu, getDetailMenu, getMenu, updateMenu } from 'src/api/menu.service'

export default function MenuDetailContent() {
  const [optionCategories, setOptionCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()

  const router = useRouter()

  const { data: menuDetail } = useQuery(['MENU', router.query.id], () => getDetailMenu(Number(router.query.id)), {
    enabled: router.query.id !== 'add'
  })

  const { data: menu } = useQuery({
    queryKey: ['MENU'],
    queryFn: () =>
      getMenu({
        name: '',
        url: '',
        display: null,
        homeDisplay: null,
        page: 1,
        pageSize: 999
      }),
    keepPreviousData: true,
    retry: 1 // Cho phép retry 1 lần nếu lỗi
  })

  useEffect(() => {
    if (menu) {
      setOptionCategories(menu.data)
    }
  }, [menu])

  const {
    getValues,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaCreateMenu),
    mode: 'onChange'
  })

  useEffect(() => {
    if (menuDetail) {
      reset(menuDetail?.data)

      setValue(
        'parentIds',
        menuDetail?.data?.parents?.map((item: any) => item?.id)
      )
    }
  }, [menuDetail, reset])

  const { mutate: handleMutate } = useMutation(
    (data: any) => {
      setIsLoading(true)

      return router.query.id !== 'add' ? updateMenu(data.id, data) : createMenu(data)
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(['CATEGORIES'])
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

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>{getValues('name') || 'Add Menu'}</Typography>
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
            sx={{ whiteSpace: 'nowrap', height: '44px' }}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: 'text.primary' }} />
            ) : router.query.id !== 'add' ? (
              'Edit'
            ) : (
              'Add'
            )}
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4} mt={3}>
        {/* Left Column */}
        <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
          <Card sx={{ p: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Information</Typography>

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

              <Controller
                name='url'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='URL'
                    error={!!errors.url}
                    helperText={errors.url?.message}
                    sx={{ mt: 2 }}
                  />
                )}
              />

              <Controller
                name='parentIds'
                control={control}
                render={({ field }: any) => (
                  <Autocomplete
                    multiple // Cho phép chọn nhiều danh mục cha
                    id='parentIds'
                    options={optionCategories}
                    sx={{ mt: 3 }}
                    getOptionLabel={(option: any) => option.name}
                    value={optionCategories.filter((option: any) => (field.value ?? []).includes(option.id))}
                    onChange={(event, newValue: any[]) => {
                      const newIds = newValue.map(item => item.id)
                      field.onChange(newIds)
                    }}
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Parents'
                        error={!!errors.parentIds}
                        helperText={errors.parentIds?.message}
                      />
                    )}
                  />
                )}
              />

              {/* Description */}
              <Controller
                name='description'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label='Description'
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    sx={{ mt: 2 }}
                  />
                )}
              />
            </Stack>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
          <Card sx={{ p: 5 }}>
            <Typography sx={{ fontWeight: 'bold', mb: 2 }}>Image</Typography>
            <CustomUploadSingle
              value={getValues('image')}
              onChange={value => {
                setValue('image', value)
              }}
            />
          </Card>
          <Card sx={{ p: 5, mt: 5 }}>
            {/* Display */}
            <Controller
              name='display'
              control={control}
              defaultValue={true}
              render={({ field }) => (
                <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Display' />
              )}
            />

            {/* Home Display */}
            <Controller
              name='homeDisplay'
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <FormControlLabel control={<Switch {...field} checked={field.value} />} label='Home Display' />
              )}
            />

            {/* SEO Title */}
            <Controller
              name='seo.title'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='SEO Title'
                  error={!!errors.seo?.title}
                  helperText={errors.seo?.title?.message}
                  sx={{ mt: 2 }}
                />
              )}
            />

            {/* SEO Description */}
            <Controller
              name='seo.description'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='SEO Description'
                  multiline
                  rows={3}
                  error={!!errors.seo?.description}
                  helperText={errors.seo?.description?.message}
                  sx={{ mt: 2 }}
                />
              )}
            />
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
