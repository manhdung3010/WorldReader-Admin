import { Avatar, Box, Modal, Stack, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getDetailAuthor } from 'src/api/author.service'
import { stringAvatar } from 'src/utils/string-avatar'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  borderRadius: 5,
  boxShadow: 24,
  p: 4
}

export default function ModalDetail({ isOpen, setIsOpen, detailData }: any) {
  const { data: detailAuthor } = useQuery(
    ['DETAIL_AUTHOR', 'AUTHORS', detailData?.id, detailData],
    () => getDetailAuthor(detailData?.id),
    {
      enabled: !!detailData?.id
    }
  )

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        setIsOpen(false)
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Stack direction='column' spacing={5}>
          <Stack direction='row' spacing={5}>
            {detailAuthor?.data?.image ? (
              <Avatar
                sx={{ width: 100, height: 100 }}
                alt={detailAuthor?.data?.data?.name}
                src={detailAuthor?.data?.image}
              />
            ) : (
              <Avatar {...stringAvatar(detailAuthor?.data?.name)} />
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant='h4'>{detailAuthor?.data.name || '-'}</Typography>
              <Typography variant='caption'>{detailAuthor?.data.date || '-'}</Typography>
              <Typography variant='inherit'>{detailAuthor?.data.nationality || '-'}</Typography>
            </Box>
          </Stack>
          <Box sx={{ maxHeight: '50vh', overflowY: 'auto' }}>
            <div
              dangerouslySetInnerHTML={{
                __html: detailAuthor?.data.biography || '-'
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Modal>
  )
}
