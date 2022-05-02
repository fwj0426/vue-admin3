/*
 * @Author: 张熠
 * @Date: 2021-12-10 16:46:10
 * @LastEditTime: 2021-12-27 10:08:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /vue3-admin/src/main.js
 */
import { createApp } from 'vue'
// import vueCompositionApi from '@vue/composition-api'
import 'normalize.css/normalize.css' //初始化浏览器默认样式
import App from './App.vue'
import router from './router'
import store from './store'
import { globalRegister } from './global/register-element'
// // 自定义全局组件
// createApp.component('svg-icon', {
//     template: '<div>123123</div>'
// })
import eventBus from 'vue3-eventbus'
// app.use(eventBus)

import { checkJurisdiction } from './utils/permissions.js'
// 用户权限判断 - VUE自定义指令
createApp(App).directive('permission', {
  inserted(el, binding) {
    // inserted → 元素插入的时候
    let permission = binding.value // 获取到 v-permission的值
    if (permission) {
      let hasPermission = checkJurisdiction(permission)
      if (!hasPermission) {
        // 没有权限 移除Dom元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error('需要传key')
    }
  }
})
import { getToken } from './utils/cookies'
/**
 * 权限实例
 * <el-button v-permission="对应的权限ID"></el-button>
 */
router.beforeEach((to, from, next) => {
  if (to.path === '/') return next();
  const tokenStr = getToken()
  if (!tokenStr) return next('/login/login')

  next()
})

createApp(App).use(store).use(router).use(globalRegister).use(eventBus).mount('#app')
