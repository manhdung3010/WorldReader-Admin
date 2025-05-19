import axiosClient from '.'

interface ReportParams {
  period?: 'week' | 'month' | 'quarter' | 'year'
  page?: number
  pageSize?: number
  status?: 'OUT_OF_STOCK' | 'LOW_STOCK' | 'MEDIUM_STOCK' | 'HIGH_STOCK'
  threshold?: number
  startDate?: Date
  endDate?: Date
}

export function getSales(params: ReportParams) {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

  return axiosClient.get('admin/reports/sales', { params: filteredParams })
}

export function getTopSellingProducts(params: ReportParams) {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

  return axiosClient.get('admin/reports/top-selling', { params: filteredParams })
}

export function getLowStockProducts(params: ReportParams) {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

  return axiosClient.get('admin/reports/low-stock', { params: filteredParams })
}

export function getInventoryStatus(params: any) {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

  return axiosClient.get('admin/reports/inventory/status', { params: filteredParams })
}

export function getInventoryAlerts() {
  return axiosClient.get('admin/reports/inventory/alerts')
}

export function getInventoryReport(params: ReportParams) {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

  return axiosClient.get('admin/reports/inventory', { params: filteredParams })
}

export function getDailySalesReport(params: ReportParams) {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

  return axiosClient.get('admin/reports/daily-sales', { params: filteredParams })
}

export function getProductPerformanceReport(productId: number, params: ReportParams) {
  const filteredParams = Object.fromEntries(Object.entries(params).filter(([, value]) => value !== ''))

  return axiosClient.get(`admin/reports/product/${productId}/performance`, { params: filteredParams })
}

export function getDashboardMetrics() {
  return axiosClient.get('admin/reports/dashboard-metrics')
}

export function getProfitMetrics() {
  return axiosClient.get('admin/reports/profit-metrics')
}
