/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Grid, Stack, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import _ from 'lodash'
import { FiltersProps } from '../Types'

const Filters: React.FC<FiltersProps> = ({ formFilter, setFormFilter }) => {
  const [formSearch, setFormSearch] = useState({
    name: '',
    nationality: ''
  })

  const debouncedSetFormFilter = _.debounce(
    (value: string, name: string, setFormFilter: React.Dispatch<React.SetStateAction<any>>) => {
      setFormFilter((prev: any) => ({ ...prev, [name]: value }))
    },
    1000
  )

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormSearch(prev => ({ ...prev, [name]: value }))
    debouncedSetFormFilter(value, name, setFormFilter)
  }

  const handleResetFilters = () => {
    setFormFilter({
      name: '',
      nationality: '',
      page: 1,
      pageSize: 10
    })

    setFormSearch({
      name: '',
      nationality: ''
    })
  }

  return (
    <Box p={3}>
      <Stack direction='row' alignContent={'center'} justifyContent={'space-between'} mt={1}>
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
            label='Search Nationality'
            name='nationality'
            value={formSearch.nationality}
            onChange={handleTextFieldChange}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default Filters
