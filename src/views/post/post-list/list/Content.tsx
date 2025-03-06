// ** MUI Imports
import TableContent from './Table'
import { Card, Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import CustomPagination from 'src/components/CustomPagination'
import { getPost } from 'src/api/post.service'

const PostContent = () => {
  const [rows, setRows] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [formFilter, setFormFilter] = useState({
    name: '',
    url: '',
    author: '',
    homeDisplay: null,
    display: null,
    page: 1,
    pageSize: 10
  })

  const {
    data: posts,
    isLoading,
    isError
  } = useQuery<any>(
    [
      'POSTS',
      formFilter.name,
      formFilter.url,
      formFilter.author,
      formFilter.homeDisplay,
      formFilter.display,
      formFilter.page,
      formFilter.pageSize
    ],
    () => getPost(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (posts?.data) {
      setRows(posts.data)
      setTotalPages(posts.totalPages || Math.ceil(posts.totalCount / formFilter.pageSize) || 1)
    }
  }, [posts])

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

export default PostContent
