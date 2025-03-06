// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import CustomPagination from 'src/components/CustomPagination'
import { getDiscount } from 'src/api/discount.service'

const DiscountContent = () => {
  const [rows, setRows] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [formFilter, setFormFilter] = useState({
    name: '',
    code: '',
    discountType: '', // 'fixed_amount' | 'percentage'
    display: undefined, // boolean
    active: undefined, // boolean
    price: undefined, // number
    usageLimit: undefined, // number
    maxDiscount: undefined, // number
    minPurchase: undefined, // number
    startTime: '', // string (date-time)
    endTime: '', // string (date-time)
    isFullDiscount: undefined, // boolean
    categoryDiscount: [], // array of numbers
    page: 1, // number
    pageSize: 10 // number
  })

  const {
    data: discounts,
    isLoading,
    isError
  } = useQuery<any>(['DISCOUNT', formFilter], () => getDiscount(formFilter), { refetchOnWindowFocus: false })

  useEffect(() => {
    if (discounts?.data) {
      setRows(discounts.data)
      setTotalPages(discounts.totalPages || Math.ceil(discounts.totalCount / formFilter.pageSize) || 1)
    }
  }, [discounts])

  return (
    <Card>
      <Filters formFilter={formFilter} setFormFilter={setFormFilter} />
      <Divider />
      <Action formFilter={formFilter} setFormFilter={setFormFilter} />
      <TableContent rows={rows} isLoading={isLoading} isError={isError} />
      <CustomPagination filter={formFilter} setFormFilter={setFormFilter} totalPages={totalPages} />
    </Card>
  )
}

export default DiscountContent
