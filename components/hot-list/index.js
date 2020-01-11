Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banner: Object
  },

  /**
   * 组件的初始数据
   */
  data: {},
  created() {
    console.log('created', this.properties.banner);
  },
  attached() {
    console.log('attached', this.properties.banner);
  },
  ready() {
    console.log('ready', this.properties.banner);
  },
  observers: {
    'banner': function (banner) {
      if (!banner || banner.items.length === 0) {
        return
      }
      const left = banner.items.find(item => item.name === 'left')
      const rightTop = banner.items.find(item => item.name === 'right-top')
      const rightBottom = banner.items.find(item => item.name === 'right-bottom')
      this.setData({
        left,
        rightTop,
        rightBottom
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {}
})
