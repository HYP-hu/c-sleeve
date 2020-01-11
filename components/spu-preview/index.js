Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    tags: []
  },
  observers: {
    'data': function (data) {
      if (!data) {
        return
      }
      if (!data.tags) {
        return
      }
      const tags = data.tags.split('$')
      this.setData({
        tags
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onImageLoad(event) {
      const {width, height} = event.detail
      this.setData({
        w: 100,
        h: 100 * height / width
      })
    },
    onItemTap(event) {
        const pid = event.currentTarget.dataset.pid

        wx.navigateTo({
          url: `/pages/detail/detail?pid=${pid}`
        })
    }
  }
})
