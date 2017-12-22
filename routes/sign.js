
// 获取微信jsapi签名
const express = require('express')
const router = express.Router()
const sign = require('../utils/sign.js')
const {APPID} = require('../utils/config')

router.all('/', (req, res, next) => {
    const url = req.query.url || req.body.url
    let o = sign(req.weixin.jsapi_ticket, url)
    o.appid = APPID
    res.send(o)
})

module.exports = router