import { Skeleton, TableCell, TableRow } from '@mui/material'

interface TableLoadingProps {
  length: number // Specify the type for length
}

export default function TableLoading({ length }: TableLoadingProps) {
  return (
    <>
      {[...Array(5)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(length)].map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton variant='text' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
