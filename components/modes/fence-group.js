import {Matrix} from "./matrix";
import {Fence} from "./fence";

export class FenceGroup {
  spu
  skuList = []
  fences = []

  constructor(spu) {
    this.spu = spu
    this.skuList = spu.sku_list
  }

  initFences() {
    const matrix = this._createMatrix(this.skuList)
    const fences = []
    const AT = matrix.transpose()
    AT.forEach(rows => {
      const fence = new Fence(rows)
      fence.init()
      this._setFenceSketch(fence)
      fences.push(fence)
    })
    this.fences = fences
  }

  _setFenceSketch(fence){
    if (this._hasSketchFence() && this._isSketchFence(fence.id)){
      fence.setFenceSketch(this.skuList)
    }
  }

  _hasSketchFence(){
    return this.spu.sketch_spec_id? true: false
  }

  _isSketchFence(fenceId){
    return this.spu.sketch_spec_id === fenceId
  }


  eachCell(cb) {
    for (let r = 0; r < this.fences.length; r++) {
      for (let c = 0; c < this.fences[r].cells.length; c++) {
        const cell = this.fences[r].cells[c]
        cb(cell, r, c)
      }
    }
  }

  getRealCell(x, y){
    return this.fences[x].cells[y]
  }

  getSku(skuCode){
    const fullSkuCode = this.spu.id + '$' + skuCode
    return this.spu.sku_list.find(s => {
      return s.code === fullSkuCode
    })
  }

  getDefaultSku(){
    const defaultSkuId = this.spu.default_sku_id
    if (!defaultSkuId){
      return
    }
    return this.skuList.find( s => s.id === defaultSkuId)
  }

  _createMatrix(skuList) {
    const m = []
    skuList.forEach(sku => {
      m.push(sku.specs)
    })
    return new Matrix(m)
  }

  // initFences1() {
  //   const matrix = this._createMatrix(this.skuList)
  //   const fences = []
  //   let currentCol = -1
  //   matrix.each((element, r, c) => {
  //
  //     if (c !== currentCol) {
  //       // 开启一个新列，需要创建一个新的fence
  //       // 此时r、c行列互换
  //       currentCol = c
  //       fences[currentCol]= this._createFence()
  //     }
  //      fences[currentCol].pushCells(element)
  //   })
  //   this.fences = fences
  // }

  // _createFence() {
  //   return new Fence()
  // }
}