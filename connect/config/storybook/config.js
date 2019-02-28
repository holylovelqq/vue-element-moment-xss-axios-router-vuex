/* eslint-disable import/no-extraneous-dependencies */
import { configure, addDecorator, addParameters } from '@storybook/vue'
import { withKnobs } from '@storybook/addon-knobs'
import { withBackgrounds } from '@storybook/addon-backgrounds'
import { withViewport } from '@storybook/addon-viewport'
// import centered from '@storybook/addon-centered'
import { withInfo } from 'storybook-addon-vue-info'
import Vue from 'vue'
import ElementUI from 'element-ui'
import '../../src/assets/css/element-variables.scss'// elementui custom theme
import 'normalize.css'
import '../../public/iconfont/material-icons.css'
import locale from 'element-ui/lib/locale/lang/ja'
import '../../src/assets/css/main.scss'

Vue.use(ElementUI, { locale })

addParameters({
  backgrounds: [
    { name: 'White', value: '#fff', default: true },
    { name: 'Gray', value: '#f2f4f6' }
  ]
})

addDecorator(withInfo)
addDecorator(withKnobs)
addDecorator(withBackgrounds)
addDecorator(withViewport())
// addDecorator(centered)

const req = require.context('../../src/stories', true, /.stories.js$/)

function loadStories () {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
