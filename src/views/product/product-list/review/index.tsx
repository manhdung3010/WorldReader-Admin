import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { useState, useMemo } from 'react'
import { getReviewByProductId, updateReviewProduct, deleteReviewProduct } from 'src/api/review-product.service'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Pagination,
  CircularProgress,
  Rating,
  Paper,
  IconButton,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material'
import { format } from 'date-fns'
import { Delete, Pencil } from 'mdi-material-ui'

interface Review {
  id: number
  name: string
  phone: string
  star: number
  content: string
  display: boolean
  image: string[]
  createdAt: string
}

export default function ReviewProductDetail() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editReview, setEditReview] = useState<Review | null>(null)
  const [openSnackbar, setOpenSnackbar] = useState<{ message: string; severity: 'success' | 'error' } | null>(null)
  const limit = 20
  const productId = router.query.id

  // Validate productId
  const isValidId = typeof productId === 'string' && productId !== 'add' && !isNaN(Number(productId))

  // Fetch reviews theo productId và phân trang
  const {
    data: reviewsData,
    isLoading,
    isError,
    error
  } = useQuery<any>(
    ['PRODUCT_REVIEW_DETAIL', productId, page],
    () => getReviewByProductId(Number(productId), page, limit),
    { enabled: isValidId }
  )

  const totalPages = useMemo(() => {
    return reviewsData?.data?.total ? Math.ceil(reviewsData.data.total / limit) : 1
  }, [reviewsData])

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  // Xử lý xóa review
  const handleDelete = async (id: number) => {
    try {
      await deleteReviewProduct(id)
      setOpenSnackbar({ message: 'Review deleted successfully', severity: 'success' })
      queryClient.invalidateQueries(['PRODUCT_REVIEW_DETAIL', productId, page])
    } catch {
      setOpenSnackbar({ message: 'Failed to delete review', severity: 'error' })
    }
  }

  // Xử lý submit cập nhật review
  const handleEditSubmit = async () => {
    if (!editReview) return
    try {
      const { id, ...payload } = editReview
      await updateReviewProduct(id, payload)
      setOpenSnackbar({ message: 'Review updated successfully', severity: 'success' })
      setEditReview(null)
      queryClient.invalidateQueries(['PRODUCT_REVIEW_DETAIL', productId, page])
    } catch {
      setOpenSnackbar({ message: 'Failed to update review', severity: 'error' })
    }
  }

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center' my={4}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box my={4} textAlign='center'>
        <Typography color='error'>Error fetching reviews: {(error as any)?.message}</Typography>
      </Box>
    )
  }

  if (!isValidId) {
    return (
      <Box my={4} textAlign='center'>
        <Typography color='error'>Invalid product ID</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant='h4' gutterBottom>
        Product Reviews
      </Typography>
      <Typography variant='h6' gutterBottom>
        Total Reviews: {reviewsData?.data?.total || 0}
      </Typography>
      {reviewsData?.data?.data && reviewsData.data.data.length > 0 ? (
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {reviewsData.data.data.map((review: Review, index: number) => (
              <Box key={review.id}>
                <ListItem alignItems='flex-start'>
                  <ListItemAvatar>
                    <Avatar>{review.name.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display='flex' alignItems='center' justifyContent='space-between'>
                        <Box display='flex' alignItems='center' gap={1}>
                          <Typography variant='subtitle1'>{review.name}</Typography>
                          <Rating value={review.star} readOnly size='small' />
                        </Box>
                        <Box>
                          <IconButton size='small' onClick={() => setEditReview(review)}>
                            <Pencil fontSize='small' />
                          </IconButton>
                          <IconButton size='small' onClick={() => handleDelete(review.id)}>
                            <Delete fontSize='small' />
                          </IconButton>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant='body2' color='text.secondary'>
                          {format(new Date(review.createdAt), 'PPPp')}
                        </Typography>
                        <Typography variant='body1' sx={{ mt: 1 }}>
                          {review.content}
                        </Typography>
                        {review.image && review.image.length > 0 && (
                          <Box mt={1} display='flex' gap={1}>
                            {review.image.map((img: string, idx: number) => (
                              <img
                                key={`${review.id}-${idx}`}
                                src={img}
                                alt={`Review image ${idx + 1}`}
                                style={{ maxWidth: 100, maxHeight: 100, objectFit: 'cover' }}
                              />
                            ))}
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                {index < reviewsData.data.data.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography>No reviews found for this product.</Typography>
      )}
      {totalPages > 1 && (
        <Box display='flex' justifyContent='center' mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color='primary'
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Modal Edit Review */}
      <Dialog open={!!editReview} onClose={() => setEditReview(null)} fullWidth maxWidth='sm'>
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin='normal'
            label='Name'
            value={editReview?.name || ''}
            onChange={e => setEditReview(prev => prev && { ...prev, name: e.target.value })}
          />
          <TextField
            fullWidth
            margin='normal'
            label='Phone'
            value={editReview?.phone || ''}
            onChange={e => setEditReview(prev => prev && { ...prev, phone: e.target.value })}
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            margin='normal'
            label='Content'
            value={editReview?.content || ''}
            onChange={e => setEditReview(prev => prev && { ...prev, content: e.target.value })}
          />
          <TextField
            fullWidth
            type='number'
            inputProps={{ min: 0, max: 5 }}
            margin='normal'
            label='Star'
            value={editReview?.star || 0}
            onChange={e => setEditReview(prev => prev && { ...prev, star: +e.target.value })}
          />
          <FormControlLabel
            control={
              <Switch
                checked={editReview?.display ?? true}
                onChange={e => setEditReview(prev => prev && { ...prev, display: e.target.checked })}
              />
            }
            label='Display'
          />
          {/* Có thể tích hợp chức năng upload ảnh tại đây */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditReview(null)}>Cancel</Button>
          <Button variant='contained' onClick={handleEditSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={!!openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(null)}
        message={openSnackbar?.message}
      />
    </Box>
  )
}
