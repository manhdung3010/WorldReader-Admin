// ** MUI Imports
import Card from '@mui/material/Card'
import TableContent from './Table'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Action from './Action'
import Filters from './Filters'
import CustomPagination from 'src/components/CustomPagination'
import { getMenu } from 'src/api/menu.service'

const MenuContent = () => {
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
    data: menu,
    isLoading,
    isError
  } = useQuery<any>(
    [
      'MENU',
      formFilter.name,
      formFilter.url,
      formFilter.display,
      formFilter.homeDisplay,
      formFilter.page,
      formFilter.pageSize
    ],
    () => getMenu(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (menu?.data) {
      setRows(menu.data)
      setTotalPages(menu.totalPages || Math.ceil(menu.totalCount / formFilter.pageSize) || 1)
    }
  }, [menu])

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

export default MenuContent
