// components/cell/index.js
import object from "../../miniprogram_npm/lin-ui/common/async-validator/validator/object";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cell: Object,
    x: Number,
    y: Number
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap(event){
      this.triggerEvent('celltap', {
        cell: this.properties.cell,
        x: this.properties.x,
        y: this.properties.y
      },{
        bubbles: true, //冒泡
        composed: true // 跨越组建边界
      })
    }
  }
})
