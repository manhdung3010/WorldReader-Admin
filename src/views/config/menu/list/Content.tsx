// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import CustomPagination from 'src/components/CustomPagination'
import { getCategoryPost } from 'src/api/category-post.service'

const CategoryPostContent = () => {
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
    data: categoryPost,
    isLoading,
    isError
  } = useQuery<any>(
    [
      'CATEGORIES_POSTS',
      formFilter.name,
      formFilter.url,
      formFilter.display,
      formFilter.homeDisplay,
      formFilter.page,
      formFilter.pageSize
    ],
    () => getCategoryPost(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (categoryPost?.data) {
      setRows(categoryPost.data)
      setTotalPages(categoryPost.totalPages || Math.ceil(categoryPost.totalCount / formFilter.pageSize) || 1)
    }
  }, [categoryPost])

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

export default CategoryPostContent
