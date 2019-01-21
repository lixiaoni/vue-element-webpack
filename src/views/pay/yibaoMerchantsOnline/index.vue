<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="商户编号">
        <el-input v-model="formInline.merchantNumber" placeholder="请输入商户编号"/>
      </el-form-item>
      <el-form-item label="入网状态">
        <el-select v-model="formInline.registerStatus" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="注册失败" value="regist_fail">注册失败</el-option>
          <el-option label="注册成功" value="regist_success">注册成功</el-option>
          <el-option label="初始化" value="init">初始化</el-option>
          <el-option label="未知" value="unkonown">未知</el-option>
          <el-option label="审核中" value="regist_processing">审核中</el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="primary" @click="addData">添加分账方</el-button>
    </el-form>
    <el-table v-loading.body="listLoading" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="thirdInnerNumber" width="200" label="第三方支付内部流水号" align="center"/>
      <el-table-column prop="requestNumber" width="200" label="入网请求编号" align="center"/>
      <el-table-column prop="merchantNumber" width="200" label="商户编号" align="center"/>
      <el-table-column prop="thirdParentMerchantNumber" width="200" label="第三方支付父商户编号" align="center"/>
      <el-table-column prop="thirdMerchantNumber" width="200" label="第三方支付商户编号" align="center"/>
      <el-table-column prop="thirdMerchantRole" width="200" label="第三方支付商户角色" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.thirdMerchantRole=='sub_merchant'" style="color: #E73E48">子商户</span>
          <span v-if="scope.row.thirdMerchantRole=='ledger_merchant'" style="color: #E6A23C">分账方</span>
        </template>
      </el-table-column>
      <el-table-column prop="registerStatus" width="200" label="入网状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.registerStatus=='unkonown'" style="color: #E73E48">未知</span>
          <span v-if="scope.row.registerStatus=='init'" style="color: #E6A23C">初始化</span>
          <span v-if="scope.row.registerStatus=='register_fail'" style="color: #67C23A">注册失败</span>
          <span v-if="scope.row.registerStatus=='register_success'" style="color: #43E0D6">注册成功</span>
          <span v-if="scope.row.registerStatus=='register_processing'" style="color: #670ACE">审核中</span>
        </template>
      </el-table-column>
      <el-table-column prop="registerChannel" label="入网渠道" width="200" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.registerChannel=='wx_pay'" style="color: #E73E48">微信支付</span>
          <span v-if="scope.row.registerChannel=='yeepay'" style="color: #E6A23C">易宝支付</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" width="180" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.updateDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="onlinePay" label="操作" fixed="right" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="getDetails(scope.$index, scope.row )">详情</el-button>
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
    <el-dialog :visible.sync="merchantSignShow" title="商户编号">
      <el-form :model="formData" :rules="rules" :ref="formData">
        <el-form-item :label-width="formLabelWidth" prop="merchantSign" label="商户编号">
          <el-input v-model="formData.merchantSign" placeholder="请输入商户编号"/>
        </el-form-item>
        <el-form-item align="center">
          <template>
            <el-button type="primary" @click="getDetailsData">确定</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible" title="商户信息">
      <el-form :model="rowData">
        <el-form-item :label-width="formLabelWidth" label="入网请求编号">
          <el-input v-model="rowData.requestNumber" disabled="disabled" placeholder/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="第三方支付内部流水号">
          <el-input v-model="rowData.thirdInnerNumber" disabled="disabled" placeholder/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="商户编号">
          <el-input v-model="rowData.merchantNumber" disabled="disabled" placeholder="商户编号"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="第三方支付父商户编号">
          <el-input v-model="rowData.thirdParentMerchantNumber" disabled="disabled" placeholder/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="第三方支付商户编号">
          <el-input v-model="rowData.thirdMerchantNumber" disabled="disabled" placeholder/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="第三方支付商户角色">
          <el-select v-model="rowData.thirdMerchantRole" disabled="disabled" placeholder="请选择">
            <el-option label="子商户" value="sub_merchant">子商户</el-option>
            <el-option label="分账方" value="ledger_merchant">分账方</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="入网状态">
          <el-select v-model="rowData.registerStatus" disabled="disabled" placeholder="请选择">
            <el-option label="微信支付" value="unkonown">微信支付</el-option>
            <el-option label="初始化" value="init">初始化</el-option>
            <el-option label="注册失败" value="regist_fail">注册失败</el-option>
            <el-option label="注册成功" value="regist_success">注册成功</el-option>
            <el-option label="审核中" value="regist_processing">审核中</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="入网渠道">
          <el-select v-model="rowData.registerChannel" disabled="disabled" placeholder="请选择">
            <el-option label="微信支付" value="wx_pay">微信支付</el-option>
            <el-option label="易宝支付" value="yeepay">易宝支付</el-option>
          </el-select>
        </el-form-item>
        <json-viewer :value="jsonData"/>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getMerchantList, getMerchantDetails } from '@/api/pay'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      formInline: {
        merchantNumber: '',
        registerStatus: ''
      },
      formData: {
        merchantSign: ''
      },
      rules: {
        merchantSign: [
          { required: true, message: '商户编号不能为空', trigger: 'blur' }
        ]
      },
      listLoading: false,
      merchantSignShow: false,
      total: 0,
      formLabelWidth: '180px',
      dialogTableVisible: false,
      listQuery: {
        registerChannel: 'YEEPAY',
        thirdMerchantRole: 'ledger_merchant',
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      tableData: [],
      merchantMes: '',
      jsonData: {},
      rowData: {}
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
      getMerchantList(this.listQuery).then(response => {
        const data = response.data
        if (data) {
          this.tableData = response.data.result
        }
        this.listLoading = false
        this.total = response.data.totalCount
      })
    },
    addData() {
      this.merchantSignShow = true
    },
    getDetailsData(index, row, sign) {
      const formData = this.formData
      this.$refs[formData].validate(valid => {
        if (valid) {
          const merchantSign = this.formData.merchantSign
          this.$router.push({
            path: '/pay/yibaoOnlineDetails',
            query: {
              merchantNo: merchantSign
            }
          })
        }
      })
    },
    getDetails(index, row) {
      const requestNumber = row.requestNumber
      this.rowData = row
      getMerchantDetails(requestNumber).then(response => {
        const data = response.data
        if (data) {
          this.jsonData = response.data

          // console.log(eval ("(" + response.data.baseInfo + ")"))
        }
        this.dialogTableVisible = true
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
.el-dialog .el-dialog__body {
  overflow-x: auto;
}
.el-dialog .el-dialog__body input {
  width: 350px;
}
</style>

