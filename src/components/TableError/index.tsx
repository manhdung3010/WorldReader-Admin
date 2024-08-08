import { Box, TableCell, TableRow } from '@mui/material'
import { FileAlertOutline } from 'mdi-material-ui'

export default function TableError() {
  return (
    <TableRow>
      <TableCell colSpan={6} sx={{ padding: 0 }}>
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
          <FileAlertOutline sx={{ fontSize: 50 }} />
          Failed to load data
        </Box>
      </TableCell>
    </TableRow>
  )
}
