// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { IconButton, Tooltip } from '@mui/material'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { Close, ExportVariant } from 'mdi-material-ui'
import toast from 'react-hot-toast'
import { uploadFiles } from 'src/api/upload.service'

interface Props {
  value?: any
  onChange?: (value: string[]) => void
  style?: React.CSSProperties
}

const CustomUploadMultiple = ({ value = [], onChange, style }: Props) => {
  const [files, setFiles] = useState<any[]>([])
  const fileUrl = process.env.NEXT_PUBLIC_FILE_URL || 'http://localhost:5000/files/'

  useEffect(() => {
    if (value) {
      setFiles(value)
    }
  }, [value])

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        await handleFileChange(acceptedFiles)
      }
    }
  })

  const handleFileChange = async (newFiles: File[]) => {
    try {
      toast.loading('Uploading files...', { id: 'upload' })
      const response = await uploadFiles(newFiles)

      const updatedFiles = response?.data?.uploadedFiles?.map(
        (file: any) => `${fileUrl}${encodeURIComponent(file?.file_name)}`
      )

      setFiles(prev => [...prev, ...updatedFiles])

      if (onChange) {
        onChange([...value, ...updatedFiles])
      }

      toast.success('Files uploaded successfully.', { id: 'upload' })
    } catch (err) {
      toast.error('Error uploading files', { id: 'upload' })
      console.error('Upload error:', err)
    }
  }

  const handleDeleteFile = (e: React.MouseEvent, fileUrl: string) => {
    e.preventDefault()
    e.stopPropagation()

    const updatedFiles = files.filter(file => file !== fileUrl)
    setFiles(updatedFiles)

    if (onChange) {
      onChange(updatedFiles)
    }
  }

  const renderFiles = () => {
    return files.map((file: any, index) => (
      <Box
        key={`${file.url}-${index}`}
        sx={{
          position: 'relative',
          display: 'inline-flex',
          m: 1,
          '&:hover': { opacity: 0.9 }
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
              onClick={e => handleDeleteFile(e, file)}
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
    ))
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
      {files.length > 0 || value.length > 0 ? (
        renderFiles()
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          <Avatar variant='rounded' sx={{ mb: 2, bgcolor: 'primary.light' }}>
            <ExportVariant />
          </Avatar>
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>Drop files here or click to upload</Typography>
          <Typography variant='caption'>(Only *.png, *.jpg, *.jpeg, *.gif images accepted)</Typography>
        </Box>
      )}
    </Box>
  )
}

export default CustomUploadMultiple
