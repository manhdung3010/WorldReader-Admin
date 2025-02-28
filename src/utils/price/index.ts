export function formatCurrency(amount: number, currency: 'VND' | 'USD'): string {
  let formattedAmount: string

  switch (currency) {
    case 'VND':
      formattedAmount = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      }).format(amount)

      return formattedAmount.replace('₫', 'đ')
    case 'USD':
      formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(amount)

      return formattedAmount
    default:
      throw new Error('Unsupported currency')
  }
}
