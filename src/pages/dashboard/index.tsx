// ** MUI Imports
import { Grid } from '@mui/material'

// ** React Query Imports
import { useQuery } from '@tanstack/react-query'

// ** API Imports
import { getDashboardMetrics, getProfitMetrics, getDailySalesReport } from 'src/api/report.service'

// ** Custom Components Imports
import TopProducts from 'src/views/dashboard/TopProducts'
import InventoryStatus from 'src/views/dashboard/InventoryStatus'

// ** Types Imports
import type { DashboardMetrics, ProfitMetrics, DailySalesReport } from 'src/types/report'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import { BriefcaseVariantOutline, CurrencyUsd, HelpCircleOutline, Poll } from 'mdi-material-ui'

import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

const Dashboard = () => {
  const { data: dashboardMetrics } = useQuery<DashboardMetrics>({
    queryKey: ['dashboardMetrics'],
    queryFn: () => getDashboardMetrics().then((res: { data: DashboardMetrics }) => res.data)
  })

  const { data: profitMetrics } = useQuery<ProfitMetrics>({
    queryKey: ['profitMetrics'],
    queryFn: () => getProfitMetrics().then((res: { data: ProfitMetrics }) => res.data)
  })

  const { data: dailySales } = useQuery<DailySalesReport>({
    queryKey: ['dailySales', 'month'],
    queryFn: () => getDailySalesReport({ period: 'month' }).then((res: { data: DailySalesReport }) => res.data)
  })

  if (!dashboardMetrics || !profitMetrics || !dailySales) {
    return null
  }

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12} md={12}>
          <StatisticsCard dashboardMetrics={dashboardMetrics} />
        </Grid>

        {/* Weekly Overview */}
        <Grid item xs={12} md={6}>
          <WeeklyOverview dailySales={dailySales} />
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={profitMetrics.metrics.totalProfit.formatted}
                icon={<Poll />}
                color='success'
                trendNumber={`${profitMetrics.metrics.totalProfit.growth}%`}
                trend={profitMetrics.metrics.totalProfit.growthType}
                title='Total Profit'
                subtitle='Total Profit'
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={profitMetrics.metrics.weeklyProfit.formatted}
                title='Weekly Profit'
                trend={profitMetrics.metrics.weeklyProfit.growthType}
                color='secondary'
                trendNumber={`${profitMetrics.metrics.weeklyProfit.growth}%`}
                subtitle='Weekly Profit'
                icon={<CurrencyUsd />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={profitMetrics.metrics.newProjects.formatted}
                trend={profitMetrics.metrics.newProjects.growthType}
                trendNumber={`${profitMetrics.metrics.newProjects.growth}%`}
                title='New Projects'
                subtitle='Yearly Projects'
                icon={<BriefcaseVariantOutline />}
              />
            </Grid>
            <Grid item xs={6}>
              <CardStatisticsVerticalComponent
                stats={profitMetrics.metrics.yearlyProjects.formatted}
                color='warning'
                title='Yearly Projects'
                subtitle='Total Projects'
                icon={<HelpCircleOutline />}
                trendNumber='0%'
                trend='positive'
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={12}>
          <TopProducts />
        </Grid>

        {/* Inventory Status */}
        <Grid item xs={12} md={12}>
          <InventoryStatus />
        </Grid>
      </Grid>
    </>
  )
}

export default Dashboard
