// 微信 JS 接口签名算法

const crypto = require('crypto')

function createNonceStr() {
    return Math.random().toString(36).substr(2, 7) + Math.random().toString(36).substr(2, 8)
}

function createTimestamp() {
    return parseInt(new Date().getTime() / 1000) + ''
}

let raw = function (args) {
    let keys = Object.keys(args)
    keys = keys.sort()
    let newArgs = {}
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key]
    })

    let string = ''
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
}

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
module.exports = function (jsapi_ticket, url) {
    let ret = {
        jsapi_ticket: jsapi_ticket,
        noncestr: createNonceStr(),
        timestamp: createTimestamp(),
        url: decodeURIComponent(url)
    }
    let string = raw(ret)
    ret.signature = crypto.createHash('sha1').update(string).digest('hex')

    return ret
}
