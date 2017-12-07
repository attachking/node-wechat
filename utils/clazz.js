const axios = require('axios')
const {APPID, SECRET} = require('./config')

// 获取用户详情
module.exports.getUserInfo = function(access_token, openid) {
    return axios.get(`https://api.weixin.qq.com/cgi-bin/user/info?access_token=${access_token}&openid=${openid}&lang=zh_CN`)
}

// 网页授权获取用户openid
module.exports.getOpenId = function(code) {
    return axios.get(`https://api.weixin.qq.com/sns/oauth2/access_token?appid=${APPID}&secret=${SECRET}&code=${code}&grant_type=authorization_code`)
}