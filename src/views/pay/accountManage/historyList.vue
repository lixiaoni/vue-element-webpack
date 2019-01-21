<template>
  <div style="padding:30px;">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="账户编号">
        <el-input v-model="formInline.accountNumber" placeholder="请输入账户编号"/>
      </el-form-item>
      <el-form-item label="商户编号">
        <el-input v-model="formInline.merchantNumber" placeholder="请输入商户编号"/>
      </el-form-item>
      <el-form-item label="支付编号">
        <el-input v-model="formInline.paymentNumber" placeholder="请输入支付编号"/>
      </el-form-item>
      <el-form-item label="账户收入">
        <el-select v-model="formInline.changeType" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="账户收入" value="in">账户收入</el-option>
          <el-option label="账户支出" value="out">账户支出</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型">
        <el-select v-model="formInline.businessType" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="销售" value="sales">销售</el-option>
          <el-option label="结算" value="settle">结算</el-option>
          <el-option label="手续费" value="sale_fee">手续费</el-option>
          <el-option label="分帐" value="divide">分帐</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="结算批次号">
        <el-input v-model="formInline.settleBatchNumber" placeholder="请输入结算批次号"/>
      </el-form-item>
      <el-form-item label="入账时间">
        <el-date-picker
          v-model="formInline.inAccountDateStart"
          placeholder="开始日期"
          value-format="timestamp"
          date-type="time"
        />
        <span>-</span>
        <el-date-picker
          v-model="formInline.inAccountDateEnd"
          placeholder="结束日期"
          value-format="timestamp"
          date-type="time"
        />
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form>
    <el-table v-loading.body="listLoading" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="accountNumber" label="账户编号" align="center"/>
      <el-table-column prop="merchantNumber" label="商户编号" align="center"/>
      <el-table-column prop="accountBalance" label="账户余额" align="center">
        <template slot-scope="scope">{{ scope.row.accountBalance }}元</template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="center">
        <template slot-scope="scope">{{ scope.row.amount }}元</template>
      </el-table-column>
      <el-table-column prop="paymentNumber" label="支付编号" align="center"/>

      <el-table-column prop="changeType" label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.changeType=='in'" style="color: #E6A23C">账户收入</span>
          <span v-if="scope.row.changeType=='out'" style="color: #67C23A">账户支出</span>
        </template>
      </el-table-column>
      <el-table-column prop="businessType" label="业务类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.businessType=='sales'" style="color: #E6A23C">销售</span>
          <span v-if="scope.row.businessType=='settle'" style="color: #67C23A">结算</span>
          <span v-if="scope.row.businessType=='sale_fee'" style="color: #43E0D6">手续费</span>
          <span v-if="scope.row.businessType=='divide'" style="color: #670ACE">分帐</span>
        </template>
      </el-table-column>
      <el-table-column prop="settleBatchNumber" label="结算批次号" align="center"/>
      <el-table-column prop="inAccountDate" label="入账时间" align="center">
        <template slot-scope="scope">
          <span>{{ unix2CurrentTime(scope.row.inAccountDate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center"/>
      <el-table-column prop="goodsName" label="商品名称" align="center"/>
      <el-table-column prop="canSettle" label="是否可结算" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.canSettle=='0'">否</span>
          <span v-if="scope.row.canSettle=='1'">是</span>
        </template>
      </el-table-column>
      <el-table-column prop="hasSettle" label="是否已结算" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.hasSettle=='0'">否</span>
          <span v-if="scope.row.hasSettle=='1'">是</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.page"
      :page-size="listQuery.size"
      :total="total"
      :page-sizes="[10, 30, 50, 100]"
      value-format="timestamp"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>
<script>
import { getHistoryList } from '@/api/pay'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      formInline: {
        accountNumber: '',
        changeType: '',
        merchantNumber: '',
        inAccountDateStart: '',
        inAccountDateEnd: ''
      },
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
    onSubmit() {
      const formInline = this.formInline
      const inAccountDateStart = formInline.inAccountDateStart
      const inAccountDateEnd = formInline.inAccountDateEnd
      if (inAccountDateStart > inAccountDateEnd) {
        this.$message.error('请选择结束时间大于开始时间！')
        return
      }
      this.listQuery = Object.assign(this.listQuery, formInline)
      this.listQuery.pageNum = 1
      this.getList()
    },
    /**
     * 获取列表
     */
    getList() {
      this.listLoading = true
      const accountNumber = this.$route.query.accountNumber
      const params = this.listQuery
      params.accountNumber = accountNumber
      getHistoryList(params).then(response => {
        this.tableData = response.data.result
        this.listLoading = false
        this.total = response.data.totalCount
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
<style>
.el-date-editor .el-range-separator {
  padding: 0;
}
</style>

