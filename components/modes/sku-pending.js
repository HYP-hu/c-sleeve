import {CellStatus} from "../../core/enum";
import {Cell} from "./cell";

export class SkuPending {
  pending = []
  size

  constructor(size) {
    this.size = size
  }

  init(sku){
    sku.specs.forEach(s => {
      const cell = new Cell(s)
      this.pending.push(cell)
    })
  }

  insertCell(cell, x) {
    this.pending[x] = cell
  }

  isIntact(){
    if (this.pending.length < this.size){
      return false
    }
    return !this.pending.includes(undefined)
  }

  getCurrentSpecValues(){
    return this.pending.map(c => c && c.spec.value)
  }

  getMissingSpecKeysIndex(){
    const keysIndex = []
    for (let i = 0; i< this.pending.length; i++){
      if (!this.pending[i]){
        keysIndex.push(i)
      }
    }
    return keysIndex
  }

  removeCell(x) {
    this.pending[x] = undefined
  }

  getSkuCode(){
      return this.pending.map(s => s.getCellCode()).join('#')
  }

  findSelectedCellByX(x) {
    return this.pending[x]
  }

  isSelect(cell, x){
    if (!this.pending[x]){
      return false
    }
    if (cell.status !== CellStatus.SELECTED){
      cell.status = CellStatus.SELECTED
    }
    return this.pending[x].id === cell.id
  }
}