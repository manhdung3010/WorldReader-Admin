// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { UserType } from 'src/enums/row'
import { getAuthor } from 'src/api/author.service'
import Action from './Action'
import Filters from './Filters'
import CustomPagination from 'src/components/CustomPagination'

const AuthorContent = () => {
  const [rows, setRows] = useState<any[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const [formFilter, setFormFilter] = useState({
    name: '',
    nationality: '',
    page: 1,
    pageSize: 10
  })

  const {
    data: authors,
    isLoading,
    isError
  } = useQuery<any>(
    ['AUTHORS', formFilter.name, formFilter.nationality, formFilter.page, formFilter.pageSize],
    () => getAuthor(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (authors?.data) {
      const transformedRows: UserType[] = authors.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        date: user.date,
        nationality: user.nationality,
        biography: user.biography,
        image: user.image
      }))
      setRows(transformedRows)
      setTotalPages(authors.totalPages || Math.ceil(authors.totalCount / formFilter.pageSize) || 1)
    }
  }, [authors])

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

export default AuthorContent
