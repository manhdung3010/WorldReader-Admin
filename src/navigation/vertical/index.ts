// ** Icon imports

import HomeOutline from 'mdi-material-ui/HomeOutline'

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
      sectionTitle: 'Config'
    },
    {
      title: 'Config',
      icon: PostOutline,
      children: [
        {
          title: 'Menu',
          path: '/config/menu'
        },
        {
          title: 'File ChatBot',
          path: '/config/file-chatbot'
        }
      ]
    }
  ]
}

export default navigation
