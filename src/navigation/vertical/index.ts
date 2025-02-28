// ** Icon imports
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { AccountEditOutline, AccountOutline, Cart, PackageVariantClosed, PostOutline, Sale } from 'mdi-material-ui'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/dashboard'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      sectionTitle: 'User'
    },
    {
      title: 'User',
      icon: AccountOutline,
      children: [
        {
          title: 'List',
          path: '/user/list'
        }
      ]
    },
    {
      title: 'Author',
      icon: AccountEditOutline,
      children: [
        {
          title: 'List',
          path: '/author/list'
        }
      ]
    },
    {
      sectionTitle: 'Product'
    },
    {
      title: 'Product',
      icon: PackageVariantClosed,
      children: [
        {
          title: 'List',
          path: '/product/list'
        },
        {
          title: 'Add',
          path: '/product/add'
        },
        {
          title: 'Category',
          path: '/product/category'
        },
        {
          title: 'Keyword',
          path: '/product/keyword'
        }
      ]
    },
    {
      title: 'Discount',
      icon: Sale,
      children: [
        {
          title: 'List',
          path: '/discount/list'
        },
        {
          title: 'Add',
          path: '/discount/add'
        }
      ]
    },
    {
      title: 'Order',
      icon: Cart,
      children: [
        {
          title: 'List',
          path: '/order/list'
        }
      ]
    },
    {
      sectionTitle: 'Community'
    },
    {
      title: 'Post',
      icon: PostOutline,
      children: [
        {
          title: 'List',
          path: '/post/list'
        },
        {
          title: 'Add',
          path: '/post/add'
        },
        {
          title: 'Category',
          path: '/post/category'
        },
        {
          title: 'Keyword',
          path: '/post/keyword'
        }
      ]
    },
    {
      sectionTitle: 'User Interface'
    },
    {
      title: 'Typography',
      icon: FormatLetterCase,
      path: '/typography'
    },
    {
      title: 'Icons',
      path: '/icons',
      icon: GoogleCirclesExtended
    },
    {
      title: 'Cards',
      icon: CreditCardOutline,
      path: '/cards'
    },
    {
      title: 'Tables',
      icon: Table,
      path: '/tables'
    },
    {
      icon: CubeOutline,
      title: 'Form Layouts',
      path: '/form-layouts'
    }
  ]
}

export default navigation
