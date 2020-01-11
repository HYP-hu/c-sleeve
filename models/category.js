import {Http} from "../utils/http";


export class Category{
  static getHomeLocationC(){
    return Http.request({
      url: `v1/category/grid/all`
    })
  }
}