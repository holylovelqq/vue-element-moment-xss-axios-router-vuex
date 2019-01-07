<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="knowledge">
    <h2 class="knowledge__title">{{ title }}</h2>
    <app-button
      style="position: absolute; top:0; right:0;"
      type="floating"
      size="md"
      @click="goAddKnowledge"
    >
      <i class="material-icons">add</i>新規ナレッジの追加
    </app-button>
    <!-- filter -->
    <time-filter :tags="tags" :searchSelect="searchSelect" :filterSelect="filterSelect" searchSelecttoolTipValue="テキスト" searchSelecttoolTipContent="テキストは [タイトルor事象の詳細or対応方法] の条件となります。" :searchOptions="searchOptions" :filterOptions="filterOptions" :filterSearchChange="filterSearchChange" :filterChange="filterChange" :handleInputConfirm="handleInputConfirm" :filterCancel="filterCancel"
    @handleSearchConfirm="handleSearchConfirm" :checkTag="checkTag" :checkAll="checkAll">
      <template slot="filterZone">
        <!-- カテゴリ -->
        <el-select v-show="filterSelectType==='category'" class="filter__searchSelect" v-model="cateSelectValue" :disabled="checkAll(filterSelect)" size="small">
          <el-option
            v-for="item in categories"
            :key="item.value"
            :value="item.name">
          </el-option>
        </el-select>
        <!-- 作成者と更新者 -->
        <el-select v-show="filterSelectType==='user'" class="filter__searchSelect" v-model="userSelectValue" size="small">
          <el-option
            v-for="item in users"
            :key="item.value"
            :value="item.last_name+'  '+item.first_name">
          </el-option>
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
          >
        </el-date-picker>
        <!-- その他 -->
        <!-- <el-input v-show="filterSelectType==='input'" class="filter__input" v-model="inputValue" @keyup.enter.native="handleInputConfirm" :disabled="checkAll(filterSelect)" placeholder=""></el-input>
        <span v-show="filterSelectType==='input'">を含む</span> -->
      </template>
    </time-filter>
    <!-- table component -->
    <data-table
      :tableData="knowledgeList"
      :tableColums="colums"
      :clickFn="goKnowledgeDetail"
      :sortFn="getSort"
      :pageSize="pageSize"
      :totalNum="totalNum"
      :currentPage="currentIndex"
      :currentChange="currentChange"
      :pageSizeChange="pageSizeChange"
      :prevClick="prevClick"
      :nextClick="nextClick"
    ></data-table>
  </div>
</template>

