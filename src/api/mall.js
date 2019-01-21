import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/mall/list',
    method: 'get',
    data: params
  })
}
export function getMallMes(mallCode) {
  return request({
    url: '/mall/info/' + mallCode,
    method: 'get'
  })
}
export function updateMall(params) {
  return request({
    url: '/mall',
    method: 'put',
    data: params
  })
}
export function addMall(params) {
  return request({
    url: '/mall',
    method: 'post',
    data: params
  })
}
// banner
export function getBannerList(params) {
  return request({
    url: '/banner/list',
    method: 'get',
    params
  })
}
export function getBannerMes(id) {
  return request({
    url: '/banner/info/' + id,
    method: 'get'
  })
}
export function updateBanner(params) {
  return request({
    url: '/banner',
    method: 'put',
    data: params
  })
}
export function removeBanner(id) {
  return request({
    url: '/banner/' + id,
    method: 'delete'
  })
}
export function addBanner(params) {
  return request({
    url: '/banner',
    method: 'post',
    data: params
  })
}
// 活动
export function getActiveList(params) {
  return request({
    url: '/activity/list',
    method: 'get',
    params
  })
}
export function getActiveMes(id) {
  return request({
    url: '/activity/info/' + id,
    method: 'get'
  })
}
export function updateActive(params) {
  return request({
    url: '/activity',
    method: 'put',
    data: params
  })
}
export function removeActive(id) {
  return request({
    url: '/activity/' + id,
    method: 'delete'
  })
}
export function addActive(params) {
  return request({
    url: '/activity',
    method: 'post',
    data: params
  })
}
// 楼层
export function getFloorList(mallCode) {
  return request({
    url: '/floor/tree/' + mallCode,
    method: 'get'
  })
}
export function saveFloor(params) {
  return request({
    url: '/floor',
    method: 'post',
    data: params
  })
}
export function getFloorDetails(floorCode) {
  return request({
    url: '/floor/info/' + floorCode,
    method: 'get'
  })
}
export function updateloor(params) {
  return request({
    url: '/floor',
    method: 'put',
    data: params
  })
}
export function deteleFloor(floorCode) {
  return request({
    url: '/floor/' + floorCode,
    method: 'delete'
  })
}
export function getFloorStore(params) {
  return request({
    url: '/floor/store',
    method: 'get',
    params
  })
}
export function removeStoreFloor(storeId) {
  return request({
    url: '/floor/store/' + storeId,
    method: 'delete'
  })
}
export function editStoreFloor(params) {
  return request({
    url: '/floor/store/add',
    method: 'post',
    data: params
  })
}
export function getFloorInfo(params) {
  return request({
    url: '/floor/store/name',
    method: 'get',
    params
  })
}
// 销售配置
export function getSaleList(params) {
  return request({
    url: '/sale/config/list',
    method: 'get',
    params
  })
}
export function deleteSale(id) {
  return request({
    url: '/sale/config/' + id,
    method: 'delete'
  })
}
export function getSaleDetails(id) {
  return request({
    url: '/sale/config/info/' + id,
    method: 'get'
  })
}
export function updateSale(params) {
  return request({
    url: '/sale/config',
    method: 'put',
    data: params
  })
}
export function addSale(params) {
  return request({
    url: '/sale/config',
    method: 'post',
    data: params
  })
}
