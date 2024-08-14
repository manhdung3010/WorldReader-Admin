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
import { useState } from 'react'
import { UserStatus } from 'src/enums'
import _ from 'lodash'
import { UserFiltersProps } from '../UserTypes'

const UserFilters: React.FC<UserFiltersProps> = ({ formFilter, setFormFilter }) => {
  const [formSearch, setFormSearch] = useState({
    email: ''
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

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target
    setFormFilter(prev => ({ ...prev, [name]: value }))
  }

  const handleResetFilters = () => {
    setFormFilter({
      username: '',
      email: '',
      gender: '',
      role: '',
      status: '' as UserStatus,
      page: 1,
      pageSize: 10
    })

    setFormSearch({
      email: ''
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
        <Grid item xs={3}>
          <TextField
            fullWidth
            label='Search Email'
            name='email'
            value={formSearch.email}
            onChange={handleTextFieldChange}
          />
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='gender-select-label'>Gender</InputLabel>
            <Select
              label='Gender'
              name='gender'
              value={formFilter.gender}
              onChange={handleSelectChange}
              id='gender-select'
              labelId='gender-select-label'
            >
              <MenuItem value='male'>Male</MenuItem>
              <MenuItem value='female'>Female</MenuItem>
              <MenuItem value='other'>Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='role-select-label'>Role</InputLabel>
            <Select
              label='Role'
              name='role'
              value={formFilter.role}
              onChange={handleSelectChange}
              id='role-select'
              labelId='role-select-label'
            >
              <MenuItem value='user'>User</MenuItem>
              <MenuItem value='admin'>Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={3}>
          <FormControl fullWidth>
            <InputLabel id='status-select-label'>Status</InputLabel>
            <Select
              label='Status'
              name='status'
              value={formFilter.status}
              onChange={handleSelectChange}
              id='status-select'
              labelId='status-select-label'
            >
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

export default UserFilters
