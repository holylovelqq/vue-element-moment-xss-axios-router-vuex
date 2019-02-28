<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="datatable">
    <el-table
      v-loading="loading"
      :data="tableData"
      :default-sort = "{prop: 'id', order: 'ascending'}"
      fit
      @cell-click="cellClick"
      @sort-change="sortChange"
    >
      <el-table-column
        v-for="(item,index) in tableColums"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        sortable ='custom'
        :min-width="item.minWidth||''"
        :width="item.width||''"
        :class-name="item.class||''"
        :label-class-name="item.labelClass||''"
      >
        <template  slot-scope="scope">
          <span class="datatable__status" v-if="item.prop=='status'" :style="{'background-color':scope.row.color}">{{ scope.row.status }}</span>
          <span v-else>{{ scope.row[scope.column.property] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <app-pagination
      layout="total, sizes, prev, pager, next, jumper"
      :page-size="pageSize"
      :total="totalNum"
      :pager-count="5"
      :current-page="currentPage"
      @current-change="currentChange"
      @size-change="pageSizeChange"
      :disabled="loading"
    >
    </app-pagination>
  </div>
</template>

<script>
import AppPagination from '@/basics/AppPagination'
export default {
  components: {
    AppPagination
  },
  props: {
    // table
    tableData: Array,
    tableColums: Array,
    // pagination
    pageSize: Number,
    totalNum: Number,
    currentPage: Number,
    loading: Boolean
  },
  data () {
    return {
    }
  },
  methods: {
    cellClick (row, column, cell, event) {
      this.$emit('cell-click', row, column)
    },
    sortChange (obj) {
      // obj: { column, prop, order }
      this.$emit('sort-change', obj)
    },
    currentChange (currentPage) {
      this.$emit('current-change', currentPage)
    },
    pageSizeChange (pageSize) {
      this.$emit('size-change', pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.datatable .el-table {
  border-radius: 4px;
  box-shadow: $shadow;
  width: 100%;
  margin-top:15px;
  /deep/ th{
    padding: 6px 0;
  }
  /deep/ td{
    padding:12px 0;
  }
  /deep/ .cell{
    line-height: 1.3;
  }
  /deep/ th:first-child .cell, /deep/ td:first-child .cell{
    padding-left: 24px;
  }
}
.datatable__status{
    display: inline-block;
    width: 100%;
    border-radius: 1000px;
    line-height: 1.6;
}
</style>
