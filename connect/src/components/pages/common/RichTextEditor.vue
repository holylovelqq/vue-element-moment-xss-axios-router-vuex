<template>
  <div class="rich-text-editor">
    <editor
      :value="html | xss"
      :options="options"
      :height="height"
      mode="wysiwyg"
      @load="onEditorLoad"
      @focus="onEditorFocus"
      @blur="onEditorBlur"
      @change="onEditorChange"
      @stateChange="onEditorStateChange"
      ref="tuiEditor"
    />
  </div>
</template>

<script>
import 'tui-editor/dist/tui-editor.css'
// import 'codemirror/lib/codemirror.css'
import 'tui-color-picker/dist/tui-color-picker.css'
// import 'highlight.js/styles/github.css'
import './RichTextEditorContents.scss'
import { Editor } from '@toast-ui/vue-editor'
import 'tui-editor/dist/tui-editor-extTable.js'
import 'tui-editor/dist/tui-editor-extColorSyntax.js'
import { xssSanitizer } from '@/components/pages/common/CommonMethods'

export default{
  name: 'RichTextEditor',
  components: {
    Editor
  },
  props: {
    html: String,
    height: String
  },
  data () {
    return {
      options: {
        minHeight: '180px',
        language: 'ja_JP',
        useCommandShortcut: true,
        // xss libraryを使うためTUIEditor標準のサニタイズ機能を無効化
        useDefaultHTMLSanitizer: false,
        // TUIEditorの開発元へ統計情報を送信する機能を無効化
        usageStatistics: false,
        hideModeSwitch: true,
        exts: [
          'colorSyntax',
          'table'
        ],
        toolbarItems: [
          'heading',
          'bold',
          'italic',
          'strike',
          'colorsyntax',
          // 'hr',
          'quote',
          // 'codeblock',
          // 'code',
          'divider',
          'ul',
          'ol',
          // 'task',
          // 'indent',
          // 'outdent',
          'divider',
          'table',
          'image',
          'link',
          'divider'
        ]
      }
    }
  },
  filters: {
    xss: function (html) {
      return xssSanitizer(html)
    }
  },
  methods: {
    onEditorLoad () {
      // implement your code It would be emitted when editor fully load
    },
    onEditorFocus () {
      // implement your code It would be emitted when editor get focus
    },
    onEditorBlur () {
      // implement your code It would be emitted when editor loose focus
      // console.log(a)
    },
    onEditorChange () {
      let html = this.$refs.tuiEditor.invoke('getHtml')
      this.$emit('change', html)
    },
    onEditorStateChange () {
      // implement your code It would be emitted when format change by cursor position
    }
  }
}
</script>

<style lang="scss" scoped>
//
// 外枠
//
/deep/ .tui-editor-defaultUI {
  @include border-primary();
}
/deep/ .te-toolbar-section {
  border-bottom: 1px solid $border-color-primary;
}

//
// ツールバー
//
/deep/ .tui-editor-defaultUI-toolbar {
  padding: 0 12px;

  // ボタン
  button:hover,
  button:active,
  button.active {
    border: 1px solid $border-color-secondary;
  }

  // 区切り線
  .tui-toolbar-divider {
    background: $border-color-primary;
  }
}

// 角丸のボーダーに中の要素の角が重なるのを回避
/deep/ .tui-editor-defaultUI-toolbar,
/deep/ .te-ww-container {
  background: transparent;
}

/deep/ .te-ww-block-overlay .code-block-header {
  display: none;
}

//
// ポップアップ
//
/deep/ .tui-popup-wrapper {
  border: none;
  border-radius: 4px;
  box-shadow: $shadow-md;

  // ヘッダ
  .tui-popup-header {
    border-bottom: 1px solid $border-color-primary;
  }
  .tui-popup-header .tui-popup-title {
    color: $font-color-primary;
  }

  // Tab
  .te-tab {
    border-bottom: 1px solid $border-color-primary;
    position: relative;
  }
  .te-tab button {
    color: $font-color-primary;
    border: 1px solid $border-color-primary;
    border-bottom: none;
    background: $border-color-secondary;
    bottom: -1px;
  }
  .te-tab button.te-tab-active {
    background: #fff;
  }

  // Label
  label {
    color: $font-color-secondary;
    line-height: 1;
    margin: 0 0 8px;
  }

  // Input
  input[type=text],
  input[type=file] {
    @include border-primary;
    color: $font-color-primary;
    font-size: 14px;
    padding: 8px 8px;
    margin-bottom: 16px;
  }

  // Button
  .te-button-section {
    margin: 0px 0 0 0;
  }
  button.te-ok-button {
    border-radius: 4px;
    background: $bluebgc;
  }
  button.te-close-button {
    color: $font-color-secondary;
    background: none;
  }
}

//
// Color Picker
//
/deep/ .tui-popup-wrapper.tui-popup-color {

  // Input
  .tui-colorpicker-palette-hex {
    border-radius: 0;
    font-size: 12px;
    padding: 2px 4px;
    margin: 0;
  }

  // Apply Button
  .te-apply-button {
    background: $bluebgc;
    border-radius: 4px;
    border: none;
    padding: 3px;
    height: 25px;
    width: 43px;
    bottom: 132px;
  }
}
</style>
