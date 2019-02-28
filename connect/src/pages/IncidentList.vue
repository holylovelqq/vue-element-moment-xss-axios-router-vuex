<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="incidents">
    <h2 class="datatable__title">
      {{ title }}
    </h2>
    <el-input class="incidents__input" v-model="searchValue" @keyup.enter.native="search" placeholder=""></el-input>
    <i class="material-icons incidents__searchicon">search</i>
    <!-- filter -->
    <el-tag class="datatable__tag" size="mini" :key="tag" v-for="tag in tags" closable :disable-transitions="false" @close="handleClose(tag)"> {{tag}}</el-tag>
    <el-input class="datatable__inputtag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" >
    </el-input>
    <el-button v-else class="datatable__newtag" size="small" @click="showInput">+ フィルタを追加</el-button>
    <!-- table component -->
    <data-table
      :tableData="incidents"
      :tableColums="colums"
      @cell-click="goIncidentDetail"
      @sort-change="changeSort"
      :pageSize="pageSize"
      :totalNum="totalNum"
      :currentPage="currentIndex"
      @current-change="currentChange"
      @size-change="pageSizeChange"
      :loading="loading"
    ></data-table>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import { formatDatetime } from '@/assets/js/CommonMethods.js'
export default {
  name: 'IncidentList',
  components: {
    DataTable
  },
  data () {
    return {
      // title
      title: 'インシデント',
      // search
      searchValue: '',
      // filter
      tags: ['ステータス≠完了', '担当者=自分'],
      inputVisible: false,
      inputValue: '',
      // table
      statuses: [],
      initdata: [],
      pagedata: [],
      colums: [
        {
          width: '80',
          prop: 'id',
          label: 'ID'
        },
        {
          // minWidth: '130',
          class: 'datas__title',
          prop: 'title',
          label: 'タイトル'
        },
        {
          // width: '200',
          prop: 'system',
          label: 'アプリケーション'
        },
        {
          // width: '250',
          prop: 'category',
          label: '分類'
        },
        {
          // width: '200',
          prop: 'occurred_at',
          label: '起票日時'
        },
        {
          width: '90',
          prop: 'priority',
          label: '優先度'
        },
        {
          width: '130',
          class: 'datas__status',
          labelClass: 'datas__status__label',
          prop: 'status',
          label: 'ステータス'
        },
        {
          // width: '100',
          prop: 'assign_to',
          label: '担当者'
        }
      ],
      // pagination
      pageSize: 20,
      totalNum: 100,
      currentIndex: 1,
      // loading
      loading: true
    }
  },
  methods: {
    handleClose (tag) {
      console.log(tag)
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    goIncidentDetail (row, column) {
      // console.log(row)
      // console.log(column)
      // console.log(cell)
      // console.log(event)
      if (column.property === 'title') {
        this.$router.push({
          name: 'incident_detail',
          params: {
            id: row.id
          }
        })
      }
    },
    search () {
      console.log(this.searchValue)
      this.searchValue = ''
    },
    currentChange (val) {
      console.log(val)
      this.currentIndex = val
      this.incidents = this.allIncidents.slice((this.currentIndex - 1) * this.pageSize, this.currentIndex * this.pageSize)
    },
    pageSizeChange (val) {
      console.log(val)
      this.pageSize = val
      // APIからもう一度データをもらう
      // this.getIncidents()
    },

    // インシデントを取得する
    getIncidents () {
      this.loading = true
      this.$axios.get('incidents/').then((response) => {
        // console.log(response)
        this.initdata = response.data

        this.loading = false
      })
    },

    // ステータスを取得する
    getStatuses () {
      this.$axios.get('statuses/').then((response) => {
        this.statuses = response.data
      })
    },

    // Get Status Color from status name
    // @param {string} statusName - ステータスの名前 ex) 新規
    // @return {string} RGB形式のCSSの値 ex) rgb(0,0,0)
    getStatusColor (statusName) {
      let statusColor = 'rgb(0,0,0)'
      if (!this.statuses || this.statuses.length === 0) {
        return statusColor
      }

      for (let s of this.statuses) {
        if (s.name === statusName) {
          statusColor = 'rgb(' + s.color[0] + ',' + s.color[1] + ',' + s.color[2] + ')'
        }
      }
      return statusColor
    },

    // 現在のページのインシデントデータを返す
    // @todo APIにページング機能が実装されたら修正する
    paginate (allIncidents) {
      this.totalNum = allIncidents.length
      let incidents = []
      if (this.totalNum < this.pageSize) {
        incidents = allIncidents
      } else {
        incidents = allIncidents.slice((this.currentIndex - 1) * this.pageSize, this.currentIndex * this.pageSize)
      }
      return incidents
    },
    // sort
    changeSort (dataObj) {
      // sort機能を実装してない
    }
  },
  created () {
    this.getIncidents()
    this.getStatuses()
  },
  mounted () {

  },
  watch: {

  },

  // @todo APIでページネーションが実装されたら修正が必要
  computed: {
    incidents: function () {
      if (!this.initdata) {
        return null
      }
      // 日付のフォーマット、名前の連結、ステータスの色の追加
      let incidents = []
      for (let incident of this.initdata) {
        // tempdata追加しましたーーcomputed中のVMにつけて変数の値を変えたら、関数が実行する
        let tempdata = {}
        tempdata.occurred_at = formatDatetime(incident.occurred_at)
        tempdata.assign_to = incident.assigned_user.last_name + ' ' + incident.assigned_user.first_name
        tempdata.status = incident.status.name
        tempdata.priority = incident.priority.name
        tempdata.id = incident.id
        tempdata.title = incident.title
        tempdata.system = incident.system ? incident.system : 'www.easytravel.com'
        tempdata.category = incident.category ? incident.category : 'ハードウェアリソースの不足'
        if (this.statuses) {
          tempdata.color = this.getStatusColor(tempdata.status)
        }
        incidents.push(tempdata)
      }
      // console.log(incidents)
      return this.paginate(incidents)
    }
  }
}
</script>
<style lang="scss" scoped>
  .incidents{
    position: relative;
    /deep/ .datas__title{
      cursor: pointer;
    }
    /deep/ .datas__status .cell:not(.datas__status__label){
      color: #fff;
      width: 80px;
      text-align: center;
      margin-left: 20px;
    }
    /deep/ .el-input__inner{
      // background-color: #E0E7EC;
      // padding-left: 40px;
    }
  }
  .incidents__input{
    width: 240px;
    height: 40px;
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 4px;
    z-index: 998;
    /deep/ .el-input__inner{
      background-color: #E0E7EC;
      padding-left: 40px;
    }
  }
  .incidents__searchicon{
    position: absolute;
    right: 205px;
    top: 8px;
    z-index: 999
  }
  .datatable__title{
  margin-bottom: 30px;
}
.datatable__tag{
  height: 24px;
  line-height: 16px;
  padding: 4px 15px;
  border-radius: 100px;
  background-color: #E0E7EC;
  border: none;
  color: $font-color-primary;
}
.el-tag + .el-tag {
    margin-left: 10px;
}
.datatable__newtag {
  margin-left: 10px;
  height: 24px;
  line-height: 16px;
  padding: 4px 15px;
  border-radius: 100px;
  background-color: #ADBAC1;
  color: #fff;
}
.datatable__inputtag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
  height: 24px;
  line-height: 16px;
  /deep/ .el-input__inner{
    height: 24px;
    line-height: 24px;
    border-radius: 100px;
    background-color: #ADBAC1;
    color: #fff;
  }
}
.datatable__tag.el-tag /deep/ .el-icon-close{
  color: $font-color-primary;
}
</style>
