import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/store/list/query',
    method: 'get',
    params
  })
}
export function getListRetail(params) {
  return request({
    url: '/store/list/retail',
    method: 'post',
    data: params
  })
}
export function getStoreMes(storeId) {
  return request({
    url: '/store/' + storeId,
    method: 'get'
  })
}
export function UpdateStoreMes(params) {
  return request({
    url: '/store',
    method: 'put',
    data: params
  })
}
export function UpdateStoreLogo(params) {
  return request({
    url: '/store/' + params.storeId + '/logo',
    method: 'put',
    params
  })
}
export function getReceipt(storeId) {
  return request({
    url: '/store/receipt/' + storeId,
    method: 'get'
  })
}
export function updateReceipt(params) {
  return request({
    url: '/store/' + params.storeId + '/receiptcode',
    method: 'put',
    params
  })
}
