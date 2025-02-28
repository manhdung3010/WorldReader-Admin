// ** MUI Imports
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses, TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import { styled } from '@mui/material/styles'

// ** Types Imports
import TableNoData from 'src/components/TableNoData'
import TableLoading from 'src/components/TableLoading'
import TableError from 'src/components/TableError'
import { AccountEye, Delete, Pencil } from 'mdi-material-ui'
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
import DrawerForm from './DrawerForm'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { stringAvatar } from 'src/utils/string-avatar'
import ModalDetail from './ModalDetail'
import { deleteAuthor } from 'src/api/author.service'

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.customColors.tableHeaderBg
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const columns = [
  { id: 'author', label: 'Author' },
  { id: 'name', label: 'Name' },
  { id: 'date', label: 'Date' },
  { id: 'nationality', label: 'Nationality' },
  { id: 'biography', label: 'Biography' },
  { id: 'action', label: 'Action' }
]

const TableContent: React.FC<any> = ({ rows, isLoading, isError }) => {
  const [openDrawerForm, setOpenDrawerForm] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [detailData, setDetailData] = useState<any | undefined>(undefined)
  const [openModalDetail, setOpenModalDetail] = useState(false)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteAuthor(id),
    onSuccess: async (response: any) => {
      toast.success(response?.message || 'Delete success!')
      await queryClient.invalidateQueries(['AUTHORS'])
      setOpenDialog(false)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Delete failed!')
    }
  })

  const handleDeleteClick = () => {
    setOpenDialog(true)
  }

  const handleDetailClick = () => {
    setOpenModalDetail(true)
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
                      {row?.image ? (
                        <Avatar alt={row?.name} src={row?.image} />
                      ) : (
                        <Avatar {...stringAvatar(row?.name)} />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell>{row.name || '-'}</TableCell>
                  <TableCell>{row.date || '-'}</TableCell>
                  <TableCell>{row.nationality || '-'}</TableCell>
                  <TableCell sx={{ maxWidth: 400 }}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: row.biography.length > 100 ? row.biography.slice(0, 100) + '...' : row.biography || '-'
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
                          handleDetailClick()
                          setDetailData(row)
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

      <DrawerForm
        openDrawerForm={openDrawerForm}
        setOpenDrawerForm={setOpenDrawerForm}
        mode='edit'
        detailData={detailData}
      />

      <ModalDetail isOpen={openModalDetail} setIsOpen={setOpenModalDetail} detailData={detailData} />
    </>
  )
}

export default TableContent
