
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
    console.log(xml)
    if(check(timestamp, nonce, signature, TOKEN)){
        if (echostr) {
            res.send(echostr)
        } else if (xml && xml.MsgType && xml.Event) {
            // 用户扫描二维码关注公众号事件
            if (xml.MsgType[0] === 'event' && xml.Event[0] === 'SCAN') {
                _scan(req, res)
            } else if (xml.MsgType[0] === 'event' && xml.Event[0] === 'CLICK' && xml.EventKey && xml.EventKey[0] === 'V1001_TODAY_MUSIC') {
                _click(req, res)
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
                    <Content><![CDATA[欢迎关注~]]></Content>
                 </xml>`
    res.setHeader('Content-Type', 'application/xml;charset=utf-8')
    res.send(resStr)
}

function _click(req, res) {
    const xml = req.body.xml,
        openid = req.query.openid,
        fromUser = xml.ToUserName && xml.ToUserName[0],
        resStr = `<xml>
                    <ToUserName><![CDATA[${openid}]]></ToUserName>
                    <FromUserName><![CDATA[${fromUser}]]></FromUserName>
                    <CreateTime>${new Date().getTime()}</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[你点我干什么？]]></Content>
                 </xml>`
    res.setHeader('Content-Type', 'application/xml;charset=utf-8')
    res.send(resStr)
}

module.exports = router