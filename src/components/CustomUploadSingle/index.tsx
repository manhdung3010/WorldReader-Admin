// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { Close, ExportVariant } from 'mdi-material-ui'
import toast from 'react-hot-toast'
import { uploadFile } from 'src/api/upload.service'
import { IconButton, Tooltip } from '@mui/material'

const CustomUploadSingle = ({
  value,
  onChange,
  style
}: {
  value: any
  onChange?: (value: any) => void
  style?: any
}) => {
  // States
  const [file, setFile] = useState<any | null>(null)

  const fileUrl = process.env.NEXT_PUBLIC_FILE_URL

  useEffect(() => {
    if (value) {
      setFile(value)
    }
  }, [value])

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
      setFile(`${fileUrl}${encodeURIComponent(uploadedFileUrl?.file_name)}`)

      // Trigger the onChange callback with the full file URL
      if (onChange) {
        onChange(`${fileUrl}${encodeURIComponent(uploadedFileUrl?.file_name)}`)
      }
    } catch (err) {
      toast.dismiss()
      toast.error('Error uploading file')
    }
  }

  const handleDeleteFile = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
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
        border: '2px dashed #ccc',
        borderRadius: 1,
        cursor: 'pointer',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 200,
        bgcolor: 'background.default',
        '&:hover': { borderColor: 'primary.main' }
      }}
      style={style}
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
          {file && (
            <Tooltip title='Delete File'>
              <IconButton
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'grey.100' }
                }}
                onClick={e => handleDeleteFile(e)}
              >
                <Close fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          <img
            alt={file}
            style={{
              maxHeight: 150
            }}
            src={file}
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
