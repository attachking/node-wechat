const express = require('express')
const router = express.Router()
const axios = require('axios')

router.all('/', (req, res, next) => {
    let str = req.query.str || req.body.str
    let openid = req.query.openid || req.body.openid
    axios.post(`https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${req.weixin.access_token}`, {
        'touser': openid,
        'msgtype': 'text',
        'text': {
            'content': str
        }
    }).then(data => {
        res.send(data.data)
    }).catch(err => {
        next(err)
    })
})

module.exports = router