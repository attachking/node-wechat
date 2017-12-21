
// 定时获取access_token, jsapi_ticket
const axios = require('axios')
const {APPID, SECRET} = require('./config')

let access_token
let jsapi_ticket

function getToken(){
    return axios.get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`)
}
function getTicket() {
    return axios.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`)
}
async function access(){
    try{
        let tooken = await getToken()
        access_token = tooken.data.access_token
        let ticket = await getTicket()
        jsapi_ticket = ticket.data.ticket
        console.log('access_token and jsapi_ticket successfully!')
        return `access_token:${access_token}\njsapi_ticket:${jsapi_ticket}`
    }catch(err){
        return err
    }
}

access().then(data => {
    console.log(data)
}).catch(err => {
    console.log(err)
})

setInterval(() => {
    access().then(data => {
        console.log(data)
    }).catch(err => {
        console.log(err)
    })
}, 60 * 60 * 1000)

module.exports = function(req, res, next) {
    req.weixin = {
        access_token,
        jsapi_ticket
    }
    next()
}
