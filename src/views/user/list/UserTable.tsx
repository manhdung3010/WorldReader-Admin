// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses, TableCellProps } from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'

import { styled } from '@mui/material/styles'

// ** Types Imports
import { ThemeColor } from 'src/@core/layouts/types'
import TableNoData from 'src/components/TableNoData'
import TableLoading from 'src/components/TableLoading'
import { UserTableProps } from 'src/enums/table'
import TableError from 'src/components/TableError'
import {
  Account,
  AccountEye,
  AccountStar,
  Delete,
  GenderFemale,
  GenderMale,
  GenderNonBinary,
  Pencil
} from 'mdi-material-ui'
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material'
import DrawerUserForm from './DrawerUserForm'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteUser } from 'src/api/user.service'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { stringAvatar } from 'src/utils/string-avatar'

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.customColors.tableHeaderBg
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

interface colorObj {
  [key: string]: {
    color: ThemeColor
  }
}

const activeObj: colorObj = {
  active: { color: 'info' },
  inactive: { color: 'error' }
}

const genderIcon: any = {
  male: (
    <Avatar variant='circular' sx={{ boxShadow: 3, marginRight: 4, backgroundColor: `info.tonal` }}>
      <GenderMale color='info' />
    </Avatar>
  ),
  female: (
    <Avatar variant='circular' sx={{ boxShadow: 3, marginRight: 4, backgroundColor: `error.tonal` }}>
      <GenderFemale color='error' />
    </Avatar>
  ),
  other: (
    <Avatar variant='circular' sx={{ boxShadow: 3, marginRight: 4, backgroundColor: `warning.tonal` }}>
      <GenderNonBinary color='warning' />
    </Avatar>
  )
}

const roleIcon: any = {
  admin: (
    <Avatar variant='circular' sx={{ boxShadow: 3, marginRight: 4, backgroundColor: `error.tonal` }}>
      <AccountStar color='error' />
    </Avatar>
  ),

  user: (
    <Avatar variant='circular' sx={{ boxShadow: 3, marginRight: 4, backgroundColor: `info.tonal` }}>
      <Account color='info' />
    </Avatar>
  )
}

const columns = [
  { id: 'user', label: 'User' },
  { id: 'email', label: 'Email' },
  { id: 'date', label: 'Date' },
  { id: 'gender', label: 'Gender' },
  { id: 'role', label: 'Role' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' }
]

const UserTable: React.FC<UserTableProps> = ({ rows, isLoading, isError }) => {
  const [openDrawerForm, setOpenDrawerForm] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [detailData, setDetailData] = useState<any | undefined>(undefined)

  const queryClient = useQueryClient()
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: async (response: any) => {
      toast.success(response?.message || 'Delete success!')
      await queryClient.invalidateQueries(['USERS'])
      setOpenDialog(false)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Delete failed!')
    }
  })

  const handleDeleteClick = () => {
    setOpenDialog(true)
  }

  const handleDeleteSubmit = () => {
    if (detailData.id !== undefined) {
      deleteMutation.mutate(detailData.id)
    } else {
      toast.error('No item selected for deletion.')
    }
  }

  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <StyledTableCell key={column.id}> {column.label}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isError ? (
              <TableError />
            ) : isLoading ? (
              <TableLoading length={columns.length} />
            ) : rows.length > 0 ? (
              rows.map((row: any) => (
                <TableRow hover key={row.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Stack direction='row' spacing={2}>
                      {row?.avatar ? (
                        <Avatar alt={row?.username} src={row?.avatar} />
                      ) : (
                        <Avatar {...stringAvatar(row?.fullName)} />
                      )}

                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>
                          {row.username || '-'}
                        </Typography>
                        <Typography variant='caption'>{row.fullName || '-'}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.email || '-'}</TableCell>
                  <TableCell>{row.date || '-'}</TableCell>
                  <TableCell>{row.gender ? genderIcon[row.gender] : '-'}</TableCell>
                  <TableCell>{row.role ? roleIcon[row.role] : '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={activeObj[row.status].color}
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title='Edit'>
                      <IconButton
                        aria-label='View'
                        onClick={() => {
                          setOpenDrawerForm(true)
                          setDetailData(row)
                        }}
                      >
                        <Pencil />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='View'>
                      <IconButton
                        aria-label='View'
                        onClick={() => {
                          router.push(`/user/detail/${row.id}`)
                        }}
                      >
                        <AccountEye />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Remove'>
                      <IconButton
                        aria-label='Delete'
                        onClick={() => {
                          handleDeleteClick()
                          setDetailData(row)
                        }}
                      >
                        <Delete color='error' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableNoData />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete {detailData?.username}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Stack direction='row' spacing={2} sx={{ mb: 2 }}>
            <Button onClick={() => setOpenDialog(false)} variant='outlined' color='error'>
              Cancel
            </Button>
            <Button onClick={handleDeleteSubmit} variant='contained' color='primary'>
              Delete
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <DrawerUserForm
        openDrawerForm={openDrawerForm}
        setOpenDrawerForm={setOpenDrawerForm}
        mode='edit'
        detailData={detailData}
      />
    </>
  )
}

export default UserTable
