// 重写数组的部分方法

// 获取数组原型
let oldArrayProto = Array.prototype

// Object.create()方法用来创建一个新对象，使用现有对象作为新对象的_proto_
export let newArrayProto = Object.create(oldArrayProto)

// 找到所有的变异方法
let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']
// concat、slice都不会改变原数组

methods.forEach(method => {
  // 这里的this指的是调用方法的数组（data）
  newArrayProto[method] = function (...args) {
    // todo
    const result = oldArrayProto[method].call(this, ...args)
    console.log('method:', method)

    // 如果新增了数据那么需要再次进行劫持
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'unshift':
      case 'push':
      case 'splice':
        inserted = args
        break
      case 'splice':
        inserted = arsg.slice(2)
      default:
        break
    }
    console.log('新增的内容为：', inserted)
    if (inserted) {
      // 如果有新增的内容需要对新增的内容再次进行观测
      ob.observeArray(inserted)
    }
    return result
  }
})
