<template>
  <div class="body-cont">
    <el-form :inline="true" class="demo-form-inline border-form">
      <el-button type="warning" @click="addSubmit">添加活动</el-button>
    </el-form>
    <el-table
      v-loading.body="listLoading"
      :data="tableData"
      highlight-current-row
      border
      style="width: 100%"
    >
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="mallCode" label="商贸云编码" align="center"/>
      <el-table-column prop="imageUrl" label="活动图" align="center">
        <template slot-scope="scope">
          <img :src="imageUrl+scope.row.imageUrl" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column prop="click" label="是否可点击" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.click==false">不可点击</span>
          <span v-if="scope.row.click==true">可点击</span>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="跳转路径" align="center"/>
      <el-table-column prop="activityDesc" label="描述" align="center"/>
      <el-table-column prop="createDate" label="创建时间" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.updateDate) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editMall(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="warning" @click="removeBanner(scope.$index, scope.row)">删除</el-button>
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
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="formData"
        :rules="rules"
        :ref="formData"
      >
        <el-form-item :label-width="formLabelWidth" label="商贸云编码">
          <el-input v-model="mallCode" disabled="disabled"/>
        </el-form-item>
        <div>
          <el-form-item label="活动图" class="cove-img" prop="imageUrl">
            <el-upload
              :on-remove="handleRemove"
              :limit="1"
              :class="{disabled:logoUrlListShow}"
              :file-list="logoList"
              :on-success="handleSuccess"
              :action="uploadImgUrl+'/base/image?type=OTHER'"
              list-type="picture-card"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </div>
        <el-form-item label="状态" prop="click">
          <el-select v-model="formData.click" placeholder="是否可点击">
            <el-option label="全部" value="">全部</el-option>
            <el-option label="不可点击" value="0">不可点击</el-option>
            <el-option label="可点击" value="1">可点击</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="跳转URL">
          <el-input v-model="formData.url"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="描述" prop="activityDesc">
          <el-input v-model="formData.activityDesc"/>
        </el-form-item>
        <el-row class="submit-btn">
          <el-button type="primary" @click="editMallMes()">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getActiveList,
  getActiveMes,
  updateActive,
  addActive,
  removeActive
} from '@/api/mall'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      imageUrl: this.Const.imageUrl,
      uploadImgUrl: process.env.IMAGE_UPLOAD_API,
      logoList: [],
      isAddMall: true,
      logoUrl: '',
      logoUrlListShow: false,
      title: '编辑商贸云信息',
      formLabelWidth: '130px',
      dialogShow: false,
      listLoading: false,
      total: 0,
      tableData: [],
      formData: {},
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      rules: {
        imageUrl: [
          { required: true, message: '活动不能为空', trigger: 'blur' }
        ],
        activityDesc: [
          { required: true, message: '活动描述不能为空', trigger: 'blur' }
        ],
        click: [
          {
            required: true,
            message: '活动是否可点击不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    unix2CurrentTime,
    /**
     * 获取列表
     */
    getList() {
      this.listLoading = true
      this.mallCode = this.$route.query.mallCode
      this.listQuery.mallCode = this.$route.query.mallCode
      getActiveList(this.listQuery).then(response => {
        this.tableData = response.data.result
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleRemove(file, fileList) {
      this.formData.logo = ''
      this.logoUrlListShow = false
    },
    handleSuccess(response) {
      const logoUrl = response.obj
      this.logoUrlListShow = true
      this.formData.imageUrl = logoUrl
    },
    initData() {
      this.formData = { imageUrl: '', click: '', url: '', activityDesc: '' }
    },
    // 删除
    removeBanner(index, row) {
      const code = row.id
      this.$confirm('确定要删除此活动吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          removeActive(code).then(response => {
            this.listQuery.pageNum = 1
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
    editMall(index, row) {
      const code = row.id
      this.dialogShow = true
      this.showCode = true
      this.initData()
      this.title = '编辑活动信息'
      getActiveMes(code).then(response => {
        const formData = response.data[0]
        if (formData.click === false) {
          formData.click = '0'
        } else {
          formData.click = '1'
        }
        this.formData = formData
        const fileList = []
        if (response.data[0].imageUrl) {
          fileList.push({ url: this.imageUrl + response.data[0].imageUrl })
          this.logoList = fileList
          this.logoUrlListShow = true
        }
      })
    },
    editMallMes() {
      const formData = this.formData
      formData.mallCode = this.mallCode
      this.$refs[formData].validate(valid => {
        if (valid) {
          if (formData.click === '0') {
            formData.click = false
          } else {
            formData.click = true
          }
          if (this.title === '添加活动') {
            addActive(formData).then(response => {
              this.dialogShow = false
              this.getList()
              this.$message({
                message: response.data,
                type: 'success'
              })
            })
          } else {
            updateActive(formData).then(response => {
              this.dialogShow = false
              this.getList()
              this.$message({
                message: response.data,
                type: 'success'
              })
            })
          }
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
    },
    addSubmit() {
      this.dialogShow = true
      this.logoUrlListShow = false
      this.initData()
      this.logoList = []
      this.title = '添加活动'
    }
  }
}
</script>
