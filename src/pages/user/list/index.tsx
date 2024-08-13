// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Demo Components Imports
import UserContent from 'src/views/user/UserContent'
import UserHeadings from 'src/views/user/UserHeadings'

const ListUserPage = () => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserHeadings />
      </Grid>
      <Grid item xs={12}>
        <UserContent />
      </Grid>
    </Grid>
  )
}

export default ListUserPage
