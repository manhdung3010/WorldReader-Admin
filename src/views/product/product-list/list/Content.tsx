// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import { getProduct } from 'src/api/product.service'
import CustomPagination from 'src/components/CustomPagination'

const ProductContent = () => {
  const [rows, setRows] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [formFilter, setFormFilter] = useState({
    name: '',
    code: '',
    priceMin: '',
    priceMax: '',
    status: '',
    isDiscount: null,
    display: null,
    page: 1,
    pageSize: 10
  })

  const {
    data: products,
    isLoading,
    isError
  } = useQuery<any>(
    [
      'PRODUCTS',
      formFilter.name,
      formFilter.code,
      formFilter.priceMin,
      formFilter.priceMax,
      formFilter.status,
      formFilter.isDiscount,
      formFilter.display,
      formFilter.page,
      formFilter.pageSize
    ],
    () => getProduct(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (products?.data) {
      setRows(products.data)
      setTotalPages(products.totalPages || Math.ceil(products.totalCount / formFilter.pageSize) || 1)
    }
  }, [products])

  return (
    <>
      <Filters formFilter={formFilter} setFormFilter={setFormFilter} />
      <Divider />
      <Action formFilter={formFilter} setFormFilter={setFormFilter} />
      <TableContent rows={rows} isLoading={isLoading} isError={isError} />
      <CustomPagination filter={formFilter} setFormFilter={setFormFilter} totalPages={totalPages} />
    </>
  )
}

export default ProductContent
