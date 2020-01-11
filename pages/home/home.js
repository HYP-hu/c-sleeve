// pages/home/home.js
import {Theme} from "../../models/theme";
import {Banner} from "../../models/banner";
import {Category} from "../../models/category";
import {Activity} from "../../models/activity";
import {SpuPaging} from "../../models/spu-paging";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeA: null,
    bannerB: null,
    grid: null,
    activityD: null,
    themeE: null,
    themeESpu: null,
    themeF: null,
    bannerG: null,
    themeH: null,
    goods: null,
    isLoading: false,
    supPaging: null,
    loadingType: 'loading'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    this.initAllData()
    this.initBottomSpuList()
  },
  async initBottomSpuList() {
    const Paging = SpuPaging.getLatestPaging()
    const data = await Paging.getMoreData()
    this.data.supPaging = Paging
    if (!data) {
      return
    }
    this.setRenderWaterFlow(data.items)
  },
  async initAllData() {
    const theme = new Theme()
    await theme.getTheme()
    const themeA = theme.getHomeLocationA()
    const bannerB = await Banner.getHomeLocationB()
    const grid = await Category.getHomeLocationC()
    const activityD = await Activity.getHomeLocationD()
    const themeE = theme.getHomeLocationE()
    let themeESpu = []
    if (themeE.online) {
      const data = await Theme.getHomeLocationESpu()
      if (data) {
        themeESpu = data.spu_list.slice(0, 8)
      }
    }
    const themeF = theme.getHomeLocationF()
    const bannerG = await Banner.getHomeLocationG()
    const themeH = theme.getHomeLocationH()

    this.setData({
      themeA,
      bannerB,
      grid,
      activityD,
      themeE,
      themeESpu,
      themeF,
      bannerG,
      themeH
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    const waterFlow = this.selectComponent('#water-flow')
     console.log(waterFlow)
    const data = await this.data.supPaging.getMoreData()
    if (!data) {
      return
    }
    this.setRenderWaterFlow(data.items)
    if (!data.moreData) {
      this.setData({
        loadingType: 'end'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  setRenderWaterFlow(item) {
    wx.lin.renderWaterFlow(item, false, () => {
      console.log('渲染成功')
    })
  }
})