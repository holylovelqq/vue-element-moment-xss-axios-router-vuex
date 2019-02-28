/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/vue'
import { action } from '@storybook/addon-actions'
import { number, select, boolean } from '@storybook/addon-knobs'

import AppPagination from '@/basics/AppPagination.vue'

const stories = storiesOf('01.Common UI', module)
stories
  .add('AppPagination', () => ({
    components: { AppPagination },
    props: {
      layout: {
        default: select(
          'layout',
          [
            'total, sizes, prev, pager, next, jumper',
            'prev, pager, next'
          ],
          'total, sizes, prev, pager, next, jumper'
        )
      },
      pageSize: {
        default: number(
          'pageSize',
          10
        )
      },
      total: {
        default: number(
          'total',
          1000
        )
      },
      currentPage: {
        default: number(
          'currentPage',
          1
        )
      },
      disabled: {
        default: boolean(
          'disabled',
          false
        )
      }
    },
    propsDescription: {
      AppPagination: {
        layout: '使用するページネーションのパーツを選択する　total: 総件数, sizes: 1ページの表示件数を変更するプルダウン, prev: 前のページに戻るボタン, next: 次のページに戻るボタン, jumper: ページ番号を入力して移動する入力ボックス',
        pageSize: '1ページの表示件数',
        total: '総件数',
        currentPage: '現在表示しているページの番号',
        disabled: 'ページネーション全体を操作不可にする',
        currentChange: 'current-page propが変更されたときに実行される',
        sizeChange: 'page-size propが変更されたときに実行される'
      }
    },
    template: `<app-pagination
      :layout="layout"
      :page-size="pageSize"
      :total="total"
      :current-page="currentPage"
      :disabled="disabled"
      @current-change="currentChange"
      @size-change="sizeChange"
    >
    </app-pagination>
    `,
    methods: {
      currentChange: action('currentChange'),
      sizeChange: action('sizeChange')
    }
  }),
  {
    info: `
      本コンポーネントはElement UIの[el-pagination](https://element.eleme.io/#/en-US/component/pagination#pagination)をラップしたコンポーネントです。
    `
  }
  )
