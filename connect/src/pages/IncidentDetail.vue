<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div>
    <app-loading :isLoading="isLoading"></app-loading>
    <div class="incdetail" v-show="!isLoading">
      <!-- 左側 -->
      <div class="left">
        <div>
          <p class="shallow-color">#{{ incidentDetail.id }}</p>
          <p class="left__title">{{ incidentDetail.title }}</p>
        </div>
        <div class="detail">
          <div class="detail__left">
            <p class="shallow-color">起票日時</p>
            <p class="same-margin">{{formatTime(incidentDetail.occurred_at)}}</p>
            <p class="shallow-color">検知元監視システム</p>
            <p class="same-margin">Dynatrace</p>
            <p class="shallow-color">説明</p>
            <pre class="same-margin detail__details">{{incidentDetail.details}}</pre>
          </div>
          <div class="detail__right">
            <p class="shallow-color">ステータス</p>
            <el-select
              class="detail__status same-margin"
              size="small"
              v-model="statusValue"
              @change="statusChange"
            >
              <el-option
                v-for="item in statuses"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :style="{'color':item.color}"
              ></el-option>
            </el-select>
            <p class="shallow-color">優先度</p>
            <el-select
              class="detail__select same-margin"
              size="small"
              v-model="priorityValue"
              @change="priorityChange"
            >
              <el-option
                v-for="item in priorities"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <p class="shallow-color">対応期限</p>
            <el-date-picker
              class="detail__select same-margin"
              v-model="dateValue"
              type="date"
              format="yyyy/MM/dd"
              @change="dateChange"
              placeholder="date"
            ></el-date-picker>
            <p class="shallow-color">担当者</p>
            <el-select
              class="detail__select same-margin"
              size="small"
              v-model="assignValue"
              @change="assignChange"
            >
              <el-option
                v-for="item in assigners"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="tabs">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="アクティビティ" name="activity">
              <!-- comment -->
              <!-- コメントを追加する -->
              <div class="comment__addcomment">
                <el-input
                  v-show="!showAddComment"
                  class="comment__addinput"
                  @focus="showEdit"
                  placeholder="コメントを追加する..."
                ></el-input>
                <comment-form
                  :content="addCommentContent"
                  v-show="showAddComment"
                  @save="saveAddComment"
                  @cancel="cancelAddComment"
                  ref="addComment"
                />
              </div>
              <!-- comment content -->
              <div>
                <div class="comment__allcontent" v-loading="commentLoading">
                  <div class="comment__blank" v-if="!commentContent.length">コメントがありません</div>
                  <div class="comment__all" v-for="comment in commentContent" :key="comment.id">
                    <comment-detail
                      :id="comment.id"
                      :commented_at="comment.commented_at"
                      :updated_at="comment.updated_at"
                      :commented_user="comment.commented_user"
                      :content="comment.content"
                      :isEdit="comment.id === editingCommentId"
                      @update="updateComment"
                      @delete="deleteCommentConfirm"
                      @open="openCommentForm"
                      @close="closeCommentForm"
                    />
                  </div>
                </div>
                <!-- pagination -->
                <app-pagination
                  layout="prev, pager, next"
                  :pager-count="5"
                  :page-size="pageSize"
                  :total="totalNum"
                  :current-page="currentIndex"
                  @current-change="currentChange"
                ></app-pagination>
              </div>
            </el-tab-pane>
            <el-tab-pane class="tabs__effectitems" label="影響する構成アイテム" name="item">
              <div class="tabs__effect" v-for="(items,keys) in effectItems" :key="keys">
                <h4 class="tabs__effecttitle">{{keys}}</h4>
                <div class="tabs__device" v-for="(item,key) in items" :key="key">
                  <p class="tabs__effectdevice">{{key}}</p>
                  <div class="tabs__event" v-for="(event,index) in item" :key="index">
                    <p class="tabs__effectevent">{{event | takeOutRootcause}}</p>
                    <span
                      v-if="event.includes('<<<')"
                      class="tabs__rootcause"
                    >{{event | takeRootcause}}</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!--右側 -->
      <div class="right">
        <!-- <p class="right__title">Top Findings</p>
        <div class="rootcause">
          <p class="rootcause__title">Dynatrace Root Cause: <span>ocp openshift-easytravel-frontend</span></p>
          <p class="rootcause__content">Garbage collection is suspending process ocp openshift-easytravel-frontend (easytravel-frontend-1-g9j8q) on host openshift-easytravel-docker</p>
        </div>
        <div class="knowledgebase">
          <p class="knowledgebase__title">ナレッジベース<span>事象Aの対処方法</span></p>
          <p class="knowledgebase__content">一般に、Copy GCに比べて、Full GCは実行に時間がかかる。そのため、Full GCはなるべく発生させず、使用済みメモリ領域はCopy GCでうまく回収させることが安定稼働のポイントとなる。 そのためには、Full GCの発生間隔を考慮して...</p>
        </div>-->
        <div class="research">
          <p class="research__title">調査</p>
          <p class="research__subtitle">ナレッジベース検索</p>
          <el-input class="research__input" v-model="serchKnowledge" @keyup.enter.native="inputEnter" placeholder="ナレッジを検索..."></el-input>
          <i class="material-icons">search</i>
          <p class="research__subtitle">関連リンク</p>
          <a class="linkpro" href="#" target="_blank">Dynatrace Problem#119</a>
        </div>
        <div class="cate">
          <p class="cate__title">分類</p>
          <el-tag
            class="cate__tags"
            v-for="tag in cateTags"
            :key="tag.name"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{tag.name}}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { formatDatetime } from '@/assets/js/CommonMethods.js'
