<!-- (C) 2018 SEIKO SOLUTIONS INC. -->

<template>
  <div class="app-pagination">
    <el-pagination
      background
      :pagerCount="5"
      :pageSizes="[10, 20, 50, 100]"
      :layout="layout"
      :pageSize="pageSize"
      :total="total"
      :currentPage="currentPage"
      :disabled="disabled"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',
  props: {

    // 表示するUIを選択
    layout: {
      type: String,
      default: 'prev, pager, next'
    },

    // 1ページの表示件数
    pageSize: {
      type: Number,
      default: 10
    },

    // 総件数
    total: {
      type: Number,
      default: null
    },

    // 現在のページ
    currentPage: {
      type: Number,
      default: 1
    },

    // ページネーション全体を操作不可にする
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCurrentChange (currentPage) {
      /**
       * el-paginationコンポーネントで発火されたcurrent-changeイベントを
       * 親コンポーネントへ伝える
       * @type {Event}
       */
      this.$emit('current-change', currentPage)
    },
    handleSizeChange (pageSize) {
      /**
       * el-paginationコンポーネントで発火されたsize-changeイベントを
       * 親コンポーネントへ伝える
       * @type {Event}
       */
      this.$emit('size-change', pageSize)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-pagination {
  position: relative;
  margin-top: 30px;
  text-align: center;
  font-weight: 400;
  overflow-x: overlay;

  .el-pagination {
    padding: 0;
  }

  /deep/ .btn-prev,
  /deep/ .btn-next,
  /deep/ .el-pager .number {
    background-color: $border-color-primary;
    border-radius: 4px;
    line-height: 32px;
    height: 32px;
  }
  /deep/ .btn-prev,
  /deep/ .btn-next {
    border-radius: 4px !important;
    background-color: $border-color-primary !important;
  }
  /deep/ .el-pagination__total {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 32px;
    height: 32px;
    margin-right: 0;
    max-width: 150px;
    overflow: hidden;
    text-align: left;
  }
  /deep/ .el-pagination__sizes {
    position: absolute;
    left: 0;
    top: 0;
    .el-input {
      width: 116px;
      margin-left: 0;
    }
    .el-input__inner {
      background-color: $border-color-primary;
      line-height: 32px;
      height: 32px;
      margin-right: 0;
    }
    .el-icon-arrow-up {
      color: $font-color-primary;
    }
  }

  // ページジャンパー
  // デスクトップでは非表示にする
  /deep/ .el-pagination__jump {
    display: none;
    position: absolute;
    top: 0;
    right: 0;
    .el-input__inner {
      background-color: $border-color-primary;
      line-height: 32px;
      height: 32px;
    }
  }
}

@include media-query-sm() {
  .app-pagination {
    // 総ページを2段目に表示する
    padding-bottom: 40px;

    // ページ番号のボタンを非表示にする
    /deep/ .el-pager {
      display: none;
    }

    // 総ページ数を非表示にする
    /deep/ .el-pagination__total {
      position: absolute;
      left: 0;
      top: 40px;
    }

    // ページ番号入力ボックスを表示する
    /deep/ .el-pagination__jump {
      display: inline-block;
    }
  }
}
</style>
