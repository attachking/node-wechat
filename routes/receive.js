
// 接收微信服务器发送的信息
const express = require("express")
const router = express.Router()
const crypto = require('crypto')

// 公众平台设置的token
const {TOKEN} = require('../utils/config')

router.all('/', (req, res, next) => {
    // aac001   openid
    let signature = req.query.signature
    let timestamp = req.query.timestamp
    let nonce = req.query.nonce
    let echostr = req.query.echostr
    const xml = req.body.xml
    if(check(timestamp, nonce, signature, TOKEN)){
        if (echostr) {
            res.send(echostr)
        } else if (xml) {
            // 用户扫描二维码关注公众号事件
            if (xml.MsgType && xml.Event && xml.MsgType[0] === 'event' && xml.Event[0] === 'SCAN') {
                _scan(req, res)
            } else {
                res.send('')
            }
        } else {
            res.send('')
        }
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

function _scan(req, res) {
    const xml = req.body.xml,
        openid = req.query.openid,
        fromUser = xml.ToUserName && xml.ToUserName[0],
        resStr = `<xml>
                    <ToUserName><![CDATA[${openid}]]></ToUserName>
                    <FromUserName><![CDATA[${fromUser}]]></FromUserName>
                    <CreateTime>${new Date().getTime()}</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[欢迎~]]></Content>
                 </xml>`
    res.send(resStr)
}



module.exports = router