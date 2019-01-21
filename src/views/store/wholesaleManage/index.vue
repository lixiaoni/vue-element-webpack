<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="店铺名称">
        <el-input v-model="formInline.name" placeholder="店铺名称"/>
      </el-form-item>
      <el-form-item label="店铺性质">
        <el-select v-model="formInline.storeNature" placeholder="请选择">
          <el-option label="全部" value>全部</el-option>
          <el-option label="新批零" value="1">新批零</el-option>
          <el-option label="新零售" value="2">新零售</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="店铺编号">
        <el-input v-model="formInline.storeId" placeholder="店铺编号"/>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="手机号"/>
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
    <el-table v-loading.body="listLoading" :data="tableData" highlight-current-row border style="width: 100%">
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="id" width="120" label="店铺编号" align="center"/>
      <el-table-column prop="merchantNumber" width="120" label="商户编号" align="center"/>
      <el-table-column prop="name" label="店铺名称" width="150" align="center"/>
      <el-table-column prop="phone" label="手机号" width="150" align="center"/>
      <el-table-column prop="logo" label="店铺logo" width="150" align="center">
        <template slot-scope="scope">
          <img :src="imageUrl+scope.row.logo" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column prop="coverUrl" label="店铺封面图" width="150" align="center">
        <template slot-scope="scope">
          <img :src="imageUrl+scope.row.coverUrl" width="40" height="40" class="head_pic">
        </template>
      </el-table-column>
      <el-table-column prop="storeNature" label="店铺性质" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.storeNature==&quot;1&quot;">新批零</span>
          <span v-if="scope.row.storeNature==&quot;2&quot;">新零售</span>
        </template>
      </el-table-column>
      <el-table-column prop="businessScope" label="经营范围" width="150" align="center"/>
      <el-table-column prop="address" label="店铺地址" width="300" align="center"/>
      <el-table-column prop="isDel" label="是否删除" width="150" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDel==false">未删除</span>
          <span v-if="scope.row.isDel==true">已删除</span>
        </template>
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" width="180" align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.updateDate) }}
        </template>
      </el-table-column>
      <el-table-column label=" 操作" fixed="right" width="210px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="getStoreDetails(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="primary" @click="getReceipt(scope.$index, scope.row)">查询收款码</el-button>
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
    <el-dialog :visible.sync="dialogShow" title="编辑小云店信息">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="formData"
        :rules="rules"
        :ref="formData"
        class="inline-f"
      >
        <el-form-item :label-width="formLabelWidth" label="店铺编号">
          <el-input v-model="formData.id" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="商户编号">
          <el-input v-model="formData.merchantNumber" disabled="disabled"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="名称" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="手机号" prop="name">
          <el-input v-model="formData.phone" disabled="disabled"/>
        </el-form-item>
        <el-form-item label="店铺性质" prop="storeNature">
          <el-select v-model="formData.storeNature" placeholder="请选择">
            <el-option label="全部" value>全部</el-option>
            <el-option label="新批零" value="1">新批零</el-option>
            <el-option label="新零售" value="2">新零售</el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="经营范围">
          <el-select
            v-model="formData.businessScope"
            placeholder="请选择"
            @change="onSelectedDrug($event)"
          >
            <el-option
              v-for="item in itemData"
              :label="item.name"
              :value="item.name"
              :key="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="店铺地址">
          <el-input v-model="formData.address"/>
        </el-form-item>
        <div>
          <el-form-item class="miniClass" label="小程序码" prop="coverUrl">
            <el-upload
              :limit="1"
              :class="{disabled:true}"
              :file-list="miniProgramCodeList"
              :action="uploadImgUrl+'/base/image?type=OTHER'"
              list-type="picture-card"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
          <el-form-item label="LOGO" prop="logo">
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
          <el-button class="up-btn" size="mini" type="warning" @click="UpdateStoreLogo()">修改LOGO</el-button>
        </div>
        <div>
          <el-form-item class="cove-img" label="封面图" prop="coverUrl">
            <el-upload
              :on-remove="handleRemoveCove"
              :limit="1"
              :class="{disabled:coveUrlListShow}"
              :file-list="coveList"
              :on-success="handleSuccessCove"
              :action="uploadImgUrl+'/base/image?type=OTHER'"
              list-type="picture-card"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </div>
        <el-row class="submit-btn">
          <el-button type="primary" @click="editStoreMes()">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="dialogShowCode" title="编辑收款码">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        class="inline-f"
      >
        <div>
          <el-form-item label="收款码">
            <el-upload
              :on-remove="handleRemoveRece"
              :limit="1"
              :class="{disabled:receiptUrlShow}"
              :file-list="receiptUrlList"
              :on-success="handleSuccessRece"
              :action="uploadImgUrl+'/base/image?type=OTHER'"
              list-type="picture-card"
            >
              <i class="el-icon-plus avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </div>
        <el-row class="submit-btn">
          <el-button type="primary" @click="editReceipt()">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getList,
  getStoreMes,
  UpdateStoreMes,
  UpdateStoreLogo,
  getReceipt,
  updateReceipt
} from '@/api/store'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      uploadImgUrl: process.env.IMAGE_UPLOAD_API,
      imageUrl: this.Const.imageUrl,
      logoUrlListShow: false,
      coveUrlListShow: false,
      dialogShowCode: false,
      receiptUrlShow: false,
      dialogShow: false,
      logoList: [],
      coveList: [],
      receiptUrl: '',
      receiptUrlList: [],
      miniProgramCodeList: [],
      formLabelWidth: '90px',
      formInline: {
        name: '',
        isDel: '',
        storeNature: '',
        storeId: '',
        phone: ''
      },
      itemData: [
        {
          name: '服饰内衣'
        },
        {
          name: '母婴玩具'
        },
        {
          name: '鞋类箱包'
        },
        {
          name: '运动户外'
        },
        {
          name: '珠宝配饰'
        },
        {
          name: '化妆品'
        },
        {
          name: '家居家纺'
        },
        {
          name: '日用百货'
        },
        {
          name: '电子产品'
        },
        {
          name: '礼品婚庆'
        },
        {
          name: '仿真花艺'
        }
      ],
      formData: {},
      listLoading: false,
      total: 0,
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      tableData: [],
      storeId: '',
      rules: {
        name: [
          { required: true, message: '商贸云名称不能为空', trigger: 'blur' }
        ],
        storeNature: [
          { required: true, message: '店铺性质不能为空', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '小云店LOGO不能为空', trigger: 'blur' }
        ]
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
    onSelectedDrug(e) {
      this.formData.businessScope = e
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
    // 图片上传删除
    handleCurrentChange(page) {
      this.listQuery.pageNum = page
      this.getList()
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
    handleRemoveCove(file, fileList) {
      this.formData.coverUrl = ''
      this.coveUrlListShow = false
    },
    handleSuccessCove(response) {
      const coveUrl = response.obj
      this.coveUrlListShow = true
      this.formData.coverUrl = coveUrl
    },
    handleRemoveRece(file, fileList) {
      this.receiptUrl = ''
      this.receiptUrlShow = false
    },
    handleSuccessRece(response) {
      const coveUrl = response.obj
      this.receiptUrlShow = true
      this.receiptUrl = coveUrl
    },
    // 修改LOGO
    UpdateStoreLogo() {
      const logo = this.formData.logo
      const storeId = this.formData.storeId
      if (logo) {
        const params = { storeId: storeId, logo: logo }
        UpdateStoreLogo(params).then(response => {
          this.$message({
            message: response.data,
            type: 'success'
          })
          const rowData = this.rowData
          this.getStoreDetails(1, rowData)
        })
      } else {
        this.$message.error('请上传图片！')
      }
    },
    // 查询收款码
    getReceipt(index, row) {
      const storeId = row.storeId
      this.storeId = storeId
      this.dialogShowCode = true
      getReceipt(storeId).then(response => {
        const data = response.data
        if (data) {
          this.receiptUrl = data
          const fileList = []
          this.receiptUrlShow = true
          fileList.push({ url: this.imageUrl + data })
          this.receiptUrlList = fileList
          this.receiptUrl = data
        }
      })
    },
    editReceipt() {
      if (this.receiptUrl) {
        const data = { storeId: this.storeId, receiptCode: this.receiptUrl }
        updateReceipt(data).then(response => {
          this.dialogShowCode = false
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.getList()
        })
      } else {
        this.$message({
          message: '请上传收款码！',
          type: 'warning'
        })
      }
    },
    // 编辑信息
    getStoreDetails(index, row) {
      this.rowData = row
      const storeId = row.storeId
      getStoreMes(storeId).then(response => {
        this.formData = response.data[0]
        this.dialogShow = true
        const miniProgramCodeList = []
        miniProgramCodeList.push({
          url: this.imageUrl + response.data[0].miniProgramCode
        })
        this.miniProgramCodeList = miniProgramCodeList
        const fileList = []
        fileList.push({ url: this.imageUrl + response.data[0].logo })
        this.logoList = fileList
        const coveList = []
        coveList.push({ url: this.imageUrl + response.data[0].coverUrl })
        this.coveList = coveList
        this.logoUrlListShow = true
        this.coveUrlListShow = true
      })
    },
    editStoreMes() {
      const formData = this.formData
      this.$refs[formData].validate(valid => {
        if (valid) {
          delete formData['logo']
          delete formData['miniProgramCode']
          UpdateStoreMes(formData).then(response => {
            this.dialogShow = false
            this.getList()
            this.$message({
              message: response.data,
              type: 'success'
            })
          })
        }
      })
    }
  }
}
</script>
<style>
.up-btn {
  margin-top: 50px;
}
.inline-f input {
  width: 200px;
}
.el-dialog__body{
  padding-bottom: 0
}
.miniClass .el-upload-list--picture-card .el-upload-list__item-actions{
  position: relative;
}
</style>

