// (C) 2018 SEIKO SOLUTIONS INC.
import Vue from 'vue'
import store from '@/store/index'
import xss from 'xss'

// time format
// 変数date:utctime-'YYYY-MM-DDTHH:mm:ss.SSSZ'
// return:指定されたtimezoneの時間

export function formatDatetime (date) {
  var m = Vue.prototype.$moment.utc(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ')
  // タイムゾーンは分で指定する
  // 日本：9*60=54min
  // https://stackoverflow.com/questions/32878197/updating-time-offset-with-moment-utcoffset
  // let timeZone = -new Date().getTimezoneOffset()
  return m.utcOffset(store.state.TZDeal.TZone).format('YYYY/MM/DD HH:mm')
}

// XSS Sanitizer
// ホワイトリストに基づいて、有害なHTMLタグ/属性を無害化ｌします。
// ホワイトリストに含まれないHTMLタグはエスケープします。
// ホワイトリストに含まれないHTML属性および属性の値は削除します。
export function xssSanitizer (html) {
  let options = {
    whiteList: {
      h1: [],
      h2: [],
      h3: [],
      h4: [],
      h5: [],
      h6: [],
      p: ['style'],
      span: ['style'],
      strong: [],
      em: [],
      br: [],
      s: [],
      u: [],
      blockquote: [],
      a: ['href'],
      ol: [],
      ul: [],
      li: [],
      img: ['src', 'alt'],
      table: [],
      tbody: [],
      thead: [],
      td: ['colspan', 'rowspan', 'align'],
      th: ['colspan', 'rowspan', 'align'],
      tr: [],
      pre: [],
      code: []
    },
    css: {
      whiteList: {
        color: /^#[a-f0-9]{3,6}$/
      }
    },
    stripIgnoreTag: false,
    onTagAttr: function (tag, name, value, isWhiteAttr) {
      // default src only allow the value that starts with `http://` | `https://` | `mailto:` | `/` | `#`
      // ここで'data:image/jpeg;base64,' | 'data:image/gif;base64,' | 'data:image/png;base64,' を追加する
      if (tag === 'img' && name === 'src') {
        value = value.trim()
        if (value.substr(0, 23) === 'data:image/jpeg;base64,' || value.substr(0, 22) === 'data:image/gif;base64,' || value.substr(0, 22) === 'data:image/png;base64,') {
          return 'src="' + value + '"'
        }
      }
    }
  }
  let myxss = new xss.FilterXSS(options)
  return myxss.process(html)
}

// 画面幅を取得して、メニューをデフォルトで折りたたむかどうかが判断する
// 変数なし
// 返しデータ：画面幅＜769:'sm'
//            769<=画面幅<1025:'md'
//            1025<=画面幅＜1367:'lg'
//            画面幅>=1367:'hg'
export function checkWidth () {
  let width = window.document.body.offsetWidth
  if (width < 769) {
    return 'sm'
  } else if (width >= 769 && width < 1025) {
    return 'md'
  } else if (width >= 1025 && width < 1367) {
    return 'lg'
  } else {
    return 'hg'
  }
}
