// ** React Imports
import { MouseEvent, ReactNode, useState } from 'react'

// ** Next Imports

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports

import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import { Controller, useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import toast from 'react-hot-toast'
import { login } from 'src/api/auth.service'
import { useMutation } from '@tanstack/react-query'

import { useRouter } from 'next/router'
import { CircularProgress } from '@mui/material'

import * as Yup from 'yup'

interface State {
  password: string
  showPassword: boolean
}

interface LoginData {
  identifier: string
  password: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const validationSchema = Yup.object().shape({
  identifier: Yup.string().required('Email is required'),
  password: Yup.string().required('Password is required')
})

const LoginPage = () => {
  // ** State
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })

  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (response: any) => {
      console.log(response)

      if (!response.data) {
        toast.error(response.message || 'Login failed')

        return
      }

      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('accessToken', response.data.accessToken)

      toast.success('Logged in successfully!')
      router.push('/dashboard')
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message || 'Login failed'
      toast.error(errorMessage)
    }
  })

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      await loginMutation.mutateAsync(data)
    } catch (error) {
      setIsLoading(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box component='form' className='content-center' onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please log in to your account and start managing</Typography>
          </Box>
          <div>
            <Controller
              name='identifier'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <TextField
                  autoFocus
                  {...field}
                  sx={{ marginBottom: 4 }}
                  fullWidth
                  label='Email or UserName'
                  error={!!errors.identifier}
                  helperText={errors.identifier?.message}
                />
              )}
            />

            <Controller
              name='password'
              control={control}
              defaultValue=''
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
                  <OutlinedInput
                    label='Password'
                    id='auth-login-password'
                    {...field}
                    type={values.showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          aria-label='toggle password visibility'
                        >
                          {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                  <Typography variant='caption' sx={{ pl: 4, color: 'red' }}>
                    {errors.password?.message}
                  </Typography>
                </FormControl>
              )}
            />

            <Button type='submit' fullWidth size='large' variant='contained' sx={{ marginBottom: 7, mt: 5 }}>
              {isLoading ? <CircularProgress sx={{ color: 'text.primary' }} /> : 'Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
