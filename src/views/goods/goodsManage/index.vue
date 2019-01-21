<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="商品ID">
        <el-input v-model="formInline.id" placeholder="请输入商品ID"/>
      </el-form-item>
      <el-form-item label="商品名称">
        <el-input v-model="formInline.name" placeholder="请输入商品名称"/>
      </el-form-item>
      <el-form-item label="店铺名称">
        <el-input v-model="formInline.storeName" placeholder="请输入店铺名称"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="formInline.status" placeholder="请选择">
          <el-option label="全部商品" value>全部商品</el-option>
          <el-option label="待上架" value="0">待上架</el-option>
          <el-option label="上架中" value="1">上架中</el-option>
          <el-option label="已下架" value="2">已下架</el-option>
          <el-option label="部分上架" value="3">部分上架</el-option>
          <el-option label="没有库存" value="4">没有库存</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否删除">
        <el-select v-model="formInline.isDel" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="未删除" value="false">未删除</el-option>
          <el-option label="已删除" value="true">已删除</el-option>
        </el-select>
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
      <el-table-column prop="goodsId" width="150" label="商品ID" align="center"/>
      <el-table-column prop="name" width="350" label="商品名称" align="center"/>
      <el-table-column prop="mainImgUrl" label="主图" align="center">
        <template slot-scope="scope">
          <img :src="imageUrl+scope.row.mainImgUrl" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column prop="wholesalePrice" width="120" label="批发价" align="center"/>
      <el-table-column prop="sellPrice" width="120" label="零售价" align="center"/>
      <el-table-column prop="status" width="120" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status==0" style="color: #E6A23C">待上架</span>
          <span v-if="scope.row.status==1" style="color: #67C23A">上架中</span>
          <span v-if="scope.row.status==2" style="color: #43E0D6">已下架</span>
          <span v-if="scope.row.status==3" style="color: #670ACE">部分上架</span>
          <span v-if="scope.row.status==4" style="color: #E73E48">没有库存</span>
        </template>
      </el-table-column>
      <el-table-column prop="isDel" width="120" label="是否已删除" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDel==true" style="color: #E6A23C">已删除</span>
          <span v-if="scope.row.isDel==false" style="color: #67C23A">未删除</span>
        </template>
      </el-table-column>
      <el-table-column prop="categoryName" width="120" label="分类" align="center"/>
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
      <el-table-column label="操作" fixed="right" width="160px" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==2"
            size="mini"
            type="primary"
            @click="onGoods(scope.$index, scope.row)"
          >上架</el-button>
          <el-button
            v-if="scope.row.status==1"
            size="mini"
            type="info"
            @click="offGoods(scope.$index, scope.row)"
          >下架</el-button>
          <el-button
            v-if="scope.row.isDel==false"
            size="mini"
            type="warning"
            @click="deteleGoods(scope.$index, scope.row)"
          >删除</el-button>
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
  </div>
</template>
<script>
import { getGoodsList, offGoods, onGoods, deteleGoods } from '@/api/goods'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      formInline: {
        name: '',
        id: '',
        storeName: '',
        status: '',
        isDel: ''
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
      this.listQuery = Object.assign(this.listQuery, this.formInline)
      this.listQuery.pageNum = 1
      this.getList()
    },
    /**
     * 获取列表
     */
    getList() {
      this.listLoading = true
      getGoodsList(this.listQuery).then(response => {
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
    // 上下架
    offGoods(index, row) {
      const data = { storeId: row.storeId, goodsIdList: [row.goodsId] }
      offGoods(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data
        })
        this.getList()
      })
    },
    onGoods(index, row) {
      const data = { storeId: row.storeId, goodsIdList: [row.goodsId] }
      onGoods(data).then(response => {
        this.$message({
          type: 'success',
          message: response.data
        })
        this.getList()
      })
    },
    deteleGoods(index, row) {
      const goodsId = row.goodsId
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deteleGoods(goodsId).then(response => {
            this.$message({
              type: 'success',
              message: response.data
            })
            this.getList()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
