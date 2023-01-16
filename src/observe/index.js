import { newArrayProto } from './array'

class Observer {
  constructor(data) {
    // 将__proto__变为不可枚举属性
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false //将__ob__变为不可枚举属性，循环的时候无法获取
    })
    // 把Observer实例挂载到data对象的自定义属性上
    // 给所有观测过的数据增添了一个标识，如果数据有这个属性说明被观测过
    // data.__ob__ = this
    if (Array.isArray(data)) {
      // 重写数组的7个变异方法，这里是可以修改数组本身的
      // 数组中引用对象也需要被劫持
      // 需要保留数组原有的特性并重写部分方法
      data.__proto__ = newArrayProto
      this.observeArray(data)
    } else {
      // Object.defineProperty只能劫持已经存在的属性，后续增加的或者删除的它无法检测到（vue2中会为此单独写一些API）
      // 遍历当前属性
      this.walk(data)
    }
  }
  walk(data) {
    // 循环对象，对属性依次劫持
    // 重新定义属性，所以这也是vue2的一个性能问题
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    // 观测数组
    data.forEach(item => observe(item))
  }
}

// 形成了个闭包
export function defineReactive(target, key, value) {
  // 如果value是对象，只能劫持第一层，因此还需要再深度劫持
  observe(value)
  // defineProperty方法：第一个参数为需要定义属性的对象
  // 第二个参数为需要定义的属性名
  // 第三个参数为属性描述符

  // 变量不被销毁是因为：get set监听事件是全局事件，不被销毁，内部函数保存着外部函数的作用域，所以外部函数有引用，也不会被销毁
  Object.defineProperty(target, key, {
    // set、get是defineProperty的内置方法
    get() {
      // 取值的时候，会执行get
      //   console.log('用户取值了')
      return value
    },
    set(newVal) {
      // 修改的时候，会执行set
      //   console.log('用户设置值')
      if (newVal === value) return
      value = newVal
    }
  })
}

export function observe(data) {
  // 对这个对象进行劫持
  // 只对对象进行劫持
  if (typeof data !== 'object' || data == null) {
    return
  }

  if (data.__ob__ instanceof Observer) {
    // 说明这个对象已经被代理过了
    return data.__ob__
  }

  // 如果一个对象已经被劫持过了，那么就不需要再被劫持
  // 要判断一个对象是否被劫持过，可以添加一个实例，用实例来判断
  return new Observer(data)
}
