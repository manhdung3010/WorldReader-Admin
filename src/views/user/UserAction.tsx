import { Box, Button, Stack, TextField } from '@mui/material'
import { Plus } from 'mdi-material-ui'
import { UserFiltersProps } from './UserTypes'
import { useState } from 'react'

import _ from 'lodash'
import DrawerUserForm from './DrawerUserForm'

const UserAction: React.FC<UserFiltersProps> = ({ setFormFilter }) => {
  const [openDrawerForm, setOpenDrawerForm] = useState(false)

  const [formSearch, setFormSearch] = useState({
    username: ''
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

  return (
    <>
      <Box p={3}>
        <Stack direction='row' alignContent={'center'} justifyContent={'space-between'}>
          <Box>
            {/* <Button variant='outlined' color='secondary' startIcon={<ExportVariant />}>
              Export
            </Button> */}
          </Box>

          <Stack direction='row' spacing={3} alignItems={'center'}>
            <TextField
              placeholder='Search User'
              name='username'
              value={formSearch.username}
              onChange={handleTextFieldChange}
              inputProps={{
                style: {
                  padding: 8
                }
              }}
            />
            <Button
              onClick={() => {
                setOpenDrawerForm(true)
              }}
              variant='contained'
              color='primary'
              sx={{ whiteSpace: 'nowrap' }}
              startIcon={<Plus />}
            >
              Add New User
            </Button>
          </Stack>
        </Stack>
      </Box>
      <DrawerUserForm openDrawerForm={openDrawerForm} setOpenDrawerForm={setOpenDrawerForm} />
    </>
  )
}

export default UserAction
