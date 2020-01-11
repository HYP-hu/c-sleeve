// components/realm/index.js
import {FenceGroup} from "../modes/fence-group";
import {Judger} from "../modes/judger";
import {Spu} from "../../models/spu";
import {Cart} from "../modes/cart";
import string from "../../miniprogram_npm/lin-ui/common/async-validator/validator/string";
import {ShoppingWay} from "../../core/enum";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object,
    orderWay: {
      type: string,
      value: ShoppingWay.CART
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    judge: Object,
    previewImg: String,
    currentSkuCount: Cart.SKU_MIN_COUNT
  },
  observers: {
    'spu': function (spu) {
      if (!spu) {
        return
      }
      if (Spu.isNoSpec(spu)) {
        this.processNoSpec(spu)
      } else {
        this.processHasSpec(spu)
      }
      this.triggerSpecEvent()
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    processNoSpec(spu) {
      this.setData({
        noSpec: true
      })
      this.bindSkuData(spu.sku_list[0])
      this.setStockStatus(spu.sku_list[0].stock)
    },
    processHasSpec(spu) {
      const fencesGroup = new FenceGroup(spu)
      fencesGroup.initFences()
      this.data.judge = new Judger(fencesGroup)
      const defaultSku = fencesGroup.getDefaultSku()
      if (defaultSku) {
        this.bindSkuData(defaultSku)
        this.setStockStatus(defaultSku.stock)
      } else {
        this.bindSpuData()
      }
      this.bindTipData()
      this.bindFenceGroupData(fencesGroup)
    },
    triggerSpecEvent() {
      const noSpec = this.data.noSpec
      if (noSpec){
        this.triggerEvent('specchange',{
          noSpec
        })
      } else {
        this.triggerEvent('specchange', {
          noSpec,
          skuIntact: this.data.judge.isSkuIntact(),
          currentValues: this.data.judge.getCurrentValues(),
          missingKeys: this.data.judge.getMissingKeys()
        })
      }

    },
    bindSpuData() {
      const spu = this.properties.spu
      this.setData({
        previewImg: spu.img,
        title: spu.title,
        price: spu.price,
        discountPrice: spu.discount_price,
      })
    },
    bindTipData() {
      this.setData({
        skuIntact: this.data.judge.isSkuIntact(),
        currentValues: this.data.judge.getCurrentValues(),
        missingKeys: this.data.judge.getMissingKeys()
      })
    },
    bindSkuData(sku) {
      this.setData({
        previewImg: sku.img,
        title: sku.title,
        price: sku.price,
        discountPrice: sku.discount_price,
        stock: sku.stock,
      })
    },
    bindFenceGroupData(fencesGroup) {
      this.setData({
        fences: fencesGroup.fences,
      })
    },
    setStockStatus(stock, currentCount = this.data.currentSkuCount) {
      this.setData({
        outStock: this.isOutOfStock(stock, currentCount)
      })
    },
    isOutOfStock(stock, currentCount) {
      return stock < currentCount
    },
    onCellTap(event) {
      const cell = event.detail
      const judge = this.data.judge
      judge.judge(cell)
      const skuIntact = judge.isSkuIntact()
      if (skuIntact) {
        const currentSku = judge.getDeterminateSku()
        this.bindSkuData(currentSku)
        this.setStockStatus(currentSku.stock)
      }
      this.bindTipData()
      this.bindFenceGroupData(judge.fencesGroup)
      this.triggerSpecEvent()
    },
    onSelectCount(event) {
      const {type, count: currentCount} = event.detail
      this.data.currentSkuCount = currentCount
      if (this.data.noSpec) {
        this.setStockStatus(this.data.spu.sku_list[0].stock)
      } else if (this.data.judge.isSkuIntact()) {
        const sku = this.data.judge.getDeterminateSku()
        this.setStockStatus(sku.stock)
      }
    }
  }
})
