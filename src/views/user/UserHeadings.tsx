// ** MUI Imports
import { Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AccountMultipleOutline } from 'mdi-material-ui'
import { useEffect, useState } from 'react'
import { getUserStats } from 'src/api/user.service'
import CardHeading from 'src/components/CardHeading'

// Define the structure of the data returned by the API
interface UserStats {
  totalUsers: {
    count: number
    weekChange: string
  }
  activeUsers: {
    count: number
    weekChange: string
  }
  inactiveUsers: {
    count: number
    weekChange: string
  }
}

const UserHeadings = () => {
  const [dataStats, setDataStats] = useState<UserStats | null>(null)

  const { data: userStats } = useQuery(['USER_STATS'], () => getUserStats(), {
    refetchOnWindowFocus: false
  })

  useEffect(() => {
    if (userStats?.data) {
      setDataStats(userStats.data) // Remove optional chaining since we know the data is available
    }
  }, [userStats])

  return (
    <Grid container spacing={6}>
      <Grid item xs={4}>
        <CardHeading
          stats={dataStats ? dataStats.totalUsers.count : 0}
          icon={<AccountMultipleOutline />}
          color='primary'
          trendNumber={dataStats ? dataStats.totalUsers.weekChange : '0.00'}
          title='Total Users'
          subtitle='Weekly Profit'
        />
      </Grid>
      <Grid item xs={4}>
        <CardHeading
          stats={dataStats ? dataStats.activeUsers.count : 0}
          icon={<AccountMultipleOutline />}
          color='success'
          trendNumber={dataStats ? dataStats.activeUsers.weekChange : '0.00'}
          title='Active Users'
          subtitle='Weekly Profit'
        />
      </Grid>

      <Grid item xs={4}>
        <CardHeading
          stats={dataStats ? dataStats.inactiveUsers.count : 0} // Use inactiveUsers instead of activeUsers
          icon={<AccountMultipleOutline />}
          color='error'
          trendNumber={dataStats ? dataStats.inactiveUsers.weekChange : '0.00'} // Use inactiveUsers instead of activeUsers
          title='Inactive Users'
          subtitle='Weekly Profit'
        />
      </Grid>
    </Grid>
  )
}

export default UserHeadings
