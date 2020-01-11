// 业务对象

import {Http} from "../utils/http";

export class Theme {
  static locationA = 't-1'
  static locationE = 't-2'
  static locationF = 't-3'
  static locationH = 't-4'
  themes = []

  async getTheme() {
    const names = `${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`
    this.themes = await Http.request({
      url: 'v1/theme/by/names',
      data: {
        names
      }
    })
  }

  getHomeLocationA() {
    return this.themes.find(item => item.name === Theme.locationA)
  }

  getHomeLocationE() {
    return this.themes.find(item => item.name === Theme.locationE)
  }

  getHomeLocationF() {
    return this.themes.find(item => item.name === Theme.locationF)
  }

  getHomeLocationH() {
    return this.themes.find(item => item.name === Theme.locationH)
  }

  static getHomeLocationESpu() {
    return Theme.getThemeSpuByName(Theme.locationE)
  }

  static getThemeSpuByName(name) {
    return Http.request({
      url: `v1/theme/name/${name}/with_spu`
    })
  }
}