<script>
import DataTable from './common/DateTable'
import eventHub from '../common/EventHub.js'
import TimeFilter from './common/TimeFilter'
import { formatDatetime } from './common/CommonMethods.js'
export default {
  name: 'Knowledge',
  components: {
    DataTable, TimeFilter
  },
  data () {
    return {
      // title
      title: 'ナレッジベース',
      // filter
      tags: [],
      // filterVisible: false,
      inputValue: '',
      filterSelect: 'カテゴリ',
      // filterSelectType: 'input',
      filterOptions: [
        {
          key: 'knowledge-category-id',
          value: 'カテゴリ'
        },
        {
          key: 'registered-user-id',
          value: '作成者'
        },
        {
          key: 'updated-user-id',
          value: '更新者'
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
      categories: [
        // {
        //   id: 1,
        //   name: '性能問題',
        //   order: 0
        // }
      ],
      users: [
        // {
        // first_name: "太郎"
        // id: 1
        // last_name: "タイム"
        // }
      ],
      dateRangeValue: '',
      userSelectValue: '',
      cateSelectValue: '',
      // filter->searchbox
      searchSelect: 'テキスト',
      searchValue: '',
      searchOptions: [
        {
          key: 'all',
          value: 'テキスト'
        },
        {
          key: 'title',
          value: 'タイトル'
        },
        {
          key: 'problem-details',
          value: '事象の詳細'
        },
        {
          key: 'content',
          value: '対応の方法'
        }
      ],
      // table
      knowledgeList: [],
      pagedata: [],
      colums: [
        {
          width: '100',
          prop: 'id',
          label: 'ID'
        },
        {
          // minWidth: '130',
          class: 'datas__title',
          prop: 'title',
          label: 'タイトル'
        },
        // {
        //   // width: '200',
        //   prop: 'system',
        //   label: '対象システム'
        // },
        {
          // width: '250',
          prop: 'knowledge_category',
          label: 'カテゴリ'
        },
        {
          // width: '200',
          prop: 'registered_at',
          label: '作成日'
        },
        {
          // width: '90',
          prop: 'updated_at',
          label: '更新日'
        },
        // {
        //   width: '130',
        //   class: 'datas__status',
        //   labelClass: 'datas__status__label',
        //   prop: 'status',
        //   label: 'ステータス'
        // },
        {
          width: '200',
          prop: 'registered_user',
          label: '作成者'
        }
      ],
      // pagination
      pageSize: 20,
      totalNum: 1,
      currentIndex: 1,
      params: {
        limit: 20,
        offset: 0
      }
    }
  },
  methods: {
    init () {
      this.getKnowledges(this.params)
      this.getCategories()
      this.getUsers()
    },
    // インシデントを取得する
    getKnowledges (params) {
      this.$axios
        .get('knowledge/', {
          params: params
        })
        .then(res => {
          // console.log(res)
          if (res.status === 200) {
            // data:
            //   count: 4
            //   next: null
            //   previous: null
            //   results: Array(4)
            //   0: {id: 1, title: "2018/12/17 11:57", registered_user: {…}, updated_user: {…}, knowledge_category: {…}, …}
            //   1: {id: 7, title: "foo", registered_user: {…}, updated_user: {…}, knowledge_category: {…}, …}
            //   2: {id: 14, title: "aaaa", registered_user: {…}, updated_user: {…}, knowledge_category: {…}, …}
            //   3: {id: 15, title: "foo", registered_user: {…}, updated_user: {…}, knowledge_category: {…}, …}
            //   length: 4
            // id: 1
            // knowledge_category: {id: 1, name: "性能問題"}
            // registered_at: "2018-12-17T11:59:31.004222+09:00"
            // registered_user: {id: 1, first_name: "太郎", last_name: "タイム"}
            // title: "2018/12/17 11:57"
            // updated_at: "2018-12-17T11:59:31.004310+09:00"
            // updated_user: {id: 1, first_name: "太郎", last_name: "タイム"}
            this.totalNum = res.data.count
            this.knowledgeList = []
            let tempdata = res.data.results
            for (let i = 0; i < tempdata.length; i++) {
              this.knowledgeList.push({
                id: tempdata[i].id,
                title: tempdata[i].title,
                knowledge_category: tempdata[i].knowledge_category.name,
                registered_user:
                  tempdata[i].registered_user.last_name +
                  '　' +
                  tempdata[i].registered_user.first_name,
                updated_user:
                  tempdata[i].updated_user.last_name +
                  '　' +
                  tempdata[i].updated_user.first_name,
                registered_at: formatDatetime(tempdata[i].registered_at),
                updated_at: formatDatetime(tempdata[i].updated_at)
              })
            }
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(err => console.log(err))
    },
    // カテゴリを取得する
    getCategories () {
      this.$axios.get('knowledge-categories/').then(res => {
        // console.log(res)
        if (res.status === 200) {
          this.categories = res.data
        }
      })
    },
    // ユーザーを取得する
    getUsers () {
      this.$axios.get('users/').then(res => {
        // console.log(res)
        if (res.status === 200) {
          this.users = res.data
        }
      })
    },
    // フィルタの選択項目を変える
    filterSelectChange (val) {
      // console.log(this.filterSelectType)
    },
    // フィルタ追加ボタンを押す->フィルタを追加する
    handleInputConfirm () {
      // console.log(this.filterSelectType)
      switch (this.filterSelectType) {
        // case 'input':
        //   let inputValue = this.inputValue.trim()
        //   // 追加ボタンを押す又はenterキーを押す
        //   if (inputValue) {
        //     this.tags.push(this.filterSelect + ':' + inputValue)
        //     this.inputValue = ''
        //     this.filterSelect = 'テキスト'
        //     this.filterVisible = false
        //   } else {
        //     this.inputValue = ''
        //   }
        //   break
        case 'date':
          // console.log(this.dateRangeValue)
          if (!this.dateRangeValue) break
          let start = this.$moment(this.dateRangeValue[0]).format('YYYY/MM/DD')
          let end = this.$moment(this.dateRangeValue[1]).format('YYYY/MM/DD')
          // console.log(start)
          // console.log(end)
          this.tags.push(this.filterSelect + ':' + start + '-' + end)
          this.dateRangeValue = ''
          eventHub.$emit('filterClose')
          break
        case 'category':
          // console.log(this.cateSelectValue)
          if (!this.cateSelectValue) break
          this.tags.push(this.filterSelect + ':' + this.cateSelectValue)
          this.cateSelectValue = ''
          eventHub.$emit('filterClose')
          break
        case 'user':
          // console.log(this.userSelectValue)
          if (!this.userSelectValue) break
          this.tags.push(this.filterSelect + ':' + this.userSelectValue)
          this.userSelectValue = ''
          eventHub.$emit('filterClose')
          break

        default:
          break
      }
    },
    // フィルタキャンセルボタンを押す
    filterCancel () {
      this.inputValue = ''
      this.dateRangeValue = ''
      this.cateSelectValue = ''
      this.userSelectValue = ''
      eventHub.$emit('filterClose')
    },
    // searchbox enterキーを押す
    handleSearchConfirm (val) {
      // console.log(val)
      // console.log(this.searchSelect)
      let searchValue = val.trim()
      if (searchValue) {
        this.tags.push(this.searchSelect + ':' + searchValue)
        // this.searchValue = ''
      } else {
        // this.searchValue = ''
      }
    },
    // 検索前の選択したもの変える
    filterSearchChange (val) {
      // console.log(val)
      this.searchSelect = val
    },
    filterChange (val) {
      // console.log(val)
      this.filterSelect = val
    },
    // table中のタイトルを押す
    goKnowledgeDetail (row, column, cell, event) {
      // console.log(row)
      // console.log(column)
      // console.log(cell)
      // console.log(event)
      if (column.property === 'title') {
        this.$router.push({
          name: 'knowledge_detail',
          params: {
            id: row.id
          }
        })
      }
    },
    // sort
    getSort (dataObj) {
      // console.log(dataObj)
      // {
      //   column: {…}
      //   order: "ascending"
      //   prop: "id"
      // }

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
      this.getKnowledges(this.params)
    },
    // ナレッジの追加ボタンを押す
    goAddKnowledge () {
      this.$router.push({
        name: 'knowledge_new'
      })
    },
    // pageNumberを変える
    currentChange (val) {
      // console.log(val)
      this.currentIndex = val
      this.params.offset = (this.currentIndex - 1) * this.pageSize
      // APIからもう一度データをもらう
      console.log(this.params)
      this.getKnowledges(this.params)
    },
    // pageSizeを変える
    pageSizeChange (val) {
      // console.log(val)
      this.pageSize = val
      this.params.limit = val
      this.currentIndex = 1
      this.params.offset = (this.currentIndex - 1) * this.pageSize
      // APIからもう一度データをもらう
      console.log(this.params)
      this.getKnowledges(this.params)
    },
    prevClick (val) {
      // console.log(val)
      // console.log(this.currentIndex)
    },
    nextClick (val) {
      // console.log(val)
      // console.log(this.currentIndex)
    },
    // タグが存在するかのcheck-----一番目の選択ボックスと項目をdisabledかとか
    checkTag (str) {
      if (this.tags.length === 0) return false
      let checkStr = ''
      for (let ele of this.tags) {
        checkStr += ele
      }
      let strExist = checkStr.includes(str)
      let allExist = checkStr.includes('テキスト')
      let title = checkStr.includes('タイトル')
      let problem = checkStr.includes('事象の詳細')
      let content = checkStr.includes('対応の方法')

      let cate = checkStr.includes('カテゴリ')
      let reDate = checkStr.includes('作成日')
      let upDate = checkStr.includes('更新日')
      let reUser = checkStr.includes('作成者')
      let upUser = checkStr.includes('更新者')
      if (allExist) {
        // 「テキスト」存在している
        if (
          str === 'タイトル' ||
          str === '事象の詳細' ||
          str === '対応の方法' ||
          str === 'searchSelect'
        ) {
          return true
        }
      } else {
        // 同じタグ存在している
        if (strExist) {
          return true
        }
        // searchSelect
        if ((title || problem || content) && str === 'テキスト') {
          return true
        }
        // searchSelectすべて存在している
        if (title && problem && content && str === 'searchSelect') {
          return true
        }
      }
      // filterすべて存在している
      if (
        cate &&
        reDate &&
        upDate &&
        reUser &&
        upUser &&
        str === 'filterSlect'
      ) {
        return true
      }
    },
    // title,problem-details,contentタグが存在するかのcheck-----return boolean
    checkAll (str) {
      let checkStr = ''
      for (let ele of this.tags) {
        checkStr += ele
      }
      let all = checkStr.includes('テキスト')
      let title = checkStr.includes('タイトル')
      let problem = checkStr.includes('事象の詳細')
      let content = checkStr.includes('対応の方法')

      let cate = checkStr.includes('カテゴリ')
      let reDate = checkStr.includes('作成日')
      let upDate = checkStr.includes('更新日')
      let reUser = checkStr.includes('作成者')
      let upUser = checkStr.includes('更新者')
      // searchInput
      if (str === 'テキスト') {
        if (title || problem || content || all) return true
      }
      // categories
      if (str === 'カテゴリ') {
        if (cate && reDate && upDate && reUser && upUser) return true
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {},
  watch: {
    // フィルタタグ変えたら,this.paramsも変わる、
    tags (val) {
      // val は変えた値
      // params
      // {
      //     // 'all': '',
      //     // 'title': '',
      //     // 'problem-details': '',
      //     // 'content': '',
      //     // 'knowledge-category-id': 1,
      //     // 'registered-user-id': 1,
      //     // 'updated-user-id': 1,
      //     // 'min-registered-at': '2018-12-17T11:59:31.004222+09:00',
      //     // 'max-registered-at': '2018-12-17T17:02:11.605454+09:00',
      //     // 'min-updated-at': '2018-12-17T11:59:31.004222+09:00',
      //     // 'max-updated-at': '2018-12-17T17:02:11.605454+09:00',
      //     'limit': this.pageSize,
      //     'offset': (this.currentIndex - 1) * this.pageSize
      //   }
      this.currentIndex = 1
      let params = {
        limit: this.pageSize,
        offset: (this.currentIndex - 1) * this.pageSize
      }
      let checkStr = ''
      for (let ele of val) {
        checkStr += ele
        let arr = ele.split(':') // ------>['作成者','自分と一致']['作成日','2018/12/05-2019/01/17']['カテゴリ','性能問題']['作成者','タイム 花子']
        if (arr[0] === 'カテゴリ') {
          let cateID = null
          for (let cate of this.categories) {
            if (arr[1] === cate.name) {
              cateID = cate.id
            }
          }
          params['knowledge-category-id'] = cateID
        } else if (arr[0] === '作成者') {
          let userId = null
          for (let user of this.users) {
            if (arr[1] === user.last_name + '  ' + user.first_name) {
              userId = user.id
            }
          }
          params['registered-user-id'] = userId
        } else if (arr[0] === '更新者') {
          let userId = null
          for (let user of this.users) {
            if (arr[1] === user.last_name + '  ' + user.first_name) {
              userId = user.id
            }
          }
          params['updated-user-id'] = userId
        } else if (arr[0] === '作成日') {
          // ['作成日','2018/12/05-2019/01/17']
          let arrTime = arr[1].split('-') // ------>['2018/12/05','2019/01/17']
          let start = this.$moment(arrTime[0]).toISOString() // ------->2018-12-04T15:00:00.000Z
          let end = this.$moment(arrTime[1] + ' 23:59:59.999').toISOString() // --------->2019-01-17T14:59:59.999Z
          params['min-registered-at'] = start
          params['max-registered-at'] = end
        } else if (arr[0] === '更新日') {
          let arrTime = arr[1].split('-') // ------>['2018/12/05','2019/01/17']
          let start = this.$moment(arrTime[0]).toISOString() // ------->2018-12-04T15:00:00.000Z
          let end = this.$moment(arrTime[1] + ' 23:59:59.999').toISOString() // --------->2019-01-17T14:59:59.999Z
          params['min-updated-at'] = start
          params['max-updated-at'] = end
        } else {
          for (let option of this.searchOptions) {
            if (arr[0] === option.value) {
              let key = option.key
              params[key] = arr[1]
            }
          }
        }
      }
      this.params = params
      // get data
      this.getKnowledges(params)

      // searchSelectValue
      let title = checkStr.includes('タイトル')
      let problem = checkStr.includes('事象の詳細')
      let content = checkStr.includes('対応の方法')
      let all = checkStr.includes('テキスト')
      all
        ? (this.searchSelect = 'テキスト')
        : !(title || problem || content)
          ? (this.searchSelect = 'テキスト')
          : !title
            ? (this.searchSelect = 'タイトル')
            : !problem
              ? (this.searchSelect = '事象の詳細')
              : !content
                ? (this.searchSelect = '対応の方法')
                : (this.searchSelect = 'テキスト')

      // filterSlectValue
      let cate = checkStr.includes('カテゴリ')
      let reDate = checkStr.includes('作成日')
      let upDate = checkStr.includes('更新日')
      let reUser = checkStr.includes('作成者')
      let upUser = checkStr.includes('更新者')
      !cate
        ? (this.filterSelect = 'カテゴリ')
        : !reUser
          ? (this.filterSelect = '作成者')
          : !upUser
            ? (this.filterSelect = '更新者')
            : !reDate
              ? (this.filterSelect = '作成日')
              : !upDate
                ? (this.filterSelect = '更新日')
                : (this.filterSelect = 'カテゴリ')
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
      } else if (
        this.filterSelect === '作成者' ||
        this.filterSelect === '更新者'
      ) {
        return 'user'
      } else {
        return ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.knowledge {
  position: relative;
  /deep/ .datas__title {
    cursor: pointer;
  }
}
.knowledge__title {
  margin-bottom: 30px;
}
.filter__daterange {
  border: 1px solid #e0e7ec;
  height: 34px;
  // line-height: 34px;
  /deep/ .el-range-separator {
    width: fit-content;
    line-height: 26px;
  }
  /deep/ .el-range__icon {
    line-height: 26px;
  }
}
.filter__input {
  display: inline-block;
  width: 240px;
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
