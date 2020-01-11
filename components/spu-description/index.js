// components/spu-description/index.js
import object from "../../miniprogram_npm/lin-ui/common/async-validator/validator/object";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    tags: Array
  },
  observers: {
    'spu':function (spu) {
      if (!spu || !spu.tags){
        return
      }
      const tags = spu.tags.split('$')
      this.setData({
        tags
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
