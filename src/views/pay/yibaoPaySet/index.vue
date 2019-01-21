<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="平台定义的app编号">
        <el-input v-model="formInline.platAppId" placeholder="请输入平台定义的app编号"/>
      </el-form-item>
      <el-form-item label="支付通道">
        <el-select v-model="formInline.payChannel" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="微信支付" value="wx_pay">微信支付</el-option>
          <el-option label="易宝支付" value="yeepay">易宝支付</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="支付方式">
        <el-select v-model="formInline.payWay" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="微信小程序支付" value="wx_mini_app_pay">微信小程序支付</el-option>
        </el-select>
      </el-form-item>

      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="primary" @click="addData">添加支付配置</el-button>
    </el-form>
    <el-table v-loading.body="listLoading" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="platAppId" label="平台定义的app编号" width="180" align="center"/>
      <el-table-column prop="merchantNumber" label="商户编号" width="180" align="center"/>
      <el-table-column prop="thirdMerchantNumber" label="第三方支付的商户编号" width="180" align="center"/>
      <el-table-column prop="payChannel" label="支付通道" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payChannel=='wx_pay'" style="color: #E6A23C">微信支付</span>
          <span v-if="scope.row.payChannel=='yeepay'" style="color: #43E0D6">易宝支付</span>
        </template>
      </el-table-column>
      <el-table-column prop="payWay" label="支付方式" width="180" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payWay=='wx_mini_app_pay'" style="color: #E6A23C">微信小程序支付</span>
        </template>
      </el-table-column>
      <el-table-column prop="payConfigContent" label="配置内容" align="center" width="450">
        <template slot-scope="scope">
          <json-viewer :value="scope.row.payConfigContent"/>
        </template>
      </el-table-column>
      <el-table-column prop="onlinePay" label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="getDetails(scope.$index, scope.row )">编辑</el-button>
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
    <!-- 添加支付配置 -->
    <el-dialog :visible.sync="merchantShow" title="商户编号">
      <el-form :model="merchantData">
        <el-form-item :label-width="formLabelWidth" prop="merchantNumber" label="商户编号">
          <el-input v-model="merchantData.merchantNumber" placeholder="请输入商户编号"/>
        </el-form-item>
        <el-form-item align="center">
          <template>
            <el-button type="primary" @click="getDetailsData">确定</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible" title="添加支付配置">
      <el-form :inline="true" :label-width="formLabelWidth" :model="storeMes" :rules="rules" :ref="storeMes" >
        <el-form-item label="第三方支付的商户编号" prop="thirdMerchantNumber">
          <el-input v-model="storeMes.thirdMerchantNumber" placeholder="请输入第三方支付的商户编号"/>
        </el-form-item>
        <el-form-item label="支付通道" prop="payChannel">
          <el-select v-model="storeMes.payChannel" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="微信支付" value="wx_pay">微信支付</el-option>
            <el-option label="易宝支付" value="yeepay">易宝支付</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop="payWay" >
          <el-select v-model="storeMes.payWay" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="微信小程序支付" value="wx_mini_app_pay">微信小程序支付</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="商户编号" prop="merchantNumber">
          <el-input v-model="merchantData.merchantNumber" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="平台内应用编号" prop="platAppId">
          <el-input v-model="storeMes.platAppId" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="小程序appId" prop="appId">
          <el-input v-model="storeMes.appId" prop="appId" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="小程序名称" prop="appName">
          <el-input v-model="storeMes.appName" prop="appName" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="小程序密钥" prop="appSecret">
          <el-input v-model="storeMes.appSecret" disabled="disabled"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addYeepayFunc">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="merchantSignShow" title="易宝支付配置详情">
      <el-form :model="formData" :rules="rules" :ref="formData">
        <el-form-item :label-width="formLabelWidth" prop="thirdMerchantNumber" label="第三方支付的商户编号">
          <el-input v-model="formData.thirdMerchantNumber" placeholder="请输入第三方支付的商户编号"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="payChannel" label="支付通道">
          <el-select v-model="formData.payChannel" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="微信支付" value="wx_pay">微信支付</el-option>
            <el-option label="易宝支付" value="yeepay">易宝支付</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="payWay" label="支付方式">
          <el-select v-model="formData.payWay" placeholder="请选择" >
            <el-option label="全部" value>全部</el-option>
            <el-option label="微信小程序支付" value="wx_mini_app_pay">微信小程序支付</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="platAppId" label="平台定义的app编号">
          <el-input v-model="formData.platAppId" disabled="disabled" placeholder="请输入平台定义的app编号"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="merchantNumber" label="商户编号">
          <el-input v-model="formData.merchantNumber" disabled="disabled" placeholder="请输入商户编号"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="配置内容">
          <json-viewer :value="formData.payConfigContent"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="appId" label="小程序appId">
          <el-input v-model="formData.appId" disabled="disabled" placeholder="请输入配小程序appId"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="小程序秘钥" prop="appSecret">
          <el-input v-model="formData.appSecret" disabled="disabled" placeholder="请输入小程序秘钥"/>
        </el-form-item>

        <el-form-item align="center">
          <template>
            <el-button type="primary" @click="eidthData()">确定</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getYeepayList, updateYeepayMes, addYeepay } from '@/api/pay'
