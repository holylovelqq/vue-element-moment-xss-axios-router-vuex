/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { text, select, boolean } from '@storybook/addon-knobs'

import AppButton from '@/basics/AppButton.vue'

const stories = storiesOf('01.Common UI', module)
stories
  .add('AppButton', () => ({
    components: { AppButton },
    props: {
      text: {
        default: text(
          'slot',
          '保存'
        )
      },
      type: {
        default: select(
          'type',
          ['primary', 'secondary', 'floating', 'text', 'link', 'danger'],
          'primary'
        )
      },
      size: {
        default: select(
          'size',
          ['sm', 'md', 'lg'],
          'md'
        )
      },
      disabled: {
        default: boolean('Disabled', false)
      }
    },
    template: `<app-button
    :type="type"
    :size="size"
    :disabled="disabled"
    @click="action"
    >
    {{ text }}
    </app-button>`,
    methods: { action: action('clicked') }
  }),
  {
    info: {}
  }
  )
