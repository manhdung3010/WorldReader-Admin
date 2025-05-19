// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icons Imports

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import type { DailySalesReport } from 'src/types/report'

interface WeeklyOverviewProps {
  dailySales: DailySalesReport
}

const WeeklyOverview = ({ dailySales }: WeeklyOverviewProps) => {
  // ** Hook
  const theme = useTheme()

  // Calculate growth percentage
  const calculateGrowth = () => {
    if (dailySales.dailyData.length < 2) return 0

    const currentPeriodTotal = dailySales.dailyData.reduce((sum, day) => sum + day.sales, 0)
    const previousPeriodTotal = dailySales.dailyData.reduce((sum, day) => sum + day.orderCount, 0)

    if (previousPeriodTotal === 0) return 0

    return ((currentPeriodTotal - previousPeriodTotal) / previousPeriodTotal) * 100
  }

  const growth = calculateGrowth()

  // Format date range
  const formatDateRange = () => {
    if (dailySales.dailyData.length === 0) {
      return ''
    }

    const startDate = new Date(dailySales.dailyData[0].date)
    const endDate = new Date(dailySales.dailyData[dailySales.dailyData.length - 1].date)

    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
  }

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 9,
        distributed: true,
        columnWidth: '40%',
        endingShape: 'rounded',
        startingShape: 'rounded'
      }
    },
    stroke: {
      width: 2,
      colors: [theme.palette.background.paper]
    },
    legend: { show: false },
    grid: {
      strokeDashArray: 7,
      padding: {
        top: -1,
        right: 0,
        left: -12,
        bottom: 5
      }
    },
    dataLabels: { enabled: false },
    colors: [
      theme.palette.primary.tonal,
      theme.palette.primary.tonal,
      theme.palette.primary.tonal,
      theme.palette.primary.main,
      theme.palette.primary.tonal,
      theme.palette.primary.tonal
    ],
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      categories: dailySales.dailyData.map(day => {
        const date = new Date(day.date)

        return date.toLocaleDateString('en-US', { weekday: 'short' })
      }),
      tickPlacement: 'on',
      labels: { show: true },
      axisTicks: { show: false },
      axisBorder: { show: false }
    },
    yaxis: {
      show: true,
      tickAmount: 4,
      labels: {
        offsetX: -17,
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}` : value.toFixed(2)}`
      }
    }
  }

  return (
    <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardHeader
        title='Weekly Overview'
        subheader={formatDateRange()}
        titleTypographyProps={{
          sx: { lineHeight: '2rem !important', letterSpacing: '0.15px !important' }
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          '& .apexcharts-xcrosshairs.apexcharts-active': { opacity: 0 }
        }}
      >
        <ReactApexcharts
          type='bar'
          height={230}
          options={options}
          series={[
            {
              data: dailySales.dailyData.map(day => day.sales)
            }
          ]}
        />
        <Box sx={{ mb: 7, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4, color: growth >= 0 ? 'success.main' : 'error.main' }}>
            {growth.toFixed(2)}%
          </Typography>
          <Typography variant='body2'>
            {growth >= 0 ? (
              <>
                Sales increased by {Math.abs(growth).toFixed(2)}% compared to previous period
                <br />
                <Typography component='span' variant='caption' sx={{ color: 'text.secondary' }}>
                  Total sales: ${dailySales.dailyData.reduce((sum, day) => sum + day.sales, 0).toFixed(2)}
                </Typography>
              </>
            ) : (
              <>
                Sales decreased by {Math.abs(growth).toFixed(1)}% compared to previous period
                <br />
                <Typography component='span' variant='caption' sx={{ color: 'text.secondary' }}>
                  Total sales: ${dailySales.dailyData.reduce((sum, day) => sum + day.sales, 0).toFixed(2)}
                </Typography>
              </>
            )}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default WeeklyOverview
