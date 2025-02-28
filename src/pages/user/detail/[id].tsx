// ** MUI Imports
import { Box, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getDetailUser } from 'src/api/user.service'
import { formatCreateAtDate } from 'src/utils/time'
import UserCard from 'src/views/user/detail/UserCard'
import UserContent from 'src/views/user/detail/UserContent'

// ** Demo Components Imports

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

  return (
    <Box>
      <Stack direction='row'>
        <Box sx={{ display: 'flex', flexDirection: 'column', pb: 5 }}>
          <Typography variant='h5'>{userData?.username}</Typography>
          <Typography variant='body2'>{formatCreateAtDate(userData?.createdAt)}</Typography>
        </Box>
      </Stack>
      <Grid container spacing={6}>
        <Grid item xs={4}>
          <UserCard userData={userData} />
        </Grid>
        <Grid item xs={8}>
          <UserContent userData={userData} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default DetailUserPage
