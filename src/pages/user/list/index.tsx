// ** MUI Imports
import Grid from '@mui/material/Grid'
import UserContent from 'src/views/user/list/UserContent'
import UserHeadings from 'src/views/user/list/UserHeadings'

// ** Demo Components Imports

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
