// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { ExportVariant } from 'mdi-material-ui'

type FileProp = {
  name: string
  type: string
  size: number
}

const CustomUploadMultiple = () => {
  // States
  const [files, setFiles] = useState<File[]>([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)))
    }
  })

  const img = files.map((file: FileProp) => (
    <Box
      key={file.name}
      sx={{
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <img
        alt={file.name}
        style={{
          maxHeight: 150
        }}
        src={URL.createObjectURL(file as any)}
      />
    </Box>
  ))

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      sx={{
        p: 2,
        border: '2px dashed #ccc'
      }}
    >
      <input {...getInputProps()} />
      {files.length ? (
        img
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
          <Typography sx={{ fontSize: 15, fontWeight: 600, mt: 2 }}>Drop files here or click to upload.</Typography>
        </Box>
      )}
    </Box>
  )
}

export default CustomUploadMultiple
