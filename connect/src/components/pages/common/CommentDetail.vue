<!-- (C) 2018 SEIKO SOLUTIONS INC. -->
<template>
  <div class="comment-detail">

    <!-- コメント詳細の表示 -->
    <template v-if="!isEdit">
      <div class="comment-detail__header">
        <span class="comment-detail__date">
          {{ formatTime(commented_at) }}
        </span>
        <span class="comment-detail__user">
          {{ last_name }} {{ first_name }}
        </span>
        <el-tooltip
          class="comment"
          effect="dark"
          :content="formatTime(updated_at)"
          placement="top"
        >
          <span v-if="isEdited">編集済み</span>
        </el-tooltip>
      </div>
      <pre class="comment-detail__content">{{content}}</pre>
      <div class="comment-detail__actions">
        <app-button
          type="link"
          size="md"
          @click="openForm"
        >
          編集
        </app-button>
        <span class="comment-detail__action-divider">
          &#x2022;
        </span>
        <app-button
          type="link"
          size="md"
          @click="deleteComment"
        >
          削除
        </app-button>
      </div>
    </template>

    <!-- コメントの編集 -->
    <comment-form
      :content="content"
      v-if="isEdit"
      @save="saveEditedComment"
      @cancel="cancelEditedComment"
      ref="commentForm"
    />
  </div>
</template>

<script>
import { formatDatetime } from '@/components/pages/common/CommonMethods.js'
import CommentForm from '@/components/pages/common/CommentForm'

export default{
  name: 'CommentDetail',
  components: {
    CommentForm
  },
  props: {
    id: Number,
    commented_at: String,
    first_name: String,
    last_name: String,
    updated_at: String,
    content: String,
    isEdit: Boolean
  },
  data () {
    return {
      editedContent: ''
    }
  },
  computed: {
    isEdited: function () {
      let create = new Date(this.commented_at)
      let update = new Date(this.updated_at)
      return create < update
    }
  },
  created () {
    this.editedContent = this.content
  },
  methods: {
    formatTime (date) {
      return formatDatetime(date)
    },
    openForm () {
      this.$emit('open', this.id)
      this.$nextTick(() => {
        this.$refs.commentForm.$refs.content.focus()
      })
    },
    deleteComment () {
      this.$emit('delete', this.id)
    },
    saveEditedComment (content) {
      this.$emit('update', this.id, content)
    },
    cancelEditedComment () {
      this.$emit('close', this.id)
    },
    closeForm () {
      this.isEditMode = false
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-detail {
  border-top: 1px solid $border-color-primary;
  padding: 18px 0;
}
.comment-detail__header {
  color: $font-color-secondary;
}
.comment-detail__date,
.comment-detail__user {
  margin-right: 1em;
}
.comment-detail__content {
  font-family: $font-family-primary;
  font-size: 14px;
  margin: 12px 0 12px 0;
  padding: 0;
  // 改行を許可
  white-space: pre-wrap;
}
.comment-detail__action-divider {
  color: $font-color-secondary;
}
</style>
