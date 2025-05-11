import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Chip,
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
  InputLabel
} from '@mui/material'
import { getInventoryStatus } from 'src/api/report.service'
import { formatCurrency } from 'src/utils/format'

const statusColors: any = {
  OUT_OF_STOCK: 'error',
  LOW_STOCK: 'warning',
  MEDIUM_STOCK: 'info',
  HIGH_STOCK: 'success'
}

export default function InventoryStatus() {
  const [inventoryData, setInventoryData] = useState<any>(null)
  const [status, setStatus] = useState<any>('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true)
        const response = await getInventoryStatus({ status: status || undefined })
        setInventoryData(response.data)
      } catch (error) {
        console.error('Error fetching inventory status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [status])

  if (!inventoryData) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant='h6'>Inventory Status</Typography>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} label='Status' onChange={e => setStatus(e.target.value)} size='small'>
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='OUT_OF_STOCK'>Out of Stock</MenuItem>
              <MenuItem value='LOW_STOCK'>Low Stock</MenuItem>
              <MenuItem value='MEDIUM_STOCK'>Medium Stock</MenuItem>
              <MenuItem value='HIGH_STOCK'>High Stock</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography color='textSecondary'>Total Products</Typography>
              <Typography variant='h6'>{inventoryData.summary.totalProducts}</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography color='textSecondary'>Out of Stock</Typography>
              <Typography variant='h6' color='error'>
                {inventoryData.summary.outOfStock}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography color='textSecondary'>Low Stock</Typography>
              <Typography variant='h6' color='warning.main'>
                {inventoryData.summary.lowStock}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography color='textSecondary'>In Stock</Typography>
              <Typography variant='h6' color='success.main'>
                {inventoryData.summary.mediumStock + inventoryData.summary.highStock}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align='right'>Current Quantity</TableCell>
                <TableCell align='right'>Daily Sales</TableCell>
                <TableCell align='right'>Days Until Stockout</TableCell>
                <TableCell align='right'>Status</TableCell>
                <TableCell align='right'>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inventoryData.data.map((item: any) => (
                <TableRow key={item.productId}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align='right'>{item.currentQuantity}</TableCell>
                  <TableCell align='right'>{item.averageDailySales.toFixed(1)}</TableCell>
                  <TableCell align='right'>
                    {item.daysUntilStockout === Infinity ? 'N/A' : item.daysUntilStockout}
                  </TableCell>
                  <TableCell align='right'>
                    <Chip label={item.status} color={statusColors[item.status] as any} size='small' />
                  </TableCell>
                  <TableCell align='right'>{formatCurrency(item.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
