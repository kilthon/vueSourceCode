import { observe } from './observe/index.js'

export function initState(vm) {
  // 对数据进行劫持，获取所有选项
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm, target, key) {
  // vm.name
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key] // vm._data.name
    },
    set(newVal) {
      vm[target][key] = newVal
    }
  })
}

function initData(vm) {
  // data可能是函数也可能是对象
  let data = vm.$options.data
  data = typeof data == 'function' ? data.call(vm) : data
  //   console.log(data)
  //   对数据进行劫持
  vm._data = data
  observe(data)

  //  将vm._data用vm来代理
  for (let key in data) {
    proxy(vm, '_data', key)
  }
}
