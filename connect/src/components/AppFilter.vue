<template>
  <div>
    <!-- filter -->
    <div class="filter__container">
      <!-- 検索ボックス -->
      <div class="search__inputbox">
        <el-input
          class="search__input"
          :value="searchValue"
          :clearable="true"
          @clear="$emit('clearInput')"
          @change="changeSearchValue"
          @keyup.enter.native="$emit('searchConfirm')"
          :disabled="disabled"
        ></el-input>
        <i class="material-icons search__inputicon">search</i>
      </div>
      <!-- フィルタタグ -->
      <div class="filter__tag" v-show="tags.length>0">
        <el-tag
          class="tag"
          size="mini"
          :key="tag"
          v-for="tag in tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag | formatTextLength}}</el-tag>
      </div>
      <el-button
        class="filter__newtag"
        type="primary"
        size="small"
        @click="$emit('showFilter')"
        :disabled="disabled"
      >
        <i class="material-icons">add</i> フィルタを追加
      </el-button>
      <div v-show="filterVisible" class="filter">
        <div class="filter__filter">
          <!-- フィルタ一番前の選択ボックス -->
          <el-select
            class="filter__select"
            :disabled="checkTag('filterSelect')"
            :value="filterSelect"
            size="small"
            @change="filterChange"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :value="item.value"
              :disabled="checkTag(item.value)"
            ></el-option>
          </el-select>
          <div class="filter__include">
            <slot name="filterZone"></slot>
          </div>
        </div>
        <app-button type="primary" size="sm" @click="$emit('inputConfirm')">追加</app-button>
        <app-button type="text" size="sm" @click="$emit('filterCancel')">キャンセル</app-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TimeFilter',
  props: {
    filterSelect: String,
    filterOptions: Array,
    tags: Array,
    checkTag: Function,
    // searchボックスの値
    searchValue: String,
    disabled: Boolean,
    filterVisible: Boolean
  },
  data () {
    return {
    }
  },
  filters: {
    // フィルタタグ表示された文字の長さを修正する
    formatTextLength: function (value) {
      if (!value) return ''
      let isDate = value.includes('作成日') || value.includes('更新日')
      if (isDate) {
        return value
      } else {
        let arr = value.split(':') // ['作成者','自分と一致']['カテゴリ','性能問題']['作成者','タイム 花子']
        if (arr[1].length > 10) {
          let tempVal = arr[1].slice(0, 10) + '...'
          return arr[0] + ':' + tempVal
        } else {
          return value
        }
      }
    }
  },
  methods: {
    // フィルタタグを削除
    handleClose (tag) {
      // console.log(tag)
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    // 一番目のフィルタの選択ボックスが変更されたら
    filterChange (val) {
      this.$emit('filterChange', val)
    },
    changeSearchValue (val) {
    /**
     * searchボックスの値が変えたら
     * @type {Event}
     */
      this.$emit('changeSearchValue', val)
    }
  },
  created () {
  },
  mounted () {},
  watch: {},
  computed: {}
}
</script>
<style lang="scss" scoped>
// 外枠
.filter__container {
  width: fit-content;
}
// フィルタタグ
.filter__tag {
  display: inline-block;
  .tag {
    height: 24px;
    line-height: 16px;
    padding: 4px 15px;
    margin-right: 10px;
    margin-bottom: 10px;
    border-radius: 100px;
    background-color: #e0e7ec;
    border: none;
    color: $font-color-primary;
    /deep/ .el-tag__close {
      font-size: 16px;
    }
    /deep/ .el-tag__close:hover {
      background-color: $font-color-secondary;
    }
    /deep/ .el-icon-close {
      color: $font-color-primary;
    }
  }
}
// 検索ボックス
.search__inputbox {
  display: inline-block;
  position: relative;
  border: 1px solid #e0e7ec;
  margin-bottom: 10px;
  margin-right: 10px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  .search__input {
    width: 200px;
    z-index: 998;
    /deep/ .el-input__inner {
      padding-left: 40px;
      height: 32px;
      line-height: 32px;
    }
  }
  .search__inputicon {
    position: absolute;
    left: 7px;
    top: 5px;
    color: $font-color-secondary;
    z-index: 999;
  }
}
// フィルタを追加するボタン
.filter__newtag {
  position: relative;
  height: 24px;
  line-height: 16px;
  padding: 4px 15px 4px 22px;
  margin-bottom: 10px;
  margin-right: 20px;
  border-radius: 100px;
  color: #fff;
  .material-icons {
    position: absolute;
    top: 4px;
    left: 7px;
    font-size: 15px;
  }
}
// 閉じられるところ
.filter {
  padding: 15px;
  background-color: #fff;
  margin-top: 20px;
  width: fit-content;
  border-radius: 4px;
  box-shadow: $shadow;
  .filter__filter {
    margin-bottom: 10px;
    .filter__select {
      width: 140px;
      border: 1px solid #e0e7ec;
      border-radius: 4px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .filter__include {
      display: inline-block;
    }
  }
}
</style>
