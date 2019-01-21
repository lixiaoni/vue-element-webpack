import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/puser/list',
    method: 'post',
    data: params
  })
}
export function getPurchaserList(params) {
  return request({
    url: '/purchaser/list',
    method: 'post',
    data: params
  })
}
export function getUserDetails(userId) {
  return request({
    url: '/puser/info/' + userId,
    method: 'get'
  })
}
export function updateUserPhone(params) {
  return request({
    url: '/puser',
    method: 'put',
    data: params
  })
}

