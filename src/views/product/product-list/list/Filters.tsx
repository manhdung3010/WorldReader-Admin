/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography
} from '@mui/material'
import { useState, useCallback } from 'react'
import _ from 'lodash'
import { FiltersProps } from 'src/views/author/Types'

const Filters: React.FC<FiltersProps> = ({ formFilter, setFormFilter }) => {
  const [formSearch, setFormSearch] = useState({
    name: '',
    code: '',
    priceMin: '',
    priceMax: '',
    status: ''
  })

  const debouncedSetFormFilter = useCallback(
    _.debounce((name: string, value: string) => {
      setFormFilter((prev: any) => ({ ...prev, [name]: value }))
    }, 1000),
    [setFormFilter]
  )

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormSearch(prev => ({ ...prev, [name]: value }))
    debouncedSetFormFilter(name, value)
  }

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    setFormFilter((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleResetFilters = () => {
    const resetValues = {
      name: '',
      code: '',
      priceMin: '',
      priceMax: '',
      status: '',
      isDiscount: null,
      display: null,
      page: 1,
      pageSize: 10
    }
    setFormFilter(resetValues)
    setFormSearch(resetValues)
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
        <Grid item xs={6}>
          <TextField
            fullWidth
            label='Search Name'
            name='name'
            value={formSearch.name}
            onChange={handleTextFieldChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label='Search Code'
            name='code'
            value={formSearch.code}
            onChange={handleTextFieldChange}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            fullWidth
            label='Min Price'
            name='priceMin'
            type='number'
            value={formSearch.priceMin}
            onChange={handleTextFieldChange}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            fullWidth
            label='Max Price'
            name='priceMax'
            type='number'
            value={formSearch.priceMax}
            onChange={handleTextFieldChange}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel id='status-select-label'>Status</InputLabel>
            <Select
              label='status'
              name='status'
              value={formFilter.status}
              onChange={handleSelectChange}
              id='status-select'
              labelId='status-select-label'
            >
              <MenuItem value=''>All</MenuItem>
              <MenuItem value='IN_STOCK'>In Stock</MenuItem>
              <MenuItem value='OUT_OF_STOCK'>Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Filters
