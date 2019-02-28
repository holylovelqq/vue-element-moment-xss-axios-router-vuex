<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="knowledge">
    <h2 class="knowledge__title">ナレッジベース</h2>
    <app-button
      style="position: absolute; top:0; right:0;"
      type="floating"
      size="md"
      @click="goAddKnowledge"
    >
      <i class="material-icons">add</i>新規ナレッジの追加
    </app-button>
    <!-- filter -->
    <app-filter
      :tags="tags"
      :filterSelect="filterSelect"
      :filterOptions="filterOptions"
      :searchValue="searchValue"
      :disabled="isLoading"
      :filterVisible="filterVisible"
      :checkTag="checkTag"
      @filterChange="filterChange"
      @inputConfirm="handleInputConfirm"
      @clearInput="clearInput"
      @filterCancel="filterCancel"
      @searchConfirm="handleSearchConfirm"
      @changeSearchValue="changeSearchValue"
      @showFilter="showFilter"
    >
      <template slot="filterZone">
        <!-- カテゴリ -->
        <el-select
          v-show="filterSelectType==='category'"
          class="filter__category"
          v-model="cateSelectValue"
          :disabled="checkTag(filterSelect)"
          size="small"
        >
          <el-option
            v-for="item in categories"
            :key="item.id"
            :value="item.name"
          ></el-option>
        </el-select>
        <!-- 作成日と更新日 -->
        <el-date-picker
          v-show="filterSelectType==='date'"
          class="filter__daterange"
          v-model="dateRangeValue"
          type="daterange"
          range-separator="-"
          start-placeholder="開始日"
          end-placeholder="終了日"
        ></el-date-picker>
      </template>
    </app-filter>
    <!-- table component -->
    <data-table
      :tableData="knowledgeList"
      :tableColums="colums"
      @cell-click="goKnowledgeDetail"
      @sort-change="changeSort"
      :pageSize="pageSize"
      :totalNum="totalNum"
      :currentPage="currentIndex"
      @current-change="currentChange"
      @size-change="pageSizeChange"
      :loading="isLoading"
    ></data-table>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import AppFilter from '@/components/AppFilter'
