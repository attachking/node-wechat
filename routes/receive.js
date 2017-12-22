
// 接收微信服务器发送的信息
const express = require("express")
const router = express.Router()
const crypto = require('crypto')
const axios = require('axios')

const myopenid = 'odT111rn01tAFeMb14AyAuTUIPf0'

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
            } else if (xml.MsgType[0] === 'event' && xml.Event[0] === 'LOCATION') {
                _location(req, res)
                res.send('')
            } else {
                res.send('')
            }
        } else if (xml && xml.MsgType && xml.MsgType[0] === 'text' && xml.Content[0].indexOf(':') !== -1) {
            _sendMessage(req, res)
            res.send('')
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

function _location(req, res) {
    const xml = req.body.xml,
        openid = req.query.openid
    if (openid === myopenid) return
    axios.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${req.weixin.access_token}`, {
        'touser': myopenid,
        'msgtype': 'text',
        'text': {
            'content': `${openid}\nLatitude:${xml.Latitude[0]}\nLongitude:${xml.Longitude[0]}\n<a href="http://60.205.177.230/test.html?lat=${xml.Latitude[0]}&lon=${xml.Longitude[0]}">点击查看位置</a>`
        }
    }).then(data => {
        console.log(data.data)
    })
}

function _sendMessage(req, res) {
    const xml = req.body.xml,
        openid = xml.Content[0].split(':')[0],
        str = xml.Content[0].split(':')[1]

    axios.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${req.weixin.access_token}`, {
        'touser': openid,
        'msgtype': 'text',
        'text': {
            'content': str
        }
    }).then(data => {
        console.log(data.data)
    })
}

module.exports = router