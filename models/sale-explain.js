import {Http} from "../utils/http";

export class saleExplain{
  static async getFixed(){
    const explains = await Http.request({
      url: `v1/sale_explain/fixed`
    })
    return explains.map(e => e.text)
  }
}