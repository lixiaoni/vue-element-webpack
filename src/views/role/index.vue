<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form>
        <el-form-item>
          <el-button
            v-if="checkPermission('role:list')"
            type="success"
            icon="el-icon-refresh"
            @click.native.prevent="getRoleList">refresh
          </el-button>
          <el-button
            v-if="checkPermission('role:add')"
            type="primary"
            icon="el-icon-plus"
            @click.native.prevent="showAddRoleDialog">add
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading.body="listLoading"
      :data="roleList"
      element-loading-text="loading"
      border
      fit
      highlight-current-row>
      <el-table-column label="#" align="center" width="80">
        <template slot-scope="scope">
          <span v-text="getTableIndex(scope.$index)"/>
        </template>
      </el-table-column>
      <el-table-column label="Role Name" align="center" prop="name"/>
      <el-table-column label="Permission" align="center">
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.name === 'ROLE_ADMIN'"
            type="success">all
          </el-tag>
          <el-tag
            v-else-if="scope.row.resourceList.length === 0"
            type="success">none
          </el-tag>
          <div
            v-for="item in scope.row.resourceList"
            v-else
            :key="item" >
            <span style="margin-right: 3px;">{{ item.resource }}</span>
            <span
              v-for="item2 in item.handleList"
              :key="item2"
              style="margin-right: 3px;">
              <el-tag
                type="success"
                v-text="item2.handle"/>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="checkPermission('role:update') || checkPermission('role:delete')"
        label="Admin"
        align="center">
        <template slot-scope="scope">
          <el-button
            v-if="checkPermission('role:update') && scope.row.name !== 'ROLE_ADMIN'"
            type="primary"
            icon="el-icon-edit-outline"
            @click="showUpdateRoleDialog(scope.$index)">update
          </el-button>
          <el-button
            v-if="checkPermission('role:delete') && scope.row.name !== 'ROLE_ADMIN'"
            type="danger"
            icon="el-icon-delete"
            @click="removeRole(scope.$index)">delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.page"
      :page-size="listQuery.size"
      :total="total"
      :page-sizes="[10, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"/>
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible">
      <el-form
        ref="tempRole"
        :model="tempRole"
        :rules="createRules"
        status-icon
        class="small-space"
        label-position="left"
        label-width="100px"
        style="width: 500px; margin-left:50px;">
        <el-form-item label="Role name" prop="name" required>
          <el-input
            v-model="tempRole.name"
            type="text"
            prefix-icon="el-icon-edit"
            auto-complete="off"/>
        </el-form-item>
        <el-form-item label="Permission" required>
          <div v-for="(permission, index) in allPermission" :key="permission">
            <el-button
              :type="isMenuNone(index) ? '' : (isMenuAll(index) ? 'success' : 'primary')"
              size="mini"
              @click="checkAll(index)">{{ permission.resource }}
            </el-button>
            <el-checkbox-group v-model="tempRole.permissionIdList">
              <el-checkbox
                v-for="item in permission.handleList"
                :key="item.id"
                :label="item.id"
                @change="handleChecked(item, _index)">
                <span>{{ item.handle }}</span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button
          v-if="dialogStatus === 'add'"
          :loading="btnLoading"
          type="success"
          @click.native.prevent="addRole">add
        </el-button>
        <el-button
          v-else
          :loading="btnLoading"
          type="primary"
          @click.native.prevent="updateRole">update
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { list as getRoleList, listResourcePermission, add as addRole, update as updateRole, remove } from '@/api/role'
import { isValidateRoleName } from '@/utils/validate'
import { mapGetters } from 'vuex'

