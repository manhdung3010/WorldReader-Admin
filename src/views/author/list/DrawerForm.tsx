import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Button, CircularProgress, Drawer, IconButton, Stack, TextField, Typography } from '@mui/material'
import { Close } from 'mdi-material-ui'
import { Controller, useForm } from 'react-hook-form'

import * as Yup from 'yup'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import CustomUploadSinge from 'src/components/CustomUploadSingle'
import { createAuthor, getDetailAuthor, updateAuthor } from 'src/api/author.service'
import CustomQuill from 'src/components/CustomQuill'

const DrawerForm: React.FC<any> = ({ openDrawerForm, setOpenDrawerForm, mode, detailData }) => {
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    date: Yup.string().notRequired(),
    nationality: Yup.string().notRequired(),
    biography: Yup.string().notRequired(),
    image: Yup.string().notRequired()
  })

  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const { data: detailAuthor } = useQuery(
    ['DETAIL_AUTHOR', detailData?.id, detailData],
    () => getDetailAuthor(detailData?.id),
    {
      enabled: !!detailData?.id
    }
  )

  const handleCloseDrawer = () => {
    setOpenDrawerForm(false)
    reset()
  }

  useEffect(() => {
    if (detailAuthor) {
      reset(detailAuthor?.data)
    }
  }, [detailAuthor, reset])

  const { mutate: handleMutate } = useMutation(
    (data: any) => {
      setIsLoading(true)

      return mode === 'edit' ? updateAuthor(data.id, data) : createAuthor(data)
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(['AUTHORS'])
        toast.success(response.message || 'Success!')
        handleCloseDrawer()
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
    <Drawer anchor='right' open={openDrawerForm} onClose={handleCloseDrawer}>
      <Box sx={{ width: 700, height: '100%', display: 'flex', flexDirection: 'column' }} role='presentation'>
        <Stack
          direction='row'
          justifyContent='space-between'
          alignItems='center'
          sx={{
            p: 4,
            borderBottom: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant='h6'>{mode === 'edit' ? 'Edit Author' : 'Add Author'}</Typography>
          <IconButton aria-label='View' onClick={handleCloseDrawer}>
            <Close />
          </IconButton>
        </Stack>
        <Stack
          direction='column'
          sx={{
            p: 4,
            flex: 1,
            overflow: 'auto'
          }}
          gap={4}
          component='form'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant='body1' py={1}>
            Avatar
          </Typography>

          <CustomUploadSinge
            value={getValues('image')}

            onChange={value => {
              setValue('image', value)
            }}
          />

          <Typography variant='body1' py={1}>
            Basic Information
          </Typography>

          <Controller
            name='name'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                autoFocus
                {...field}
                fullWidth
                label='Name'
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          <Controller
            name='nationality'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                autoFocus
                {...field}
                fullWidth
                label='Nationality'
                error={!!errors.nationality}
                helperText={errors.nationality?.message}
              />
            )}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name='date'
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  value={field.value ? dayjs(field.value) : null}
                  onChange={date => field.onChange(date ? date.format('YYYY-MM-DD') : null)}
                  label='Date'
                />
              )}
            />
          </LocalizationProvider>

          <Controller
            name='biography'
            control={control}
            render={({ field: { onChange, value } }: any) => (
              <div>
                <CustomQuill placeholder='Biography' value={value} onChange={onChange} style={{ height: '200px' }} />
              </div>
            )}
          />

          <Stack direction='row' spacing={3}>
            <Button variant='contained' color='primary' type='submit'>
              {isLoading ? (
                <CircularProgress size={20} sx={{ color: 'text.primary' }} />
              ) : mode === 'edit' ? (
                'Edit'
              ) : (
                'Add'
              )}
            </Button>

            <Button variant='outlined' color='error' onClick={handleCloseDrawer}>
              Discard
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  )
}

export default DrawerForm
