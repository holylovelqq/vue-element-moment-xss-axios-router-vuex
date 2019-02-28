<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div>
    <app-loading :isLoading="isLoading"></app-loading>
    <div class="kb-edit" v-show="!isLoading" >
      <div class="kb-form">
        <div class="kb-form__section">
          <label class="kb-form__label">タイトル</label>
          <el-input
            placeholder="ナレッジのタイトルを入力してください..."
            v-model="storedKnowledge.title"
          >
          </el-input>
        </div>

        <div class="kb-form__section">
          <label class="kb-form__label">カテゴリ</label>
          <el-select class="kb-form__category" size="small" v-model="storedKnowledge.category">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            >
            </el-option>
          </el-select>
        </div>

        <div class="kb-form__section">
          <label class="kb-form__label">事象の詳細</label>
          <rich-text-editor
            :html="bindedKnowledge.problem_details"
            height="200px"
            @change="onProblemDetailsChange"
          />
        </div>

        <div class="kb-form__section">
          <label class="kb-form__label">対応方法</label>
          <rich-text-editor
            :html="bindedKnowledge.content"
            height="320px"
            @change="onContentChange"
          />
        </div>
      </div>
      <div class="kb-form__actions">
        <app-button
          type="primary"
          size="md"
          @click="onClickSave()"
        >
          保存
        </app-button>
        <app-button
          type="text"
          size="md"
          @click="onClickCancel()"
        >
          キャンセル
        </app-button>
        <app-button
          v-if="isEdit"
          style="float: right"
          type="danger"
          size="md"
          @click="onClickDelete()"
        >
          削除
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import RichTextEditor from '@/basics/RichTextEditor'
import AppLoading from '@/basics/AppLoading'
export default {
  components: {
    RichTextEditor,
    AppLoading
  },
  data () {
    return {
      // Page mode
      isEdit: false,
      // Knowledge data passed to DOM/child component
      bindedKnowledge: {
        title: '',
        problem_details: '',
        content: '',
        category: null
      },
      // Knowledge data posted/patched to the API server
      storedKnowledge: {
        title: '',
        problem_details: '',
        content: '',
        category: null
      },
      categories: [],
      // POST,PATCH,DELETEの状態か？
      isCUD: false
    }
  },
  created () {
    this.checkPageMode()
    this.getCategories()
    this.getData()
  },
  mounted () {
    this.changeColorPicker()
  },
  methods: {
    checkPageMode () {
      if (this.$route.params.id) {
        this.isEdit = true
      }
    },
    onClickCancel () {
      // 一時保存した内容を削除する
      this.deleteStore()
      if (this.isEdit) {
        // 編集画面はキャンセル時に詳細画面へ遷移
        this.$router.push('/knowledge/' + this.$route.params.id + '/')
      } else {
        // 新規画面はキャンセル時に一覧画面へ遷移
        this.$router.push('/knowledge/')
      }
    },
    onClickSave () {
      if (!this.checkForm()) {
        return
      }
      if (this.isEdit) {
        this.patchKnowledge()
      } else {
        this.postKnowledge()
      }
      // 一時保存した内容を削除する
      this.deleteStore()
    },
    onClickDelete () {
      this.$confirm('データを完全に削除します。続行しますか？', '警告', {
        confirmButtonText: '削除',
        cancelButtonText: 'キャンセル',
        type: 'warning'
      }).then(() => {
        // 削除がクリックされた場合、削除を実施
        this.deleteKnowledge()
      }).catch(() => {
        // キャンセルがクリックされた場合何もしない
      })
      // 一時保存した内容を削除する
      this.deleteStore()
    },
    onProblemDetailsChange (html) {
      this.storedKnowledge.problem_details = html
    },
    onContentChange (html) {
      this.storedKnowledge.content = html
    },
    checkForm () {
      if (!this.storedKnowledge.title) {
        this.$message.error('タイトルを選択してください')
        return false
      }

      if (!this.storedKnowledge.category) {
        this.$message.error('カテゴリを選択してください')
        return false
      }

      if (!this.storedKnowledge.problem_details) {
        this.$message.error('事象の詳細を入力してください。')
        return false
      }

      if (!this.storedKnowledge.content) {
        this.$message.error('対応内容を入力してください。')
        return false
      }

      return true
    },
    getCategories () {
      this.$axios.get('knowledge-categories/').then((response) => {
        this.categories = response.data
      })
    },
    getKnowledge () {
      this.$axios.get('knowledge/' + this.$route.params.id + '/')
        .then((res) => {
          if (res.status === 200) {
            let k = {
              id: res.data.id,
              title: res.data.title,
              problem_details: res.data.problem_details,
              content: res.data.content,
              category: res.data.knowledge_category.id
            }
            // 参照ではなく値を渡す
            this.bindedKnowledge = Object.assign({}, k)
            this.storedKnowledge = Object.assign({}, k)
          } else {
            console.log(res)
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.$router.push({ name: 'notfound' })
          console.log('Error has oocured)' + err)
        })
    },
    postKnowledge () {
      console.log(this.storedKnowledge)
      this.isCUD = true
      this.$axios.post('knowledge/', {
        title: this.storedKnowledge.title,
        problem_details: this.storedKnowledge.problem_details,
        content: this.storedKnowledge.content,
        knowledge_category_id: this.storedKnowledge.category
      })
        .then((res) => {
          if (res.status === 201) {
            console.log(res)
            this.$message.success('ナレッジを保存しました。')
            this.isCUD = false
            this.$router.push({
              name: 'knowledge_detail',
              params: {
                id: res.data.id
              }
            })
          } else {
            console.log(res)
            this.isCUD = false
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.isCUD = false
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    patchKnowledge () {
      this.isCUD = true
      this.$axios.patch('knowledge/' + this.$route.params.id + '/', {
        title: this.storedKnowledge.title,
        problem_details: this.storedKnowledge.problem_details,
        content: this.storedKnowledge.content,
        knowledge_category_id: this.storedKnowledge.category
      })
        .then((res) => {
          if (res.status === 200) {
            this.$message.success('ナレッジを保存しました。')
            this.isCUD = false
            this.$router.push({
              name: 'knowledge_detail',
              params: {
                id: res.data.id
              }
            })
          } else {
            console.log(res)
            this.isCUD = false
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.isCUD = false
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    deleteKnowledge () {
      this.isCUD = true
      this.$axios.delete('knowledge/' + this.$route.params.id + '/')
        .then((res) => {
          if (res.status === 204) {
            this.$message.success('ナレッジを削除しました。')
            this.isCUD = false
            this.$router.push({ name: 'knowledge' })
          } else {
            console.log(res)
            this.isCUD = false
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          this.isCUD = false
          // @ToDo we need error handling for TCP connection error
          console.log('Error has oocured' + err)
        })
    },
    // 一時保存した内容を削除する
    deleteStore () {
      if (!window.localStorage.draft) return false
      window.localStorage.removeItem('draft')
    },
    // 一時保存した内容又はナレッジの詳細情報を取得する
    getData () {
      if (window.localStorage.draft) {
        let storage = window.localStorage
        let storeData = storage.getItem('draft')
        let storeObj = JSON.parse(storeData)
        // {
        //   entity: "knowledge"
        //   id: "41"
        //   category: 3
        //   content: "<p>sdg</p>"
        //   problem_details: "<p>wqr</p>"
        //   title: "wqrw"
        // }
        if (this.isEdit) {
          if (storeObj.id === this.$route.params.id) {
          // 参照ではなく値を渡す
            this.bindedKnowledge = Object.assign({}, storeObj)
            this.storedKnowledge = Object.assign({}, storeObj)
          } else {
            this.getKnowledge()
          }
        } else {
          if (storeObj.id === null) {
          // 参照ではなく値を渡す
            this.bindedKnowledge = Object.assign({}, storeObj)
            this.storedKnowledge = Object.assign({}, storeObj)
          }
        }
      } else {
        if (this.isEdit) {
          this.getKnowledge()
        }
      }
    },
    // 二つeditorが使うから二番目の文字色を一番目の色sourceを使ってしまった問題を直す
    changeColorPicker () {
      // すべての色sourceを取得得する
      let colorArr = document.querySelectorAll('#tui-colorpicker-svg-fill-color')
      let blackArr = document.querySelectorAll('#tui-colorpicker-svn-fill-black')
      let gArr = document.querySelectorAll('#g')
      // 二番目editorを使う色sourceのIDを変える
      colorArr[1].id = 'tui-colorpicker-svg-fill-color1'
      blackArr[1].id = 'tui-colorpicker-svn-fill-black1'
      gArr[1].id = 'g1'
      // すべての色を表示されるDOMを取得
      let rectArr = document.querySelectorAll('rect')
      // 二番目editorに色sourceと同じのIDを変える
      rectArr[3].attributes.fill.value = 'url(#tui-colorpicker-svg-fill-color1)'
      rectArr[4].attributes.fill.value = 'url(#tui-colorpicker-svn-fill-black1)'
      rectArr[5].attributes.fill.value = 'url(#g1)'
    }

  },
  watch: {
    // 一時保存
    storedKnowledge: {
      handler: function (val) {
        if (!window.localStorage) return false
        console.log(val)
        // {
        //   category: 3
        //   content: "<p>sdg</p>↵"
        //   problem_details: "<p>wqr</p>↵"
        //   title: "wqrw"
        // }
        val.entity = 'knowledge'
        val.id = this.isEdit ? this.$route.params.id : null
        console.log(val)
        let tempData = JSON.stringify(val)
        let storage = window.localStorage
        storage.setItem('draft', tempData)
      },
      deep: true
    }
  },
  computed: {
    isLoading: function () {
      let hasTitle = Boolean(this.bindedKnowledge.title)
      if (this.$route.params.id) {
        // 編集
        if (hasTitle && this.categories.length !== 0 && !this.isCUD) {
          return false
        } else {
          return true
        }
      } else {
        // 新規
        if (this.categories.length !== 0 && !this.isCUD) {
          return false
        } else {
          return true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.kb-edit {
  background: #fff;
  box-shadow: $shadow;
  border-radius: 4px;
  padding: 40px;
  margin: 0 auto;
  max-width: 1024px;
}

// Input
/deep/ .el-input__inner {
  color: $font-color-primary;
  @include border-primary();
}

// Section
.kb-form__section {
  margin-bottom: 22px;
}

// Label
.kb-form__label {
  color: $font-color-secondary;
  font-weight: bold;
  display: block;
  margin-bottom: 8px;
}

// Button
.el-button[name="cancel"] {
  color: $font-color-secondary;
  margin-left: 16px;

  :hover {
    color: $font-color-primary;
  }
}
.el-button[name="delete"] {
  background: $border-color-primary;
  border: none;
  color: $font-color-secondary;
  float: left;

}
.el-button[name="delete"]:hover {
  background: $border-color-secondary;
}

@include media-query-sm() {
  .kb-edit {
    padding: 20px;
  }
}
</style>
