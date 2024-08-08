import { Avatar, Box, Card, Grid, Typography } from '@mui/material'
import { CardHeadingProps } from './types'

export default function CardHeading(props: CardHeadingProps) {
  const { title, subtitle, color, icon, stats, trendNumber } = props

  return (
    <Card>
      <Grid container p={5}>
        <Grid item xs={10}>
          <Typography sx={{ fontWeight: 500, fontSize: '0.875rem' }}>{title}</Typography>
          <Box sx={{ marginTop: 1.5, display: 'flex', flexWrap: 'wrap', marginBottom: 1.5, alignItems: 'center' }}>
            <Typography variant='h5' sx={{ mr: 2 }}>
              {stats}
            </Typography>
            <Typography
              component='sup'
              variant='body2'
              sx={{ color: trendNumber <= 0 ? 'error.main' : 'success.main' }}
            >
              {`(${trendNumber * 100}%)`}
            </Typography>
          </Box>
          <Typography component='sup' variant='body2'>
            {subtitle}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Avatar
            variant='rounded'
            sx={{ boxShadow: 3, marginRight: 4, color: 'common.white', backgroundColor: `${color}.main` }}
          >
            {icon}
          </Avatar>
        </Grid>
      </Grid>
    </Card>
  )
}
