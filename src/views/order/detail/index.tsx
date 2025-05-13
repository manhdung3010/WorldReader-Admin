// ** MUI Imports
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Divider,
  Avatar,
  Stack,
  IconButton,
  Paper
} from '@mui/material'
import { getDetailOrder } from 'src/api/order.service'
import { formatCurrency } from 'src/utils/price'
import { format } from 'date-fns'
import { useRouter } from 'next/router'
import { ArrowLeft, BagPersonal, ContactlessPaymentCircle, ShippingPallet } from 'mdi-material-ui'

const OrderDetail = () => {
  const router = useRouter()
  const id = router.query.id
  const { data: orderData, isLoading } = useQuery(['ORDER_DETAIL', id], () => getDetailOrder(id))

  if (isLoading) {
    return <div>Loading...</div>
  }

  const order = orderData?.data

  const statusColors: Record<string, string> = {
    PENDING: 'warning',
    RETURNED: 'info',
    SHIPPING: 'primary',
    DONE: 'success',
    CANCELLED: 'error'
  }

  const payStatusColors: Record<string, string> = {
    PENDING: 'warning',
    DONE: 'success',
    FAIL: 'error'
  }

  return (
    <Box sx={{ p: 5 }}>
      {/* Header */}
      <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 4 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowLeft />
        </IconButton>
        <Typography variant='h4'>Order Details</Typography>
        <Typography variant='h4' color='primary'>
          {order.orderCode}
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        {/* Order Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 3 }}>
                Order Summary
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Order Date
                  </Typography>
                  <Typography variant='body1'>{format(new Date(order.createdAt), 'PPP')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Last Updated
                  </Typography>
                  <Typography variant='body1'>{format(new Date(order.updatedAt), 'PPP')}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Order Status
                  </Typography>
                  <Chip label={order.status} color={statusColors[order.status] as any} sx={{ mt: 1 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='subtitle2' color='text.secondary'>
                    Payment Status
                  </Typography>
                  <Chip label={order.payStatus} color={payStatusColors[order.payStatus] as any} sx={{ mt: 1 }} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 3 }}>
                Order Items
              </Typography>
              {order.orderItems.map((item: any) => (
                <Paper key={item.productId} sx={{ p: 2, mb: 2 }}>
                  <Grid container spacing={2} alignItems='center'>
                    <Grid item xs={2}>
                      <Avatar
                        src={item.product.avatar}
                        alt={item.product.name}
                        variant='rounded'
                        sx={{ width: 80, height: 80 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant='subtitle1'>{item.product.name}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        Quantity: {item.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant='subtitle1' color='primary'>
                        {formatCurrency(item.itemTotal)}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {formatCurrency(item.unitPrice)} each
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Customer & Shipping Info */}
        <Grid item xs={12} md={4}>
          <Stack spacing={4}>
            {/* Customer Info */}
            <Card>
              <CardContent>
                <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 3 }}>
                  <BagPersonal color='primary' />
                  <Typography variant='h6'>Customer Information</Typography>
                </Stack>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Name
                    </Typography>
                    <Typography variant='body1'>{order.user.fullName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Email
                    </Typography>
                    <Typography variant='body1'>{order.user.email}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Username
                    </Typography>
                    <Typography variant='body1'>{order.user.username}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card>
              <CardContent>
                <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 3 }}>
                  <ShippingPallet color='primary' />
                  <Typography variant='h6'>Shipping Information</Typography>
                </Stack>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Name
                    </Typography>
                    <Typography variant='body1'>{order.shipping.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Phone
                    </Typography>
                    <Typography variant='body1'>{order.shipping.phone}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Address
                    </Typography>
                    <Typography variant='body1'>{order.shipping.address}</Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle2' color='text.secondary'>
                      Address Type
                    </Typography>
                    <Typography variant='body1'>{order.shipping.addressType}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardContent>
                <Stack direction='row' spacing={2} alignItems='center' sx={{ mb: 3 }}>
                  <ContactlessPaymentCircle color='primary' />
                  <Typography variant='h6'>Order Summary</Typography>
                </Stack>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='subtitle2'>Subtotal</Typography>
                    <Typography variant='subtitle2'>{formatCurrency(order.totalPrice)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='subtitle2'>Discount</Typography>
                    <Typography variant='subtitle2' color='error'>
                      -{formatCurrency(order.discountPrice)}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h6'>Total</Typography>
                    <Typography variant='h6' color='primary'>
                      {formatCurrency(order.totalPrice)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default OrderDetail
