<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="用户名称">
        <el-input v-model="formInline.userName" placeholder="请输入用户名"/>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="formInline.nickName" placeholder="请输入昵称"/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="请输入手机号"/>
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
    <el-table v-loading.body="listLoading" :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="userName" label="用户名称" align="center"/>
      <el-table-column prop="headPic" label="用户头像" align="center">
        <template slot-scope="scope">
          <img :src="imageUrl+scope.row.headPic" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" align="center"/>
      <el-table-column prop="gender" label="性别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.gender==&quot;0&quot;">未知</span>
          <span v-if="scope.row.gender==&quot;1&quot;">男</span>
          <span v-if="scope.row.gender==&quot;2&quot;">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="nickName" label="用户昵称" align="center"/>
      <!-- <el-table-column prop="weixinNumber" label="微信号" align="center"/> -->
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
      <el-table-column label=" 操作" align="center">
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
    <el-dialog :visible.sync="dialogShow" title="用户详情">
      <el-form :inline="true" :label-width="formLabelWidth" :model="formData">
        <el-form-item :label-width="formLabelWidth" label="用户名称">
          <el-input v-model="formData.userName" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="手机号">
          <el-input v-model="formData.mobile"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户昵称">
          <el-input v-model="formData.nickName" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="用户性别">
          <el-select v-model="formData.gender" disabled="disabled" placeholder="请选择">
            <el-option label="未知" value="0">未知</el-option>
            <el-option label="男" value="1">男</el-option>
            <el-option label="女" value="2">女</el-option>
          </el-select>
        </el-form-item>
        <div class="pay-img">
          <el-form-item label="用户头像">
            <el-upload
              :limit="1"
              :class="{disabled:urlListShow}"
              :file-list="headPicList"
              :action="uploadImgUrl+'/base/image?type=OTHER'"
              list-type="picture-card"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
          <el-form-item label="二维码">
            <el-upload
              :limit="1"
              :class="{disabled:urlListShow}"
              :file-list="qrcodeList"
              :action="uploadImgUrl+'/base/image?type=OTHER'"
              list-type="picture-card"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </div>
        <el-row class="submit-btn">
          <el-button type="primary" @click="editUserMes()">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getList, getUserDetails, updateUserPhone } from '@/api/users'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      formLabelWidth: '90px',
      uploadImgUrl: process.env.IMAGE_UPLOAD_API,
      imageUrl: this.Const.imageUrl,
      headPicList: [],
      qrcodeList: [],
      urlListShow: true,
      formInline: {
        userName: '',
        isDel: '',
        nickName: '',
        phone: ''
      },
      dialogShow: false,
      formData: { name: '' },
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
      getList(this.listQuery).then(response => {
        this.tableData = response.data.result
        this.listLoading = false
        this.total = response.data.totalCount
      })
    },
    // 获取详情
    getDetails(index, row) {
      const userId = row.userId
      getUserDetails(userId).then(response => {
        this.dialogShow = true
        this.formData = response.data
        const headPicList = []
        headPicList.push({ url: this.imageUrl + response.data.headPic })
        this.headPicList = headPicList
        const qrcodeList = []
        qrcodeList.push({ url: this.imageUrl + response.data.qrcode })
        this.qrcodeList = qrcodeList
      })
    },
    editUserMes() {
      const data = { mobile: this.formData.mobile }
      data.id = this.formData.id
      if (data) {
        updateUserPhone(data).then(response => {
          this.dialogShow = false
          this.$message({
            message: response.data,
            type: 'success'
          })
          this.getList()
        })
      } else {
        this.$message({
          message: '请输入手机号！',
          type: 'warning'
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
    }
  }
}
</script>
<style>
.pay-img .el-upload-list--picture-card .el-upload-list__item-actions {
  position: relative;
}
</style>

