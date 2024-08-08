// ** React Imports
import { ElementType, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Types
import { NavLink } from 'src/@core/layouts/types'
import { Settings } from 'src/@core/context/settingsContext'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'
import { ChevronDown, ChevronRight, CircleOutline } from 'mdi-material-ui'
import { Collapse } from '@mui/material'

interface Props {
  item: NavLink
  settings: Settings
  navVisible?: boolean
  toggleNavVisibility: () => void
}

// ** Styled Components
const MenuNavLink = styled(ListItemButton)<
  ListItemButtonProps & { component?: ElementType; target?: '_blank' | undefined }
>(({ theme }) => ({
  width: '100%',
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out',
  '&.active, &.active:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
  },
  '&.active .MuiTypography-root, &.active .MuiSvgIcon-root': {
    color: `${theme.palette.common.white} !important`
  },
  '&.hover, &.hover:hover': {
    backgroundColor: theme.palette.action.hover
  }
}))

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({ item, navVisible, toggleNavVisibility }: Props) => {
  // ** Hooks
  const router = useRouter()
  const [open, setOpen] = useState(false) // Manage dropdown state

  const IconTag: ReactNode = item.icon

  const isNavLinkActive = (path: any) => {
    if (router.pathname === path || handleURLQueries(router, path)) {
      return true
    } else {
      return false
    }
  }

  const isNavLinkChildActive = (item: any): boolean => {
    if (item.children) {
      return item.children.some((child: any) => isNavLinkActive(child.path))
    }

    return false
  }

  const handleToggle = () => {
    setOpen(!open)
  }

  useEffect(() => {
    if (isNavLinkChildActive(item)) {
      setOpen(true)
    }
  }, [item])

  return (
    <>
      <ListItem
        disablePadding
        className='nav-link'
        disabled={item.disabled || false}
        sx={{ mt: 1.5, px: '0 !important' }}
      >
        <Link passHref href={item.path === undefined ? '/' : `${item.path}`}>
          <MenuNavLink
            component={'a'}
            className={`${isNavLinkActive(item?.path) ? 'active' : ''} ${
              isNavLinkChildActive(item) || open ? 'hover' : ''
            }`}
            {...(item.openInNewTab ? { target: '_blank' } : null)}
            onClick={e => {
              if (item.path === undefined) {
                e.preventDefault()
                e.stopPropagation()
              }
              if (item.children) {
                handleToggle()
              } else if (navVisible) {
                toggleNavVisibility()
              }
            }}
            sx={{
              pl: 5.5,
              ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
            }}
          >
            <ListItemIcon
              sx={{
                mr: 2.5,
                color: 'text.primary',
                transition: 'margin .25s ease-in-out'
              }}
            >
              <UserIcon icon={IconTag} />
            </ListItemIcon>

            <MenuItemTextMetaWrapper>
              <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{item.title}</Typography>
              {item.badgeContent ? (
                <Chip
                  label={item.badgeContent}
                  color={item.badgeColor || 'primary'}
                  sx={{
                    height: 20,
                    fontWeight: 500,
                    marginLeft: 1.25,
                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                  }}
                />
              ) : null}
              {item.children && (open ? <ChevronDown /> : <ChevronRight />)}
            </MenuItemTextMetaWrapper>
          </MenuNavLink>
        </Link>
      </ListItem>
      {item.children && (
        <Collapse in={open} timeout='auto' unmountOnExit>
          <Box>
            {item.children.map((child, index) => (
              <ListItem
                key={index}
                disablePadding
                className='nav-link'
                disabled={child.disabled || false}
                sx={{ mt: 1.5, px: '0 !important' }}
              >
                <Link passHref href={child.path === undefined ? '/' : `${child.path}`}>
                  <MenuNavLink
                    component={'a'}
                    className={isNavLinkActive(child.path) ? 'active' : ''}
                    {...(child.openInNewTab ? { target: '_blank' } : null)}
                    onClick={e => {
                      if (child.path === undefined) {
                        e.preventDefault()
                        e.stopPropagation()
                      }
                      if (child.children) {
                        handleToggle()
                      }
                      if (navVisible) {
                        toggleNavVisibility()
                      }
                    }}
                    sx={{
                      pl: 5.5,
                      ...(child.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' })
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        mr: 2.5,
                        padding: '4px',
                        color: 'text.primary',
                        transition: 'margin .25s ease-in-out'
                      }}
                    >
                      {child.icon ? <UserIcon icon={child.icon} /> : <UserIcon icon={CircleOutline} subMenu={true} />}
                    </ListItemIcon>

                    <MenuItemTextMetaWrapper>
                      <Typography {...(themeConfig.menuTextTruncate && { noWrap: true })}>{child.title}</Typography>
                      {child.badgeContent ? (
                        <Chip
                          label={child.badgeContent}
                          color={child.badgeColor || 'primary'}
                          sx={{
                            height: 20,
                            fontWeight: 500,
                            marginLeft: 1.25,
                            '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                          }}
                        />
                      ) : null}
                      {child.children && (open ? <ChevronDown /> : <ChevronRight />)}
                    </MenuItemTextMetaWrapper>
                  </MenuNavLink>
                </Link>
              </ListItem>
            ))}
          </Box>
        </Collapse>
      )}
    </>
  )
}

export default VerticalNavLink
