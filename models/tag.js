import {Http} from "../utils/http";

export class Tag{
  static getSearchTag(){
    return Http.request({
      url: `v1/tag/type/1`
    })
  }
}