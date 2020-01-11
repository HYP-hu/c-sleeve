import {SkuCode} from "./sku-code";
import {CellStatus} from "../../core/enum";
import {SkuPending} from "./sku-pending";
import {Joiner} from "../../utils/joiner";

export class Judger {
  pathDict = []
  fencesGroup
  skuPending
  // 沟通类
  // 本质类

  constructor(fenceGroup) {
    this.fencesGroup = fenceGroup
    this._initPathDict()
    this._initSpuPending()
  }

  isSkuIntact(){
    return this.skuPending.isIntact()
  }

  getCurrentValues(){
    return this.skuPending.getCurrentSpecValues()
  }

  getMissingKeys(){
    const missKeysIndex = this.skuPending.getMissingSpecKeysIndex()
    return missKeysIndex.map(i => {
      return this.fencesGroup.fences[i].title
    })
  }

  _initSpuPending() {
    const specsLength = this.fencesGroup.fences.length
    const defaultSku = this.fencesGroup.getDefaultSku()
    this.skuPending = new SkuPending(specsLength)
    if (defaultSku){
      this.skuPending.init(defaultSku)
      this._changeOtherCellStatus()
    } else {
      this.skuPending.pending = new Array(specsLength)
    }
  }

  getDeterminateSku(){
    const code = this.skuPending.getSkuCode()
    return this.fencesGroup.getSku(code)
  }

  _initPathDict() {
    this.fencesGroup.spu.sku_list.forEach(s => {
      const skuCode = new SkuCode(s.code)
      this.pathDict.push(...skuCode.totalSegments)
    })
  }

  judge({cell, x, y}, isInit=false) {
    if (!isInit){
      this._changeCurrentCellStatus(cell, x, y)
    }

    this._changeOtherCellStatus()
  }

  _isInDict(path) {
    return this.pathDict.includes(path)
  }

  _findPotentialPath(cell, x, y) {
    const joiner = new Joiner('#')
    for (let i = 0; i < this.fencesGroup.fences.length; i++) {
      const selected = this.skuPending.findSelectedCellByX(i)
      if (i === x) {
        // 判断当前cell路径是否已经被选择；处理同一行中两个cell被选择的情况
        if (this.skuPending.isSelect(cell, x)) {
          return
        }
        const cellCode = cell.getCellCode()
        joiner.join(cellCode)
      } else if (selected) {
        const selectedCellCode = selected.getCellCode()
        joiner.join(selectedCellCode)
      }
    }
    return joiner.getStr()
  }

  _changeOtherCellStatus() {
    this.fencesGroup.eachCell((cell, r, c) => {
      const path = this._findPotentialPath(cell, r, c)
      if (!path) {
        return
      }
      const isIn = this._isInDict(path)
      if (isIn) {
        this.fencesGroup.fences[r].cells[c].status = CellStatus.WAITING
      } else {
        this.fencesGroup.fences[r].cells[c].status = CellStatus.FORBIDDEN
      }
    })
  }

  _changeCurrentCellStatus(cell, x, y) {
    const realCell = this.fencesGroup.getRealCell(x, y)
    if (cell.status === CellStatus.WAITING) {
      realCell.status = CellStatus.SELECTED
      this.skuPending.insertCell(realCell, x)
      return
    }
    if (cell.status === CellStatus.SELECTED) {
      realCell.status = CellStatus.WAITING
      this.skuPending.removeCell(x)
    }
  }

}