import { formatDatetime } from '@/assets/js/CommonMethods.js'
export default {
  name: 'Knowledge',
  components: {
    DataTable,
    AppFilter
  },
  // routerからpropsをもらう
  props: { queryObj: Object },
  data () {
    return {
      // 検索ボックスの値
      searchValue: '',
      // フィルタタグ
      tags: [],
      // フィルタエリアが表示されるかどうか
      filterVisible: false,
      // フィルタエリアに一番目のプルダウンの値
      filterSelect: 'カテゴリ',
      // フィルタエリアに一番目のプルダウンの可能な値
      filterOptions: [
        {
          key: 'knowledge-category-id',
          value: 'カテゴリ'
        },
        {
          key: 'registered-at',
          value: '作成日'
        },
        {
          key: 'updated-at',
          value: '更新日'
        }
      ],
      // フィルタエリア'カテゴリ'対応の値配列
      categories: [],
      // ィルタエリア'カテゴリ'対応の値
      cateSelectValue: '',
      // フィルタエリア'作成日と更新日'対応の値
      dateRangeValue: '',
      // テーブルデータ
      knowledgeList: [],
      // テーブルコラム
      colums: [
        {
          width: '100',
          prop: 'id',
          label: 'ID'
        },
        {
          class: 'datas__title',
          prop: 'title',
          label: 'タイトル'
        },
        {
          prop: 'knowledge_category',
          label: 'カテゴリ'
        },
        {
          prop: 'registered_at',
          label: '作成日'
        },
        {
          prop: 'updated_at',
          label: '更新日'
        }
      ],
      // デフォルト一ページの件数
      pageSize: 20,
      // 全ての件数
      totalNum: 1,
      // 今のページナンバー
      currentIndex: 1,
      // GET /knowledgeのパラメータ
      params: {
        limit: 20,
        offset: 0,
        'sort-fields': 'id'
      },
      // ローディングするかどうか
      isLoading: true
    }
  },
  methods: {
    init () {
      this.getCategories()
    },

    // ナレッジを取得する
    getKnowledges (params) {
      this.isLoading = true
      this.$axios
        .get('knowledge/', {
          params: params
        })
        .then(res => {
          this.totalNum = res.data.count
          this.knowledgeList = []
          let tempdata = res.data.results
          for (let i = 0; i < tempdata.length; i++) {
            this.knowledgeList.push({
              id: tempdata[i].id,
              title: tempdata[i].title,
              knowledge_category: tempdata[i].knowledge_category.name,
              registered_at: formatDatetime(tempdata[i].registered_at),
              updated_at: formatDatetime(tempdata[i].updated_at)
            })
          }
        })
        .catch(err => console.log(err))
        .finally(() => {
          this.isLoading = false
        })
    },

    // ブラウザヒストリーを追加する
    addBrowserHistory (params) {
      //  Browser Historyを追加する
      let queryObj = Object.assign({}, params)
      // カテゴリの値が存在する
      if (params['knowledge-category-id']) {
        let cateName = ''
        for (let cate of this.categories) {
          if (params['knowledge-category-id'] === cate.id) {
            cateName = cate.name
          }
        }
        queryObj['category'] = cateName
        delete queryObj['knowledge-category-id']
      }
      // 作成日の値が存在する
      if (params['min-registered-at']) {
        queryObj['registered_at'] =
          this.$moment(params['min-registered-at']).format('YYYY/MM/DD') +
          '-' +
          this.$moment(params['max-registered-at']).format('YYYY/MM/DD')
        delete queryObj['min-registered-at']
        delete queryObj['max-registered-at']
      }
      // 更新日の値が存在する
      if (params['min-updated-at']) {
        queryObj['updated_at'] =
          this.$moment(params['min-updated-at']).format('YYYY/MM/DD') +
          '-' +
          this.$moment(params['max-updated-at']).format('YYYY/MM/DD')
        delete queryObj['min-updated-at']
        delete queryObj['max-updated-at']
      }
      if (this.$route.name !== 'knowledge') return false
      // URLのパラメータを変える
      this.$router.push({
        path: '/knowledge',
        query: queryObj
      })
    },

    // カテゴリを取得する
    getCategories () {
      this.$axios
        .get('knowledge-categories/')
        .then(res => {
          this.categories = res.data
        })
        .catch(err => console.log(err))
    },

    // searchbox enterキーを押す
    handleSearchConfirm () {
      this.$set(this.params, 'all', this.searchValue)
    },

    // 検索ボックスの値を変えたら
    changeSearchValue (val) {
      this.searchValue = val
    },

    // 検索ボックスの値を消す
    clearInput () {
      this.$delete(this.params, 'all')
    },

    // フィルタを追加するエリアが表示される
    showFilter () {
      this.filterVisible = true
    },

    // フィルタ追加ボタンを押す->フィルタを追加する
    handleInputConfirm () {
      switch (this.filterSelectType) {
        case 'date':
          if (!this.dateRangeValue) break
          let start = this.$moment(this.dateRangeValue[0]).format('YYYY/MM/DD')
          let end = this.$moment(this.dateRangeValue[1]).format('YYYY/MM/DD')
          this.tags.push(this.filterSelect + ':' + start + '-' + end)
          this.dateRangeValue = ''
          this.filterVisible = false
          break
        case 'category':
          if (!this.cateSelectValue) break
          this.tags.push(this.filterSelect + ':' + this.cateSelectValue)
          this.cateSelectValue = ''
          this.filterVisible = false
          break
        default:
          break
      }
    },

    // フィルタキャンセルボタンを押す
    filterCancel () {
      this.dateRangeValue = ''
      this.cateSelectValue = ''
      this.userSelectValue = ''
      this.filterVisible = false
    },

    // 一番目のフィルタの選択ボックスが変更されたら
    filterChange (val) {
      this.filterSelect = val
    },

    // table中のタイトルを押す
    goKnowledgeDetail (row, column) {
      if (column.property === 'title') {
        this.$router.push({
          name: 'knowledge_detail',
          params: {
            id: row.id
          }
        })
      }
    },

    // ソート順を変えたら
    changeSort (dataObj) {
      // API側最後尾'_id'が必要ー＞追加する
      if (
        dataObj.prop === 'registered_user' ||
        dataObj.prop === 'knowledge_category'
      ) {
        dataObj.prop += '_id'
      }
      // 降順にする
      if (dataObj.order === 'descending') {
        dataObj.prop = '-' + dataObj.prop
      }
      this.params['sort-fields'] = dataObj.prop
      this.currentIndex = 1
      this.params.offset = (this.currentIndex - 1) * this.pageSize
    },

    // ナレッジの追加ボタンを押す
    goAddKnowledge () {
      this.$router.push({
        name: 'knowledge_new'
      })
    },

    // pageNumberを変える
    currentChange (val) {
      this.currentIndex = val
      this.params.offset = (this.currentIndex - 1) * this.pageSize
    },

    // pageSizeを変える
    pageSizeChange (val) {
      this.pageSize = val
      this.params.limit = val
      this.currentIndex = 1
      this.params.offset = (this.currentIndex - 1) * this.pageSize
    },

    // タグが存在するかのcheck-----一番目の選択ボックスと項目をdisabledかとか
    checkTag (str) {
      if (this.tags.length === 0) return false
      let checkStr = ''
      for (let ele of this.tags) {
        checkStr += ele
      }
      let strExist = checkStr.includes(str)

      let cate = checkStr.includes('カテゴリ')
      let reDate = checkStr.includes('作成日')
      let upDate = checkStr.includes('更新日')
      if (strExist) {
        return true
      }
      // filterすべて存在している
      if (cate && reDate && upDate && str === 'filterSelect') {
        return true
      }
    },

    // URLパラメータがあるかどうか？デフォルトの値かどうか？のチェック
    checkQueryObj (queryObj) {
      let queryObjLength = Object.keys(queryObj).length
      let tempParams = {
        limit: '20',
        offset: '0',
        'sort-fields': 'id'
      }
      let isDefaultParams =
        JSON.stringify(queryObj) === JSON.stringify(tempParams)
      queryObjLength === 0 || isDefaultParams
        ? this.getKnowledges(this.params)
        : this.getURLParameter(queryObj)
    },

    // URLから検索値/フィルタ値を取得する
    getURLParameter (queryObj) {
      // limit
      this.params.limit = Number(queryObj.limit)
      this.pageSize = Number(queryObj.limit)
      // offset
      if (queryObj.offset % queryObj.limit !== 0) {
        queryObj.offset = 0
      }
      this.params.offset = Number(queryObj.offset)
      this.currentIndex = queryObj.offset / queryObj.limit + 1
      // sort-fields
      this.params['sort-fields'] = queryObj['sort-fields']
      // 検索ボックスの値
      if (queryObj.all) {
        this.$set(this.params, 'all', queryObj.all)
        this.searchValue = queryObj.all
      } else {
        this.$delete(this.params, 'all')
        this.searchValue = ''
      }
      let checkStr = ''
      for (let ele of this.tags) {
        checkStr += ele
      }

      // 画面に入る時カテゴリのタグが存在するか
      let cateTag = checkStr.includes('カテゴリ')
      // カテゴリのタグがないー＞存在
      if (queryObj.category && !cateTag) {
        this.tags.push('カテゴリ:' + queryObj.category)
      }
      // カテゴリのタグが存在ー＞ない
      if (!queryObj.category && cateTag) {
        for (let i = 0; i < this.tags.length; i++) {
          let flag = this.tags[i].indexOf('カテゴリ')
          if (flag >= 0) {
            this.tags.splice(this.tags.indexOf(i), 1)
          }
        }
      }
      // 作成日のタグがないー＞存在
      let registeredTag = checkStr.includes('作成日')
      if (queryObj.registered_at && !registeredTag) {
        this.tags.push('作成日:' + queryObj.registered_at)
      }
      // 作成日のタグが存在ー＞ない
      if (!queryObj.registered_at && registeredTag) {
        for (let i = 0; i < this.tags.length; i++) {
          let flag = this.tags[i].indexOf('作成日')
          if (flag >= 0) {
            this.tags.splice(this.tags.indexOf(i), 1)
          }
        }
      }
      // 更新日のタグがないー＞存在
      let updatedTag = checkStr.includes('更新日')
      if (queryObj.updated_at && !updatedTag) {
        this.tags.push('更新日:' + queryObj.updated_at)
      }
      // 更新日のタグが存在ー＞ない
      if (!queryObj.updated_at && updatedTag) {
        for (let i = 0; i < this.tags.length; i++) {
          let flag = this.tags[i].indexOf('更新日')
          if (flag >= 0) {
            this.tags.splice(this.tags.indexOf(i), 1)
          }
        }
      }
    }
  },
  created () {
    this.init()
  },
  watch: {
    // フィルタタグが変わったら,this.paramsも変わる
    tags (val) {
      // val は変えた値
      this.currentIndex = 1
      let params = {
        limit: this.pageSize,
        offset: 0,
        'sort-fields': this.params['sort-fields']
      }
      if (this.params.all) {
        params.all = this.params.all
      }
      let checkStr = ''
      for (let ele of val) {
        checkStr += ele
        let arr = ele.split(':')
        if (arr[0] === 'カテゴリ') {
          let cateID = null
          for (let cate of this.categories) {
            if (arr[1] === cate.name) {
              cateID = cate.id
            }
          }
          params['knowledge-category-id'] = cateID
        } else if (arr[0] === '作成日') {
          let arrTime = arr[1].split('-')
          let start = this.$moment(arrTime[0]).toISOString()
          let end = this.$moment(arrTime[1] + ' 23:59:59.999').toISOString()
          params['min-registered-at'] = start
          params['max-registered-at'] = end
        } else if (arr[0] === '更新日') {
          let arrTime = arr[1].split('-')
          let start = this.$moment(arrTime[0]).toISOString()
          let end = this.$moment(arrTime[1] + ' 23:59:59.999').toISOString()
          params['min-updated-at'] = start
          params['max-updated-at'] = end
        } else {
          for (let option of this.filterOptions) {
            if (arr[0] === option.value) {
              let key = option.key
              params[key] = arr[1]
            }
          }
        }
      }
      // this.paramsの値を変えて、データをもらう
      this.params = params
      // filterSlectValue
      let cate = checkStr.includes('カテゴリ')
      let reDate = checkStr.includes('作成日')
      let upDate = checkStr.includes('更新日')
      !cate
        ? (this.filterSelect = 'カテゴリ')
        : !reDate
          ? (this.filterSelect = '作成日')
          : !upDate
            ? (this.filterSelect = '更新日')
            : (this.filterSelect = 'カテゴリ')
    },

    // paramsが変わったら,ナレッジデータをもらう
    params: {
      handler: function (val) {
        this.addBrowserHistory(val)
        this.getKnowledges(val)
      },
      deep: true
    },

    // カテゴリAPIのレスポンスをもらったかどうか？
    categories: {
      handler: function (val) {
        this.checkQueryObj(this.queryObj)
      },
      deep: true
    }
  },
  computed: {
    filterSelectType: function () {
      if (this.filterSelect === 'カテゴリ') {
        return 'category'
      } else if (
        this.filterSelect === '作成日' ||
        this.filterSelect === '更新日'
      ) {
        return 'date'
      } else {
        return 'input'
      }
    }
  },
  beforeRouteUpdate (to, from, next) {
    // URLのパラメータを変わるとき、次のコードを実行する
    to.query.limit = Number(to.query.limit)
    to.query.offset = Number(to.query.offset)
    let queryString = JSON.stringify(to.query)
    let paramsString = JSON.stringify(this.params)
    if (queryString !== paramsString) {
      this.checkQueryObj(to.query)
    }
    next()
  }
}
</script>
<style lang="scss" scoped>
// 外枠
.knowledge {
  position: relative;
  /deep/ .datas__title {
    cursor: pointer;
  }
}
// title
.knowledge__title {
  margin-bottom: 30px;
  padding-top: 12px;
}
//
// filter
//
// 作成日と更新日
.filter__daterange {
  border: 1px solid #e0e7ec;
  height: 34px;
  /deep/ .el-range-separator {
    width: fit-content;
    line-height: 26px;
  }
  /deep/ .el-range__icon {
    line-height: 26px;
  }
}
// カテゴリと作成者と更新者
.filter__category,
.filter__user {
  border: 1px solid #e0e7ec;
  border-radius: 4px;
  margin-right: 10px;
}
// input
.filter__input {
  display: inline-block;
  height: 34px;
  border: 1px solid #e0e7ec;
  border-radius: 4px;
  /deep/ .el-input__inner {
    padding-left: 10px;
    height: 30px;
    line-height: 34px;
  }
}
</style>
