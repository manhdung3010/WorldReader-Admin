import { useState } from 'react'
import {
  Card,
  Typography,
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getChatbotFiles, uploadChatbotFile, deleteChatbotFile, deleteAllChatbotFiles } from 'src/api/chatbot.service'
import { Delete, DeleteSweep, CloudUpload, Pencil } from 'mdi-material-ui'
import { toast } from 'react-hot-toast'

// Define allowed file types
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv'
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function FileChatbotPage() {
  const queryClient = useQueryClient()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data: files, isLoading } = useQuery({
    queryKey: ['chatbot-files'],
    queryFn: getChatbotFiles
  })

  const uploadMutation = useMutation({
    mutationFn: uploadChatbotFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-files'] })
      setSelectedFile(null)
      toast.success('File uploaded successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to upload file')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteChatbotFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-files'] })
      toast.success('File deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete file')
    }
  })

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllChatbotFiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbot-files'] })
      toast.success('All files deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete all files')
    }
  })

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]

      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError('Invalid file type. Please upload PDF, Word, TXT, or CSV files.')

        return
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError('File size exceeds 10MB limit.')

        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = () => {
    if (selectedFile) {
      uploadMutation.mutate(selectedFile)
    }
  }

  const handleDelete = (filename: string) => {
    if (window.confirm(`Are you sure you want to delete ${filename}?`)) {
      deleteMutation.mutate(filename)
    }
  }

  const handleDeleteAll = () => {
    if (window.confirm('Are you sure you want to delete all files? This action cannot be undone.')) {
      deleteAllMutation.mutate()
    }
  }

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant='h5' sx={{ mb: 4 }}>
        Chatbot File Management
      </Typography>

      {error && (
        <Alert severity='error' sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', gap: 2, alignItems: 'center' }}>
        <Button component='label' variant='outlined' startIcon={<CloudUpload />}>
          Select File
          <input type='file' hidden onChange={handleFileChange} accept={ALLOWED_FILE_TYPES.join(',')} />
        </Button>

        {selectedFile && (
          <>
            <Typography variant='body2' sx={{ flex: 1 }}>
              Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </Typography>
            <Button variant='contained' onClick={handleUpload} disabled={uploadMutation.isLoading}>
              Upload
            </Button>
          </>
        )}

        <Button
          variant='outlined'
          color='error'
          startIcon={<DeleteSweep />}
          onClick={handleDeleteAll}
          disabled={!files?.files?.length || deleteAllMutation.isLoading}
          sx={{ ml: 'auto' }}
        >
          Delete All
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Filename</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  Loading...
                </TableCell>
              </TableRow>
            ) : files?.files?.length ? (
              files?.files.map((file: string) => (
                <TableRow key={file}>
                  <TableCell>{file}</TableCell>
                  <TableCell>{file.split('.').pop()?.toUpperCase()}</TableCell>
                  <TableCell align='right'>
                    <IconButton color='error' onClick={() => handleDelete(file)} disabled={deleteMutation.isLoading}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  No files uploaded
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  )
}
