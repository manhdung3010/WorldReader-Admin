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
import { Check, Close, Delete, Pencil } from 'mdi-material-ui'
import {
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { deleteDiscount } from 'src/api/discount.service'
import { isInTime } from 'src/utils/time'
import { formatCurrency } from 'src/utils/price'

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.customColors.tableHeaderBg
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const booleanObj: any = {
  true: { color: 'info' },
  false: { color: 'error' }
}

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'name', label: 'Name' },
  { id: 'code', label: 'Code' },
  { id: 'price', label: 'Discount' },
  { id: 'usageLimit', label: 'Usage Limit' },
  { id: 'maxDiscount', label: 'Max Discount' },
  { id: 'minPurchase', label: 'Min Purchase' },
  { id: 'active', label: 'Active' },
  { id: 'display', label: 'Display' },
  { id: 'action', label: 'Action' }
]

const TableContent: React.FC<any> = ({ rows, isLoading, isError }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [detailData, setDetailData] = useState<any | undefined>(undefined)

  const queryClient = useQueryClient()
  const router = useRouter()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteDiscount(id),
    onSuccess: async (response: any) => {
      toast.success(response?.message || 'Delete success!')
      await queryClient.invalidateQueries(['DISCOUNT'])
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
    router.push(`/discount/${id}`)
  }

  const handleDeleteSubmit = () => {
    if (detailData.id !== undefined) {
      deleteMutation.mutate(detailData.id)
    } else {
      toast.error('No item selected for deletion.')
    }
  }

  const Row = ({ row }: { row: any }) => {
    const [open, setOpen] = useState(false)

    return (
      <>
        <TableRow
          onClick={() => setOpen(!open)}
          sx={{
            cursor: 'pointer',
            backgroundColor: isInTime(row?.startTime, row?.endTime) ? 'white' : '#ccc'
          }}
        >
          <TableCell>{row.id}</TableCell>
          <TableCell>{row.name || '-'}</TableCell>
          <TableCell>{row.code || '-'}</TableCell>
          <TableCell>
            {row.discountType === 'PERCENTAGE' ? `${row.price}%` : formatCurrency(row.price) || '-'}
          </TableCell>
          <TableCell>{row.usageLimit || '-'}</TableCell>
          <TableCell>{row.maxDiscount || '-'}</TableCell>
          <TableCell>{row.minPurchase || '-'}</TableCell>
          <TableCell>
            <Chip label={row.active ? <Check /> : <Close />} color={booleanObj[row.active]?.color} />
          </TableCell>
          <TableCell>
            <Chip label={row.display ? <Check /> : <Close />} color={booleanObj[row.display]?.color} />
          </TableCell>
          <TableCell>
            <Tooltip title='Edit'>
              <IconButton onClick={() => handleDetailClick(row.id)}>
                <Pencil />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove'>
              <IconButton
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

        {open && (
          <TableRow>
            <TableCell colSpan={13} sx={{ p: '0 !important', border: 'none' }}>
              <Collapse in={open} timeout='auto' unmountOnExit>
                <Box sx={{ p: 5, bgcolor: 'grey.50', borderRadius: 1, boxShadow: 1 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Discount Details
                  </Typography>
                  <Stack spacing={2}>
                    <Typography variant='body2'>
                      <strong>Start Time:</strong> {new Date(row.startTime).toLocaleString()}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>End Time:</strong> {new Date(row.endTime).toLocaleString()}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Category Discount:</strong>{' '}
                      {row.categoryDiscount?.length
                        ? row.categoryDiscount.map((cat: any) => cat.name).join(', ')
                        : 'No category available'}
                    </Typography>
                  </Stack>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )}
      </>
    )
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
              rows.map((row: any) => <Row key={row.id} row={row} />)
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
