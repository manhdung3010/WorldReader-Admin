/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Grid, Stack, TextField, Typography, MenuItem } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useState } from 'react'
import _ from 'lodash'
import { FiltersProps } from 'src/views/author/Types'
import dayjs from 'dayjs'

const Filters: React.FC<FiltersProps> = ({ formFilter, setFormFilter }) => {
  const statusOptions = ['PENDING', 'RETURNED', 'SHIPPING', 'DONE', 'CANCELLED']
  const payStatusOptions = ['PENDING', 'DONE', 'FAIL']

  // Define types
  type FormSearchType = {
    status?: string
    payStatus?: string
    priceFrom?: number
    priceTo?: number
    userId?: string
    createAtFrom?: string
    createAtTo?: string
  }

  const [formSearch, setFormSearch] = useState<FormSearchType>({
    status: '',
    payStatus: '',
    priceFrom: undefined,
    priceTo: undefined,
    userId: '',
    createAtFrom: '',
    createAtTo: ''
  })

  // Debounced function to update filters
  const debouncedSetFormFilter = _.debounce((name: string, value: string | number | undefined) => {
    setFormFilter((prev: any) => ({ ...prev, [name]: value }))
  }, 500)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormSearch(prev => ({ ...prev, [name]: value }))
    debouncedSetFormFilter(name, value)
  }

  const handleDateChange = (name: string, date: Date | null) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : ''
    setFormSearch(prev => ({ ...prev, [name]: formattedDate }))
    debouncedSetFormFilter(name, formattedDate)
  }

  const handleResetFilters = () => {
    const defaultFilters = {
      status: '',
      payStatus: '',
      priceFrom: undefined,
      priceTo: undefined,
      userId: '',
      createAtFrom: '',
      createAtTo: '',
      page: 1,
      pageSize: 10
    }
    setFormFilter(defaultFilters)
    setFormSearch(defaultFilters)
  }

  return (
    <Box p={3}>
      <Stack direction='row' alignItems='center' justifyContent='space-between' mt={1}>
        <Typography variant='h6'>Filters</Typography>
        <Button variant='contained' color='info' onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </Stack>

      <Grid container spacing={3} mt={1}>
        {/* Status Filter */}
        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            select
            label='Status'
            name='status'
            value={formSearch.status}
            onChange={handleInputChange}
          >
            {statusOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Price From */}
        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            type='number'
            label='Price From'
            name='priceFrom'
            value={formSearch.priceFrom || ''}
            onChange={handleInputChange}
          />
        </Grid>

        {/* Price To */}
        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            type='number'
            label='Price To'
            name='priceTo'
            value={formSearch.priceTo || ''}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid item xs={6} sm={4}>
          <TextField
            fullWidth
            select
            label='Pay Status'
            name='payStatus'
            value={formSearch.payStatus}
            onChange={handleInputChange}
          >
            {payStatusOptions.map(option => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Created At From */}
        <Grid item xs={6} sm={4}>
          <DatePicker
            label='Created At From'
            value={formSearch.createAtFrom ? dayjs(formSearch.createAtFrom) : null}
            onChange={(date: any) => handleDateChange('createAtFrom', date)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>

        {/* Created At To */}
        <Grid item xs={6} sm={4}>
          <DatePicker
            label='Created At To'
            value={formSearch.createAtTo ? dayjs(formSearch.createAtTo) : null}
            onChange={(date: any) => handleDateChange('createAtTo', date)}
            slotProps={{ textField: { fullWidth: true } }}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Filters
