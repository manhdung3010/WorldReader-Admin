import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { Close } from 'mdi-material-ui'
import { Controller, useForm } from 'react-hook-form'

import * as Yup from 'yup'

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUser, getDetailUser, updateUser } from 'src/api/user.service'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import CustomUploadSingle from 'src/components/CustomUploadSingle'

const DrawerUserForm: React.FC<any> = ({ openDrawerForm, setOpenDrawerForm, mode, detailData }) => {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: mode !== 'edit' ? Yup.string().required('Password is required') : Yup.string().notRequired(),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    fullName: Yup.string().required('Full name is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    role: Yup.string().oneOf(['user', 'admin'], 'Role is not valid').required('Role is required'),
    address: Yup.string().notRequired(),
    date: Yup.string().notRequired(),
    gender: Yup.string().notRequired(),
    status: Yup.string().notRequired(),
    avatar: Yup.string().notRequired()
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

  const { data: detailUser } = useQuery(
    ['DETAIL_USER', detailData?.id, detailData],
    () => getDetailUser(detailData?.id),
    {
      enabled: !!detailData?.id
    }
  )

  const handleCloseDrawer = () => {
    setOpenDrawerForm(false)
    reset()
  }

  useEffect(() => {
    if (detailUser) {
      reset(detailUser?.data)
    }
  }, [detailUser, reset])

  const { mutate: handleMutate } = useMutation(
    (data: any) => {
      setIsLoading(true)

      return mode === 'edit' ? updateUser(data.id, data) : createUser(data)
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(['USERS'])
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
      <Box sx={{ width: 500, height: '100%', display: 'flex', flexDirection: 'column' }} role='presentation'>
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
          <Typography variant='h6'>{mode === 'edit' ? 'Edit User' : 'Add User'}</Typography>
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

          <CustomUploadSingle
            value={getValues('avatar')}
            onChange={value => {
              setValue('avatar', value)
            }}
          />

          <Typography variant='body1' py={1}>
            Basic Information
          </Typography>

          <Controller
            name='username'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                autoFocus
                {...field}
                fullWidth
                label='Username'
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />

          <Controller
            name='email'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField {...field} fullWidth label='Email' error={!!errors.email} helperText={errors.email?.message} />
            )}
          />

          {mode !== 'edit' && (
            <Controller
              name='password'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Password'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
          )}

          <Typography variant='body1' py={1}>
            Detailed information
          </Typography>
          <Controller
            name='fullName'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                autoFocus
                {...field}
                fullWidth
                label='Full Name'
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
            )}
          />

          <Controller
            name='phoneNumber'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label='Phone Number'
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
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
            name='address'
            control={control}
            defaultValue=''
            render={({ field }) => <TextField {...field} fullWidth label='Address' />}
          />

          <Controller
            name='gender'
            control={control}
            defaultValue='other'
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='gender-select-label'>Gender</InputLabel>
                <Select label='Gender' {...field} id='gender-select' labelId='gender-select-label'>
                  <MenuItem value='male'>Male</MenuItem>
                  <MenuItem value='female'>Female</MenuItem>
                  <MenuItem value='other'>Other</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='status'
            control={control}
            defaultValue='active'
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='status-select-label'>Status</InputLabel>
                <Select label='Status' {...field} id='status-select' labelId='status-select-label'>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
              </FormControl>
            )}
          />

          <Controller
            name='role'
            control={control}
            defaultValue='user'
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id='role-select-label'>Role</InputLabel>
                <Select label='Role' {...field} id='role-select' labelId='role-select-label'>
                  <MenuItem value='user'>User</MenuItem>
                  <MenuItem value='admin'>Admin</MenuItem>
                </Select>
              </FormControl>
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

export default DrawerUserForm
