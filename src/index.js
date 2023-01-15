import { initMixin } from './init'
// es5中Vue是通过构造函数然后扩展方法，然后将不同的方法放到不同的文件中
// es6是将所有原型方法放在类中
function Vue(options) {
  // debugger
  // 默认调用init
  this._init(options)
}

// 初始化，扩展了init方法
initMixin(Vue)

export default Vue
