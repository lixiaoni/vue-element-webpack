<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="商户编号">
        <el-input v-model="formInline.merchantNumber" placeholder="请输入商户编号"/>
      </el-form-item>
      <el-form-item label="商户类型">
        <el-select v-model="formInline.merchantType" placeholder="请选择">
          <el-option label="全部商户" value="">全部商户</el-option>
          <el-option label="批发商" value="1">批零商</el-option>
          <el-option label="零售商" value="2">零售商</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="在线支付状态">
        <el-select v-model="formInline.onlinePay" placeholder="请选择">
          <el-option label="全部" value="">全部</el-option>
          <el-option label="未开通" value="0">未开通</el-option>
          <el-option label="已开通" value="1">已开通</el-option>
          <el-option label="未设置" value="2">未设置</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商户名称">
        <el-input v-model="formInline.merchantName" placeholder="请输入商户名称"/>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form>
    <el-table
      v-loading.body="listLoading"
      :data="tableData"
      highlight-current-row
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        align="center"/>
      <el-table-column
        prop="merchantNumber"
        label="商户编号"
        align="center"/>
      <el-table-column
        prop="merchantName"
        label="商户名称"
        align="center"/>
      <el-table-column
        prop="linkman"
        label="联系人"
        align="center"/>
      <el-table-column
        prop="linkmanPhone"
        label="联系电话"
        align="center"/>
      <el-table-column
        prop="merchantCharacter"
        label="商户性质"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.merchantCharacter==&quot;1&quot;">个人</span>
          <span v-if="scope.row.merchantCharacter==&quot;2&quot;">个体</span>
          <span v-if="scope.row.merchantCharacter==&quot;3&quot;">企业</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="merchantType"
        label="商户类型"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.merchantType==&quot;1&quot;">批发商</span>
          <span v-if="scope.row.merchantType==&quot;2&quot;">零售商</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="onlinePay"
        label="在线支付状态"
        align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.onlinePay==&quot;0&quot;">未开通</span>
          <span v-if="scope.row.onlinePay==&quot;1&quot;">已开通</span>
          <span v-if="scope.row.onlinePay==&quot;2&quot;">未设置</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="onlinePay"
        label="操作"
        width="200"
        align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.onlinePay=='0'">
            <el-button
              size="mini"
              type="primary"
              @click="getDetailsFun(scope.$index, scope.row )">编辑</el-button>
          </div>
          <div v-if="scope.row.onlinePay=='1'">
            <el-button
              size="mini"
              type="warning"
              @click="closeFun(scope.$index, scope.row )">关闭</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="getDetailsFun(scope.$index, scope.row )">编辑</el-button>
          </div>
          <div v-if="scope.row.onlinePay=='2'">
            <el-button
              size="mini"
              type="primary"
              @click="getDetailsFun(scope.$index, scope.row )">编辑</el-button>
          </div>
        </template>
      </el-table-column>
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
    <el-dialog :visible.sync="dialogTableVisible" title="支付信息配置">
      <el-form :model="merchantMes">
        <el-form-item :label-width="formLabelWidth" label="商户编号">
          {{ merchantNumber }}
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="在线支付">
          <el-radio v-model="merchantMes.onlinePay" label="0">未开通</el-radio>
          <el-radio v-model="merchantMes.onlinePay" label="1">已开通</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="支付信息">
          小程序支付
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateMes">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getListMerchantRetail, closePay, getPayMes, savePayMes } from '@/api/merchant'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      formLabelWidth: '130px',
      merchantNumber: '',
      formInline: {
        merchantType: '',
        merchantName: '',
        merchantNumber: '',
        onlinePay: ''
      },
      merchantMes: {},
      listLoading: false,
      total: 0,
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      tableData: [],
      dialogTableVisible: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    unix2CurrentTime,
    onSubmit() {
      this.listQuery = Object.assign(this.listQuery, this.formInline)
      this.listQuery.pageNum = 1
      this.getList()
    },
    /**
       * 获取列表
       */
    getList() {
      this.listLoading = true
      getListMerchantRetail(this.listQuery).then(response => {
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
    },
    getDetailsFun(index, row) {
      this.dialogTableVisible = true
      const merchantNumber = row.merchantNumber
      this.merchantNumber = merchantNumber
      this.merchantMes = {}
      getPayMes(merchantNumber).then(response => {
        const merchantMes = response.data
        if (merchantMes) {
          if (merchantMes.onlinePay) {
            merchantMes.onlinePay = '1'
          } else {
            merchantMes.onlinePay = '0'
          }
          this.merchantMes = merchantMes
        }
      })
    },
    updateMes() {
      const merchantMes = this.merchantMes
      if (merchantMes.onlinePay) {
        const params = this.merchantMes
        if (params.onlinePay === '0') {
          params.onlinePay = false
        }
        if (params.onlinePay === '1') {
          params.onlinePay = true
        }
        params.payProduct = '小程序支付'
        params.merchantNumber = this.merchantNumber
        savePayMes(params).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功!'
          })
          this.getList()
          this.dialogTableVisible = false
        })
      } else {
        this.$message.error('请选择支付信息！')
      }
    },
    closeFun(index, row) {
      const merchantNumber = row.merchantNumber
      this.$confirm('是否关闭商户在线支付?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        closePay(merchantNumber).then(response => {
          this.$message({
            type: 'success',
            message: '关闭成功!'
          })
          this.getList()
        })
      }).catch(() => {

      })
    }
  }
}
</script>
