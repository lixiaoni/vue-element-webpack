<template>
  <div class="bodyCont">
    <el-button type="primary" @click="onSubmit">添加楼层</el-button>
    <div class="custom-tree-node tree-header">
      <tr>
        <td style="width:32px;border-left:0">#</td>
        <td>楼座名称</td>
        <td>楼层</td>
        <td>排序</td>
        <td>操作</td>
      </tr>
    </div>
    <el-tree :data="tableData" :props="defaultProps" :expand-on-click-node="false" node-key="id">
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <tr>
          <td>{{ data.name }}</td>
          <td>{{ data.floorNum==0?"": data.floorNum }}</td>
          <td>{{ data.sort }}</td>
          <td>
            <el-button size="mini" type="primary" @click="editCode(data.code)">编辑</el-button>
            <el-button size="mini" type="warning" @click="removeCode(data.code)">删除</el-button>
            <el-button size="mini" type="warning" @click="getStoreList(data.code)">店铺列表</el-button>
          </td>
        </tr>
      </div>
    </el-tree>
    <el-dialog :visible.sync="dialogShow" :title="title">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="formData"
        :rules="rules"
        :ref="formData"
      >
        <el-row v-if="headerClass">
          <el-form-item label="添加项" prop="type">
            <el-radio-group v-model="formData.type" @change="clickitem">
              <el-radio label="1">楼座</el-radio>
              <el-radio label="2">楼层</el-radio>
              <el-radio label="3">区域</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-form-item
          v-if="headerClass"
          :label-width="formLabelWidth"
          label="商贸云编码"
          prop="mallCode"
        >
          <el-input v-model="mallCode" disabled="disabled"/>
        </el-form-item>
        <el-form-item v-if="oneClass" label="选择楼座" prop="rootCode">
          <el-select
            :label-width="formLabelWidth"
            v-model="formData.rootCode"
            placeholder="请选择"
            @change="changeOneClass($event)"
          >
            <el-option
              v-for="item in tableData"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="twoClass" label="选择楼层" prop="parentCode">
          <el-select
            :label-width="formLabelWidth"
            v-model="formData.parentCode"
            placeholder="请选择"
            @change="changeTwoClass($event)"
          >
            <el-option
              v-for="item in childList"
              :label="item.name"
              :value="item.code"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="名称" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="排序" prop="sort">
          <el-input v-model="formData.sort" type="number"/>
        </el-form-item>
      </el-form>
      <el-row class="submit-btn">
        <el-button type="primary" @click="addClass">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import {
  getFloorList,
  saveFloor,
  getFloorDetails,
  updateloor,
  deteleFloor
} from '@/api/mall'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      mallCode: '',
      title: '添加分类',
      addClassData: false,
      className: '',
      sort: '0',
      dialogShow: false,
      formLabelWidth: '130px',
      listLoading: false,
      tableData: [],
      childList: [],
      oneClass: true,
      headerClass: true,
      twoClass: true,
      defaultProps: {
        children: 'childList',
        label: 'name'
      },
      formData: {
        type: '',
        name: '',
        parentCode: '',
        mallCode: '',
        sort: ''
      },
      rules: {
        name: [
          { required: true, message: '楼层名称不能为空', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '添加项不能为空', trigger: 'blur' }],
        rootCode: [
          { required: true, message: '楼座信息不能为空', trigger: 'blur' }
        ],
        parentCode: [
          { required: true, message: '楼层信息不能为空', trigger: 'blur' }
        ],
        mallCode: [
          { required: true, message: '商贸云编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    unix2CurrentTime,
    handleNodeClick(data) {},
    /**
     * 获取列表
     */
    getList() {
      this.listLoading = true
      this.mallCode = this.$route.query.mallCode
      getFloorList(this.mallCode).then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    removeCode(code) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deteleFloor(code).then(response => {
            this.getList()
            this.$message({
              type: 'success',
              message: response.msg
            })
          })
        })
        .catch(() => {})
    },
    // 查看店铺列表
    getStoreList(code) {
      this.$router.push({
        path: '/floorMes/floorStoreList',
        query: {
          floorCode: code
        }
      })
    },
    // 编辑分类
    editCode(code) {
      this.headerClass = false
      this.oneClass = false
      this.twoClass = false
      this.initFormData()
      this.title = '编辑楼层'
      this.addClassData = true
      getFloorDetails(code).then(response => {
        this.formData = response.data
        this.dialogShow = true
      })
    },
    initFormData() {
      this.formData = {
        type: '',
        name: '',
        parentCode: '',
        sort: '',
        mallCode: ''
      }
    },
    // 添加楼层
    onSubmit() {
      this.addClassData = false
      this.dialogShow = true
      this.title = '添加楼层'
      this.isShowAdd = true
      this.headerClass = true
      this.initFormData()
    },
    addClass() {
      this.formData.mallCode = this.mallCode
      const formData = this.formData
      const type = formData.type
      const isShowAdd = this.addClassData
      this.$refs[formData].validate(valid => {
        if (valid) {
          var params
          if (isShowAdd) {
            params = formData
          } else {
            params = {
              type: type,
              name: formData.name,
              sort: formData.sort,
              mallCode: formData.mallCode
            }
          }
          if (type === '1') {
            params.parentCode = '0'
          } else if (type === '2') {
            params.parentCode = formData.rootCode
          } else {
            params.parentCode = formData.parentCode
          }
          delete params['rootCode']
          if (isShowAdd) {
            updateloor(params).then(response => {
              this.getList()
              this.dialogShow = false
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
            })
          } else {
            saveFloor(params).then(response => {
              this.getList()
              this.dialogShow = false
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
            })
          }
        }
      })
    },
    clickitem(e) {
      this.formData.parentCode = ''
      this.formData.rootCode = ''
      if (e === '1') {
        this.oneClass = false
        this.twoClass = false
      } else if (e === '2') {
        this.oneClass = true
        this.twoClass = false
      } else {
        this.oneClass = true
        this.twoClass = true
      }
      this.formData.type = e
    },
    changeOneClass(event) {
      this.formData.rootCode = event
      const tableData = this.tableData
      for (var i = 0; i < tableData.length; i++) {
        if (tableData[i].code === event) {
          this.childList = tableData[i].childList
        }
      }
    },
    changeTwoClass(event) {
      this.formData.parentCode = event
    }
  }
}
</script>
<style>
.custom-tree-node td {
  width: 240px;
  border: 1px solid #ebeef5;
  border-right: 0;
  height: 50px;
  text-align: center;
  line-height: 50px;
  border-bottom: 0;
}
.el-tree-node:focus > .el-tree-node__content {
  background: #fff;
}
.custom-tree-node > td {
  background: #ebeef5;
}
.el-tree-node__content {
  height: 50px;
}
.custom-tree-node tr:hover {
  background-color: #f5f7fa;
}
.custom-tree-node tr td:last-child {
  border-right: 1px solid #ebeef5;
}
.el-tree-node__content > .el-tree-node__expand-icon {
  padding: 19px 10px;
  border-top: 1px solid #ebeef5;
}
.tree-header tr td {
  font-weight: bold;
  font-size: 14px;
  color: #909399;
}
.el-tree-node__content:hover,
.el-tree-node is-focusable {
  background: #fff;
}
.bodyCont {
  margin: 30px;
  border: 1px solid #ebeef5;
  border-top: 0;
  border-right: 0;
}
</style>

