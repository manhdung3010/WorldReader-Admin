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
              value={formFilter.isDiscount}
              onChange={() =>
                setFormFilter((prev: any) => ({
                  ...prev,
                  isDiscount: !prev.isDiscount
                }))
              }
              labelPlacement='start'
              control={<Switch checked={formFilter.isDiscount} />}
              label='Discount'
            />

            <Button
              onClick={() => {
                router.push('/product/add')
              }}
              variant='contained'
              color='primary'
              sx={{ whiteSpace: 'nowrap' }}
              startIcon={<Plus />}
            >
              Add New Product
            </Button>
          </Stack>
        </Stack>
      </Box>
    </>
  )
}

export default Action
