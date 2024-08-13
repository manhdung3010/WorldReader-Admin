// ** MUI Imports
import { Box, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getDetailUser } from 'src/api/user.service'
import { formatCreateAtDate } from 'src/utils/time'

// ** Demo Components Imports
import UserContent from 'src/views/user/UserContent'

const DetailUserPage = () => {
  const [userData, setUserData] = useState<any>()
  const router = useRouter()

  const { data: detailUser } = useQuery(['DETAIL_USER', router?.query?.id], () => getDetailUser(router?.query?.id), {
    enabled: !!router?.query?.id
  })

  useEffect(() => {
    if (detailUser) {
      setUserData(detailUser?.data)
    }
  }, [userData, detailUser])

  console.log(userData)

  return (
    <Box>
      <Stack direction='row'>
        <Box sx={{ display: 'flex', flexDirection: 'column', pb: 5 }}>
          <Typography variant='h5'>{userData?.username}</Typography>
          <Typography variant='body2'>{formatCreateAtDate(userData?.createdAt)}</Typography>
        </Box>
      </Stack>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserContent />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DetailUserPage
