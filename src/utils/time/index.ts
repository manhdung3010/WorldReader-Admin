export function formatCreateAtDate(isoDateString: string): string {
  const date = new Date(isoDateString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  }

  return date.toLocaleString('en-US', options)
}

export function displayDateTime(dateString: any) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export function isFlashSaleActive(flashSale: any) {
  const currentTime = new Date()

  const startTime = new Date(flashSale.flashSaleStartTime)
  const endTime = new Date(flashSale.flashSaleEndTime)

  return currentTime >= startTime && currentTime <= endTime
}
