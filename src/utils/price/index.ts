export function formatCurrency(amount: number, currency: 'VND' | 'USD' = 'USD'): string {
  if (isNaN(amount) || amount == null) {
    return '0 đ' // Mặc định trả về "0 đ" nếu giá trị không hợp lệ
  }

  switch (currency) {
    case 'VND':
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
      })
        .format(amount)
        .replace('₫', 'đ')

    case 'USD':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
      }).format(amount)

    default:
      throw new Error('Unsupported currency')
  }
}
