// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import CustomPagination from 'src/components/CustomPagination'
import { getOrder } from 'src/api/order.service'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const OrderContent = () => {
  const [rows, setRows] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [formFilter, setFormFilter] = useState({
    status: undefined,
    payStatus: undefined,
    priceFrom: undefined,
    priceTo: undefined,
    userId: undefined,
    createAtFrom: undefined,
    createAtTo: undefined,
    page: 1,
    pageSize: 10
  })

  const {
    data: discounts,
    isLoading,
    isError
  } = useQuery<any>(['ORDERS', formFilter], () => getOrder(formFilter), { refetchOnWindowFocus: false })

  useEffect(() => {
    if (discounts?.data) {
      setRows(discounts.data)
      setTotalPages(discounts.totalPages || Math.ceil(discounts.totalCount / formFilter.pageSize) || 1)
    }
  }, [discounts])

  return (
    <Card>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Filters formFilter={formFilter} setFormFilter={setFormFilter} />
      </LocalizationProvider>
      <Divider />
      <Action formFilter={formFilter} setFormFilter={setFormFilter} />
      <TableContent rows={rows} isLoading={isLoading} isError={isError} />
      <CustomPagination filter={formFilter} setFormFilter={setFormFilter} totalPages={totalPages} />
    </Card>
  )
}

export default OrderContent
