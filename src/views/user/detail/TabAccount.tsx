// ** React Imports

import CardContent from '@mui/material/CardContent'
import { Stack, Typography } from '@mui/material'

const TabAccount = ({ userData }: { userData: any }) => {
  return (
    <CardContent>
      <Stack spacing={2}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
          Username: <span style={{ fontWeight: 400 }}> {userData?.username}</span>
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
          Role: <span style={{ fontWeight: 400 }}> {userData?.role}</span>
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
          Billing Email: <span style={{ fontWeight: 400 }}> {userData?.email}</span>
        </Typography>

        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
          Date: <span style={{ fontWeight: 400 }}> {userData?.date}</span>
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
          Contact: <span style={{ fontWeight: 400 }}> {userData?.phoneNumber}</span>
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
          Address: <span style={{ fontWeight: 400 }}> {userData?.address}</span>
        </Typography>
        <Typography sx={{ fontSize: '16px', fontWeight: 600 }}>
          Create At: <span style={{ fontWeight: 400 }}> {userData?.createdAt}</span>
        </Typography>
      </Stack>
    </CardContent>
  )
}

export default TabAccount
