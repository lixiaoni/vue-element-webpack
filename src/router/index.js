import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
import goodsRouter from './modules/goods'
import orderRouter from './modules/order'
import payRouter from './modules/pay'
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/permission',
    component: Layout,
    redirect: '/permission/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'permission',
      icon: 'lock',
      roles: ['admin', 'editor'] // you can set roles in root nav
    },
    children: [
      {
        path: 'page',
        component: () => import('@/views/permission/page'),
        name: 'PagePermission',
        meta: {
          title: 'pagePermission',
          roles: ['admin'] // or you can only set roles in sub nav
        }
      },
      {
        path: 'directive',
        component: () => import('@/views/permission/directive'),
        name: 'DirectivePermission',
        meta: {
          title: 'directivePermission'
          // if do not set roles, means: this page does not require permission
        }
      }
    ]
  },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/svg-icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },

  {
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    name: 'systemManage',
    meta: {
      title: 'systemManage',
      icon: 'lock'
    },
    children: [
      {
        path: '/user/index',
        component: () => import('@/views/system/user/index'),
        name: 'userManage',
        icon: 'permission',
        meta: {
          title: 'userManage',
          icon: 'lock'
        }
      },
      {
        path: '/role/index',
        component: () => import('@/views/system/role/index'),
        icon: 'permission',
        name: 'roleManage',
        meta: {
          title: 'roleManage',
          icon: 'lock'
        }
      }
    ]
  },
  /** 商户**/
  {
    path: '/merchant',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: 'merchant',
      icon: 'peoples'
    },
    children: [
      {
        path: '/retailList/index',
        component: () => import('@/views/merchant/retailList/index'),
        name: 'retailList',
        meta: {
          title: 'retailList'
        }
      },
      {
        path: '/merchantDetails/index',
        component: () => import('@/views/merchant/merchantDetails/index'),
        name: 'merchantDetails',
        meta: {
          title: 'merchantDetails'
        },
        hidden: true
      },
      {
        path: '/merchantDetails/indexFen',
        component: () => import('@/views/merchant/merchantDetails/indexFen'),
        name: 'merchantDetailsFen',
        meta: {
          title: 'merchantDetailsFen'
        },
        hidden: true
      },
      {
        path: '/qualificationsManage/index',
        component: () => import('@/views/merchant/qualificationsManage/index'),
        name: 'qualificationsManage',
        meta: {
          title: 'qualificationsManage'
        }
      },
      {
        path: '/openPayment/index',
        component: () => import('@/views/merchant/openPayment/index'),
        name: 'openPayment',
        meta: {
          title: 'openPayment'
        }
      }
    ]
  },
  /** 客户**/
  {
    path: '/usersManage',
    component: Layout,
    redirect: 'noredirect',
    meta: {
      title: 'usersManage',
      icon: 'user'
    },
    children: [
      {
        path: '/userList/index',
        component: () => import('@/views/usersManage/userList/index'),
        name: 'userList',
        meta: {
          title: 'userList'
        }
      },
      {
        path: '/buyerList/index',
        component: () => import('@/views/usersManage/buyerList/index'),
        name: 'buyerList',
        meta: {
          title: 'buyerList'
        }
      }
    ]
  },
  /** 结算**/
  {
    path: '/settlement',
    component: Layout,
    alwaysShow: true,
    redirect: 'noredirect',
    meta: {
      title: 'settlement',
      icon: 'money'
    },
    children: [
      {
        path: '/settlementManage/index',
        component: () => import('@/views/settlement/settlementManage/index'),
        name: 'settlementManage',
        meta: {
          title: 'settlementManage'
        }
      }
    ]
  },
  payRouter,
  /** 小云店**/
  {
    path: '/store',
    component: Layout,
    alwaysShow: true,
    redirect: 'noredirect',
    meta: {
      title: 'store',
      icon: 'tab'
    },
    children: [
      {
        path: '/wholesaleManage/index',
        component: () => import('@/views/store/wholesaleManage/index'),
        name: 'wholesaleManage',
        meta: {
          title: 'wholesaleManage'
        }
      }
    ]
  },

  /** 商贸云管理**/
  {
    path: '/mallManage',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: {
      title: 'mallManage',
      icon: 'table'
    },
    children: [
      {
        path: '/mallManage/index',
        component: () => import('@/views/mallManage/mallList/index'),
        name: 'mallList',
        meta: {
          title: 'mallList'
        }
      },
      {
        path: '/bannerManage/index',
        component: () => import('@/views/mallManage/bannerManage/index'),
        name: 'bannerManage',
        meta: {
          title: 'bannerManage'
        }
      },
      {
        path: '/mallBanner/index',
        component: () => import('@/views/mallManage/mallBanner/index'),
        name: 'mallBanner',
        meta: {
          title: 'mallBanner'
        },
        hidden: true
      },
      {
        path: '/activeManage/index',
        component: () => import('@/views/mallManage/activeManage/index'),
        name: 'activeManage',
        meta: {
          title: 'activeManage'
        }
      },
      {
        path: '/mallActive/index',
        component: () => import('@/views/mallManage/mallActive/index'),
        name: 'mallActive',
        meta: {
          title: 'mallActive'
        },
        hidden: true
      },
      {
        path: '/mallSale/index',
        component: () => import('@/views/mallManage/mallSale/index'),
        name: 'mallSale',
        meta: {
          title: 'mallSale'
        }
      },
      {
        path: '/floorMes/index',
        component: () => import('@/views/mallManage/floorMes/index'),
        name: 'floorMes',
        meta: {
          title: 'floorMes'
        },
        hidden: true
      },
      {
        path: '/floorMes/floorStoreList',
        component: () => import('@/views/mallManage/floorMes/floorStoreList'),
        name: 'floorStoreList',
        meta: {
          title: 'floorStoreList'
        },
        hidden: true
      },
      {
        path: '/floorManage/index',
        component: () => import('@/views/mallManage/floorManage/index'),
        name: 'floorManage',
        meta: {
          title: 'floorManage'
        }
      }
    ]
  },
  /** 销售中心**/
  {
    path: '/salesCenter',
    component: Layout,
    redirect: 'noredirect',
    alwaysShow: true,
    meta: {
      title: 'salesCenter',
      icon: 'example'
    },
    children: [
      {
        path: '/cloudProducts/index',
        component: () => import('@/views/salesCenter/cloudProducts/index'),
        name: 'cloudProducts',
        meta: {
          title: 'cloudProducts'
        }
      },
      {
        path: '/cloudProducts/detail',
        component: () => import('@/views/salesCenter/cloudProducts/detail'),
        name: 'cloudProductsDetail',
        meta: {
          title: 'cloudProductsDetail'
        },
        hidden: true
      }
    ]
  },
  /** When your routing table is too long, you can split it into small modules**/
  goodsRouter,
  orderRouter,
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'createArticle', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'editArticle', noCache: true },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'articleList', icon: 'list' }
  //     }
  //   ]
  // },

  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'tab', icon: 'tab' }
  //     }
  //   ]
  // },

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    hidden: true,
    children: [
      {
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: { title: 'page401', noCache: true }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: { title: 'page404', noCache: true }
      }
    ]
  },

  // {
  //   path: '/error-log',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/errorLog/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'errorLog', icon: 'bug' }
  //     }
  //   ]
  // },

  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/exportExcel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'exportExcel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/selectExcel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'selectExcel' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/uploadExcel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'uploadExcel' }
  //     }
  //   ]
  // },

  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   meta: { title: 'zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'exportZip' }
  //     }
  //   ]
  // },

  // {
  //   path: '/theme',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'theme', icon: 'theme' }
  //     }
  //   ]
  // },

  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'clipboardDemo', icon: 'clipboard' }
  //     }
  //   ]
  // },

  // {
  //   path: '/i18n',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/i18n-demo/index'),
  //       name: 'I18n',
  //       meta: { title: 'i18n', icon: 'international' }
  //     }
  //   ]
  // },

  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'externalLink', icon: 'link' }
  //     }
  //   ]
  // },

  { path: '*', redirect: '/404', hidden: true }
]
