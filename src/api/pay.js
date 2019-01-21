import request from '@/utils/request'
export function getMerchantList(params) {
  return request({
    url: '/register/merchant/list',
    method: 'get',
    params
  })
}
export function getMerchantDetails(params) {
  return request({
    url: '/register/merchant/' + params,
    method: 'get'
  })
}
export function yeepayRegister(params) {
  return request({
    url: '/register/merchant/yeepay/ledger/register',
    method: 'post',
    data: params
  })
}
export function yeepaySubRegister(params) {
  return request({
    url: '/register/merchant/yeepay/sub/register',
    method: 'post',
    data: params
  })
}
export function getYeepayList(params) {
  return request({
    url: '/yeepay/config/yeepay/list',
    method: 'get',
    params
  })
}
export function updateYeepayMes(params) {
  return request({
    url: '/yeepay/config',
    method: 'put',
    data: params
  })
}
export function addYeepay(params) {
  return request({
    url: '/yeepay/config',
    method: 'post',
    data: params
  })
}
// 账户管理
export function addAccountNumber(params) {
  return request({
    url: '/account',
    method: 'post',
    data: params
  })
}
export function getAccountList(params) {
  return request({
    url: '/account/list',
    method: 'get',
    params
  })
}
export function freezeTrue(accountNumber) {
  return request({
    url: '/account/freeze/' + accountNumber,
    method: 'put'
  })
}
export function freezeFalse(accountNumber) {
  return request({
    url: '/account/unfreeze/' + accountNumber,
    method: 'put'
  })
}
export function openStatus(accountNumber) {
  return request({
    url: '/account/on/' + accountNumber,
    method: 'put'
  })
}
export function closeStatus(accountNumber) {
  return request({
    url: '/account/off/' + accountNumber,
    method: 'put'
  })
}
export function getHistoryList(params) {
  return request({
    url: '/account/history/list',
    method: 'get',
    params
  })
}
