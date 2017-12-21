const express = require('express')
const router = express.Router()

router.all('/', (req, res, next) => {
    let resStr = `<xml>
                    <ToUserName><![CDATA[123]]></ToUserName>
                    <FromUserName><![CDATA[123]]></FromUserName>
                    <CreateTime>${new Date().getTime()}</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content><![CDATA[欢迎关注~]]></Content>
                 </xml>`
    res.setHeader('Content-Type', 'application/xml;charset=utf-8')
    res.send(resStr)
});

module.exports = router