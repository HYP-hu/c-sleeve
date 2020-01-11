import {Paging} from "../../utils/paging";

export class Search{
  static search(q){
    return new Paging({
      url: `v1/search?q=${q}`
    })
  }
}
