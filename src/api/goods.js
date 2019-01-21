import request from '@/utils/request'
// 分类
export function getClassList() {
  return request({
    url: '/shop/category/tree',
    method: 'get'
  })
}
export function deteleClass(categoryCode) {
  return request({
    url: '/shop/category/' + categoryCode,
    method: 'delete'
  })
}
export function getClassDetails(categoryCode) {
  return request({
    url: '/shop/category/info/' + categoryCode,
    method: 'get'
  })
}
export function saveClass(params) {
  return request({
    url: '/shop/category/save',
    method: 'post',
    data: params
  })
}
export function updateClass(params) {
  return request({
    url: '/shop/category/update',
    method: 'put',
    data: params
  })
}
// 商品
export function getGoodsList(params) {
  return request({
    url: '/goods/list',
    method: 'post',
    data: params
  })
}
export function offGoods(params) {
  return request({
    url: '/goods/' + params.storeId + '/goods/status/off',
    method: 'post',
    data: params.goodsIdList
  })
}
export function onGoods(params) {
  return request({
    url: '/goods/' + params.storeId + '/goods/status/on',
    method: 'post',
    data: params.goodsIdList
  })
}
export function deteleGoods(goodsId) {
  return request({
    url: '/goods/' + goodsId,
    method: 'delete'
  })
}
