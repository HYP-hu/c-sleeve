import {Http} from "./http";

export class Paging {
  start
  count
  req
  locker = false
  moreData = true
  accumulator = []

  constructor(req, count = 10, start = 0) {
    this.start = start
    this.count = count
    this.req = req
  }

  async getMoreData() {
    if (!this.moreData){
      return
    }
    if (!this._getLocker()) {
      return
    }
    const data = await this._actualGetData()
    this._releaseLocker()
    return data
  }

  _getCurrentReq() {
    return {
      data: {
        start: this.start,
        count: this.count
      }, ...this.req
    }
  }

  async _actualGetData() {
    const req = this._getCurrentReq()
    let paging = await Http.request(req)
    if (!paging){
      return null
    }
    if(paging.total === 0){
        return {
          empty: true,
          items: [],
          moreData: false,
          accumulator: []
        }
    }
    this.moreData = Paging._moreData(paging.total_page, paging.page)
    if (this.moreData){
      this.start += this.count
    }
    this._accumulate(paging.items)
    return {
      empty: false,
      items: paging.items,
      moreData: this.moreData,
      accumulator: this.accumulator
    }
  }
  _accumulate(items){
    this.accumulator.push(...items)
  }

  static _moreData(total_page, current_page){
    return current_page < total_page - 1
  }

  _getLocker() {
    if (this.locker){
      return false
    }
    this.locker = true
    return true
  }

  _releaseLocker() {
    this.locker = false
  }
}