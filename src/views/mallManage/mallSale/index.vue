<template>
  <div class="body-cont">
    <el-form :inline="true" class="demo-form-inline border-form">
      <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
        <el-form-item label="属性名称">
          <el-input v-model="formInline.attrName" placeholder="属性名称"/>
        </el-form-item>
        <el-form-item label="配置所有者">
          <el-input v-model="formInline.owner" placeholder="配置所有者"/>
        </el-form-item>
        <el-form-item label="配置所有者类型">
          <el-select v-model="formInline.ownerType" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="店铺" value="STORE">店铺</el-option>
            <el-option label="商户" value="MERCHANT">商户</el-option>
            <el-option label="用户" value="USER">用户</el-option>
            <el-option label="商品" value="GOODS">商品</el-option>
            <el-option label="商贸云" value="MALL">商贸云</el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="warning" @click="addSubmit">添加销售配置</el-button>
      </el-form>
    </el-form>
    <el-table
      v-loading.body="listLoading"
      :data="tableData"
      highlight-current-row
      border
      style="width: 100%"
    >
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="attrName" width="150" label="属性名称" align="center"/>
      <el-table-column prop="attrValue" width="350" label="属性值" align="center">
        <template slot-scope="scope">
          <json-viewer :value="scope.row.attrValue"/>
        </template>
      </el-table-column>
      <el-table-column prop="attrValueType" width="180" label="属性值类型" align="center"/>
      <el-table-column prop="attrDesc" width="150" label="属性描述" align="center"/>
      <el-table-column prop="owner" width="150" label="配置所有者" align="center"/>
      <el-table-column prop="ownerType" width="150" label="配置所有者类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.ownerType=='STORE'">店铺</span>
          <span v-if="scope.row.ownerType=='MERCHANT'">商户</span>
          <span v-if="scope.row.ownerType=='USER'">用户</span>
          <span v-if="scope.row.ownerType=='GOODS'">商品</span>
          <span v-if="scope.row.ownerType=='MALL'">商贸云</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" width="170" label="创建时间" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" width="170" label="更新时间" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.updateDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="onlinePay" label="操作" fixed="right" width="200" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="getSaleDetails(scope.$index, scope.row )">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteSale(scope.$index, scope.row )">删除</el-button>
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
    <el-dialog :visible.sync="dialogShow" :title="title">
      <el-form :inline="true" :label-width="formLabelWidth" :model="formData">
        <el-form-item :label-width="formLabelWidth" label="属性名称">
          <el-input v-model="formData.attrName"/>
        </el-form-item>
        <div>
          <el-form-item :label-width="formLabelWidth" class="el-text" label="属性值">
            <el-input v-model="formData.attrValue" type="textarea"/>
          </el-form-item>
        </div>
        <el-form-item :label-width="formLabelWidth" label="属性值类型">
          <el-input v-model="formData.attrValueType"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="属性描述">
          <el-input v-model="formData.attrDesc"/>
        </el-form-item>
        <el-form-item label="配置所有者">
          <el-input v-model="formData.owner" placeholder="配置所有者"/>
        </el-form-item>
        <el-form-item label="配置所有者类型">
          <el-select v-model="formData.ownerType" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="店铺" value="STORE">店铺</el-option>
            <el-option label="商户" value="MERCHANT">商户</el-option>
            <el-option label="用户" value="USER">用户</el-option>
            <el-option label="商品" value="GOODS">商品</el-option>
            <el-option label="商贸云" value="MALL">商贸云</el-option>
          </el-select>
        </el-form-item>
        <el-row class="submit-btn">
          <el-button type="primary" @click="editMes()">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSaleList,
  getSaleDetails,
  updateSale,
  addSale,
  deleteSale
} from '@/api/mall'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      formInline: {
        owner: '',
        ownerType: '',
        attrName: ''
      },
      title: '',
      formLabelWidth: '130px',
      dialogShow: false,
      listLoading: false,
      total: 0,
      tableData: [],
      formData: {},
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      }
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
      getSaleList(this.listQuery).then(response => {
        this.tableData = response.data.result
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    initData() {
      this.formData = {
        attrName: '',
        attrValue: '',
        attrValueType: '',
        attrDesc: '',
        owner: '',
        ownerType: ''
      }
    },
    // 删除
    deleteSale(index, row) {
      const code = row.id
      this.$confirm('确定要删除此配置吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteSale(code).then(response => {
            this.getList()
            this.$message({
              message: response.data,
              type: 'success'
            })
          })
        })
        .catch(() => {})
    },
    // 编辑信息
    getSaleDetails(index, row) {
      const code = row.id
      this.dialogShow = true
      this.showCode = true
      this.initData()
      this.title = '编辑配置信息'
      getSaleDetails(code).then(response => {
        const formData = response.data[0]
        this.formData = formData
      })
    },
    editMes() {
      const formData = this.formData
      if (this.title === '添加配置') {
        addSale(formData).then(response => {
          this.dialogShow = false
          this.getList()
          this.$message({
            message: response.data,
            type: 'success'
          })
        })
      } else {
        updateSale(formData).then(response => {
          this.dialogShow = false
          this.getList()
          this.$message({
            message: response.data,
            type: 'success'
          })
        })
      }
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
    addSubmit() {
      this.dialogShow = true
      this.logoUrlListShow = false
      this.initData()
      this.logoList = []
      this.title = '添加配置'
    }
  }
}
</script>
<style>
.el-text .el-textarea__inner{
  width: 400px;min-height: 100px !important;
}
</style>

