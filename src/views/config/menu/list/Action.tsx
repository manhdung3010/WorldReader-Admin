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
            <FormControlLabel
              value={formFilter.display}
              onChange={() =>
                setFormFilter((prev: any) => ({
                  ...prev,
                  display: !prev.display // Đảo giá trị `display`
                }))
              }
              labelPlacement='start'
              control={<Switch checked={formFilter.display} />}
              label='Display'
            />

            <FormControlLabel
              value={formFilter.homeDisplay}
              onChange={() =>
                setFormFilter((prev: any) => ({
                  ...prev,
                  homeDisplay: !prev.homeDisplay
                }))
              }
              labelPlacement='start'
              control={<Switch checked={formFilter.homeDisplay} />}
              label='Home Display'
            />

            <Button
              onClick={() => {
                router.push('/post/category/add')
              }}
              variant='contained'
              color='primary'
              sx={{ whiteSpace: 'nowrap' }}
              startIcon={<Plus />}
            >
              Add New Category
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

export default Action