export default {
  data() {
    /**
       * 验证角色名
       * @param rule 规则
       * @param value 角色名
       * @param callback 回调
       */
    const validateRoleName = (rule, value, callback) => {
      if (!isValidateRoleName(value)) {
        callback(new Error('role name format error. eg. ROLE_ABC'))
      } else {
        callback()
      }
    }
    return {
      roleList: [],
      allPermission: [],
      listLoading: false,
      total: 0,
      listQuery: {
        page: 1,
        size: 30
      },
      dialogStatus: 'add',
      dialogFormVisible: false,
      textMap: {
        update: 'Update Role Permission',
        add: 'Add Role'
      },
      btnLoading: false,
      tempRole: {
        id: '',
        name: '',
        permissionIdList: []
      },
      createRules: {
        name: [{ required: true, trigger: 'blur', validator: validateRoleName }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'roleName'
    ])
  },
  created() {
    if (this.checkPermission('role:update')) {
      this.getAllPermission()
    }
    if (this.checkPermission('role:list')) {
      this.getRoleList()
    }
  },
  methods: {
    checkPermission(param) {
      return true
    },
    /**
       * 获取所有角色权限
       */
    getAllPermission() {
      listResourcePermission().then(response => {
        this.allPermission = response.data.list
      })
    },
    /**
       * 获取角色列表
       */
    getRoleList() {
      this.listLoading = true
      getRoleList(this.listQuery).then(response => {
        this.roleList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    },
    /**
       * 改变每页数量
       * @param size 页大小
       */
    handleSizeChange(size) {
      this.listQuery.page = 1
      this.listQuery.size = size
      this.getRoleList()
    },
    /**
       * 改变页码
       * @param page 页号
       */
    handleCurrentChange(page) {
      this.listQuery.page = page
      this.getRoleList()
    },
    /**
       * 表格序号
       * @param index 数据下标
       * @returns 表格序号
       */
    getTableIndex(index) {
      return (this.listQuery.page - 1) * this.listQuery.size + index + 1
    },
    /**
       * 显示新增角色对话框
       */
    showAddRoleDialog() {
      this.dialogFormVisible = true
      this.dialogStatus = 'add'
      this.tempRole.name = ''
      this.tempRole.id = ''
      this.tempRole.permissionIdList = []
    },
    /**
       * 显示更新角色的对话框
       * @param index 角色下标
       */
    showUpdateRoleDialog(index) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      const role = this.roleList[index]
      this.tempRole.name = role.name
      this.tempRole.id = role.id
      this.tempRole.permissionIdList = []
      for (let i = 0; i < role.resourceList.length; i++) {
        const handleList = role.resourceList[i].handleList
        for (let j = 0; j < handleList.length; j++) {
          const handle = handleList[j]
          this.tempRole.permissionIdList.push(handle.id)
        }
      }
    },
    /**
       * 添加新角色
       */
    addRole() {
      this.$refs.tempRole.validate(valid => {
        if (valid && this.isRoleNameUnique(this.tempRole.id, this.tempRole.name)) {
          this.btnLoading = true
          addRole(this.tempRole).then(() => {
            this.$message.success('Add success')
            this.getRoleList()
            this.dialogFormVisible = false
            this.btnLoading = false
          })
        } else {
          console.log('form not validate')
        }
      })
    },
    /**
       * 修改角色
       */
    updateRole() {
      this.$refs.tempRole.validate(valid => {
        if (valid && this.isRoleNameUnique(this.tempRole.id, this.tempRole.name)) {
          this.btnLoading = true
          updateRole(this.tempRole).then(() => {
            this.$message.success('Update success')
            this.getRoleList()
            this.dialogFormVisible = false
            this.btnLoading = false
          })
        } else {
          console.log('form not validate')
        }
      })
    },
    /**
       * 校验角色名是否已经存在
       * @param id 角色id
       * @param name 角色名
       * @returns {boolean}
       */
    isRoleNameUnique(id, name) {
      for (let i = 0; i < this.roleList.length; i++) {
        if (this.roleList[i].id !== id && this.roleList[i].name === name) {
          this.$message.error('Role name already existed')
          return false
        }
      }
      return true
    },
    /**
       * 移除角色
       * @param index 角色下标
       * @returns {boolean}
       */
    removeRole(index) {
      this.$confirm('Delete this role?', 'Waring', {
        confirmButtonText: 'yes',
        cancelButtonText: 'no',
        showCancelButton: false,
        type: 'warning'
      }).then(() => {
        const roleId = this.roleList[index].id
        remove(roleId).then(() => {
          this.$message.success('Delete success!')
          this.getRoleList()
        })
      })
    },
    /**
       * 判断角色菜单内的权限是否一个都没选
       * @param index 下标
       * @returns {boolean}
       */
    isMenuNone(index) {
      const handleList = this.allPermission[index].handleList
      for (let i = 0; i < handleList.length; i++) {
        if (this.tempRole.permissionIdList.indexOf(handleList[i].id) > -1) {
          return false
        }
      }
      return true
    },
    /**
       * 判断角色菜单内的权限是否全选了
       * @param index 下标
       * @returns {boolean}
       */
    isMenuAll(index) {
      const handleList = this.allPermission[index].handleList
      for (let i = 0; i < handleList.length; i++) {
        if (this.tempRole.permissionIdList.indexOf(handleList[i].id) < 0) {
          return false
        }
      }
      return true
    },
    /**
       * 根据菜单状态check所有checkbox
       * @param index 下标
       */
    checkAll(index) {
      if (this.isMenuAll(index)) {
        // 如果已经全选了,则全部取消
        this.cancelAll(index)
      } else {
        // 如果尚未全选,则全选
        this.selectAll(index)
      }
    },
    /**
       * checkbox全部选中
       * @param index 下标
       */
    selectAll(index) {
      const handleList = this.allPermission[index].handleList
      for (let i = 0; i < handleList.length; i++) {
        this.addUnique(handleList[i].id, this.tempRole.permissionIdList)
      }
    },
    /**
       * checkbox全部取消选中
       * @param index 下标
       */
    cancelAll(index) {
      const handleList = this.allPermission[index].handleList
      for (let i = 0; i < handleList.length; i++) {
        const idIndex = this.tempRole.permissionIdList.indexOf(handleList[i].id)
        if (idIndex > -1) {
          this.tempRole.permissionIdList.splice(idIndex, 1)
        }
      }
    },
    /**
       * 本方法会在勾选状态改变之后触发
       * @param item 选项
       * @param index 对应下标
       */
    handleChecked(item, index) {
      if (this.tempRole.permissionIdList.indexOf(item.id) > -1) {
        // 选中事件
        // 如果之前未勾选本权限,现在勾选完之后,tempRole里就会包含本id
        // 那么就要将必选的权限勾上
        this.makePermissionChecked(index)
      } else {
        // 取消选中事件
        this.cancelAll(index)
      }
    },
    /**
       * 将角色菜单必选的权限勾上（这里并没有做必选的数据库字段）
       * @param index 权限对应下标
       */
    makePermissionChecked(index) {
      const handleList = this.allPermission[index].handleList
      for (let i = 0; i < handleList.length; i++) {
        this.addUnique(handleList[i].id, this.tempRole.permissionIdList)
      }
    },
    /**
       * 数组内防重复地添加元素
       * @param val 值
       * @param arr 数组
       */
    addUnique(val, arr) {
      const _index = arr.indexOf(val)
      if (_index < 0) {
        arr.push(val)
      }
    }
  }
}
</script>
