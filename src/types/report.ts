export interface DashboardMetrics {
  metrics: {
    transactions: {
      total: number
      growth: string
      growthType: 'positive' | 'negative'
    }
    sales: {
      total: number
      formatted: string
    }
    users: {
      total: number
      formatted: string
    }
    products: {
      total: number
      formatted: string
    }
  }
  period: {
    currentMonth: string
    previousMonth: string
  }
}

export interface ProfitMetrics {
  metrics: {
    totalProfit: {
      amount: number
      formatted: string
      growth: string
      growthType: 'positive' | 'negative'
    }
    weeklyProfit: {
      amount: number
      formatted: string
      growth: string
      growthType: 'positive' | 'negative'
    }
    newProjects: {
      count: number
      formatted: string
      growth: string
      growthType: 'positive' | 'negative'
    }
    yearlyProjects: {
      count: number
      formatted: string
    }
  }
  period: {
    currentWeek: string
    previousWeek: string
    currentYear: string
    previousYear: string
  }
}

export interface DailySalesData {
  date: string
  sales: number
  orderCount: number
}

export interface DailySalesReport {
  period: 'week' | 'month' | 'quarter' | 'year'
  startDate: string
  endDate: string
  dailyData: DailySalesData[]
}

export interface TopProduct {
  product: {
    id: number
    name: string
  }
  quantity: number
  revenue: number
}

export interface TopProductsResponse {
  data: TopProduct[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  period: {
    startDate: string
    endDate: string
  }
}

export interface InventoryItem {
  productId: number
  productName: string
  currentQuantity: number
  quantityInStock: number
  quantityInUse: number
  averageDailySales: number
  daysUntilStockout: number
  status: 'OUT_OF_STOCK' | 'LOW_STOCK' | 'MEDIUM_STOCK' | 'HIGH_STOCK'
  value: number
}

export interface InventoryStatusResponse {
  data: InventoryItem[]
  pagination: {
    totalItems: number
    totalPages: number
    currentPage: number
    pageSize: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  summary: {
    totalProducts: number
    outOfStock: number
    lowStock: number
    mediumStock: number
    highStock: number
  }
}
