import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Box
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency } from 'src/utils/format'
import type { TopProductsResponse, TopProduct } from 'src/types/report' 
import { getTopSellingProducts } from 'src/api/report.service'

export default function TopProducts() {
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  const { data, isLoading } = useQuery<TopProductsResponse>({
    queryKey: ['topProducts', period],
    queryFn: () => getTopSellingProducts({ period }).then((res: { data: TopProductsResponse }) => res.data)
  })

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box display='flex' justifyContent='center' alignItems='center' minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card>
      <CardHeader
        title='Top Selling Products'
        action={
          <FormControl size='small' sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={period}
              label='Period'
              onChange={e => setPeriod(e.target.value as 'week' | 'month' | 'quarter' | 'year')}
            >
              <MenuItem value='week'>This Week</MenuItem>
              <MenuItem value='month'>This Month</MenuItem>
              <MenuItem value='quarter'>This Quarter</MenuItem>
              <MenuItem value='year'>This Year</MenuItem>
            </Select>
          </FormControl>
        }
      />
      <CardContent>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align='right'>Quantity</TableCell>
                <TableCell align='right'>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.data.map((product: TopProduct) => (
                <TableRow key={product.product.id}>
                  <TableCell>{product.product.name}</TableCell>
                  <TableCell align='right'>{product.quantity}</TableCell>
                  <TableCell align='right'>{formatCurrency(product.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
