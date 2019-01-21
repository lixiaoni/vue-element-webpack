<template>
  <div style="padding:30px;">
    <div class="block">
      <div class="clearfix">
        <span>订单详情</span>
      </div>
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="consigneeInfo"
        class="demo-form-inline"
      >
        <el-form-item label="收货人姓名">
          <el-input v-model="consigneeInfo.userName" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="收货人电话">
          <el-input v-model="consigneeInfo.userPhone" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="收货人地址">
          <el-input v-model="consigneeInfo.detailAddress" disabled="disabled"/>
        </el-form-item>
      </el-form>
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="orderDetailVOList"
        class="demo-form-inline"
      >
        <el-form-item label="商品名称">
          <el-input v-model="orderDetailVOList.goodsName" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="商品数量">
          <el-input v-model="orderDetailVOList.num" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input v-model="orderDetailVOList.goodsId" disabled="disabled"/>
        </el-form-item>
      </el-form>
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="formInline"
        class="demo-form-inline"
      >
        <el-form-item label="店铺ID">
          <el-input v-model="formInline.storeId" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="订单编号">
          <el-input v-model="formInline.orderNumber" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="订单金额">
          <el-input v-model="formInline.orderAmount" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="物流方式">
          <el-select v-model="formInline.logisticsMode" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="其他" value="0">没有物流</el-option>
            <el-option label="门店自提" value="1">门店自提</el-option>
            <el-option label="物流配送" value="2">物流配送</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票信息">
          <el-input v-model="formInline.receiptInfo" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="邮费信息">
          <el-input v-model="postageType" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-input v-model="formInline.orderStatus" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="订单分类">
          <el-select v-model="formInline.orderCategory" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="批发订单" value="1">批发订单</el-option>
            <el-option label="小云店订单" value="2">小云店订单</el-option>
            <el-option label="零售订单" value="3">零售订单</el-option>
            <el-option label="门店订单" value="4">门店订单</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款方商户编号">
          <el-input v-model="formInline.receiveMerchantNumber" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="付款方用户编号">
          <el-input v-model="formInline.customerUserNo" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="店铺ID">
          <el-input v-model="formInline.storeId" disabled="disabled"/>
        </el-form-item>
        <el-form-item label=" 支付状态">
          <el-select v-model="formInline.payStatus" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="已支付" value="0">已支付</el-option>
            <el-option label="未支付" value="1">未支付</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付金额">
          <el-input v-model="formInline.payAmount" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="支付时间">
          <template >{{ unix2CurrentTime(formInline.payDate) }}</template>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="formInline.payWay" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="线下支付" value="offline_pay">线下支付</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 商品数量">
          <el-input v-model="formInline.num" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="退款状态">
          <el-select v-model="formInline.refundStatus" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="已退款" value="1">已退款</el-option>
            <el-option label="退款失" value="2">退款失</el-option>
            <el-option label="退款中" value="0">退款中</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户备注">
          <el-input v-model="formInline.userMemo" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="物流方式">
          <el-select v-model="formInline.logisticsMode" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="门店自提" value="1">门店自提</el-option>
            <el-option label="物流配送" value="2">物流配送</el-option>
            <el-option label="没有物流" value="0">没有物流</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 取货状态">
          <el-select v-model="formInline.claimStatus" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="待取货" value="0">待取货</el-option>
            <el-option label="已取货" value="1">已取货</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="取货码">
          <el-input v-model="formInline.claimGoodsNum" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="快递状态">
          <el-select v-model="formInline.expressStatus" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="待发货" value="0">待发货</el-option>
            <el-option label="已发货" value="1">已发货</el-option>
            <el-option label="已收货" value="2">已收货</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递单号">
          <el-input v-model="formInline.expressNumber" disabled="disabled"/>
        </el-form-item>
        <el-form-item label=" 快递公司名称">
          <el-input v-model="formInline.expressCompany" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="订单取消原因">
          <el-input v-model="formInline.cancelReason" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="取消时间">
          <el-input v-model="formInline.cancelDate" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="商家备注">
          <el-input v-model="formInline.remark" disabled="disabled"/>
        </el-form-item>
        <el-form-item label=" 发货时间">
          <template >{{ unix2CurrentTime(formInline.deliverDate) }}</template>
        </el-form-item>
        <el-form-item label="完成时间">
          <template>{{ unix2CurrentTime(formInline.finishDate) }}</template>
        </el-form-item>
        <el-form-item label="创建时间">
          <template >{{ unix2CurrentTime(formInline.createDate) }}</template>
        </el-form-item>
        <el-form-item label="用户删除标识">
          <el-select v-model="formInline.customerDelFlag" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="">未知</el-option>
            <el-option label="未删除" value="0">未删除</el-option>
            <el-option label="已删除" value="1">已删除</el-option>
            <el-option label="彻底删除" value="2">彻底删除</el-option>
          </el-select>
        </el-form-item>
        <div>
          <el-form-item class="pay-img" label="支付凭证">
            <img :src="payVoucher" style="width:400px;height:auto">
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getOrderDetails } from '@/api/order'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      payVoucherShow: true,
      consigneeInfo: {},
      postageType: '',
      orderDetailVOList: {},
      payVoucher: '',
      formInline: {},
      formLabelWidth: '150px',
      listLoading: false
    }
  },
  created() {
    this.getOrderDetails()
  },
  methods: {
    unix2CurrentTime,
    /**
     * 查看详情
     */
    getOrderDetails() {
      this.listLoading = true
      const orderNumber = this.$route.query.orderNumber
      getOrderDetails(orderNumber).then(response => {
        this.formInline = response.data
        this.consigneeInfo = response.data.consigneeInfo
        this.orderDetailVOList = response.data.orderDetailVOList[0]
        this.postageType = response.data.postageinfo.postageType
        this.payVoucher = this.imageUrl + '/' + response.data.payVoucher
      })
    }
  }
}
</script>
<style>
.pay-img img {
    width: 400px;height: auto;
}
</style>

