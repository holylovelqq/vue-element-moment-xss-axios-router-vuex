<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div>
  <!-- 左側 -->
    <div class="left">
      <div>
        <p class="shallowcolor">#{{ incidentDetail.id }}</p>
        <p class="left__title">{{ incidentDetail.title }}</p>
      </div>
      <div class="detail">
        <div class="detail__left">
          <p class="shallowcolor">発生日時</p>
          <p class="samemargin">{{formatTime(incidentDetail.occurred_at)}}</p>
          <p class="shallowcolor">検知元監視システム</p>
          <p class="samemargin">Dynatrace</p>
          <p class="shallowcolor">説明</p>
          <pre class="samemargin detail__details">{{incidentDetail.details}}</pre>
        </div>
        <div class="detail__right">
          <p class="shallowcolor">ステータス</p>
          <el-select class="detail__status samemargin" size="small" v-model="statusValue" @change="statusChange">
            <el-option
              v-for="item in statuses"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :style="{'color':item.color}">
            </el-option>
          </el-select>
          <p class="shallowcolor">優先度</p>
          <el-select class="detail__select samemargin" size="small" v-model="priorityValue" @change="priorityChange">
            <el-option
              v-for="item in priorities"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
          <p class="shallowcolor">対応期限</p>
          <el-date-picker
            class="detail__select samemargin"
            v-model="dateValue"
            type="date"
            format="yyyy/MM/dd"
            @change="dateChange"
            placeholder="date">
          </el-date-picker>
          <p class="shallowcolor">担当者</p>
          <el-select class="detail__select samemargin" size="small" v-model="assignValue" @change="assignChange">
            <el-option
              v-for="item in assigners"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="tabs">
        <!-- <p class="tabs__title" style="">アクティビティ</p> -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="アクティビティ" name="activity">
            <!-- comment追加 -->
            <div class="tabs__addcomment" style="">
              <el-input v-show="!showAddComment" class="tabs__addinput" @focus="showEdit" placeholder="コメントを追加する..."></el-input>
              <el-input v-show="showAddComment" v-model="addCommentContent" class="tabs__addinput" resize="none" rows="3" type="textarea" size="medium" ref="addComment"></el-input>
              <el-button v-show="showAddComment" @click="saveAddComment" type="primary" size="small" style="border:none">Save</el-button>
              <el-button v-show="showAddComment" @click="cancelAddComment" size="small" style="border:none">Cancel</el-button>
            </div>
            <!-- comment content -->
            <div style="position:relative">
              <el-select class="tabs__select" size="small" v-model="activityValue">
                <el-option
                  v-for="item in activities"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <div class="tabs__blank" v-if="!commentContent.length">コメントがありません</div>
              <div class="tabs__all" v-for="item in pageComment" :key="item.id">
                <div class="tabs__nodes"></div>
                <div class="tabs__timeline">
                <span class="shallowcolor">{{formatTime(item.commented_at)}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="shallowcolor">{{item.auther}}</span>
                </div>
                <p class="tabs__content">{{ item.content }}</p>
                <a class="shallowcolor" href="">編集&nbsp;&#x2022;&nbsp;</a><a class="shallowcolor" href="">削除</a>
              </div>
              <!-- pagination -->
              <el-pagination class="tabs__pages" background layout="prev, pager, next" :pager-count="5" :page-size="pageSize" :total="totalNum" :current-page="currentIndex" @current-change="currentChange">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane class="tabs__effectitems" label="影響する構成アイテム" name="item">
            <div class="tabs__effect" v-for="(items,keys) in effectItems" :key="keys">
              <h4 class="tabs__effecttitle">{{keys}}</h4>
              <div class="tabs__device" v-for="(item,key) in items" :key="key">
                <p class="tabs__effectdevice">{{key}}</p>
                <div class="tabs__event" v-for="(event,index) in item" :key="index">
                  <p class="tabs__effectevent">{{event | takeOutRootcause}}</p>
                  <span v-if="event.includes('<<<')" class="tabs__rootcause">{{event | takeRootcause}}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <!--右側 -->
    <div class="right">
      <p class="right__title">Top Findings</p>
      <div class="rootcause">
        <p class="rootcause__title">Dynatrace Root Cause: <span>ocp openshift-easytravel-frontend</span></p>
        <p class="rootcause__content">Garbage collection is suspending process ocp openshift-easytravel-frontend (easytravel-frontend-1-g9j8q) on host openshift-easytravel-docker</p>
      </div>
      <div class="knowledgebase">
        <p class="knowledgebase__title">ナレッジベース<span>事象Aの対処方法</span></p>
        <p class="knowledgebase__content">一般に、Copy GCに比べて、Full GCは実行に時間がかかる。そのため、Full GCはなるべく発生させず、使用済みメモリ領域はCopy GCでうまく回収させることが安定稼働のポイントとなる。 そのためには、Full GCの発生間隔を考慮して...</p>
      </div>
      <div class="research">
        <p class="research__title" style="">調査</p>
        <p class="research__subtitle">ナレッジベース・インシデント検索</p>
        <el-input class="research__input" @keyup.enter.native="inputEnter" placeholder="ナレッジ・インシデントを検索..."></el-input>
        <i class="material-icons">search</i>
        <p class="research__subtitle">関連リンク</p>
        <a class="linkpro" href="#" target="_blank">Dynatrace Problem#119</a>
      </div>
      <div class="cate">
        <p class="cate__title">分類</p>
        <el-tag class="cate__tags" v-for="tag in cateTags" :key="tag.name" closable :disable-transitions="false" @close="handleClose(tag)">
          {{tag.name}}
        </el-tag>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDatetime } from './common/CommonMethods.js'
