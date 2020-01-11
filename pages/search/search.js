// pages/search/search.js
import {HistoryKeyword} from "../../models/history-keyword";
import {Tag} from "../../models/tag";
import {Search} from "../../components/modes/search";
import {showToast} from "../../utils/ui";

const history = new HistoryKeyword()
Page({

  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const historyTags = history.get()
    const hotTags = await Tag.getSearchTag()
    this.setData({
      historyTags,
      hotTags
    })
  },
  async onSearch(event) {
    this.setData({
      search: true,
      item: []
    })
    const keyword = event.detail.value || event.detail.name
    history.save(keyword)
    if (! keyword.split('')){
      showToast('请输入关键字')
      return
    }
    this.setData({
      historyTags: history.get()
    })
    const paging = Search.search(keyword)
    wx.lin.showLoading({
      color: '#157658',
      type: 'flash',
      fullScreen: true
    })
    const data = await paging.getMoreData()
    this.bindItem(data)
    wx.lin.hideLoading()
  },
  bindItem(data){
    if (data.accumulator.length){
      this.setData({
        items: data.accumulator
      })
    }
  },
  onCancel(event){
    this.setData({
      search: false
    })
  },
  onDeleteHistory(event){
    history.clear()
    this.setData({
      historyTags: history.get()
    })
  }
})