
// 二维码登录
const express = require('express')
const router = express.Router()
let {EVENT_TYPES, event} = require('../utils/event')
const axios = require('axios')

let o = {}
event.$on(EVENT_TYPES.login, ({id, value}) => {
    o[id] = value
})

router.all('/', (req, res, next) => {
    const id = req.query.id || req.body.id
    if (typeof id !== 'undefined') {
        axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${req.weixin.access_token}`, {
            expire_seconds: 7200,
            action_name: 'QR_STR_SCENE',
            action_info: {
                scene: {
                    scene_str: `${id}`
                }
            }
        }).then(data => {
            res.send(data.data)
        }).catch(err => {
            next(err)
        });
    } else {
        res.send({})
    }
});

router.all('/check', (req, res, next) => {
    let id = req.query.id || req.body.id
    if (typeof id !== 'undefined') {
        if (o[id] === 1) {
            res.send({
                code: 1
            })
            delete o[id]
        } else {
            res.send({
                code: 0
            })
        }
    } else {
        res.send({
            code: 0
        })
    }
})