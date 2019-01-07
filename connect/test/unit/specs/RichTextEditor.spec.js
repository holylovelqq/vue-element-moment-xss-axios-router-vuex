import { shallowMount } from '@vue/test-utils'
import RichTextEditor from '@/components/pages/common/RichTextEditor'

// @Todo 下記を検証するテストを追加したい
//       - Toast UI Editorにコンテンツが出力されることを検証する
//       - Change Ebent発火時の動作

describe('RichTextEditor', () => {
  const wrapper = shallowMount(RichTextEditor)

  it('should render correct contents', () => {
    expect(wrapper.contains('.rich-text-editor')).toBe(true)
  })
})
