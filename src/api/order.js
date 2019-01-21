import request from '@/utils/request'
export function getOrderList(params) {
  return request({
    url: '/order/list/common',
    method: 'get',
    params
  })
}
export function getPurchaseList(params) {
  return request({
    url: '/order/list/purchase',
    method: 'get',
    params
  })
}
export function getOrderDetails(orderNumber) {
  return request({
    url: '/order/' + orderNumber,
    method: 'get'
  })
}
export function getPayList(params) {
  return request({
    url: '/payment/list',
    method: 'get',
    params
  })
}
