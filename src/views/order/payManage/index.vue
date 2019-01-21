<template>
  <div style="padding:30px;">
    <el-table v-loading.body="listLoading" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="paymentNumber" width="150" label="支付流水号" align="center"/>
      <el-table-column prop="orderNumber" width="150" label="订单编号" align="center"/>
      <el-table-column prop="platAppId" width="150" label="平台商编号" align="center"/>
      <el-table-column prop="receiveMerchantNumber" width="150" label="收款方商户编号" align="center"/>
      <el-table-column prop="customerUserNo" width="150" label="付款方编号" align="center"/>
      <el-table-column prop="customerPhone" width="150" label="付款方手机号" align="center"/>
      <el-table-column prop="paymentIp" width="150" label="支付客户端ip" align="center"/>
      <el-table-column prop="payTime" width="170" label="支付下单时间" align="center">
        <template slot-scope="scope">{{ unix2CurrentTime(scope.row.payTime) }}</template>
      </el-table-column>
      <el-table-column prop="amount" width="150" label="支付金额(元)" align="center"/>
      <el-table-column prop="payWay" width="150" label="支付方式" align="center">
        <template slot-scope="scope"><span v-if="scope.row.payWay=='wx_mini_app_pay'">小程序支付</span></template>
      </el-table-column>
      <el-table-column prop="accountNumber" width="150" label="账户编号" align="center"/>
      <el-table-column prop="channel" width="150" label="支付通道" align="center">
        <template slot-scope="scope"> <span v-if="scope.row.channel=='wx_mini_app'">微信小程序支付</span></template>
      </el-table-column>
      <el-table-column prop="status" width="150" label="支付状态" align="center"/>
      <el-table-column prop="paidDate" width="170" label="支付完成时间" align="center">
        <template slot-scope="scope">{{ unix2CurrentTime(scope.row.paidDate) }}</template>
      </el-table-column>
      <el-table-column prop="timeoutDate" width="170" label="支付过期时间" align="center">
        <template slot-scope="scope">{{ unix2CurrentTime(scope.row.timeoutDate) }}</template>
      </el-table-column>
      <el-table-column prop="createDate" width="170" label="创建日期" align="center">
        <template slot-scope="scope">{{ unix2CurrentTime(scope.row.createDate) }}</template>
      </el-table-column>
      <el-table-column prop="fee" width="150" label="手续费" align="center"/>
      <el-table-column prop="thirdFee" width="180" label="第三方支付手续费" align="center"/>
      <el-table-column prop="hasInAccount" width="150" label="是否已入账" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.hasInAccount=='0'">否</span>
          <span v-if="scope.row.hasInAccount=='1'">是</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodsName" width="150" label="商品信息" align="center"/>
      <el-table-column prop="canDivideAccount" width="150" label="是否可分账" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.canDivideAccount=='0'">否</span>
          <span v-if="scope.row.canDivideAccount=='1'">是</span>
        </template>
      </el-table-column>
      <el-table-column prop="hasRefund" width="150" label="是否已退款" align="center"/>
      <!-- <el-table-column label=" 操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="getOrderDetails(scope.$index, scope.row )"
          >查看详情</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="getPayList(scope.$index, scope.row )"
          >查看支付列表</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      :current-page="listQuery.page"
      :page-size="listQuery.size"
      :total="total"
      :page-sizes="[10, 30, 50, 100]"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getPayList } from '@/api/order'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      data: '',
      imageUrl: this.Const.imageUrl,
      listLoading: false,
      total: 0,
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    unix2CurrentTime,
    /**
     * 获取列表
     */
    getList() {
      this.listLoading = true
      const orderNumber = this.$route.query.orderNumber
      const listQuery = this.listQuery
      listQuery.orderNumber = orderNumber
      getPayList(listQuery).then(response => {
        this.tableData = response.data == null ? [] : response.data.result
        this.listLoading = false
        this.total = response.data == null ? 0 : response.data.totalCount
      })
    },
    /**
     * 改变每页数量
     * @param size 页大小
     */
    handleSizeChange(size) {
      this.listQuery.pageSize = size
      this.listQuery.pageNum = 1
      this.getList()
    },
    /**
     * 改变页码
     * @param page 页号
     */
    handleCurrentChange(page) {
      this.listQuery.pageNum = page
      this.getList()
    }
  }
}
</script>
