<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="datatable">
    <el-table
      :data="tableData"
      :default-sort = "{prop: 'id', order: 'ascending'}"
      fit
      @cell-click="clickFn"
      @sort-change="sortFn"
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
    <el-pagination class="datatable__pages" background layout="total, sizes, prev, pager, next" :pager-count="5" :page-sizes="[10,20,50,100]" :page-size="pageSize" :total="totalNum" :current-page="currentPage" @current-change="currentChange" @size-change="pageSizeChange" @prev-click="prevClick" @next-click="nextClick">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    // table
    tableData: Array,
    tableColums: Array,
    clickFn: Function,
    sortFn: Function,
    // pagination
    pageSize: Number,
    totalNum: Number,
    currentPage: Number,
    currentChange: Function,
    pageSizeChange: Function,
    prevClick: Function,
    nextClick: Function
  },
  data () {
    return {
    }
  },
  methods: {
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
.datatable__pages{
  position: relative;
  padding-top: 30px;
  text-align: center;
  font-weight: 400;
  // white-space:normal;
  overflow-x: overlay;
  /deep/ .btn-prev, /deep/ .btn-next, /deep/ .el-pager .number{
    background-color: #E0E7EC;
  }
  // /deep/ .btn-prev{
  //   margin-left: 190px;
  // }
  /deep/ .el-pagination__total{
    position: absolute;
    left: 0;
  }
  /deep/ .el-pagination__sizes{
    position: absolute;
    left: 80px;
    /deep/ .el-input__inner{
      background-color: $graybgc;
      padding-left: 0;
      padding-right: 20px;
    }
    /deep/ .el-icon-arrow-up{
      color:$font-color-primary;
    }
  }
}
@include media-query-sm() {
  .datatable__pages{
    margin-top: 18px;
    padding-top: 40px;
    /deep/ .el-pagination__sizes{
    position: absolute;
    left: 80px;
    top: 0;
    }
    /deep/ .el-pagination__total{
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
.datatable__status{
    display: inline-block;
    width: 100%;
    border-radius: 1000px;
    line-height: 1.6;
}
</style>
