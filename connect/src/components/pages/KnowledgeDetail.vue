<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="kbdetail">
    <div class="title">
      <p class="title__id">#{{KBDetailId}}</p>
      <p class="title__title">{{KBDetail.title}}</p>
      <app-button
        style="position: absolute; right: 0; top: 15px;"
        type="primary"
        size="md"
        @click="goEditPage"
      >
        編集
      </app-button>
    </div>

    <div class="left">
      <div class="left__info">
        <p class="info__title">
          事象の内容
        </p>
        <div class="info__content">
          <rich-text :html="KBDetail.problem_details" />
        </div>
      </div>
      <div class="left__method left__info">
        <p class="info__title">
          対応方法
        </p>
        <div class="info__content">
          <rich-text :html="KBDetail.content" />
        </div>
      </div>

    </div>
    <div class="right">
      <p class="right__title">記事情報</p>
      <p class="right__cate">カテゴリ</p>
      <p>{{KBDetail.category}}</p>
      <p class="right__create">作成</p>
      <p>{{formatTime(KBDetail.create)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{KBDetail.auther}}</p>
      <p class="right__edit">最終更新</p>
      <p>{{formatTime(KBDetail.edit)}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{KBDetail.editer}}</p>
    </div>
          <!-- comment content -->
      <div class="comment">
        <p class="comment__title">コメント</p>
        <!-- comment追加 -->
        <div class="comment__addcomment" style="">
          <el-input
            v-show="!showAddComment"
            class="comment__addinput"
            @focus="showEdit"
            placeholder="コメントを追加する...">
          </el-input>
          <comment-form
            :content="addCommentContent"
            v-if="showAddComment"
            @save="saveAddComment"
            @cancel="cancelAddComment"
            ref="addComment"
          />
        </div>

        <!-- commentの内容 -->
        <div class="comment__allcontent">
          <div class="comment__blank" v-if="!KBComments.length">
            コメントがありません
          </div>
          <div class="comment__all"
            v-for="comment in KBComments"
            :key="comment.id"
          >
            <comment-detail
              :id="comment.id"
              :commented_at="comment.commented_at"
              :updated_at="comment.updated_at"
              :commented_user="comment.commented_user"
              :last_name="comment.commented_user.last_name"
              :first_name="comment.commented_user.first_name"
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
        <el-pagination
          class="comment__pages"
           background layout="prev, pager, next"
           :pager-count="5"
           :page-size="pageSize"
           :total="totalNum"
           :current-page="currentIndex"
           @current-change="currentChange">
        </el-pagination>
      </div>
  </div>
</template>

<script>
import { formatDatetime } from './common/CommonMethods.js'
import RichText from './common/RichText'
import CommentDetail from './common/CommentDetail'
import CommentForm from '@/components/pages/common/CommentForm'

export default{
  name: 'KBDetail',
  components: {
    RichText, CommentDetail, CommentForm
  },
  data () {
    return {
      KBDetailId: this.$route.params.id,
      KBDetail: {
        id: 1,
        title: '',
        problem_details: '',
        content: '',
        category: '',
        create: '2018-11-26T13:16:12.081000+09:00',
        auther: '小林　野愛',
        edit: '2018-11-26T13:16:12.081000+09:00',
        editer: '小林　野愛'
      },
      //
      // コメント
      //
      // APIから取得したコメントのデータ
      KBComments: [],
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
      addCommentContent: ''
    }
  },
  created () {
    this.getKnowledge()
    this.getComments()
  },
  methods: {
    // 編集ページに遷移
    goEditPage () {
      this.$router.push('/knowledge/' + this.KBDetail.id + '/edit')
    },

    // 日時のフォーマット
    formatTime (date) {
      return formatDatetime(date)
    },

    // コメントのpage numberを変更
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

    // 追加したコメントを保存
    saveAddComment (content) {
      if (content.trim() === '') return false
      console.log(content)
      this.$axios.post('/knowledge/' + this.KBDetailId + '/comments/', {
        content: content.trim()
      }, {
        headers: {'content-Type': 'application/json;charset=UTF-8'}
      }).then((res) => {
        console.log(res)
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

    // コメント追加のキャンセル
    cancelAddComment () {
      this.addCommentContent = ''
      this.showAddComment = false
    },

    // ナレッジを取得
    getKnowledge () {
      this.$axios.get('knowledge/' + this.$route.params.id + '/')
        .then((res) => {
          if (res.status === 200) {
            console.log(res)
            this.KBDetailId = res.data.id
            this.KBDetail = {
              id: res.data.id,
              title: res.data.title,
              problem_details: res.data.problem_details,
              content: res.data.content,
              category: res.data.knowledge_category.name,
              create: res.data.registered_at,
              auther: res.data.registered_user.last_name + ' ' + res.data.registered_user.first_name,
              edit: res.data.updated_at,
              editer: res.data.updated_user.last_name + ' ' + res.data.updated_user.first_name
            }
          } else {
            console.log(res)
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.$router.push({name: 'notfound'})
          console.log('Error has oocured)' + err)
        })
    },

    // コメントを取得
    getComments () {
      let path = 'knowledge/' + this.$route.params.id + '/comments/'
      this.$axios.get(path,
        {
          params: {
            limit: this.pageSize,
            offset: (this.currentIndex - 1) * this.pageSize
          }
        }
      )
        .then((res) => {
          if (res.status === 200) {
            console.log('comments!!')
            console.log(res)
            this.KBComments = res.data.results
            this.totalNum = res.data.count
          } else {
            console.log(res)
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log('Error has oocured)' + err)
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
      let path = 'knowledge/' + this.$route.params.id + '/comments/' + id + '/'
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
      let path = 'knowledge/' + this.$route.params.id + '/comments/' + id + '/'
      this.$axios.delete(path)
        .then((res) => {
          if (res.status === 204) {
            this.getComments()
          } else {
            console.log(res)
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log('Error has oocured' + err)
        })
    }

    // コメントを逆順でソート
    // even: function (arr) {
    //   // Set slice() to avoid to generate an infinite loop!
    //   return arr.slice().sort(function (a, b) {
    //     return b.id - a.id
    //   })
    // }
  }
}
</script>
<style lang="scss" scoped>
  .kbdetail{
    width: 100%;
    max-width: 1024px;
    margin: 0 auto;
  }
  .title{
    position: relative;
    margin-bottom: 35px;
    .title__title{
      padding: 10px 0 20px 0;
      // font-weight: 700;
      font-size: 20px;
      border-bottom: 2px solid #E0E7EC;
    }
  }
  .left{
    display: inline-block;
    margin-right: 3%;
    width: 75%;
    .left__info{
      margin-bottom: 35px;
      box-shadow: $shadow;
    }
    .info__title{
      background-color: #fff;
      color: $bluebgc;
      padding: 15px 20px;
      border-bottom: 1px solid $border-color-primary;
      font-size: 16px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    .info__content{
      background-color: #fff;
      padding: 15px 20px;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
    }

  }
  .right{
    width: 21%;
    display: inline-block;
    vertical-align: top;
    padding:20px 0;
    margin-bottom: 20px;
    .right__title{
      font-size: 16px;
    }
    .right__cate,.right__create,.right__edit{
      margin: 20px 0 8px 0;
    }
  }
  .title__id,.comment__timeline,.comment__action,.right__cate,.right__create,.right__edit{
    color:$font-color-secondary;
  }
  .comment{
    width: 75%;
    padding:0 20px;
    .comment__title{
      font-size: 16px;
      margin-bottom: 20px;
    }
    .comment__addcomment{
      margin-bottom: 20px;
      .comment__addinput{
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #E8ECEF;
      }
    }
    .comment__allcontent{
      border-bottom: 1px solid $border-color-primary;
    }
    .comment__blank{
      border-top: 1px solid $border-color-primary;
      padding:20px 0;
    }
    .comment__pages{
      text-align: center;
      margin-top: 20px;
    }
  }
  @include media-query-sm() {
    .left{
      width: 100%;
      margin:0;
    }
    .right{
      width: 100%;
    }
    .comment{
      width: 100%;
      padding: 0;
    }
  }
</style>
