import {Http} from "../../utils/http";

export class Categories{
  roots = []
  subs = []
  async getAll(){
    const data = await Http.request({
      url: `v1/category/all`
    })
    this.roots = data.roots
    this.subs = data.subs
  }
  getRoots(){
    return this.roots
  }
  getSubs(parentId){
    return this.subs.filter(r => r.parent_id == parentId)
  }
  getRoot(rootId){
    return this.roots.find(r => r.id=rootId)
  }
}