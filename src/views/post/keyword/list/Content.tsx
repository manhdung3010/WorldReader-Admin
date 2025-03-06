// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import CustomPagination from 'src/components/CustomPagination'
import { getKeywordPost } from 'src/api/keyword-post.service'

const KeywordPostContent = () => {
  const [rows, setRows] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [formFilter, setFormFilter] = useState({
    name: '',
    code: '',
    page: 1,
    pageSize: 10
  })

  const {
    data: keywordPost,
    isLoading,
    isError
  } = useQuery<any>(
    ['KEYWORDS_POST', formFilter.name, formFilter.code, formFilter.page, formFilter.pageSize],
    () => getKeywordPost(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (keywordPost?.data) {
      setRows(keywordPost.data)
      setTotalPages(keywordPost.totalPages || Math.ceil(keywordPost.totalCount / formFilter.pageSize) || 1)
    }
  }, [keywordPost])

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

export default KeywordPostContent
