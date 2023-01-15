import { initState } from './state'

// 给Vue增加init方法
export function initMixin(Vue) {
  // 用于初始化操作
  Vue.prototype._init = function (options) {
    // 原型中的this指的都是实例
    const vm = this
    // vm.$options 获取用户的配置
    // 将options挂载到实例上
    vm.$options = options

    // 初始化状态
    initState(vm)
  }
}
