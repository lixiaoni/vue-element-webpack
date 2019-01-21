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
          <el-option label="全部" value>全部</el-option>
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
      <el-table-column label=" 操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editData(scope.$index, scope.row )">编辑</el-button>
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
    <el-dialog :visible.sync="dialogShow" title="商户详情">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="merchantVOData"
        :rules="rules"
        :ref="merchantVOData"
        class="same-wid"
      >
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="merchantVOData.linkman"/>
        </el-form-item>
        <el-form-item label="商户编号" prop="merchantNumber">
          <el-input v-model="merchantVOData.merchantNumber"/>
        </el-form-item>
        <el-form-item label="商户名称" prop="merchantName">
          <el-input v-model="merchantVOData.merchantName"/>
        </el-form-item>
        <el-form-item label="商户类型" prop="merchantType">
          <el-select
            v-model="merchantVOData.merchantType"
            placeholder="请选择"
            @change="merchantType($event)"
          >
            <el-option label="请选择" value>请选择</el-option>
            <el-option label="批发商" value="1">批发商</el-option>
            <el-option label="零售商" value="2">零售商</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户性质" prop="merchantCharacter">
          <el-select
            v-model="merchantVOData.merchantCharacter"
            placeholder="请选择"
            @change="merchantCharacter($event)"
          >
            <el-option label="请选择" value>请选择</el-option>
            <el-option label="个人" value="1">个人</el-option>
            <el-option label="个体" value="2">个体</el-option>
            <el-option label="企业" value="3">企业</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户简称">
          <el-input v-model="merchantVOData.merchantAbbre"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="linkmanPhone">
          <el-input v-model="merchantVOData.linkmanPhone"/>
        </el-form-item>
        <el-form-item label="联系人邮箱">
          <el-input v-model="merchantVOData.linkmanEmail"/>
        </el-form-item>
        <el-form-item label="商户经营范围">
          <el-input v-model="merchantVOData.merchantScope"/>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="merchantVOData.address"/>
        </el-form-item>

        <el-form-item label="省份">
          <el-select
            v-model="merchantVOData.province"
            placeholder="请选择"
            @change="onSelectedDrug($event)"
          >
            <el-option
              v-for="item in areaData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="市">
          <el-select
            v-model="merchantVOData.city"
            placeholder="请选择"
            @change="onSelectedCity($event)"
          >
            <el-option
              v-for="item in areaCityData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="区县">
          <el-select
            v-model="merchantVOData.county"
            placeholder="请选择"
            @change="onSelectedCounty($event)"
          >
            <el-option
              v-for="item in areaCountyData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-row class="submit-btn">
          <el-button type="primary" @click="updateDetails()">确定</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import {
  getListMerchantRetail,
  merchantNumberDetails,
  updateDetails,
  getProvinceList,
  getCityChildList
} from '@/api/merchant'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      formLabelWidth: '110px',
      dialogShow: false,
      merchantVOData: {},
      areaData: [],
      areaCityData: [],
      areaCountyData: [],
      formInline: {
        merchantType: '',
        linkmanPhone: '',
        isDel: '',
        merchantName: ''
      },
      rules: {
        linkman: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        merchantName: [
          { required: true, message: '商户名称不能为空', trigger: 'blur' }
        ],
        linkmanPhone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ],
        merchantNumber: [
          { required: true, message: '商户编号不能为空', trigger: 'blur' }
        ],
        merchantType: [
          { required: true, message: '商户类型不能为空', trigger: 'blur' }
        ],
        merchantCharacter: [
          { required: true, message: '商户性质不能为空', trigger: 'blur' }
        ]
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
    // 商户性质
    merchantType(event) {
      this.merchantVOData.merchantType = event
    },
    merchantCharacter(event) {
      this.merchantVOData.merchantCharacter = event
    },
    /**
     * 改变页码
     * @param page 页号
     */
    handleCurrentChange(page) {
      this.listQuery.pageNum = page
      this.getList()
    },
    // 选择城市
    getProvinceListData() {
      getProvinceList(this.listQuery).then(response => {
        this.areaData = response.data.obj.result
      })
    },
    getDataName(arr, event) {
      let obj = {}
      obj = arr.find(item => {
        return item.code === event
      })
      return obj.name
    },
    onSelectedDrug(event) {
      const name = this.getDataName(this.areaData, event)
      const listQuery = this.listQuery
      listQuery.parentCode = event
      this.merchantVOData.provinceCode = event
      this.merchantVOData.province = name
      this.merchantVOData.city = ''
      this.merchantVOData.cityCode = ''
      this.merchantVOData.county = ''
      this.merchantVOData.countyCode = ''
      getCityChildList(this.listQuery).then(response => {
        this.areaCityData = response.data.obj.result
      })
    },
    onSelectedCity(event) {
      const name = this.getDataName(this.areaCityData, event)
      const listQuery = this.listQuery
      listQuery.parentCode = event
      this.merchantVOData.cityCode = event
      this.merchantVOData.city = name
      getCityChildList(listQuery).then(response => {
        this.areaCountyData = response.data.obj.result
      })
    },
    onSelectedCounty(event) {
      const name = this.getDataName(this.areaCountyData, event)
      this.merchantVOData.countyCode = event
      this.merchantVOData.county = name
    },
    editData(index, row) {
      const merchantNumber = row.merchantNumber
      this.getProvinceListData()
      merchantNumberDetails(merchantNumber).then(response => {
        this.dialogShow = true
        this.merchantVOData = response.data[0]
      })
    },
    updateDetails() {
      const merchantVOData = this.merchantVOData
      this.$refs[merchantVOData].validate(valid => {
        if (valid) {
          updateDetails(merchantVOData).then(response => {
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
.same-wid input {
  width: 160px;
}
</style>

