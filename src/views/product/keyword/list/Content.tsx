// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import { getKeywordProduct } from 'src/api/keyword-product.service'
import CustomPagination from 'src/components/CustomPagination'

const KeywordContent = () => {
  const [rows, setRows] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [formFilter, setFormFilter] = useState({
    name: '',
    code: '',
    page: 1,
    pageSize: 10
  })

  const {
    data: keywords,
    isLoading,
    isError
  } = useQuery<any>(
    ['KEYWORDS_PRODUCT', formFilter.name, formFilter.code, formFilter.page, formFilter.pageSize],
    () => getKeywordProduct(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (keywords?.data) {
      setRows(keywords.data)
      setTotalPages(keywords.totalPages || Math.ceil(keywords.totalCount / formFilter.pageSize) || 1)
    }
  }, [keywords])

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

export default KeywordContent
