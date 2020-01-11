import {config} from "../config/config";

const promisic = function (func) {
    return function (params = {}) {
        return new Promise((resolve, reject) => {
            const args = Object.assign(
                params, {success: res => resolve(res.data), fail: reject}
            )
            func(args)
        })
    }
}

export class Http {
    static request(options) {
        return promisic(wx.request)({
            url: `${options.apiBaseUrl || config.apiBaseUrl + options.url}`,
            method: options.method || 'GET',
            data: options.data || {},
            header: Object.assign(options.header || {}, {'appkey': config.appkey}),
        })
    }
}