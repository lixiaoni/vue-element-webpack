<template>
  <div class="body-cont">
    <el-form :inline="true" class="demo-form-inline border-form">
      <el-button type="warning" @click="addSubmit">添加</el-button>
    </el-form>
    <el-table
      v-loading.body="listLoading"
      :data="tableData"
      highlight-current-row
      border
      style="width: 100%"
    >
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="name" label="商贸云名称" align="center"/>
      <el-table-column prop="code" label="code" align="center"/>
      <el-table-column prop="logo" label="logo" align="center">
        <template slot-scope="scope">
          <img :src="imageUrl+scope.row.logo" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editMall(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="dialogShow" :title="title">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="formData"
        :rules="rules"
        :ref="formData"
      >
        <el-form-item :label-width="formLabelWidth" label="商贸云名称" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <div>
          <el-form-item label="商贸云LOGO" prop="logo">
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
        <el-row class="submit-btn">
          <el-button type="primary" @click="editMallMes()">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getList, getMallMes, updateMall, addMall } from '@/api/mall'
export default {
  data() {
    return {
      uploadImgUrl: process.env.IMAGE_UPLOAD_API,
      logoList: [],
      isAddMall: true,
      logoUrl: '',
      logoUrlListShow: false,
      title: '编辑商贸云信息',
      formLabelWidth: '130px',
      dialogShow: false,
      imageUrl: this.Const.imageUrl,
      listLoading: false,
      total: 0,
      listQuery: '',
      tableData: [],
      formData: {},
      rules: {
        name: [
          { required: true, message: '商贸云名称不能为空', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '商贸云LOGO不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSubmit() {
      this.listQuery = this.formInline
      this.getList()
    },
    /**
     * 获取列表
     */
    getList() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    // 编辑信息
    editMall(index, row) {
      const code = row.code
      this.dialogShow = true
      this.title = '编辑商贸云'
      getMallMes(code).then(response => {
        this.formData = response.data
        const fileList = []
        fileList.push({ url: this.imageUrl + response.data.logo })
        this.logoList = fileList
        this.logoUrlListShow = true
      })
    },
    handleRemove(file, fileList) {
      this.formData.logo = ''
      this.logoUrlListShow = false
    },
    handleSuccess(response) {
      const logoUrl = response.obj
      this.logoUrlListShow = true
      this.formData.logo = logoUrl
    },
    editMallMes() {
      const formData = this.formData
      this.$refs[formData].validate(valid => {
        if (valid) {
          if (this.title === '编辑商贸云') {
            updateMall(formData).then(response => {
              this.dialogShow = false
              this.getList()
              this.$message({
                message: response.data,
                type: 'success'
              })
            })
          } else {
            addMall(formData).then(response => {
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
    // 添加商贸云信息
    addSubmit() {
      this.formData = {}
      this.logoList = []
      this.logoUrlListShow = false
      this.dialogShow = true
      this.title = '添加商贸云'
    }
  }
}
</script>