import CommentDetail from '@/components/CommentDetail'
import CommentForm from '@/components/CommentForm'
import AppLoading from '@/basics/AppLoading'
import AppPagination from '@/basics/AppPagination'
export default {
  name: 'IncidentsDetail',
  components: {
    CommentDetail,
    CommentForm,
    AppLoading,
    AppPagination
  },
  data () {
    return {
      // id
      incDetailId: this.$route.params.id,
      // 詳細データ
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
      // ステータスリスト
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
      // 現在のステータスid
      defaultStatusValue: '',
      // 優先度
      priorityValue: '',
      // 優先度リスト
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
      // 対応期限
      dateValue: '2018/9/25',
      // 担当者
      assignValue: '',
      // 担当者リスト
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
      //
      // コメント
      //
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
        //     '<p><strong><em><u>vue2-editor</u></em><span class="ql-cursor"></span></strong></p>'
        // {
        //   id: 4,
        //   commented_at: '2018-11-26T13:16:12.081000+09:00',
        //   auther: 'Dynatrace',
        //   content:
        //     'Error log pattern found Pattern "OS Process Error" found 1 times/min in "c:\\Users\\labuser\\.dynaTrace\\easyTravel 2.0.0\\easyTrave\\log\\couch.log".'
        // }
      ],
      // 編集フォームを開いているコメントのID
      editingCommentId: null,
      // 1ページに表示するコメントの数
      pageSize: 5,
      // コメントの総件数
      totalNum: 1,
      // 現在のページ番号
      currentIndex: 1,
      // 新規コメントフォームの表示ステータス
      showAddComment: false,
      // 新規コメントのデータ
      addCommentContent: '',
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
      ],
      // ナレッジ検索値
      serchKnowledge: '',
      // 全画面のloading
      commentsGetted: false,
      // コメントのloading
      commentLoading: true
    }
  },
  filters: {
    // rootcauseを削除する
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
    // rootcauseを取得する
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
      this.$axios
        .get('incidents/' + incidentId)
        .then(res => {
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
        .catch(err => {
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
          changedData = { assigned_user_id: this.assignValue }
          message = '担当者を変更しました。'
          break
        case 'status':
          changedData = { status_id: this.statusValue }
          message = 'ステータスを変更しました。'
          break
        case 'priority':
          changedData = { priority_id: this.priorityValue }
          message = '優先度を変更しました。'
          break
        default:
          break
      }

      this.$axios
        .patch('incidents/' + this.incDetailId + '/', changedData)
        .then(res => {
          res.status === 200
            ? this.$message.success(message)
            : this.$messaage.error(res.message)
        })
        .catch(err => console.log(err))
    },
    // ステータス情報を取得
    getStatuses () {
      this.$axios
        .get('statuses/')
        .then(res => {
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
                color:
                  'rgb(' +
                  tempdata.color[0] +
                  ',' +
                  tempdata.color[1] +
                  ',' +
                  tempdata.color[2] +
                  ')'
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
        .catch(err => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // 優先度情報を取得
    getPriorities () {
      this.$axios
        .get('priorities/')
        .then(res => {
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
        .catch(err => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // 担当者情報を取得
    getUsers () {
      this.$axios
        .get('users/')
        .then(res => {
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
        .catch(err => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // コメント情報を取得
    getComments () {
      this.isLoading ? this.commentLoading = false : this.commentLoading = true
      this.$axios
        .get('incidents/' + this.incDetailId + '/comments/',
          {
            params: {
              limit: this.pageSize,
              offset: (this.currentIndex - 1) * this.pageSize
            }
          })
        .then(res => {
          // @ToDo we need error handling for 404, 503 etc...
          // console.log(res)
          if (res.status === 200) {
            this.commentContent = res.data.results
            this.totalNum = res.data.count

            this.commentLoading = false
            this.commentsGetted = true
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch(err => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // コメントの編集フォームを開く
    openCommentForm (id) {
      this.editingCommentId = id
    },

    // コメントの編集フォームを閉じる
    closeCommentForm (id) {
      this.editingCommentId = null
    },

    // 編集されたコメントを保存
    updateComment (id, content) {
      let path = 'incidents/' + this.$route.params.id + '/comments/' + id + '/'
      this.$axios.patch(path, { content: content })
        .then((res) => {
          if (res.status === 200) {
            this.getComments()
            this.closeCommentForm(id)
            this.$message.success('コメントを保存しました。')
          } else {
            console.log(res)
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log('Error has oocured' + err)
        })
    },

    // コメントの削除確認
    async deleteCommentConfirm (id) {
      try {
        await this.$confirm('コメントを削除します。続行しますか？', '警告', {
          confirmButtonText: '削除',
          cancelButtonText: 'キャンセル',
          type: 'warning'
        })
        this.deleteComment(id)
      } catch (err) {}
    },

    // コメントを削除
    deleteComment (id) {
      let path = 'incidents/' + this.$route.params.id + '/comments/' + id + '/'
      this.$axios.delete(path)
        .then((res) => {
          if (res.status === 204) {
            this.getComments()
            this.$message.success('コメントを削除しました。')
          } else {
            console.log(res)
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log('Error has oocured' + err)
        })
    },
    // イベント情報を取得
    getEvents (incidentId) {
      this.$axios
        .get('incidents/' + incidentId + '/events/')
        .then(res => {
          // @ToDo we need error handling for 404, 503 etc...
          // console.log(res)
          if (res.status === 200) {
            // 0: {place: "My web application", place_type: "Application", matter: "やばい", attribute: null}
            // 1: {place: "Requests executed in background threads of com.dynatrace.easytravel.weblauncher.jar easytravel-*-x*", place_type: "Services", matter: "げきやば", attribute: "rootcause"}
            this.effectItems = {}
            for (let i = 0; i < res.data.length; i++) {
              let tempdata = res.data[i]
              this.effectItems[tempdata.place_type] =
                this.effectItems[tempdata.place_type] || {}
              if (tempdata.attribute) {
                this.effectItems[tempdata.place_type][tempdata.place] = this
                  .effectItems[tempdata.place_type][tempdata.place]
                  ? this.effectItems[tempdata.place_type][tempdata.place].concat([tempdata.matter + '<<<' + tempdata.attribute])
                  : [tempdata.matter + '<<<' + tempdata.attribute]
              } else {
                this.effectItems[tempdata.place_type][tempdata.place] = this
                  .effectItems[tempdata.place_type][tempdata.place]
                  ? this.effectItems[tempdata.place_type][tempdata.place].concat([tempdata.matter])
                  : [tempdata.matter]
              }
            }
          } else {
            // this.$message.error(res.message)
          }
        })
        .catch(err => {
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // タイムをフォーマット
    formatTime (date) {
      return formatDatetime(date)
    },
    // ステータス情報を変更する
    statusChange (val) {
      // console.log(val)
      this.patchIncidentDetail('status')
    },
    // 優先度情報を変更する
    priorityChange (val) {
      // console.log(val)
      this.patchIncidentDetail('priority')
    },
    // 対応期限を変更する
    dateChange (val) {
      console.log(val)
      this.$message.success('対応期限を変更しました。')
    },
    // 担当者情報を変更する
    assignChange (val) {
      // console.log(val)
      this.patchIncidentDetail('assign')
    },
    // comment
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // page numberを変更する
    currentChange (val) {
      console.log(val)
      this.currentIndex = val
      this.getComments()
    },
    // コメントを追加する
    showEdit () {
      this.showAddComment = true
      this.$nextTick(() => {
        this.$refs.addComment.$refs.content.focus()
      })
    },
    // 追加したコメントを保存する
    saveAddComment (content) {
      if (content.trim() === '') return false
      this.$axios
        .post(
          'incidents/' + this.incDetailId + '/comments/',
          {
            content: content.trim()
          },
          {
            headers: { 'content-Type': 'application/json;charset=UTF-8' }
          }
        )
        .then(res => {
          // console.log(res)
          if (res.status === 201) {
            this.$message.success('コメントを追加しました。')
            this.currentIndex = 1
            this.getComments()
          } else {
            this.$messaage.error(res.message)
          }
        })
        .catch(err => console.log(err))

      this.addCommentContent = ''
      this.showAddComment = false
    },
    // 追加したコメントをキャンセルする
    cancelAddComment () {
      this.addCommentContent = ''
      this.showAddComment = false
    },
    // 右側
    inputEnter () {
      let textVal = this.serchKnowledge.trim()
      if (textVal) {
        this.$router.push({
          path: '/knowledge',
          query: {
            all: textVal,
            limit: 20,
            offset: 0,
            'sort-fields': 'id'
          }
        })
      }
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
    // 実際に表示されるステータスのid
    statusValue: {
      // getter
      get: function () {
        if (this.statuses.length > 0) {
          return this.defaultStatusValue
        } else {
          return ''
        }
      },
      // setter
      set: function (newValue) {
        this.defaultStatusValue = newValue
      }
    },
    isLoading: function () {
      let detailLength = Object.keys(this.incidentDetail).length
      let eventsLength = Object.keys(this.effectItems).length
      if (this.statuses.length !== 0 && this.priorities.length !== 0 && this.assigners.length !== 0 && detailLength !== 0 && eventsLength !== 0 && this.commentsGetted) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.incdetail{
    width: 100%;
    height: 100%;
    position: relative;
    // max-width: 1024px;
    // margin: 0 auto;
}
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
  .left__title {
    font-size: 20px;
    margin-bottom: 30px;
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
    .detail__details {
      white-space: pre-wrap;
    }
    .detail__right {
      position: absolute;
      top: 20px;
      left: 70%;
      width: 30%;
      padding-left: 3%;
      box-sizing: border-box;
      /deep/ .el-input__inner {
        height: 34px;
      }
      /deep/ .el-select .el-input .el-select__caret {
        color: #fff;
      }
      .detail__status /deep/ .el-input__inner {
        background-color: $graybgc;
        color: #fff;
        border: none;
      }
      .detail__select {
        /deep/ .el-input__inner {
          background-color: $graybgc;
          padding-left: 15px;
        }
        /deep/ .el-input__prefix,
        .el-input__suffix {
          display: none;
        }
        /deep/ .el-input__suffix{
            display: none;
        }
      }
      /deep/ .el-date-editor.el-input,
      .el-date-editor.el-input__inner {
        width: 100%;
        max-width: 213px;
      }
    }
  }
  .tabs {
    margin-top: 36px;
    /deep/ .el-tabs__item {
      text-align: center;
    }
    /deep/ .el-tabs__content {
      overflow: visible;
    }
    .tabs__title {
      margin-bottom: 20px;
      font-size: 16px;
    }
    // コメント
    .comment__allcontent{
      border-bottom: 1px solid $border-color-primary;
    }
    .comment__blank {
      border-top: 1px solid $border-color-primary;
      padding: 20px;
      // background-color: $graybgc;
    }
    .comment__pages {
      text-align: center;
      margin-top: 20px;
      font-weight: 400;
      overflow-x: auto;
    }
    .comment__addcomment{
      margin-bottom: 20px;
      .comment__addinput{
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #E8ECEF;
      }
    }
    .comment__addinput {
      border: 1px solid $border-color-primary;
      border-radius: 4px;
      margin-bottom: 10px;
    }
    .tabs__select {
      width: 100px;
      position: absolute;
      right: 0px;
      top: -35px;
      z-index: 998;
      /deep/ .el-input__inner {
        background-color: $graybgc;
      }
    }
    .tabs__effectitems {
      margin-bottom: 80px;
    }
    .tabs__effect {
      margin-top: 30px;
      // margin-bottom: 100px;
      .tabs__device {
        border: 1px solid $border-color-primary;
        border-radius: 4px;
        margin-top: 10px;
        .tabs__effectdevice {
          line-height: 30px;
          background-color: #e8ecef;
          border-radius: 4px 4px 0 0;
          margin-bottom: 10px;
          padding-left: 10px;
        }
        .tabs__effectevent {
          padding: 0 10px;
          margin-bottom: 10px;
          display: inline-block;
        }
        .tabs__rootcause {
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
  /deep/ .el-input__inner {
    height: 48px;
    line-height: 48px;
    background-color: $whitebgc;
    padding-left: 50px;
  }
  .research {
    margin-top: 30px;
    position: relative;
    .research__title {
      font-size: 18px;
    }
    .research__subtitle {
      margin: 20px 0 16px;
    }
    .material-icons {
      position: absolute;
      left: 10px;
      top: 85px;
    }
    .research__input {
      box-shadow: $shadow;
    }
    .linkpro {
      text-decoration: underline;
      color: $bluebgc;
    }
  }
  .cate {
    margin-top: 50px;
    .cate__title {
      font-size: 18px;
      margin-bottom: 17px;
    }
    .cate__tags {
      background-color: #e8ecef;
      border: none;
      margin: 0 10px 10px 0;
      height: 24px;
      line-height: 16px;
      line-height: 18px;
      padding: 4px 15px;
      border-radius: 100px;
      color: $font-color-primary;
    }
    .cate__tags.el-tag /deep/ .el-icon-close {
      color: $font-color-primary;
    }
  }
}
.shallow-color {
  color: $font-color-secondary;
}
.same-margin {
  margin: 4px 0 20px 0;
}
</style>
