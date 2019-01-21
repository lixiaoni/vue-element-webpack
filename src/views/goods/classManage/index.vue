<template>
  <div class="bodyCont">
    <el-button type="primary" @click="onSubmit">添加分类</el-button>
    <div class="custom-tree-node tree-header">
      <tr>
        <td style="width:32px;border-left:0">#</td>
        <td>分类名称</td>
        <td>分类编码</td>
        <td>排序</td>
        <td>创建时间</td>
        <td>更新时间</td>
        <td>操作</td>
      </tr>
    </div>
    <el-tree :data="tableData" :props="defaultProps" :expand-on-click-node="false" node-key="id">
      <div slot-scope="{ node, data }" class="custom-tree-node">
        <tr>
          <td>{{ data.name }}</td>
          <td>{{ data.categoryCode }}</td>
          <td>{{ data.sort }}</td>
          <td>{{ unix2CurrentTime(data.createDate) }}</td>
          <td>{{ unix2CurrentTime(data.updateDate) }}</td>
          <td>
            <el-button size="mini" type="primary" @click="editCode(data.categoryCode)">编辑</el-button>
            <el-button size="mini" type="warning" @click="removeCode(data.categoryCode)">删除</el-button>
          </td>
        </tr>
      </div>
    </el-tree>
    <!-- <el-table
      v-loading.body="listLoading"
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        width="50"
        label="序号"
        align="center"/>
      <el-table-column
        prop="name"
        label="分类名称"
        align="center"/>
      <el-table-column
        prop="categoryCode"
        label="分类编码"
        align="center"/>
      <el-table-column
        prop="sort"
        label="排序"
        align="center"/>
      <el-table-column
        prop="createDate"
        label="创建时间"
        align="center">
        <template slot-scope="scope">
          {{ unix2CurrentTime(scope.row.createDate) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="分类"
        align="center">
        <template slot-scope="scope">
          <el-tree :data="scope.row.subGoodsCategoryList" :props="defaultProps" @node-click="handleNodeClick"/>
        </template>
      </el-table-column>
    </el-table>-->
    <el-dialog :visible.sync="dialogShow" :title="title">
      <el-form
        :inline="true"
        :label-width="formLabelWidth"
        :model="formData"
        :rules="rules"
        :ref="formData"
      >
        <el-row>
          <el-form-item label="分类等级" prop="level">
            <el-radio-group v-model="formData.level" @change="clickitem">
              <el-radio label="ONE">一级分类</el-radio>
              <el-radio label="TWO">二级分类</el-radio>
              <el-radio label="THREE">三级分类</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-form-item :label-width="formLabelWidth" label="分类名称" prop="name">
          <el-input v-model="formData.name"/>
        </el-form-item>
        <el-form-item v-if="oneClass" label="选择一级分类" prop="rootCode">
          <el-select
            :label-width="formLabelWidth"
            v-model="formData.rootCode"
            placeholder="请选择"
            @change="changeOneClass($event)"
          >
            <el-option
              v-for="item in tableData"
              :label="item.name"
              :value="item.categoryCode"
              :key="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="twoClass" label="选择二级分类" prop="parentCategoryCode">
          <el-select
            :label-width="formLabelWidth"
            v-model="formData.parentCategoryCode"
            placeholder="请选择"
            @change="changeTwoClass($event)"
          >
            <el-option
              v-for="item in subGoodsCategoryList"
              :label="item.name"
              :value="item.categoryCode"
              :key="item.id"
            />
          </el-select>
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
  getClassList,
  deteleClass,
  getClassDetails,
  saveClass,
  updateClass
} from '@/api/goods'
import { unix2CurrentTime } from '@/utils'
export default {
  data() {
    return {
      title: '添加分类',
      addClassData: false,
      className: '',
      sort: '0',
      dialogShow: false,
      formLabelWidth: '130px',
      listLoading: false,
      parentCategoryCode: 0,
      tableData: [],
      subGoodsCategoryList: [],
      oneClass: true,
      twoClass: true,
      defaultProps: {
        children: 'subGoodsCategoryList',
        label: 'name'
      },
      formData: {
        level: '',
        name: '',
        parentCategoryCode: '',
        rootCode: '',
        sort: ''
      },
      nameInit: '',
      rules: {
        name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
        level: [
          { required: true, message: '分类等级不能为空', trigger: 'blur' }
        ],
        rootCode: [
          { required: true, message: '一级分类不能为空', trigger: 'blur' }
        ],
        parentCategoryCode: [
          { required: true, message: '二级分类不能为空', trigger: 'blur' }
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
      getClassList(this.parentCategoryCode).then(response => {
        this.tableData = response.data
        this.listLoading = false
      })
    },
    removeCode(categoryCode) {
      this.$confirm('是否确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deteleClass(categoryCode).then(response => {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {})
    },
    // 编辑分类
    editCode(categoryCode) {
      this.initFormData()
      this.title = '编辑分类'
      this.addClassData = true
      getClassDetails(categoryCode).then(response => {
        const parentCategoryCode = response.data.parentCategoryCode
        this.formData = response.data
        this.nameInit = response.data.name
        this.dialogShow = true
        if (parentCategoryCode === '0') {
          this.oneClass = false
          this.twoClass = false
        } else {
          if (response.data.rootCode === '') {
            this.oneClass = true
            this.twoClass = false
            this.formData.rootCode = response.data.parentCategoryCode
          } else {
            this.oneClass = true
            this.twoClass = true
            this.formData.rootCode = response.data.rootCode
            this.formData.parentCategoryCode = response.data.parentCategoryCode
          }
        }
      })
    },
    initFormData() {
      this.formData = {
        level: '',
        name: '',
        parentCategoryCode: '',
        rootCode: '',
        sort: ''
      }
    },
    // 添加分类
    onSubmit() {
      this.dialogShow = true
      this.title = '添加分类'
      this.addClassData = false
      this.initFormData()
    },
    addClass() {
      const formData = this.formData
      const level = formData.level
      const isShowAdd = this.addClassData
      this.$refs[formData].validate(valid => {
        if (valid) {
          var params
          if (isShowAdd) {
            params = formData
          } else {
            params = {
              level: level,
              name: formData.name,
              sort: formData.sort
            }
          }
          if (level === 'ONE') {
            params.parentCategoryCode = '0'
          } else if (level === 'TWO') {
            params.parentCategoryCode = formData.rootCode
          } else {
            params.rootCode = formData.rootCode
            params.parentCategoryCode = formData.parentCategoryCode
          }
          if (isShowAdd) {
            if (params.name === this.nameInit) {
              delete params['name']
            }
            updateClass(params).then(response => {
              this.getList()
              this.dialogShow = false
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
            })
          } else {
            saveClass(params).then(response => {
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
      this.formData.parentCategoryCode = ''
      this.formData.rootCode = ''
      if (e === 'ONE') {
        this.oneClass = false
        this.twoClass = false
      } else if (e === 'TWO') {
        this.oneClass = true
        this.twoClass = false
      } else {
        this.oneClass = true
        this.twoClass = true
      }
      this.formData.level = e
    },
    changeOneClass(event) {
      this.formData.rootCode = event
      const tableData = this.tableData
      for (var i = 0; i < tableData.length; i++) {
        if (tableData[i].categoryCode === event) {
          this.subGoodsCategoryList = tableData[i].subGoodsCategoryList
        }
      }
    },
    changeTwoClass(event) {
      this.formData.parentCategoryCode = event
    }
  }
}
</script>
<style>
.custom-tree-node td {
  width: 200px;
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

