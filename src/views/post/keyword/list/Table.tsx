// ** MUI Imports
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
import { Delete, Pencil } from 'mdi-material-ui'
import {
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
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { deleteKeywordPost } from 'src/api/keyword-post.service'

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.customColors.tableHeaderBg
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const columns = [
  { id: 'name', label: 'Name' },
  { id: 'code', label: 'Code' },
  { id: 'action', label: 'Action' }
]

const TableContent: React.FC<any> = ({ rows, isLoading, isError }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [detailData, setDetailData] = useState<any | undefined>(undefined)

  const queryClient = useQueryClient()
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteKeywordPost(id),
    onSuccess: async (response: any) => {
      toast.success(response?.message || 'Delete success!')
      await queryClient.invalidateQueries(['KEYWORDS_POST'])
      setOpenDialog(false)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Delete failed!')
    }
  })

  const handleDeleteClick = () => {
    setOpenDialog(true)
  }

  const handleDetailClick = (id: any) => {
    router.push(`/post/keyword/${id}`)
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
                <StyledTableCell key={column.id}>{column.label}</StyledTableCell>
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
                  <TableCell>{row.name || '-'}</TableCell>
                  <TableCell>{row.code || '-'}</TableCell>

                  <TableCell>
                    <Tooltip title='Edit'>
                      <IconButton
                        aria-label='View'
                        onClick={() => {
                          handleDetailClick(row?.id)
                        }}
                      >
                        <Pencil />
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
    </>
  )
}

export default TableContent
