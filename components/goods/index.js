// components/sku/index.js
import {Spu} from "../../models/spu";

class Type {  //每个元素的属性
  constructor(value, selectable = false, disabled = false, items = {}) {
    this.value = value
    this.selectable = selectable
    this.disabled = disabled
    this.items = items
    this.re = 0 // 有几个元素禁用
  }
}

class Goods {   // 所有集合详情
  types = {}
  stock = null
  discount_price = null
  price = null
  img = null // 显示的图片
  title = null
  desc = null

  getSelectable() {
    for (let i in this.types) {
      if (!this.types[i].selectable) {
        return false
      }
    }
    return true
  }

  getDesc() {
    let descAll = []
    let descAny = []
    for (let i in this.types) {
      if (this.types[i].selectable) {
        descAll.push(this.types[i].value)
        continue
      }
      descAny.push(this.types[i].value)
    }
    return this.getSelectable() ? `已选:  ${descAll.join(',')}` : `请选择:  ${descAny.join(',')}`
  }
}

class GoodsDetail {  // 接口接收单个集合物品详情
  collect = []
  price = null
  discount_price = null
  stock = null
  img = null // 显示的图片
  title = null
  selectCount = 0
}


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pid: String,
    spu: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    sku: null,
    detail: [],
    goods: null
  },
  lifetimes: {
    attached() {

    }
  },
  observers:{
    'pid': function (pid) {
    },
    'spu': function (spu) {
      if (!spu){
        return
      }
      this.__initData(spu)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async __initData(spu) {
      const itemList = spu.sku_list
      this.createSpecs(itemList)
    },
    createSpecs(itemList) {
      const goods = new Goods()
      for (let item of itemList) {
        const goodsDetail = new GoodsDetail()

        for (let i of item.specs) {
          let newItem = null
          const valueId = i.value_id
          const keyId = i.key_id
          if (!goods.types.hasOwnProperty(keyId)) {
            const type = new Type(i.key)
            newItem = new Type(i.value)
            type.items[valueId] = newItem //增加元素
            goods.types[keyId] = type //增加属性
            const obj = {}
            obj[keyId] = {}
            obj[keyId][valueId] = newItem
            goodsDetail.collect.push(obj)
            continue
          }
          // 当属性在goods.types中
          const type_ = goods.types[keyId]

          if (!type_.items.hasOwnProperty[valueId]) {
            newItem = new Type(i.value)
            type_.items[valueId] = newItem
            const obj = {}
            obj[keyId] = {}
            obj[keyId][valueId] = newItem
            goodsDetail.collect.push(obj)
          }
        }
        goodsDetail.price = item.price
        goodsDetail.discount_price = item.discount_price
        goodsDetail.stock = item.stock
        goodsDetail.img = item.img
        goodsDetail.title = item.title
        this.data.detail.push(goodsDetail)

      }
      this.setData({
        goods
      })

      for (let i of itemList[0].specs) {
        this.itemSelectable(goods, i.key_id, i.value_id)
      }

      goods.desc = goods.getDesc()
      this.setData({
        goods
      })

    },
    onBtnClick(event) {
      const {
        index: goodsIndex_,
        typeindex: typeIndex,
      } = event.currentTarget.dataset
      this.itemSelectable(this.data.goods, typeIndex, goodsIndex_)
      this.setData({
        goods: this.data.goods
      })
    },
    itemSelectable(goods, typeIndex, goodsIndex_) {
      const obj = goods.types[typeIndex].items
      const typeObj = goods.types[typeIndex]

      for (let key in obj) {
        if (key == goodsIndex_ && obj[key].selectable) { // 取消操作
          obj[key].selectable = false
          typeObj.selectable = false

          goods.desc = goods.getDesc()
          this.itemEnable(goods,false, typeIndex, goodsIndex_)
          break
        }
        // 跳转操作
        if (key == goodsIndex_ && !obj[key].selectable) {
          obj[key].selectable = true
          typeObj.selectable = true
          goods.desc = goods.getDesc()
          this.itemEnable(goods,true, typeIndex, goodsIndex_)
          continue
        }
        // 跳转操作之取消之前选择的按钮
        if (obj[key].selectable) {
          obj[key].selectable = false
          this.itemEnable(goods,false, typeIndex, key)
        }
      }

    },

    itemEnable(goods, selectable, typeIndex, goodsIndex_) {
      let col = []
      for (let res of this.data.detail) {

        for (let it of res.collect) {
          if (it[parseInt(typeIndex)] && it[parseInt(typeIndex)][parseInt(goodsIndex_)]) {
            res.selectCount = selectable ? res.selectCount + 1 : res.selectCount - 1
            if (res.selectCount === res.collect.length) {
              goods.title = res.title
              goods.price = res.price
              goods.discount_price = res.discount_price
              goods.img = res.img
              goods.stock = res.stock
            }
            col.push(res)
            break
          }
        }

      } // 第一遍处理

      // 第二遍处理
      const obj = {}
      for (let itm of col) {
        for (let it of itm.collect) {
          if (it[typeIndex]) {
            continue
          }
          for (let j in it) {
            if (!obj[j]) {
              obj[j] = {...it[j]} //
              continue
            }
            Object.assign(obj[j], it[j]);
          }
        }
      }

      for (let i in this.data.goods.types) {
        if (Object.keys(obj).includes(i)) {
          for (let j in this.data.goods.types[i].items) {
            if (!Object.keys(obj[i]).includes(j)) {
              this.data.goods.types[i].items[j].disabled = selectable
              this.data.goods.types[i].items[j].re =
                selectable ? this.data.goods.types[i].items[j].re + 1 :
                  this.data.goods.types[i].items[j].re - 1
              this.data.goods.types[i].items[j].disabled = this.data.goods.types[i].items[j].re != 0
            }
          }
        }
      }
    }
  },
})
