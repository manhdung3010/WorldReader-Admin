// ** MUI Imports

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

import CardContent from '@mui/material/CardContent'
import { useRouter } from 'next/router'
import { displayDateTime } from 'src/utils/time'
import { formatCurrency } from 'src/utils/price'

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

const statusObj: colorObj = {
  PENDING: { color: 'warning' },
  RETURNED: { color: 'secondary' },
  SHIPPING: { color: 'info' },
  DONE: { color: 'success' },
  CANCELLED: { color: 'error' }
}

const payStatusObj: colorObj = {
  PENDING: { color: 'warning' },
  DONE: { color: 'success' },
  FAIL: { color: 'error' }
}

const TabOrder = ({ userOrder }: { userOrder: any }) => {
  const columns = [
    { id: 'order', label: 'ORDER' },
    { id: 'date', label: 'DATE' },
    { id: 'status', label: 'STATUS' },
    { id: 'payStatus', label: 'PAY STATUS' },
    { id: 'spent', label: 'SPENT' }
  ]

  const router = useRouter()

  return (
    <CardContent>
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
            {userOrder?.map((row: any) => (
              <TableRow hover key={row.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                <TableCell sx={{ cursor: 'pointer' }} onClick={() => router.push(`/order/details/${row.id}`)}>
                  <Typography color='primary'>#{row?.id || '-'}</Typography>
                </TableCell>
                <TableCell>{displayDateTime(row.createdAt) || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={row.status}
                    color={statusObj[row.status].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={row.payStatus}
                    color={payStatusObj[row.payStatus].color}
                    sx={{
                      height: 24,
                      fontSize: '0.75rem',
                      textTransform: 'capitalize',
                      '& .MuiChip-label': { fontWeight: 500 }
                    }}
                  />
                </TableCell>
                <TableCell>{formatCurrency(row?.totalPrice, 'VND') || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  )
}

export default TabOrder
