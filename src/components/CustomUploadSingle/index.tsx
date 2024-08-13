// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { Close, ExportVariant } from 'mdi-material-ui'
import toast from 'react-hot-toast'
import { deleteFile, uploadFile } from 'src/api/upload.service'
import { useMutation } from '@tanstack/react-query'
import { IconButton, Tooltip } from '@mui/material'

const CustomUploadSingle = ({ onChange }: { onChange?: (value: any) => void }) => {
  // States
  const [file, setFile] = useState<any | null>(null)

  const fileUrl = process.env.NEXT_PUBLIC_FILE_URL

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]
        handleFileChange(file)
      }
    }
  })

  const handleFileChange = async (file: File) => {
    try {
      toast.loading('Uploading file...')

      // Upload the file and get the response
      const uploadedFileResponse = await uploadFile(file)

      // Get the uploaded file URL and encode it
      const uploadedFileUrl = uploadedFileResponse.data.uploadedFiles[0]

      toast.dismiss()
      toast.success('File uploaded successfully.')

      // Set the encoded file URL
      setFile(uploadedFileUrl)

      // Trigger the onChange callback with the full file URL
      if (onChange) {
        onChange(`${fileUrl}${encodeURIComponent(uploadedFileUrl?.file_name)}`)
      }
    } catch (err) {
      toast.dismiss()
      toast.error('Error uploading file')
    }
  }

  const deleteFileMutation = useMutation((fileName: any) => deleteFile(fileName), {
    onMutate: () => {
      toast.loading('Deleting file...')
    },
    onSuccess: () => {
      toast.dismiss()
      toast.success('File deleted successfully.')
    },
    onError: () => {
      toast.dismiss()
      toast.error('Failed to delete file.')
    },
    onSettled: () => {
      toast.dismiss()
    }
  })

  const handleDeleteFile = (e: any, fileName: any) => {
    e.preventDefault()
    e.stopPropagation()
    deleteFileMutation.mutate(fileName)
    if (onChange) {
      onChange('')
    }
    setFile(null)
  }

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      sx={{
        p: 2,
        border: '2px dashed #ccc'
      }}
    >
      <input {...getInputProps()} />
      {file ? (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Tooltip title='Delete File'>
            <IconButton
              sx={{
                position: 'absolute',
                top: -10,
                right: 20
              }}
              aria-label='View'
              onClick={e => {
                handleDeleteFile(e, file?.file_name)
              }}
            >
              <Close />
            </IconButton>
          </Tooltip>
          <img
            alt={file?.fileName}
            style={{
              maxHeight: 150
            }}
            src={`${fileUrl}${encodeURIComponent(file?.file_name)}`}
          />
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column'
          }}
        >
          <Avatar variant='rounded'>
            <ExportVariant />
          </Avatar>
          <Typography sx={{ fontSize: 15, fontWeight: 600, mt: 2 }}>Drop a file here or click to upload.</Typography>
        </Box>
      )}
    </Box>
  )
}

export default CustomUploadSingle
