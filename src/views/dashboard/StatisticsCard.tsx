// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import CellphoneLink from 'mdi-material-ui/CellphoneLink'
import AccountOutline from 'mdi-material-ui/AccountOutline'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'
import type { DashboardMetrics } from 'src/types/report'

interface DataType {
  stats: string
  title: string
  color: ThemeColor
  icon: ReactElement
  growth?: string
  growthType?: 'positive' | 'negative'
}

interface StatisticsCardProps {
  dashboardMetrics: DashboardMetrics
}

const StatisticsCard = ({ dashboardMetrics }: StatisticsCardProps) => {
  const statsData: DataType[] = [
    {
      stats: dashboardMetrics.metrics.transactions.total.toString(),
      title: 'Transactions',
      color: 'primary',
      icon: <TrendingUp sx={{ fontSize: '1.75rem' }} />,
      growth: dashboardMetrics.metrics.transactions.growth,
      growthType: dashboardMetrics.metrics.transactions.growthType
    },
    {
      stats: dashboardMetrics.metrics.sales.formatted,
      title: 'Sales',
      color: 'success',
      icon: <CurrencyUsd sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: dashboardMetrics.metrics.users.formatted,
      title: 'Users',
      color: 'warning',
      icon: <AccountOutline sx={{ fontSize: '1.75rem' }} />
    },
    {
      stats: dashboardMetrics.metrics.products.formatted,
      title: 'Products',
      color: 'info',
      icon: <CellphoneLink sx={{ fontSize: '1.75rem' }} />
    }
  ]

  const renderStats = () => {
    return statsData.map((item: DataType, index: number) => (
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            variant='rounded'
            sx={{
              mr: 3,
              width: 44,
              height: 44,
              boxShadow: 3,
              color: 'common.white',
              backgroundColor: `${item.color}.main`
            }}
          >
            {item.icon}
          </Avatar>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='caption'>{item.title} </Typography>
            <Typography variant='h6'>
              {item.stats}{' '}
              {item.growth && (
                <span
                  style={{
                    color: item.growthType === 'positive' ? '#56CA00' : 'red',
                    fontSize: '12px'
                  }}
                >
                  ({item.growth}% vs last month)
                </span>
              )}
            </Typography>
          </Box>
        </Box>
      </Grid>
    ))
  }

  return (
    <Card>
      <CardHeader
        title='Statistics Overview'
        subheader={
          <Typography variant='body2'>
            <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
              {dashboardMetrics.period.currentMonth}
            </Box>
          </Typography>
        }
        titleTypographyProps={{
          sx: {
            mb: 2.5,
            lineHeight: '2rem !important',
            letterSpacing: '0.15px !important'
          }
        }}
      />
      <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
        <Grid container spacing={[5, 0]}>
          {renderStats()}
        </Grid>
      </CardContent>
    </Card>
  )
}

export default StatisticsCard
