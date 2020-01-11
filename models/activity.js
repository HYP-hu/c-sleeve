import {Http} from "../utils/http";

export class Activity {
  static LocationD = 'a-2'

  static getHomeLocationD() {
    return Http.request({
      url: `v1/activity/name/${Activity.LocationD}`,

    })
  }
}