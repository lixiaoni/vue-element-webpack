<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="商户编号">
        <el-input v-model="formInline.merchantNumber" placeholder="请输入商户编号"/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.linkmanPhone" placeholder="请输入手机号"/>
      </el-form-item>
      <el-form-item label="商户类型">
        <el-select v-model="formInline.merchantType" placeholder="请选择">
          <el-option label="全部商户" value>全部商户</el-option>
          <el-option label="批发商" value="1">批零商</el-option>
          <el-option label="零售商" value="2">零售商</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否删除">
        <el-select v-model="formInline.isDel" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="未删除" value="false">未删除</el-option>
          <el-option label="已删除" value="true">已删除</el-option>
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
      style="width: 100%"
    >
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="merchantNumber" label="商户编号" align="center"/>
      <el-table-column prop="merchantName" label="商户名称" align="center"/>
      <el-table-column prop="linkman" label="联系人" align="center"/>
      <el-table-column prop="linkmanPhone" label="联系电话" align="center"/>
      <el-table-column prop="merchantCharacter" label="商户性质" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.merchantCharacter==&quot;1&quot;">个人</span>
          <span v-if="scope.row.merchantCharacter==&quot;2&quot;">个体</span>
          <span v-if="scope.row.merchantCharacter==&quot;3&quot;">企业</span>
        </template>
      </el-table-column>
      <el-table-column prop="merchantType" label="商户类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.merchantType==&quot;1&quot;">批发商</span>
          <span v-if="scope.row.merchantType==&quot;2&quot;">零售商</span>
        </template>
      </el-table-column>
      <el-table-column prop="isDel" label="是否删除" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDel==false">未删除</span>
          <span v-if="scope.row.isDel==true">已删除</span>
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
      <el-table-column label="操作" width="400" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="handleLook(scope.$index, scope.row ,true)"
          >全量资质编辑</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="handleLookFen(scope.$index, scope.row ,true)"
          >基本资质编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="getStoreMess(scope.$index, scope.row ,true)"
          >小程序信息编辑</el-button>
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
    <el-dialog :visible.sync="dialogTableVisible" :title="title">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="storeMes"
        :rules="rules"
        :ref="storeMes"
      >
        <el-form-item :label-width="formLabelWidth" label="商户编号">
          <el-input v-model="merchantNumber" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="平台内应用编号">
          <el-input v-model="storeMes.platAppId" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="小程序appID" prop="appId">
          <el-input :readonly="readonly" v-model="storeMes.appId"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="小程序名称" prop="appName">
          <el-input :readonly="readonly" v-model="storeMes.appName"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="小程序密钥" prop="appSecret">
          <el-input :readonly="readonly" v-model="storeMes.appSecret"/>
        </el-form-item>
      </el-form>
      <div v-if="isShow" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateMes">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getListMerchantRetail, getStoreMes, saveupdate } from '@/api/merchant'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      title: '小程序信息详情',
      formLabelWidth: '130px',
      merchantNumber: '',
      readonly: false,
      formInline: {
        merchantType: '',
        isDel: '',
        linkmanPhone: '',
        merchantName: ''
      },
      isShow: false,
      rules: {
        appId: [
          { required: true, message: '小程序appID不能为空', trigger: 'blur' }
        ],
        appName: [
          { required: true, message: '小程序名称不能为空', trigger: 'blur' }
        ],
        appSecret: [
          { required: true, message: '小程序密钥不能为空', trigger: 'blur' }
        ]
      },
      listLoading: false,
      total: 0,
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      storeMes: {},
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
    addMerchant(index, row, sign) {
      const merchantNo = row.merchantNo
      this.$router.push({
        path: '/addMerchant/index',
        query: {
          merchantNo: merchantNo
        }
      })
    },
    // 小程序信息
    getStoreMess(index, row, sign) {
      this.storeMes = {}
      if (sign) {
        this.isShow = true
        this.title = '小程序信息编辑'
      } else {
        this.isShow = false
        this.title = '小程序信息详情'
      }
      this.dialogTableVisible = true
      const merchantNumber = row.merchantNumber
      this.merchantNumber = merchantNumber
      getStoreMes(merchantNumber).then(response => {
        const storeMes = response.data
        if (storeMes) {
          this.storeMes = storeMes[0]
        }
      })
    },
    updateMes(index, row) {
      const formData = this.storeMes
      this.$refs[formData].validate(valid => {
        if (valid) {
          const dataMes = this.storeMes
          const merchantNumber = this.merchantNumber
          delete dataMes['createTime']
          delete dataMes['updateTime']
          dataMes.merchantNumber = merchantNumber
          saveupdate(dataMes).then(response => {
            this.dialogTableVisible = false
            this.$message({
              message: '修改成功！',
              type: 'success'
            })
          })
        }
      })
    },
    handleLookFen(index, row, sign) {
      const merchantNo = row.merchantNo
      this.$router.push({
        path: '/merchantDetails/indexFen',
        query: {
          merchantNo: merchantNo,
          sign: sign
        }
      })
    },
    handleLook(index, row, sign) {
      const merchantNo = row.merchantNo
      this.$router.push({
        path: '/merchantDetails/index',
        query: {
          merchantNo: merchantNo,
          sign: sign
        }
      })
    }
  }
}
</script>
