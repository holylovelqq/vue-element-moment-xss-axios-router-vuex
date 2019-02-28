<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="comment-form">
    <el-input
      class="comment-form__content-edit"
      v-model="editedContent"
      resize="vertical"
      rows="3"
      type="textarea"
      ref="content"
      :disabled="disabled">
    </el-input>
    <app-button
      type="primary"
      size="md"
      @click="onClickSaveEdit"
      :disabled="disabled"
    >
      保存
    </app-button>
    <app-button
      size="md"
      type="text"
      @click="onClickCancelEdit"
    >
       キャンセル
    </app-button>
  </div>
</template>

<script>
export default {
  name: 'CommentForm',
  props: {
    content: String,
    disabled: Boolean
  },
  data () {
    return {
      editedContent: ''
    }
  },
  created () {
    // コメントの追加か編集かの判断
    this.content === '' ? this.getLocalStorage() : this.editedContent = this.content
    // this.editedContent = this.content
  },
  methods: {
    // 一時保存した内容を取得する
    getLocalStorage () {
      // if(window.localStorage.knowledgeAddComment||window.localStorage.incidentAddComment)
      if (this.$route.name === 'knowledge_detail') {
        if (window.localStorage.knowledgeAddComment) {
          let storeData = window.localStorage.getItem('knowledgeAddComment')
          let storeObj = JSON.parse(storeData) // {id: 7, content: "waertfcygvbh"}
          this.$route.params.id === storeObj.id ? this.editedContent = storeObj.content : this.editedContent = this.content
        }
      } else if (this.$route.name === 'incident_detail') {
        if (window.localStorage.incidentAddComment) {
          let storeData = window.localStorage.getItem('incidentAddComment')
          let storeObj = JSON.parse(storeData) // {id: 7, content: "waertfcygvbh"}
          this.$route.params.id === storeObj.id ? this.editedContent = storeObj.content : this.editedContent = this.content
        }
      }
    },
    // 一時保存した内容を削除する
    deleteStore () {
      if (this.$route.name === 'knowledge_detail' && this.content === '') {
        window.localStorage.removeItem('knowledgeAddComment')
      } else if (this.$route.name === 'incident_detail' && this.content === '') {
        window.localStorage.removeItem('incidentAddComment')
      }
    },
    // 保存ボタンを押す
    onClickSaveEdit () {
      this.$emit('save', this.editedContent.trim())
      this.deleteStore()
      // this.editedContent = ''
    },
    // キャンセルボタンを押す
    onClickCancelEdit () {
      this.$emit('cancel')
      this.deleteStore()
      this.editedContent = ''
    }
  },
  watch: {
    // 一時保存
    editedContent: function (newVal, oldVal) {
      if (!window.localStorage) return false
      // console.log(this.$route)
      let val = newVal.trim()
      if (val === '') return false // 内容がない場合保存しない
      if (this.content) return false // コメントを追加するじゃない場合保存しない
      // 現在のページの判断
      if (this.$route.name === 'knowledge_detail') {
        // ナレッジ詳細ページ
        let dataObj = {
          id: this.$route.params.id,
          content: val
        }
        let tempData = JSON.stringify(dataObj)
        window.localStorage.setItem('knowledgeAddComment', tempData)
      } else if (this.$route.name === 'incident_detail') {
        // インシデント詳細ページ
        let dataObj = {
          id: this.$route.params.id,
          content: val
        }
        let tempData = JSON.stringify(dataObj)
        window.localStorage.setItem('incidentAddComment', tempData)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-form__content-edit {
  margin-bottom: 8px;
}
</style>
