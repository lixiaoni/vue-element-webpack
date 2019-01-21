<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="店铺名称">
        <el-input v-model="formInline.name" placeholder="请输入店铺名称"/>
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
      <el-table-column prop="name" label="店铺名称" align="center"/>
      <el-table-column prop="phone" label="手机号" align="center"/>
      <el-table-column prop="logo" label="店铺logo" align="center">
        <template slot-scope="scope">
          <img :src="imageUrl+scope.row.logo" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column prop="storeNature" label="店铺性质" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.storeNature==&quot;1&quot;">新批零</span>
          <span v-if="scope.row.storeNature==&quot;2&quot;">新零售</span>
        </template>
      </el-table-column>
      <el-table-column prop="businessScope" label="经营范围" align="center"/>
      <el-table-column prop="address" label="店铺地址" align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editStoreFloor(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="removeStoreFloor(scope.$index, scope.row)"
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
import {
  getFloorStore,
  removeStoreFloor,
  editStoreFloor,
  getFloorInfo
} from "@/api/mall";
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      formInline: {
        name: ""
      },
      listLoading: false,
      total: 0,
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      tableData: []
    };
  },
  created() {
    this.getList();
  },
  methods: {
    onSubmit() {
      this.listQuery = Object.assign(this.listQuery, this.formInline);
      this.listQuery.pageNum = 1;
      this.getList();
    },
    /**
     * 获取列表
     */
    getList() {
      this.listLoading = true;
      this.mallCode = this.$route.query.floorCode;
      this.listQuery.floorCode = this.$route.query.floorCode;
      getFloorStore(this.listQuery).then(response => {
        this.tableData = response.data.result;
        this.listLoading = false;
        this.total = response.data.totalCount;
      });
    },
    /**
     * 改变每页数量
     * @param size 页大小
     */
    handleSizeChange(size) {
      this.listQuery.pageSize = size;
      this.listQuery.pageNum = 1;
      this.getList();
    },
    /**
     * 改变页码
     * @param page 页号
     */
    handleCurrentChange(page) {
      this.listQuery.pageNum = page;
      this.getList();
    },
    // 删除与楼层之间的关系
    removeStoreFloor(index, row) {
      const storeId = row.id;
      this.$confirm("确定要删除此店铺吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeStoreFloor(storeId).then(response => {
            this.listQuery.pageNum = 1;
            this.getList();
            this.$message({
              message: response.data,
              type: "success"
            });
          });
        })
        .catch(() => {});
    },
    // 编辑
    editStoreFloor(index, row) {
      const data = { name: row.name };
      console.log(data)
      getFloorInfo(data).then(response => {
        console.log(response);
      });
    }
  }
};
</script>
