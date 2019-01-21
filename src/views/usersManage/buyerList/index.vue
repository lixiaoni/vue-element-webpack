<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="供应商名称">
        <el-input v-model="formInline.storeName" placeholder="请输入供应商名称"/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.purchaserPhone" placeholder="请输入手机号"/>
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
        prop="nickName"
        label="昵称"
        align="center"/>
      <el-table-column
        prop="headPic"
        label="用户头像"
        align="center">
        <template slot-scope="scope">
          <img :src="imageUrl+scope.row.headPic" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号"
        align="center"/>
      <el-table-column
        prop="storeName"
        label="供应商"
        align="center"/>
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
import { getPurchaserList } from '@/api/users'
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      formInline: {
        storeName: '',
        purchaserPhone: ''
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
      getPurchaserList(this.listQuery).then(response => {
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
