
// 获取公众号二维码(可自行携带参数)
const express = require('express')
const router = express.Router()
const axios = require('axios')

router.all('/', (req, res, next) => {
    axios.post(`https://api.weixin.qq.com/cgi-bin/qrcode/create?access_token=${req.weixin.access_token}`, {
        expire_seconds: 7200,
        action_name: 'QR_STR_SCENE',
        action_info: {
            scene: {
                scene_str: '123456'
            }
        }
    }).then(data => {
        res.send(data.data)
    }).catch(err => {
        next(err)
    });
});

// 获取二维码ticket后，可用ticket换取二维码图片。本接口无须登录态即可调用  https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET  提醒：TICKET记得进行UrlEncode
module.exports = router