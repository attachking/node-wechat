// 获取用户详情
const express = require("express")
const router = express.Router()
const {getOpenId} = require('../utils/clazz')

// 通过网页授权获取openid
router.all('/openid', (req, res, next) => {
    const code = req.query.code || req.body.code;
    if (typeof code === 'undefined') {
        return next(new Error('no code'))
    }
    getOpenId(code).then(data => {
        res.send(data.data)
    }).catch(err => {
        next(err)
    })
})

module.exports = router