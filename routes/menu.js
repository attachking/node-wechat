// 获取公众号二维码(可自行携带参数)
const express = require('express')
const router = express.Router()
const axios = require('axios')

router.all('/', (req, res, next) => {
    axios.post(`https://api.weixin.qq.com/cgi-bin/menu/create?access_token=${req.weixin.access_token}`, {
        'button':[
            {
                'type':'click',
                'name':'测试点击',
                'key':'V1001_TODAY_MUSIC'
            },
            {
                'name':'测试url',
                'type':'view',
                'url':'http://www.soso.com/'
            }]
    }).then(data => {
        res.send(data.data)
    }).catch(err => {
        console.log(err)
        next(err)
    })
})

module.exports = router