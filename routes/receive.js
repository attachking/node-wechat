
// 接收微信服务器发送的信息
const express = require("express")
const router = express.Router()
const crypto = require('crypto')
let {EVENT_TYPES, event} = require('../utils/event')

// 公众平台设置的token
const {TOKEN} = require('../utils/config')

router.all('/', (req, res, next) => {
    try {
        if (req.body.xml.MsgType[0] === 'event' && req.body.xml.Event[0] === 'SCAN') {
            _scan(req)
        }
    } catch (err) {
        console.log(err)
    }
    // aac001   openid   loginId
    let signature = req.query.signature
    let timestamp = req.query.timestamp
    let nonce = req.query.nonce
    let echostr = req.query.echostr
    if(check(timestamp, nonce, signature, TOKEN)){
        res.send(echostr)
    }else{
        res.send('It is not from weixin')
    }
})

function check(timestamp,nonce,signature,token){
    let currSign, tmp
    tmp = [token, timestamp, nonce].sort().join("")
    currSign = crypto.createHash("sha1").update(tmp).digest("hex")
    return currSign === signature
}

function _scan(req) {
    try {
        const openid = req.query.openid
        const str = req.body.xml.EventKey[0]
        event.$emit(EVENT_TYPES.login, {
            id: str,
            value: 1
        })

    } catch (err) {
        console.log(err)
    }
}



module.exports = router