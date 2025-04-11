// ** MUI Imports
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses, TableCellProps } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'

import { styled, useTheme } from '@mui/material/styles'

// ** Types Imports
import TableNoData from 'src/components/TableNoData'
import TableLoading from 'src/components/TableLoading'
import TableError from 'src/components/TableError'
import { Check, Close, Comment, Delete, Pencil } from 'mdi-material-ui'
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Rating,
  Stack,
  Tooltip,
  Typography
} from '@mui/material'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { stringAvatar } from 'src/utils/string-avatar'
import { useRouter } from 'next/router'
import { deleteProduct } from 'src/api/product.service'
import { displayDateTime, isInTime } from 'src/utils/time'

const StyledTableCell = styled(TableCell)<TableCellProps>(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.customColors.tableHeaderBg
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14
  }
}))

const columns = [
  { id: 'avatar', label: 'Avatar' },
  { id: 'name', label: 'Name' },
  { id: 'code', label: 'Code' },
  { id: 'price', label: 'Price' },
  { id: 'discountPrice', label: 'Discount Price' },
  { id: 'displayQuantity', label: 'Quantity' },
  { id: 'quantityInUse', label: 'Use' },
  { id: 'quantityInStock', label: 'Stock' },
  { id: 'display', label: 'Display' },
  { id: 'status', label: 'Status' },
  { id: 'action', label: 'Action' }
]

const booleanObj: any = {
  true: { color: 'info' },
  false: { color: 'error' }
}

const statusObj: any = {
  IN_STOCK: { color: 'info' },
  OUT_OF_STOCK: { color: 'error' }
}

const TableContent: React.FC<any> = ({ rows, isLoading, isError }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [detailData, setDetailData] = useState<any | undefined>(undefined)
  const theme = useTheme()
  const queryClient = useQueryClient()
  const router = useRouter()

  const homeUrl = process.env.NEXT_PUBLIC_PAGE_URL

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: async (response: any) => {
      toast.success(response?.message || 'Delete success!')
      await queryClient.invalidateQueries(['PRODUCTS'])
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
    router.push(`/product/${id}`)
  }

  const handleDeleteSubmit = () => {
    if (detailData.id !== undefined) {
      deleteMutation.mutate(detailData.id)
    } else {
      toast.error('No item selected for deletion.')
    }
  }

  const Row = (props: { row: any }) => {
    // ** Props
    const { row } = props

    // ** State
    const [open, setOpen] = useState<boolean>(false)

    return (
      <>
        <TableRow
          onClick={() => setOpen(!open)}
          sx={{
            cursor: 'pointer',
            border: isInTime(row?.flashSale?.flashSaleStartTime, row?.flashSale?.flashSaleEndTime)
              ? '1px solid red '
              : ''
          }}
        >
          <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
            <Stack direction='row' spacing={2}>
              {row?.avatar ? <Avatar alt={row?.name} src={row?.avatar} /> : <Avatar {...stringAvatar(row?.name)} />}
            </Stack>
          </TableCell>
          <TableCell>{row.name.length > 30 ? row.name.slice(0, 30) + '...' : row.name || '-'}</TableCell>
          <TableCell>{row.code.length > 30 ? row.code.slice(0, 30) + '...' : row.code || '-'}</TableCell>
          <TableCell>{row.price || '-'}</TableCell>
          <TableCell>{row.discountPrice || '-'}</TableCell>
          <TableCell>{row?.productWarehouse?.displayQuantity || '-'}</TableCell>
          <TableCell>{row?.productWarehouse?.quantityInUse || '-'}</TableCell>
          <TableCell>{row?.productWarehouse?.quantityInStock || '-'}</TableCell>
          <TableCell>
            <Chip label={row.display ? <Check /> : <Close />} color={booleanObj[row.display].color} />
          </TableCell>
          <TableCell>
            <Chip label={row.status ? 'In Stock' : 'Out Of Stock'} color={statusObj[row.status].color} />
          </TableCell>

          <TableCell>
            <Stack direction='row'>
              <Tooltip title='Comment'>
                <IconButton
                  aria-label='Comment'
                  onClick={() => {
                    router.push(`/product/${row?.id}/review`)
                  }}
                >
                  <Comment />
                </IconButton>
              </Tooltip>
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
            </Stack>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            colSpan={12}
            sx={{ width: '100%', border: 'none', p: '0 !important', '& > *': { borderBottom: 'unset' } }}
          >
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box
                sx={{
                  p: 5,
                  bgcolor: theme.palette.grey[50],
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
                <Typography
                  variant='subtitle2'
                  gutterBottom
                  sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
                >
                  Product Details
                </Typography>
                <Stack spacing={2}>
                  {' '}
                  {/* Increased spacing for better layout */}
                  <Typography variant='body2'>
                    <strong>Category:</strong>{' '}
                    {row.categories?.map((cat: any) => cat.name).join(', ') || 'No category available'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>URL:</strong>{' '}
                    {row.url && row.url !== 'string2' ? (
                      <a
                        href={`${homeUrl}${row.url}`}
                        target='_blank'
                        rel='noopener noreferrer'
                        style={{ color: theme.palette.primary.main }}
                      >
                        {`${homeUrl}${row.url}`}
                      </a>
                    ) : (
                      '-'
                    )}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Keywords:</strong>{' '}
                    {row.keywords?.map((key: any) => key.name).join(', ') || 'No keywords available'}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Additional Information:</strong>{' '}
                    {row.information?.length > 0
                      ? row.information.map((info: any) => `${info.name}: ${info.content}`).join(', ')
                      : 'No information available'}
                  </Typography>
                  <Typography variant='body2' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <strong>Average Rating:</strong>{' '}
                    {row.averageStarRating > 0 ? (
                      <Rating value={row.averageStarRating} readOnly size='small' precision={0.5} />
                    ) : (
                      'No ratings yet'
                    )}
                  </Typography>
                  <Typography variant='body2'>
                    <strong>Flash Sale:</strong>{' '}
                    {row.flashSale?.flashSalePrice > 0 ? (
                      <span>
                        Price:{' '}
                        <span style={{ color: theme.palette.success.main }}>
                          {row.flashSale.flashSalePrice.toLocaleString()} VND
                        </span>
                        , Discount: <strong>{row.flashSale.flashSaleDiscount}%</strong>, Start:{' '}
                        {displayDateTime(row.flashSale.flashSaleStartTime)}, End:{' '}
                        {displayDateTime(row.flashSale.flashSaleEndTime)}
                      </span>
                    ) : (
                      'No flash sale available'
                    )}
                  </Typography>
                  <Divider sx={{ my: 2 }} /> {/* Added spacing for Divider */}
                  <Typography variant='body2'>
                    <strong>Description:</strong>{' '}
                    <p
                      dangerouslySetInnerHTML={{
                        __html: row.description || 'No description available'
                      }}
                    />
                  </Typography>
                </Stack>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
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
              rows.map((row: any) => <Row key={row.name} row={row} />)
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
