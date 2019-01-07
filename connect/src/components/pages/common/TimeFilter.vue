<template>
  <div>
    <!-- filter -->
    <div class="knowledge__filter">
      <div class="knowledge__tag">
        <el-tag
          class="datatable__tag"
          size="mini"
          :key="tag"
          v-for="tag in tags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag | formatTextLength}}</el-tag>
      </div>
    <el-button class="datatable__newtag" type="primary" size="small" @click="showFilter"><i class="material-icons">add</i> フィルタを追加</el-button>
    <div class="knowledge__search">
       <el-select class="knowledge__searchSelect" :value="searchSelect" :disabled="checkTag('searchSelect')" size="small" @change="filterSearchChange">
        <el-option
          v-for="item in searchOptions"
          :key="item.value"
          :value="item.value"
          :disabled="checkTag(item.value)">
          <span style="font-weight:400;">{{item.value}}</span>
          <el-tooltip v-if="(item.value === searchSelecttoolTipValue)" class="item" effect="dark" :content="searchSelecttoolTipContent" placement="top"><i class="material-icons" style="float:right;margin-right:-5px;margin-top:8px;color:#F5BB1A;font-size:16px;">info</i></el-tooltip>
        </el-option>
      </el-select><div class="knowledge__filtersearch">
        <el-input class="knowledge__input" v-model="searchValue" @keyup.enter.native="handleSearchConfirm" :disabled="checkAll(searchSelect)" placeholder=""></el-input>
        <i class="material-icons knowledge__searchicon">filter_list</i>
      </div>
    </div>
    <div v-show="filterVisible" class="filter">
      <div class="filter__filter">
        <!-- フィルタ一番前の選択ボックス -->
        <el-select class="filter__searchSelect" :disabled="checkTag('filterSlect')" :value="filterSelect" size="small" @change="filterChange">
          <el-option
            v-for="item in filterOptions"
            :key="item.value"
            :value="item.value"
            :disabled="checkTag(item.value)">
          </el-option>
        </el-select>
      <div class="filter__include">
        <slot name="filterZone"></slot>
      </div>
      </div>
        <app-button
          type="primary"
          size="sm"
          @click="handleInputConfirm"
        >
          追加
        </app-button>
        <app-button
          type="text"
          size="sm"
          @click="filterCancel"
        >
          キャンセル
        </app-button>
    </div>
    </div>
  </div>
</template>
<script>
import eventHub from '../../common/EventHub.js'
export default {
  name: 'TimeFilter',
  props: {
    // 仮v-modelの変数
    searchSelect: String,
    filterSelect: String,
    // customtooltip
    searchSelecttoolTipValue: String,
    searchSelecttoolTipContent: String,
    searchOptions: Array,
    filterOptions: Array,
    tags: Array,
    filterSearchChange: Function,
    filterChange: Function,
    filterCancel: Function,
    handleInputConfirm: Function,
    checkTag: Function,
    checkAll: Function

  },
  data () {
    return {
      searchValue: '',
      filterVisible: false
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
    handleSearchConfirm () {
      this.$emit('handleSearchConfirm', this.searchValue)
      this.searchValue = ''
    },
    // フィルタをみえる
    showFilter () {
      this.filterVisible = true
    }
  },
  created () {
    eventHub.$on('filterClose', () => {
      this.filterVisible = false
    })
  },
  mounted () {

  },
  watch: {
  },
  computed: {

  }
}
</script>
<style lang="scss" scoped>
.knowledge__filter {
  width: fit-content;
}
.knowledge__tag {
  display: inline-block;
}
.datatable__tag {
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
}
.datatable__newtag {
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
.knowledge__search {
  display: inline-block;
}
.knowledge__searchSelect {
  width: 120px;
  height: 34px;
  border: 1px solid #e0e7ec;
  border-right: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  vertical-align: top;
}
.knowledge__filtersearch {
  display: inline-block;
  position: relative;
  border: 1px solid #e0e7ec;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  .knowledge__input {
    width: 200px;
    z-index: 998;
    /deep/ .el-input__inner {
      padding-left: 40px;
      height: 32px;
      line-height: 32px;
    }
  }
  .knowledge__searchicon {
    position: absolute;
    left: 7px;
    top: 5px;
    color: $font-color-secondary;
    z-index: 999;
  }
}
.datatable__inputtag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
  height: 24px;
  line-height: 16px;
  /deep/ .el-input__inner {
    height: 24px;
    line-height: 24px;
    border-radius: 100px;
    background-color: #adbac1;
    color: #fff;
  }
}
.datatable__tag /deep/ .el-icon-close {
  color: $font-color-primary;
}
.filter {
  padding: 15px;
  background-color: #fff;
  margin-top: 20px;
  width: fit-content;
  border-radius: 4px;
  box-shadow: $shadow;
  .filter__filter {
    margin-bottom: 10px;
  }
  .filter__searchSelect {
    width: 140px;
    // height: 34px;
    border: 1px solid #e0e7ec;
    border-radius: 4px;
    margin-right: 10px;
  }
  .filter__include {
    display: inline-block;
  }
}
</style>
