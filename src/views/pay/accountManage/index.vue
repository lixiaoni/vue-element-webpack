<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="账户编号">
        <el-input v-model="formInline.accountNumber" placeholder="请输入账户编号"/>
      </el-form-item>
      <el-form-item label="商户编号">
        <el-input v-model="formInline.merchantNumber" placeholder="请输入商户编号"/>
      </el-form-item>
      <el-form-item label="商户类型">
        <el-select v-model="formInline.merchantType" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="优生活平台" value="0">优生活平台</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户类型">
        <el-select v-model="formInline.accountType" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="余额账户" value="balance">余额账户</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="账户状态">
        <el-select v-model="formInline.status" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="已开通" value="on">已开通</el-option>
          <el-option label="未开通" value="off">未开通</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否冻结">
        <el-select v-model="formInline.freeze" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="已开通" value="true">已冻结</el-option>
          <el-option label="未开通" value="false">未冻结</el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="warning" @click="showAddModel">添加账户</el-button>
    </el-form>
    <el-table v-loading.body="listLoading" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="accountNumber" width="150" label="账户编号" align="center"/>
      <el-table-column prop="merchantNumber" label="商户编号" width="150" align="center"/>
      <el-table-column prop="merchantName" label="商户名称" width="150" align="center"/>
      <el-table-column prop="merchantCharacter" label="商户性质" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.merchantCharacter=='1'" style="color: #E6A23C">个人</span>
          <span v-if="scope.row.merchantCharacter=='2'" style="color: #67C23A">个体</span>
          <span v-if="scope.row.merchantCharacter=='3'" style="color: #43E0D6">企业</span>
        </template>
      </el-table-column>
      <el-table-column prop="merchantNature" label="商户类型" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.merchantNature=='1'">批发商</span>
          <span v-if="scope.row.merchantNature=='2'">零售商</span>
        </template>
      </el-table-column>
      <el-table-column prop="balance" label="账户余额" width="150" align="center"/>
      <el-table-column prop="accountType" label=" 账户类型" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.accountType=='balance'">余额账户</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="170" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" width="170" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.updateDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label=" 账户状态" width="90" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status=='on'"
            size="mini"
            type="warning"
            @click="closeStatus(scope.$index, scope.row )"
          >关闭</el-button>
          <el-button
            v-if="scope.row.status=='off'"
            size="mini"
            type="primary"
            @click="openStatus(scope.$index, scope.row )"
          >开通</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="freeze" label=" 是否冻结" width="90" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.freeze==true"
            size="mini"
            type="primary"
            @click="freezeFalse(scope.$index, scope.row )"
          >解冻</el-button>
          <el-button
            v-if="scope.row.freeze==false"
            size="mini"
            type="warning"
            @click="freezeTrue(scope.$index, scope.row )"
          >冻结</el-button>
        </template>
      </el-table-column>
      <el-table-column label=" 操作" fixed="right" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="lookHistoryDetails(scope.$index, scope.row )"
          >查看明细</el-button>
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
    <el-dialog :visible.sync="dialogTableVisible" title="添加账户">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="addAccountData"
        :rules="rules"
        :ref="addAccountData"
      >
        <el-form-item :label-width="formLabelWidth" label="商户编号" prop="merchantNumber">
          <el-input v-model="addAccountData.merchantNumber"/>
        </el-form-item>
        <el-form-item label="商户类型" prop="merchantType">
          <el-select v-model="addAccountData.merchantType" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="优生活平台" value="0">优生活平台</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户类型" prop="accountType">
          <el-select v-model="addAccountData.accountType" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="余额账户" value="balance">余额账户</el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addAccountNumber">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAccountList,
  freezeTrue,
  freezeFalse,
  closeStatus,
  openStatus,
  addAccountNumber
} from '@/api/pay'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      dialogTableVisible: false,
      formLabelWidth: '130px',
      formInline: {
        accountNumber: '',
        merchantNumber: '',
        merchantType: '',
        accountType: '',
        status: '',
        freeze: ''
      },
      listLoading: false,
      total: 0,
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      tableData: [],
      rules: {
        merchantNumber: [
          { required: true, message: '商户编号不能为空', trigger: 'blur' }
        ],
        merchantType: [
          { required: true, message: '商户类型不能为空', trigger: 'blur' }
        ],
        accountType: [
          { required: true, message: '账户类型不能为空', trigger: 'blur' }
        ]
      },
      addAccountData: {}
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
      getAccountList(this.listQuery).then(response => {
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
    // 查看历史明细
    lookHistoryDetails(index, row) {
      const accountNumber = row.accountNumber
      this.$router.push({
        path: '/pay/historyList',
        query: {
          accountNumber: accountNumber
        }
      })
    },
    // 解冻 冻结
    freezeFalse(index, row) {
      this.$confirm('是否要解冻账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const accountNumber = row.accountNumber
          freezeFalse(accountNumber).then(response => {
            this.$message({
              message: response.data,
              type: 'success'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },
    freezeTrue(index, row) {
      this.$confirm('是否要冻结账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const accountNumber = row.accountNumber
          freezeTrue(accountNumber).then(response => {
            this.$message({
              message: response.data,
              type: 'success'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },
    // 开通关闭
    closeStatus(index, row) {
      this.$confirm('是否要关闭账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const accountNumber = row.accountNumber
          closeStatus(accountNumber).then(response => {
            this.$message({
              message: response.data,
              type: 'success'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },
    openStatus(index, row) {
      this.$confirm('是否要开通账户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const accountNumber = row.accountNumber
          openStatus(accountNumber).then(response => {
            this.$message({
              message: response.data,
              type: 'success'
            })
            this.getList()
          })
        })
        .catch(() => {})
    },
    // 添加账户
    showAddModel() {
      this.addAccountData = {}
      this.dialogTableVisible = true
    },
    addAccountNumber() {
      const addAccountData = this.addAccountData
      this.$refs[addAccountData].validate(valid => {
        if (valid) {
          addAccountNumber(addAccountData).then(response => {
            this.$message({
              message: response.data,
              type: 'success'
            })
            this.dialogTableVisible = false
            this.getList()
          })
        } else {
          this.$message.error('请补全信息！')
        }
      })
    }
  }
}
</script>
