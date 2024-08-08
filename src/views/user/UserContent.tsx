// ** MUI Imports
import Card from '@mui/material/Card'
import UserTable from './UserTable'
import UserFilters from './UserFilters'
import UserAction from './UserAction'
import { Divider } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getUser } from 'src/api/user.service'
import { Gender, Role, UserStatus } from 'src/enums'
import { UserType } from 'src/enums/row'

const UserContent = () => {
  const [rows, setRows] = useState<UserType[]>([])

  const [formFilter, setFormFilter] = useState({
    username: '',
    email: '',
    gender: '',
    role: '',
    status: '' as UserStatus,
    page: 1,
    pageSize: 10
  })

  const {
    data: users,
    isLoading,
    isError
  } = useQuery(
    [
      'USERS',
      formFilter.username,
      formFilter.email,
      formFilter.gender,
      formFilter.role,
      formFilter.page,
      formFilter.status,
      formFilter.pageSize
    ],
    () => getUser(formFilter),
    {
      refetchOnWindowFocus: false
    }
  )

  useEffect(() => {
    if (users?.data) {
      const transformedRows: UserType[] = users.data.map((user: any) => ({
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        date: user.date,
        status: user.status as UserStatus,
        gender: user.gender as Gender,
        role: user.role as Role,
        createAt: user.createAt
      }))
      setRows(transformedRows)
    }
  }, [users])

  return (
    <Card>
      <UserFilters formFilter={formFilter} setFormFilter={setFormFilter} />
      <Divider />
      <UserAction formFilter={formFilter} setFormFilter={setFormFilter} />
      <UserTable rows={rows} isLoading={isLoading} isError={isError} />
    </Card>
  )
}

export default UserContent
