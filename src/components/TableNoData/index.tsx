import { Box, TableCell, TableRow } from '@mui/material'
import { FileRemoveOutline } from 'mdi-material-ui'

export default function TableNoData() {
  return (
    <TableRow>
      <TableCell colSpan={6} sx={{ padding: 0, width: '100%' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            py: 10
          }}
        >
          <FileRemoveOutline sx={{ fontSize: 50 }} />
          No data
        </Box>
      </TableCell>
    </TableRow>
  )
}
