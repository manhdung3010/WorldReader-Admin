import { Box, Pagination, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { ChangeEvent } from 'react'

const CustomPagination = ({ filter, setFormFilter, totalPages }: any) => {
  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setFormFilter((prev: any) => ({
      ...prev,
      page
    }))
  }

  const handlePageSizeChange = (event: any) => {
    const newPageSize = event.target.value as number
    setFormFilter((prev: any) => ({
      ...prev,
      pageSize: newPageSize,
      page: 1 // Reset về page 1 khi thay đổi pageSize
    }))
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'end',
        alignItems: 'center',
        p: 4
      }}
    >
      <FormControl>
        <InputLabel>Rows per page</InputLabel>
        <Select value={filter.pageSize} label='Rows per page' sx={{ height: 44 }} onChange={handlePageSizeChange}>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={25}>25</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
      <Pagination
        count={totalPages}
        page={filter.page}
        onChange={handlePageChange} // Sửa: Gắn với Pagination
        color='primary'
        showFirstButton
        showLastButton
      />
    </Box>
  )
}

export default CustomPagination
