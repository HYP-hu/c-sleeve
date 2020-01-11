import {Http} from "../utils/http";

export class Banner {
  static locationB= 'b-1'
  static locationG = 'b-2'

  static getHomeLocationB() {
    return  Http.request({
      url: `v1/banner/name/${Banner.locationB}`
    })
  }

  static getHomeLocationG(){
    return Http.request({
      url: `v1/banner/name/${Banner.locationG}`
    })
  }
}