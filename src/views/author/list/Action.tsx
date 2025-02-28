/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Stack } from '@mui/material'
import { Plus } from 'mdi-material-ui'
import { useState } from 'react'

import _ from 'lodash'
import { FiltersProps } from '../Types'
import DrawerForm from './DrawerForm'

const Action: React.FC<FiltersProps> = ({ setFormFilter }) => {
  const [openDrawerForm, setOpenDrawerForm] = useState(false)

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
            <Button
              onClick={() => {
                setOpenDrawerForm(true)
              }}
              variant='contained'
              color='primary'
              sx={{ whiteSpace: 'nowrap' }}
              startIcon={<Plus />}
            >
              Add New Author
            </Button>
          </Stack>
        </Stack>
      </Box>
      <DrawerForm openDrawerForm={openDrawerForm} setOpenDrawerForm={setOpenDrawerForm} />
    </>
  )
}

export default Action
