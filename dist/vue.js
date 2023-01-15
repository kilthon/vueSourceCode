(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      // Object.defineProperty只能劫持已经存在的属性，后续增加的或者删除的它无法检测到（vue2中会为此单独写一些API）
      // 遍历当前属性
      this.walk(data);
    }
    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 循环对象，对属性依次劫持
        // 重新定义属性，所以这也是vue2的一个性能问题
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }]);
    return Observer;
  }(); // 形成了个闭包
  function defineReactive(target, key, value) {
    // 如果value是对象，只能劫持第一层，因此还需要再深度劫持
    observe(value);
    // defineProperty方法：第一个参数为需要定义属性的对象
    // 第二个参数为需要定义的属性名
    // 第三个参数为属性描述符

    // 变量不被销毁是因为：get set监听事件是全局事件，不被销毁，内部函数保存着外部函数的作用域，所以外部函数有引用，也不会被销毁
    Object.defineProperty(target, key, {
      // set、get是defineProperty的内置方法
      get: function get() {
        // 取值的时候，会执行get
        console.log('用户取值了');
        return value;
      },
      set: function set(newVal) {
        // 修改的时候，会执行set
        console.log('用户设置值');
        if (newVal === value) return;
        value = newVal;
      }
    });
  }
  function observe(data) {
    // 对这个对象进行劫持
    // 只对对象进行劫持
    if (_typeof(data) !== 'object' || data == null) {
      return;
    }
    // 如果一个对象已经被劫持过了，那么就不需要再被劫持
    // 要判断一个对象是否被劫持过，可以添加一个实例，用实例来判断
    return new Observer(data);
  }

  function initState(vm) {
    // 对数据进行劫持，获取所有选项
    var opts = vm.$options;
    if (opts.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    // vm.name
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key]; // vm._data.name
      },
      set: function set(newVal) {
        vm[target][key] = newVal;
      }
    });
  }
  function initData(vm) {
    // data可能是函数也可能是对象
    var data = vm.$options.data;
    data = typeof data == 'function' ? data.call(vm) : data;
    //   console.log(data)
    //   对数据进行劫持
    vm._data = data;
    observe(data);

    //  将vm._data用vm来代理
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  // 给Vue增加init方法
  function initMixin(Vue) {
    // 用于初始化操作
    Vue.prototype._init = function (options) {
      // 原型中的this指的都是实例
      var vm = this;
      // vm.$options 获取用户的配置
      // 将options挂载到实例上
      vm.$options = options;

      // 初始化状态
      initState(vm);
    };
  }

  // es5中Vue是通过构造函数然后扩展方法，然后将不同的方法放到不同的文件中
  // es6是将所有原型方法放在类中
  function Vue(options) {
    // debugger
    // 默认调用init
    this._init(options);
  }

  // 初始化，扩展了init方法
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