export default {
  name: 'IncidentsDetail',
  data () {
    return {
      incDetailId: this.$route.params.id,
      incidentDetail: {
        // id: 1,
        // title: 'WWW.easytravel.com: User action duration degradation',
        // assigned_user: {first_name: '太郎', last_name: 'タイム'},
        // occurred_at: '2018-10-01T02:02:03+09:00',
        // details: 'default message',
        // watch_sys: 'Dynatrace',
        // status: '新規',
        // priority: '低'
      },
      statuses: [
        // {
        //   value: '1',
        //   label: '未着手',
        //   color: 'gray'
        // },
        // {
        //   value: '2',
        //   label: '復旧中',
        //   color: 'green'
        // },
        // {
        //   value: '3',
        //   label: '完了',
        //   color: 'blue'
        // }
      ],
      defaultStatusValue: '',
      // statusValue: '',
      priorityValue: '',
      priorities: [
        // {
        //   value: '1',
        //   label: '低'
        // },
        // {
        //   value: '2',
        //   label: '中'
        // },
        // {
        //   value: '3',
        //   label: '高'
        // }
      ],
      dateValue: '2018/9/25',
      assignValue: '',
      assigners: [
        // {
        //   value: '1',
        //   label: '小林 野愛'
        // },
        // {
        //   value: '2',
        //   label: '小'
        // },
        // {
        //   value: '3',
        //   label: '林'
        // },
        // {
        //   value: '4',
        //   label: '野'
        // },
        // {
        //   value: '5',
        //   label: '愛'
        // }
      ],
      // comment
      activeName: 'activity',
      commentContent: [
        // {
        //   id: 1,
        //   commented_at: '2018-11-26T13:16:12.081000+09:00',
        //   auther: 'Dynatrace',
        //   content:
        //     '<p>Error log pattern found Pattern</p> "OS Process Error" found 1 times/min in "c:\\Users\\labuser\\.dynaTrace\\easyTravel 2.0.0\\easyTrave\\log\\couch.log".'
        // },
        // {
        //   id: 2,
        //   commented_at: '2018-11-26T13:16:12.081000+09:00',
        //   auther: 'Dynatrace',
        //   content:
        //     '&lt;p&gt;Error log pattern found Pattern &lt;/p&gt;"OS Process Error" found 1 times/min in "c:\\Users\\labuser\\.dynaTrace\\easyTravel 2.0.0\\easyTrave\\log\\couch.log".'
        // },
        // {
        //   id: 3,
        //   commented_at: '2018-11-26T13:16:12.081000+09:00',
        //   auther: 'Dynatrace',
        //   content:
        //     '<p><strong><em><u>vue2-editor</u></em><span class="ql-cursor"></span></strong><img src="data:image/jpeg;base64,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"></p>'
        // },
        // {
        //   id: 4,
        //   commented_at: '2018-11-26T13:16:12.081000+09:00',
        //   auther: 'Dynatrace',
        //   content:
        //     'Error log pattern found Pattern "OS Process Error" found 1 times/min in "c:\\Users\\labuser\\.dynaTrace\\easyTravel 2.0.0\\easyTrave\\log\\couch.log".'
        // }
      ],
      pageComment: [],
      pageSize: 5,
      totalNum: 1,
      currentIndex: 1,
      showAddComment: false,
      addCommentContent: '',
      activities: [
        {
          value: 'all',
          label: 'すべて'
        },
        {
          value: 'alert',
          label: 'アラート'
        },
        {
          value: 'comment',
          label: 'コメント'
        },
        {
          value: 'others',
          label: 'その他'
        }
      ],
      activityValue: 'all',
      // comment->effectitems
      effectItems: {
        // 'Applications': {
        //   // 'EasyTravel Customer Frontend': ['PROCESS_GROUP_LOW_INSTANCE_COUNT', 'PROCESS_GROUP_LOW_INSTANCE_COUNT']
        // },
        // 'Services': {
        //   // 'EasyTravel Customer Frontend': ['PROCESS_GROUP_LOW_INSTANCE_COUNT', 'PROCESS_GROUP_LOW_INSTANCE_COUNT'],
        //   // 'EasyTravel Customer Frontend0': ['PROCESS_GROUP_LOW_INSTANCE_COUNT', 'PROCESS_GROUP_LOW_INSTANCE_COUNT']
        // },
        // 'processes': {
        //   // 'EasyTravel Customer Frontend': ['PROCESS_GROUP_LOW_INSTANCE_COUNT', 'PROCESS_GROUP_LOW_INSTANCE_COUNT']
        // },
        // 'Hosts': {
        //   // 'EasyTravel Customer Frontend': ['PROCESS_GROUP_LOW_INSTANCE_COUNT', 'PROCESS_GROUP_LOW_INSTANCE_COUNT']
        // }
      },
      // 分類
      cateTags: [
        { name: 'インシデント分類：応答時間の遅延' },
        { name: 'アプリケーション：EasyTravel' }
      ]
    }
  },
  filters: {
    // rootcauseを削除
    takeOutRootcause: function (value) {
      if (!value) {
        return ''
      } else {
        let tf = value.includes('<<<')
        if (tf) {
          let index = value.indexOf('<<<')
          let data = value.slice(0, index)
          return data
        } else {
          return value
        }
      }
    },
    // rootcauseを取得
    takeRootcause: function (value) {
      if (!value) {
        return ''
      } else {
        let tf = value.includes('<<<')
        if (tf) {
          let index = value.indexOf('<<<')
          let data = value.slice(index + 3)
          return data
        } else {
          return ''
        }
      }
    }
  },
  methods: {
    init () {
      // console.log(this.$route)
      this.getStatuses()
      this.getPriorities()
      this.getUsers()
      this.getIncidentDetail(this.incDetailId)
      this.getComments(this.incDetailId)
      this.getEvents(this.incDetailId)
    },
    // 詳細情報を取得
    getIncidentDetail (incidentId) {
      this.$axios.get('incidents/' + incidentId)
        .then((res) => {
          // console.log(res)
          // @ToDo we need error handling for 404, 503 etc...
          if (res.status === 200) {
            this.incidentDetail = res.data
            this.defaultStatusValue = res.data.status.id
            this.priorityValue = res.data.priority.id
            this.assignValue = res.data.assigned_user.id
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch((err) => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // 詳細情報を更新
    patchIncidentDetail (option) {
      let changedData = {}
      let message = ''
      switch (option) {
        case 'assign':
          changedData = {assigned_user_id: this.assignValue}
          message = '担当者を変更しました。'
          break
        case 'status':
          changedData = {status_id: this.statusValue}
          message = 'ステータスを変更しました。'
          break
        case 'priority':
          changedData = {priority_id: this.priorityValue}
          message = '優先度を変更しました。'
          break
        default:
          break
      }

      this.$axios.patch('incidents/' + this.incDetailId + '/', changedData).then((res) => {
        res.status === 200 ? this.$message.success(message) : this.$messaage.error(res.message)
      }).catch(err => console.log(err))
    },
    // ステータス情報を取得
    getStatuses () {
      this.$axios.get('statuses/')
        .then((res) => {
          // console.log(res)
          // @ToDo we need error handling for 404, 503 etc...
          if (res.status === 200) {
            // data: Array(3)
            //   0: {id: 1, name: "新規", order: 0, color: Array(3)}
            //   1: {id: 2, name: "進行中", order: 100, color: Array(3)}
            //   2: {id: 3, name: "完了", order: 200, color: Array(3)}

            this.statuses = []
            for (let i = 0; i < res.data.length; i++) {
              let tempdata = res.data[i]
              this.statuses.push({
                order: tempdata.order,
                value: tempdata.id,
                label: tempdata.name,
                color: 'rgb(' + tempdata.color[0] + ',' + tempdata.color[1] + ',' + tempdata.color[2] + ')'
              })
            }
            // 昇順
            this.statuses.sort((a, b) => {
              return a.order - b.order
            })
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch((err) => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // 優先度情報を取得
    getPriorities () {
      this.$axios.get('priorities/')
        .then((res) => {
          // console.log(res)
          // @ToDo we need error handling for 404, 503 etc...
          if (res.status === 200) {
            this.priorities = []
            for (let i = 0; i < res.data.length; i++) {
              let tempdata = res.data[i]
              this.priorities.push({
                value: tempdata.id,
                label: tempdata.name,
                order: tempdata.order
              })
            }
            // 昇順
            this.priorities.sort((a, b) => {
              return a.order - b.order
            })
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch((err) => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // 担当者情報を取得
    getUsers () {
      this.$axios.get('users/')
        .then((res) => {
          // console.log(res)
          // @ToDo we need error handling for 404, 503 etc...
          if (res.status === 200) {
            this.assigners = []
            for (let i = 0; i < res.data.length; i++) {
              let tempdata = res.data[i]
              this.assigners.push({
                value: tempdata.id,
                label: tempdata.last_name + '　' + tempdata.first_name,
                order: tempdata.order
              })
            }
            // 昇順
            this.assigners.sort((a, b) => {
              return a.order - b.order
            })
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch((err) => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // コメント情報を取得
    getComments () {
      this.$axios.get('incidents/' + this.incDetailId + '/comments/')
        .then((res) => {
          // @ToDo we need error handling for 404, 503 etc...
          // console.log(res)
          if (res.status === 200) {
            // 0: {id: 1, content: "とんでもない問題が発生したんだな", commented_user: { first_name: "太郎", last_name: "タイム"}, commented_at: "2018-11-26T13:16:12.081000+09:00"}
            // 1:{id: 2, content: "とんでもない問題が発生したんだな", commented_user: { first_name: "太郎", last_name: "タイム"}, commented_at: "2018-11-26T13:16:12.081000+09:00"}
            this.commentContent = []
            if (!res.data.length) return false
            for (let i = 0; i < res.data.length; i++) {
              let tempdata = res.data[i]
              this.commentContent.push({
                id: tempdata.id,
                commented_at: tempdata.commented_at,
                auther: tempdata.last_name + '　' + tempdata.first_name,
                content: tempdata.content
              })
            }
            // 降順
            this.commentContent.sort((a, b) => {
              return b.id - a.id
            })
            // 全てのコメント中に画面に表示されるコメントを取得する
            this.totalNum = this.commentContent.length
            if (this.totalNum < this.pageSize) {
              this.pageComment = this.commentContent
            } else {
              this.pageComment = this.commentContent.slice((this.currentIndex - 1) * this.pageSize, this.currentIndex * this.pageSize)
            }
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch((err) => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // イベント情報を取得
    getEvents (incidentId) {
      this.$axios.get('incidents/' + incidentId + '/events/')
        .then((res) => {
          // @ToDo we need error handling for 404, 503 etc...
          // console.log(res)
          if (res.status === 200) {
            // 0: {place: "My web application", place_type: "Application", matter: "やばい", attribute: null}
            // 1: {place: "Requests executed in background threads of com.dynatrace.easytravel.weblauncher.jar easytravel-*-x*", place_type: "Services", matter: "げきやば", attribute: "rootcause"}
            this.effectItems = {}
            for (let i = 0; i < res.data.length; i++) {
              let tempdata = res.data[i]
              this.effectItems[tempdata.place_type] = this.effectItems[tempdata.place_type] || {}
              if (tempdata.attribute) {
                this.effectItems[tempdata.place_type][tempdata.place] = this.effectItems[tempdata.place_type][tempdata.place] ? this.effectItems[tempdata.place_type][tempdata.place].concat([tempdata.matter + '<<<' + tempdata.attribute]) : [tempdata.matter + '<<<' + tempdata.attribute]
              } else {
                this.effectItems[tempdata.place_type][tempdata.place] = this.effectItems[tempdata.place_type][tempdata.place] ? this.effectItems[tempdata.place_type][tempdata.place].concat([tempdata.matter]) : [tempdata.matter]
              }
            }
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch((err) => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // タイムをフォーマット
    formatTime (date) {
      return formatDatetime(date)
    },
    // ステータス情報を変更
    statusChange (val) {
      // console.log(val)
      this.patchIncidentDetail('status')
    },
    // 優先度情報を変更
    priorityChange (val) {
      // console.log(val)
      this.patchIncidentDetail('priority')
    },
    // 対応期限を変更
    dateChange (val) {
      console.log(val)
      this.$message.success('対応期限を変更しました。')
    },
    // 担当者情報を変更
    assignChange (val) {
      // console.log(val)
      this.patchIncidentDetail('assign')
    },
    // comment
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // page numberを変更
    currentChange (val) {
      console.log(val)
      this.currentIndex = val
      this.pageComment = this.commentContent.slice((this.currentIndex - 1) * this.pageSize, this.currentIndex * this.pageSize)
    },
    // コメントを追加する
    showEdit () {
      this.showAddComment = true
      this.$nextTick(() => {
        this.$refs.addComment.$refs.textarea.focus()
      })
    },
    // 追加したコメントを保存
    saveAddComment () {
      if (this.addCommentContent.trim() === '') return false
      // console.log(this.addCommentContent)
      this.$axios.post('incidents/' + this.incDetailId + '/comments/', {
        content: this.addCommentContent
      }, {
        headers: {'content-Type': 'application/json;charset=UTF-8'}
      }).then((res) => {
        // console.log(res)
        if (res.status === 201) {
          this.$message.success('コメントを追加しました。')
          this.getComments()
        } else {
          this.$messaage.error(res.message)
        }
      }).catch(err => console.log(err))

      this.addCommentContent = ''
      this.showAddComment = false
    },
    // コメントの追加することを諦める
    cancelAddComment () {
      this.addCommentContent = ''
      this.showAddComment = false
    },
    // 右側
    inputEnter () {
      console.log('u pressed the key of enter')
    }
  },
  created () {
    this.init()
  },
  mounted () {},
  watch: {
    // status選択boxの色
    statusValue: function (val) {
      let tempColor = ''
      this.statuses.forEach(ele => {
        if (ele.value === val) {
          tempColor = ele.color
        }
      })
      this.$nextTick(() => {
        let input = document.querySelector('.detail__status .el-input__inner')
        input.style.backgroundColor = tempColor
      })
    }
  },
  computed: {
    statusValue: {
      // getter
      get: function () {
        if (this.statuses.length > 0) {
          return this.defaultStatusValue
        }
      },
      // setter
      set: function (newValue) {
        this.defaultStatusValue = newValue
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.left {
  position: absolute;
  left: 2.5%;
  top: 42px;
  width: 62.5%;
  padding: 2%;
  box-sizing: border-box;
  box-shadow: $shadow;
  background-color: $whitebgc;
  border-radius: 4px;
  .left__title{
    font-size:20px;
    margin-bottom:30px;
  }
  .detail {
    position: relative;
    border-top: 1px solid $border-color-primary;
    border-bottom: 1px solid $border-color-primary;
    .detail__left {
      width: 70%;
      box-sizing: border-box;
      padding-right: 50px;
      min-height: 300px;
      margin-right: 30%;
      margin: 20px 0 20px;
      border-right: 1px solid $border-color-primary;
    }
    .detail__details{
      white-space: pre-wrap;
    }
    .detail__right {
      position: absolute;
      top: 20px;
      left: 70%;
      width: 30%;
      padding-left: 3%;
      box-sizing: border-box;
      /deep/ .el-input__inner{
        height: 34px;
      }
      /deep/ .el-select .el-input .el-select__caret{
        color: #fff;
      }
      .detail__status /deep/ .el-input__inner{
        background-color: $graybgc;
        color: #fff;
        border: none;
      }
      .detail__select{
        /deep/ .el-input__inner{
          background-color: $graybgc;
          padding-left: 15px;
        }
        /deep/ .el-input__prefix, .el-input__suffix{
          display: none;
        }
      }
      /deep/ .el-date-editor.el-input,.el-date-editor.el-input__inner{
        width:100%;
        max-width: 213px;
      }
    }
  }
  .tabs{
    margin-top:36px;
    /deep/ .el-tabs__item{
      text-align: center;
    }
    /deep/ .el-tabs__content{
      overflow: visible;
    }
    .tabs__title{
      margin-bottom:20px;
      font-size:16px;
    }
    .tabs__blank{
      padding: 20px;
      background-color: $graybgc;
    }
    .tabs__all{
      box-sizing:border-box;
      padding:8px 20px 32px 20px;
      border-left:1px solid $border-color-primary;
      position:relative;
      .tabs__nodes{
        position:absolute;
        background-color:#E8ECEF;
        width:8px;
        height:8px;
        border-radius:4px;
        left:-4px;
        top:-4px
      }
      .tabs__timeline{
        position: absolute;
        top: -8px;
      }
      .tabs__content{
        margin:10px 0;
      }
    }
    .tabs__all:first-child{
        margin-top: 35px;
    }
    .tabs__pages{
      text-align: center;
      margin-top: 20px;
      font-weight:400;
      overflow-x:auto
    }
    .tabs__addcomment{
      margin-bottom: 80px;
    }
    .tabs__addinput{
      border: 1px solid $border-color-primary;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .tabs__select{
      width: 100px;
      position: absolute;
      right: 0px;
      top: -35px;
      z-index: 998;
      /deep/ .el-input__inner{
        background-color: $graybgc;
      }
    }
    .tabs__effectitems{
      margin-bottom: 80px;
    }
    .tabs__effect{
      margin-top: 30px;
      // margin-bottom: 100px;
      .tabs__device{
        border: 1px solid $border-color-primary;
        border-radius: 4px;
        margin-top: 10px;
        .tabs__effectdevice{
          line-height: 30px;;
          background-color: #E8ECEF;
          border-radius: 4px 4px 0 0;
          margin-bottom: 10px;
          padding-left: 10px;
        }
        .tabs__effectevent{
          padding:0 10px;
          margin-bottom:10px;
          display: inline-block
        }
        .tabs__rootcause{
          display: inline-block;
          padding: 2px 6px;
          border-radius: 100px;
          background-color: $redbgc;
          color: #fff;
        }
      }
    }
  }
}
.right {
  width: 30%;
  height: 100%;
  position: absolute;
  right: 2.5%;
  top: 42px;
  bottom: 0;
  /deep/ .el-input__inner{
    height: 48px;
    line-height: 48px;
    background-color: $whitebgc;
    padding-left: 50px;
  }
  .right__title{
    margin-top:20px;
    font-size:18px;
  }
  .rootcause{
    margin:20px 0;
    box-shadow: $shadow;
    border-radius:0 0 4px 4px;
    .rootcause__title{
      height:36px;
      line-height:36px;
      background-color:$redbgc;
      font-weight:700;
      border-radius:4px 4px 0 0;
      color:#fff;
      padding:0 10px;
      span{
        font-weight:400;
      }
    }
    .rootcause__content{
      background-color:$whitebgc;
      padding:10px;
      border-radius:0 0 4px 4px;
    }
  }
  .knowledgebase{
     margin:20px 0;
     box-shadow: $shadow;
     border-radius:0 0 4px 4px;
     .knowledgebase__title{
       height:36px;
       line-height:36px;
       background-color:$bluebgc;
       font-weight:700;
       border-radius:4px 4px 0 0;
       color:#fff;
       padding:0 10px;
       span{
         font-weight: 400;
       }
     }
     .knowledgebase__content{
       background-color:$whitebgc;
       padding:10px;
       border-radius:0 0 4px 4px;
     }
  }
  .research{
    margin-top:30px;
    position:relative;
    .research__title{
      font-size:18px;
    }
    .research__subtitle{
      margin:20px 0 16px;
    }
    .material-icons{
      position:absolute;
      left:10px;
      top:85px
    }
    .research__input{
      box-shadow: $shadow;
    }
    .linkpro{
      text-decoration:underline;
      color:$bluebgc;
    }
  }
  .cate{
    margin-top:50px;
    .cate__title{
      font-size:18px;
      margin-bottom:17px;
    }
    .cate__tags{
      background-color: #E8ECEF;
      border: none;
      margin: 0 10px 10px 0;
      height: 24px;
      line-height: 16px;
      line-height: 18px;
      padding: 4px 15px;
      border-radius: 100px;
      color: $font-color-primary;
    }
    .cate__tags.el-tag /deep/ .el-icon-close{
      color: $font-color-primary;
    }
  }
}
.shallowcolor{
  color:$font-color-secondary;
}
.samemargin{
  margin:4px 0 20px 0
}
</style>
