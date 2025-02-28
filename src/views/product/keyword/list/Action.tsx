/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, FormControlLabel, Stack, Switch } from '@mui/material'
import { Plus } from 'mdi-material-ui'
import { useState } from 'react'

import _ from 'lodash'
import { useRouter } from 'next/router'

const Action: React.FC<any> = ({ formFilter, setFormFilter }) => {
  const router = useRouter()

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
                router.push('/product/keyword/add')
              }}
              variant='contained'
              color='primary'
              sx={{ whiteSpace: 'nowrap' }}
              startIcon={<Plus />}
            >
              Add New Keyword
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

export default Action
