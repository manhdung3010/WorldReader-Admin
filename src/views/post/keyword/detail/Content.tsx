import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { Controller, useForm } from 'react-hook-form'
import { Box, Button, Card, Grid, Stack, TextField, Typography, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { createKeywordPost, getDetailKeywordPost, updateKeywordPost } from 'src/api/keyword-post.service'
import { schemaCreateKeywordPost } from '../schema/schema'

export default function KeywordPostDetailContent() {
  const [isLoading, setIsLoading] = useState(false)

  const queryClient = useQueryClient()

  const router = useRouter()

  const { data: keywordPostDetail } = useQuery(
    ['KEYWORD_POST_DETAIL', router.query.id],
    () => (router.query.id !== 'add' ? getDetailKeywordPost(Number(router.query.id)) : null),
    { enabled: router.query.id !== 'add' }
  )

  const {
    getValues,
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schemaCreateKeywordPost),
    mode: 'onChange'
  })

  useEffect(() => {
    if (keywordPostDetail) {
      reset(keywordPostDetail?.data)
    }
  }, [keywordPostDetail, reset])

  const { mutate: handleMutate } = useMutation(
    (data: any) => {
      setIsLoading(true)

      return router.query.id !== 'add' ? updateKeywordPost(data.id, data) : createKeywordPost(data)
    },
    {
      onSuccess: async (response: any) => {
        await queryClient.invalidateQueries(['KEYWORDS_PRODUCT'])
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
        <Typography variant='h5'>{getValues('name') || 'Add Keyword Post'}</Typography>
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

      <Grid container spacing={4} mt={3} sx={{ justifyContent: 'center' }}>
        {/* Left Column */}
        <Grid item xs={8}>
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
                    sx={{ mt: 2 }}
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
