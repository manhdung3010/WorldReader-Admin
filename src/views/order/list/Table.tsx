// ** MUI Imports
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses, TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import { styled } from '@mui/material/styles'
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
import { Delete, Eye } from 'mdi-material-ui'

// ** Types Imports
import TableNoData from 'src/components/TableNoData'
import TableLoading from 'src/components/TableLoading'
import TableError from 'src/components/TableError'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { formatCurrency } from 'src/utils/price'
import { deleteOrder, updateOrderPaymentStatus } from 'src/api/order.service'
import { updateOrderStatus } from 'src/api/order.service'
import { useRouter } from 'next/router'

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.customColors.tableHeaderBg
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const statusColors: Record<any, any> = {
  PENDING: 'warning',
  RETURNED: 'info',
  SHIPPING: 'primary',
  DONE: 'success',
  CANCELLED: 'error'
}

const payStatusColors: Record<any, any> = {
  PENDING: 'warning',
  DONE: 'success',
  FAIL: 'error'
}

const columns = [
  { id: 'id', label: 'ID' },
  { id: 'orderCode', label: 'Order Code' },
  { id: 'totalPrice', label: 'Total lPrice' },
  { id: 'discountPrice', label: 'Discount Price' },
  { id: 'discountCode', label: 'Discount Code' },
  { id: 'orderItems', label: 'Product Quantity' },
  { id: 'status', label: 'Status' },
  { id: 'payStatus', label: 'Pay Status' },
  { id: 'action', label: 'Action' }
]

const TableContent: React.FC<any> = ({ rows, isLoading, isError }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [detailData, setDetailData] = useState<any | undefined>(undefined)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [paymentStatusDialogOpen, setPaymentStatusDialogOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteOrder(id),
    onSuccess: async (response: any) => {
      toast.success(response?.message || 'Delete success!')
      await queryClient.invalidateQueries(['ORDERS'])
      setOpenDialog(false)
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Delete failed!')
    }
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateOrderStatus(id, status),
    onSuccess: async (response: any) => {
      toast.success(response?.message || 'Status updated successfully!')
      await queryClient.invalidateQueries(['ORDERS'])
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update status!')
    }
  })

  const updatePaymentStatusMutation = useMutation({
    mutationFn: ({ id, payStatus }: { id: number; payStatus: string }) => updateOrderPaymentStatus(id, payStatus),
    onSuccess: async (response: any) => {
      toast.success(response?.message || 'Payment status updated successfully!')
      await queryClient.invalidateQueries(['ORDERS'])
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update payment status!')
    }
  })

  const handleStatusClick = (order: any) => {
    setSelectedOrder(order)
    setStatusDialogOpen(true)
  }

  const handlePaymentStatusClick = (order: any) => {
    setSelectedOrder(order)
    setPaymentStatusDialogOpen(true)
  }

  const handleStatusUpdate = (status: string) => {
    if (selectedOrder) {
      updateStatusMutation.mutate({ id: selectedOrder.id, status })
      setStatusDialogOpen(false)
    }
  }

  const handlePaymentStatusUpdate = (payStatus: string) => {
    if (selectedOrder) {
      updatePaymentStatusMutation.mutate({ id: selectedOrder.id, payStatus })
      setPaymentStatusDialogOpen(false)
    }
  }

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

  const Row = ({ row }: { row: any }) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()

    return (
      <>
        <TableRow onClick={() => setOpen(!open)} sx={{ cursor: 'pointer', backgroundColor: 'white' }}>
          <TableCell>{row.id}</TableCell>
          <TableCell>{row.orderCode || '-'}</TableCell>
          <TableCell>{formatCurrency(row.totalPrice) || '-'}</TableCell>
          <TableCell>{formatCurrency(row.discountPrice) || '-'}</TableCell>

          <TableCell>
            {row.discountCode.length > 30 ? row.discountCode.slice(0, 30) + '...' : row.discountCode || '-'}
          </TableCell>
          <TableCell>{row.orderItems?.length || '-'}</TableCell>

          <TableCell>
            <Chip
              label={row.status}
              color={statusColors[row.status as any] || 'default'}
              onClick={e => {
                e.stopPropagation()
                handleStatusClick(row)
              }}
              sx={{ cursor: 'pointer' }}
            />
          </TableCell>

          <TableCell>
            <Chip
              label={row.payStatus}
              color={payStatusColors[row.payStatus as any] || 'default'}
              onClick={e => {
                e.stopPropagation()
                handlePaymentStatusClick(row)
              }}
              sx={{ cursor: 'pointer' }}
            />
          </TableCell>

          <TableCell>
            <Tooltip title='Detail'>
              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  router.push(`/order/${row.id}`)
                }}
              >
                <Eye />
              </IconButton>
            </Tooltip>
            <Tooltip title='Remove'>
              <IconButton
                onClick={e => {
                  e.stopPropagation()
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
            <TableCell colSpan={9} sx={{ p: '0 !important', border: 'none' }}>
              <Collapse in={open} timeout='auto' unmountOnExit>
                <Box sx={{ p: 5, bgcolor: 'grey.50', borderRadius: 1, boxShadow: 1 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    Order Details
                  </Typography>
                  <Stack spacing={2}>
                    <Typography variant='body2'>
                      <strong>Customer:</strong> {row.user?.fullName || '-'} ({row.user?.email})
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Shipping Address:</strong> {row.shipping?.address || '-'}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Phone:</strong> {row.shipping?.phone || '-'}
                    </Typography>
                    <Typography variant='body2'>
                      <strong>Order Items:</strong>
                      {row?.orderItems?.length
                        ? row.orderItems.map((item: any) => (
                            <div key={item.productId}>
                              {item.product.name} - {item.quantity}x {formatCurrency(item.product.price)}
                            </div>
                          ))
                        : 'No items available'}
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

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {Object.keys(statusColors).map(status => (
              <Button
                key={status}
                variant={'outlined'}
                color={statusColors[status]}
                onClick={() => handleStatusUpdate(status)}
              >
                {status}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Payment Status Update Dialog */}
      <Dialog open={paymentStatusDialogOpen} onClose={() => setPaymentStatusDialogOpen(false)}>
        <DialogTitle>Update Payment Status</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {Object.keys(payStatusColors).map(status => (
              <Button
                key={status}
                variant={'outlined'}
                color={payStatusColors[status]}
                onClick={() => handlePaymentStatusUpdate(status)}
              >
                {status}
              </Button>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentStatusDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

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
