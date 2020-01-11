export class HistoryKeyword {
  // 静态属性
  // 单例模式
  // 缓存中写入数据
  // 最大上限 去重
  static MAX_ITEM_COUNT = 20
  keywords = []
  static KEY = 'search_keywords'

  constructor() {
    // 单例模式
    if (typeof HistoryKeyword.instance === 'object'){
      return HistoryKeyword.instance
    }
    HistoryKeyword.instance = this
    this.keywords = this._getLocalKeywords()
    return this
  }

  save(keyword) {
    const items = this.keywords.filter(k => k === keyword)
    if (items.length) {
      return
    }
    if (this.keywords.length >= HistoryKeyword.MAX_ITEM_COUNT) {
      this.keywords.pop()
    }
    this.keywords.unshift(keyword)
    this._refreshLocal()
  }

  get() {
    return this.keywords
  }

  clear() {
    this.keywords = []
    this._refreshLocal()
  }

  _refreshLocal() {
    wx.setStorageSync(HistoryKeyword.KEY, this.keywords)
  }

  _getLocalKeywords() {
    return wx.getStorageSync(HistoryKeyword.KEY) || wx.setStorageSync(HistoryKeyword.KEY, [])
  }
}
