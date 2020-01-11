// components/sale-explain/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    texts: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    _texts: Array  // texts的别名， 防止死循环导致的内存泄漏
  },
  observers:{
    'texts': function(texts){
      this.setData({
          _texts: texts // 会有内存泄漏的风险
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
