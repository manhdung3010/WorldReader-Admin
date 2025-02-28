// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import { getCategory } from 'src/api/category.service'
import CustomPagination from 'src/components/CustomPagination'

const CategoryContent = () => {
  const [rows, setRows] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [formFilter, setFormFilter] = useState({
    name: '',
    url: '',
    display: null,
    homeDisplay: null,
    page: 1,
    pageSize: 10
  })

  const {
    data: categories,
    isLoading,
    isError
  } = useQuery<any>(
    [
      'CATEGORIES',
      formFilter.name,
      formFilter.url,
      formFilter.display,
      formFilter.homeDisplay,
      formFilter.page,
      formFilter.pageSize
    ],
    () => getCategory(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (categories?.data) {
      setRows(categories.data)
      setTotalPages(categories.totalPages || Math.ceil(categories.totalCount / formFilter.pageSize) || 1)
    }
  }, [categories])

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

export default CategoryContent
