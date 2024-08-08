// ** React Imports
import { ReactNode } from 'react'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

export type CardHeadingProps = {
  title: string
  stats: any
  icon: ReactNode
  subtitle: string
  color?: ThemeColor
  trendNumber: any
}
