import { Avatar, Box, Button, Card, Chip, Divider, Stack, Typography } from '@mui/material'
import { CartOutline, CurrencyUsd } from 'mdi-material-ui'
import { ThemeColor } from 'src/@core/layouts/types'
import DrawerUserForm from '../list/DrawerUserForm'
import { useState } from 'react'

export default function UserCard({ userData }: { userData: any }) {
  const [openDrawerForm, setOpenDrawerForm] = useState(false)
  const [detailData, setDetailData] = useState<any | undefined>(undefined)

  interface colorObj {
    [key: string]: {
      color: ThemeColor
    }
  }

  const activeObj: colorObj = {
    active: { color: 'info' },
    inactive: { color: 'error' }
  }

  return (
    <>
      <Card sx={{ p: 5 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            alignItems: 'center',
            mt: 10
          }}
        >
          {userData?.avatar ? (
            <Avatar
              variant='rounded'
              sizes='50px'
              alt={userData?.username}
              src={userData?.avatar}
              sx={{ m: 2, width: 100, height: 100 }}
            />
          ) : (
            <Avatar variant='rounded' sizes='large' sx={{ m: 2, width: 100, height: 100 }} />
          )}
          <Typography variant='h6'>{userData?.fullName}</Typography>
          <Typography variant='body2'>
            {userData?.username} #{userData?.id}
          </Typography>

          <Stack direction='row' spacing={20} my={6}>
            <Stack direction='row' spacing={2}>
              <Avatar variant='rounded' sx={{ boxShadow: 3, marginRight: 4, backgroundColor: `primary.tonal` }}>
                <CartOutline color='primary' />
              </Avatar>
              <Box>
                <Typography fontWeight={600}>157</Typography>
                <Typography variant='body2'>Orders</Typography>
              </Box>
            </Stack>

            <Stack direction='row' spacing={2}>
              <Avatar variant='rounded' sx={{ boxShadow: 3, marginRight: 4, backgroundColor: `primary.tonal` }}>
                <CurrencyUsd color='primary' />
              </Avatar>
              <Box>
                <Typography fontWeight={600}>$2074.22</Typography>
                <Typography variant='body2'>Spent</Typography>
              </Box>
            </Stack>
          </Stack>
        </Box>

        <Stack spacing={2}>
          <Typography variant='h6'>Details</Typography>
          <Divider />

          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
            Username: <span style={{ fontWeight: 400 }}> {userData?.username}</span>
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
            Billing Email: <span style={{ fontWeight: 400 }}> {userData?.email}</span>
          </Typography>
          <div style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2 }}>
            Status:{' '}
            <Chip
              label={userData?.status || 'unknown'}
              color={activeObj[userData?.status]?.color || 'default'}
              sx={{
                height: 24,
                fontSize: '0.75rem',
                textTransform: 'capitalize',
                '& .MuiChip-label': { fontWeight: 500 }
              }}
            />
          </div>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
            Contact: <span style={{ fontWeight: 400 }}> {userData?.phoneNumber}</span>
          </Typography>
          <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
            Address: <span style={{ fontWeight: 400 }}> {userData?.address}</span>
          </Typography>
        </Stack>
        <Button
          fullWidth
          variant='contained'
          color='primary'
          sx={{ mt: 4 }}
          onClick={() => {
            setOpenDrawerForm(true)
            setDetailData(userData)
          }}
        >
          Edit Details
        </Button>
      </Card>
      <DrawerUserForm
        openDrawerForm={openDrawerForm}
        setOpenDrawerForm={setOpenDrawerForm}
        mode='edit'
        detailData={detailData}
      />
    </>
  )
}
