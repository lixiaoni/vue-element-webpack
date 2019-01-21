/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const orderRouter = {
  path: '/pay',
  component: Layout,
  redirect: 'noredirect',
  name: 'Pay',
  meta: {
    title: 'pay',
    icon: 'component'
  },
  children: [
    {
      path: 'yibaoMerchantsOnline',
      name: 'YibaoMerchantsOnline',
      component: () => import('@/views/pay/yibaoMerchantsOnline/index'), // Parent router-view
      meta: { title: 'yibaoMerchantsOnline' }
    },
    {
      path: 'yibaoOnlineDetails',
      name: 'YibaoOnlineDetails',
      component: () => import('@/views/pay/yibaoMerchantsOnline/details'), // Parent router-view
      meta: { title: 'yibaoOnlineDetails' },
      hidden: true
    },
    {
      path: 'yibaoBranchOnline',
      name: 'YibaoBranchOnline',
      component: () => import('@/views/pay/yibaoBranchOnline/index'), // Parent router-view
      meta: { title: 'yibaoBranchOnline' }
    },
    {
      path: 'yibaoSubDetails',
      name: 'YibaoSubDetails',
      component: () => import('@/views/pay/yibaoBranchOnline/details'), // Parent router-view
      meta: { title: 'yibaoSubDetails' },
      hidden: true
    },
    {
      path: 'yibaoPaySet',
      name: 'YibaoPaySet',
      component: () => import('@/views/pay/yibaoPaySet/index'), // Parent router-view
      meta: { title: 'yibaoPaySet' }
    },
    {
      path: 'accountManage',
      name: 'AccountManage',
      component: () => import('@/views/pay/accountManage/index'), // Parent router-view
      meta: { title: 'accountManage' }
    },
    {
      path: 'historyList',
      name: 'HistoryList',
      component: () => import('@/views/pay/accountManage/historyList'), // Parent router-view
      meta: { title: 'historyList' },
      hidden: true
    },
    {
      path: 'network',
      name: 'Network',
      component: () => import('@/views/pay/network/index'), // Parent router-view
      meta: { title: 'network' }
    },
    {
      path: 'billList',
      name: 'BillList',
      component: () => import('@/views/pay/billList/index'),
      meta: { title: 'billList' }
    },
    {
      path: 'rateSet',
      name: 'RateSet',
      component: () => import('@/views/pay/rateSet/index'),
      meta: { title: 'rateSet' }
    },
    {
      path: 'accountSet',
      name: 'AccountSet',
      component: () => import('@/views/pay/accountSet/index'),
      meta: { title: 'accountSet' }
    },
    {
      path: 'refund',
      name: 'Refund',
      component: () => import('@/views/pay/refund/index'),
      meta: { title: 'refund' }
    }
  ]
}

export default orderRouter
