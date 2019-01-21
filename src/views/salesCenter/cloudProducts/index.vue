
<template>
  <div class="body-cont">
    <el-form :inline="true" :model="formInline" class="demo-form-inline border-form">
      <el-form-item label="关键字">
        <el-input v-model="serchKey" placeholder="关键字"/>
      </el-form-item>
      <el-form-item label="订单种类">
        <el-select v-model="type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker v-model="startDate" :picker-options="pickerOptions" type="date" placeholder="支付开始" value-format="timestamp"/>
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker v-model="endDate" :picker-options="pickerOptions" type="date" placeholder="支付截至" value-format="timestamp"/>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
      <el-button type="success" @click="exportExcel">导出</el-button>
    </el-form>
    <el-table id="out-table" :data="tableData" border style="width: 100%" highlight-current-row>
      <el-table-column type="index" width="50" label="序号" align="center"/>
      <el-table-column prop="yunStoreGoodsSnapshot.classifyName" label="订单" width="180" align="center"/>
      <el-table-column label="状态" align="center">
        <template scope="scope">
          <span v-if="scope.row.orderStatus==='unpaid'" style="color: #E6A23C">待付款</span>
          <span v-else-if="scope.row.orderStatus==='paid'" style="color: #67C23A">已付款</span>
          <span v-else-if="scope.row.orderStatus==='canceled'" style="color: #909399">已取消</span>
        </template>
      </el-table-column>
      <el-table-column prop="yunStore.name" label="店名" align="center"/>
      <el-table-column prop="yunStoreGoodsSnapshot.serviceReriodMonth" label="服务时间（月）" align="center"/>
      <el-table-column prop="userInfoVO.mobile" label="客户手机" width="180" align="center"/>
      <el-table-column :formatter="formatTime" prop="createDate" label="下单时间" width="180" align="center"/>
      <el-table-column prop="orderNumber" label="订单号" width="180" align="center"/>
      <el-table-column prop="yunStoreGoodsSnapshot.discountAmount" label="优惠码支付(元)" width="180" align="center"/>
      <el-table-column prop="orderAmount" label="订单金额(元)" width="180" align="center"/>
      <el-table-column label="操作" width="220" align="left">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="toDetail(scope)">详情</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="getPayList(scope.$index, scope.row )"
          >查看支付列表</el-button>
          <el-button v-if="scope.row.orderStatus==='paid' && (!scope.row.yunStore || !scope.row.yunStore.id)" type="success" @click="openStore(scope)">开店</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="listQuery.pageNum"
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
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { unix2CurrentTime } from '@/utils'
import { getAllList, openStore } from '@/api/cloudOrder'
export default {
  data() {
    return {
      formInline: {},
      tableData: [],
      serchKey: '',
      search: '',
      type: 'all',
      total: 0,
      listQuery: {
        pageNum: 1, // 页码
        pageSize: 10 // 每页数量
      },
      typeOptions: [{
        label: '全部',
        value: 'all'
      }, {
        label: '待支付',
        value: 'unpaid'
      }, {
        label: '已支付',
        value: 'paid'
      }, {
        label: '已取消',
        value: 'canceled'
      }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      startDate: '',
      endDate: ''
    }
  },
  created() {
    this.getAllList()
  },
  methods: {
    exportExcel() {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-table'))
      /* get binary string as output */
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sheetjs.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    formatTime(row, column, cellValue) {
      return unix2CurrentTime(cellValue)
    },
    getAllList() {
      this.listQuery.keyWords = this.serchKey
      if (this.startDate) {
        this.listQuery.payDateBeginStr = this.startDate
      } else {
        this.listQuery.payDateBeginStr = ''
      }
      if (this.endDate) {
        this.listQuery.payDateEndStr = this.endDate + 86400000
      } else {
        this.listQuery.payDateEndStr = ''
      }
      if (this.startDate > this.endDate) {
        this.$message({
          message: '开始时间应小于截止时间',
          type: 'warning'
        })
        return
      }
      getAllList(this.type, this.listQuery).then(res => {
        this.tableData = res.data.result
        this.total = res.data.totalCount
      })
    },
    toDetail(d) {
      this.$router.push({ path: '/cloudProducts/detail', query: {
        id: d.row.orderNumber
      }})
    },
    openStore(d) {
      openStore(d.row.orderNumber).then(res => {
        this.$message(res.data)
        this.getAllList()
      })
    },
    onSubmit() {
      this.listQuery.pageNum = 1
      this.getAllList()
    },
    /**
     * 查看支付列表
     */
    getPayList(index, row) {
      const orderNumber = row.orderNumber
      this.$router.push({
        path: '/order/payManage',
        query: {
          orderNumber: orderNumber
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
      this.getAllList()
    },
    /**
       * 改变页码
       * @param page 页号
       */
    handleCurrentChange(page) {
      this.listQuery.pageNum = page
      this.getAllList()
    }
  }
}
</script>
