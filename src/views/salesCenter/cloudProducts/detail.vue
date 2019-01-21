
<template>
  <div v-if="showPage" style="padding:30px;">
    <el-form ref="form" :inline="true" :model="msg" label-position="right" label-width="180px">
      <el-row>
        <el-form-item label="购买人">
          <el-input v-model="msg.userInfoVO.nickName" disabled/>
        </el-form-item>

        <el-form-item label="状态">
          <el-input v-model="status" disabled/>
        </el-form-item>

        <el-form-item label="服务时间(月)">
          <el-input v-model="msg.yunStoreGoodsSnapshot.serviceReriodMonth" disabled/>
        </el-form-item>

        <el-form-item label="开始时间">
          <el-date-picker
            v-model="msg.yunStore.serviceTimeStart"
            type="date"
            placeholder="无"
            readonly
          />
        </el-form-item>

        <el-form-item label="结束时间">
          <el-date-picker
            v-model="msg.yunStore.serviceTimeEnd"
            type="date"
            placeholder="无"
            readonly
          />
        </el-form-item>

        <el-form-item label="手机号码">
          <el-input v-model="msg.userInfoVO.mobile" disabled/>
        </el-form-item>

        <el-form-item label="剩余时间">
          <el-input v-model="msg.yunStore.surplusDay" disabled/>
        </el-form-item>

        <el-form-item label="服务状态">
          <el-input v-model="msg.yunStore.status" disabled/>
        </el-form-item>

        <el-form-item label="订单号">
          <el-input v-model="msg.orderNumber" disabled/>
        </el-form-item>

        <el-form-item label="交易单号">
          <el-input v-model="msg.payVoucher" disabled/>
        </el-form-item>

        <el-form-item label="下单时间">
          <el-date-picker v-model="msg.createDate" type="date" placeholder="无" readonly/>
        </el-form-item>

        <el-form-item label="付款时间">
          <el-date-picker v-model="msg.payDate" type="date" placeholder="无" readonly/>
        </el-form-item>
      </el-row>

      <el-row v-if="msg.receiptInfo">
        <el-form-item label="发票信息">
          <el-input v-model="msg.receiptInfo.invoiceCategory" disabled/>
        </el-form-item>

        <el-form-item label="公司名称">
          <el-input v-model="msg.receiptInfo.invoiceTitle" disabled/>
        </el-form-item>

        <el-form-item label="纳税人识别号">
          <el-input v-model="msg.receiptInfo.identificationNumber" disabled/>
        </el-form-item>
      </el-row>

      <el-row>
        <el-form-item label="支付方式">
          <el-input placeholder="微信支付" disabled/>
        </el-form-item>

        <el-form-item label="订单金额">
          <el-input v-model="msg.orderAmount" disabled/>
        </el-form-item>

        <el-form-item label="优惠码支付">
          <el-input v-model="msg.yunStoreGoodsSnapshot.discountAmount" disabled/>
        </el-form-item>

        <el-form-item label="实付金额">
          <el-input v-model="msg.payAmount" disabled/>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>
<style>
.el-row {
  margin: 10px 0;
  border-bottom: 1px solid #ddd;
  padding: 20px 0;
}
.el-input {
  width: 220px;
}
</style>

<script>
import { getDetail } from '@/api/cloudOrder'
export default {
  data() {
    return {
      msg: {},
      status: '',
      showPage: false
    }
  },
  created() {
    this.num = this.$route.query.id
    this.getData()
  },
  methods: {
    getData() {
      getDetail(this.num).then(res => {
        if (!res.data.yunStore) {
          res.data.yunStore = {}
        }

        this.msg = res.data
        this.showPage = true

        let sta = ''
        switch (this.msg.orderStatus) {
          case 'paid':
            sta = '已支付'
            break
          case 'unpaid':
            sta = '待支付'
            break
          case 'canceled':
            sta = '已取消'
            break
        }
        if (this.msg.yunStore.status === true) {
          this.msg.yunStore.status = '已开通'
        } else {
          this.msg.yunStore.status = '未开通'
        }
        this.status = sta
      })
    }
  }
}
</script>