import { getStoreMes } from '@/api/merchant'
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      formInline: {
        platAppId: '',
        payWay: '',
        payChannel: ''
      },
      formLabelWidth: '180px',
      formData: {},
      merchantData: {},
      rules: {
        thirdMerchantNumber: [
          { required: true, message: '第三方支付的商户编号不能为空', trigger: 'blur' }
        ],
        merchantNumber: [
          { required: true, message: '商户编号不能为空', trigger: 'blur' }
        ],
        payChannel: [
          { required: true, message: '支付通道不能为空', trigger: 'blur' }
        ],
        appId: [
          { required: true, message: '小程序appId不能为空,请在资质管理补全信息', trigger: 'blur' }
        ],
        payWay: [
          { required: true, message: '支付方式不能为空', trigger: 'blur' }
        ],
        platAppId: [
          { required: true, message: '平台内应用编号不能为空', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '小程序秘钥不能为空,请在资质管理补全信息', trigger: 'blur' }
        ],
        appName: [
          { required: true, message: '小程序名称不能为空', trigger: 'blur' }
        ]
      },
      listLoading: false,
      merchantShow: false,
      dialogTableVisible: false,
      merchantSignShow: false,
      total: 0,
      storeMes: {},
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
      getYeepayList(this.listQuery).then(response => {
        const data = response.data
        if (data) {
          this.tableData = response.data.result
          this.total = response.data.totalCount
        } else {
          this.tableData = []
          this.total = 0
        }
        this.listLoading = false
      })
    },
    getDetails(index, row) {
      this.formData = {}
      this.formData = row
      this.formData.payChannel = 'yeepay'
      this.formData.payWay = 'wx_mini_app_pay'
      this.merchantSignShow = true
    },
    eidthData() {
      const formData = this.formData
      this.$refs[formData].validate(valid => {
        if (valid) {
          updateYeepayMes(formData).then(response => {
            this.merchantSignShow = false
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
            this.getList()
          })
        }
      })
    },
    addData() {
      this.merchantShow = true
    },
    getDetailsData() {
      const merchantData = this.merchantData
      const merchantNumber = merchantData.merchantNumber
      if (merchantNumber) {
        getStoreMes(merchantNumber).then(response => {
          const storeMes = response.data
          if (storeMes) {
            this.dialogTableVisible = true
            this.merchantShow = false
            this.storeMes = storeMes[0]
            this.storeMes.payChannel = 'yeepay'
            this.storeMes.payWay = 'wx_mini_app_pay'
          } else {
            this.$message.error('未查询到该商户，请输入正确的商户编号！')
          }
        })
      } else {
        this.$message.error('请输入商户编号！')
      }
    },
    addYeepayFunc() {
      const storeMes = this.storeMes
      this.$refs[storeMes].validate(valid => {
        if (valid) {
          addYeepay(storeMes).then(response => {
            this.dialogTableVisible = false
            this.merchantData = {}
            const code = response.data.code
            if (code === '0') {
              this.$message({
                message: '添加成功！',
                type: 'success'
              })
            } else {
              this.$message.error(response.data.message)
            }
          })
        }
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

