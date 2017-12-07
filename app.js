const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser)

const ticket = require('./utils/ticket')
const sign = require('./routes/sign')
const receive = require('./routes/receive')
const qrCode = require('./routes/qrCode')
const user = require('./routes/user')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.png')))
app.use(logger((tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms'
    ].join(' ')
}))
app.use(bodyParser.xml())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// 路由及自定义中间件
// 定时获取access_token和jsapi_ticket
app.use(ticket)
// 获取js票据
app.use('/sign', sign)
// 接收微信服务器发送的信息
app.use('/receive', receive)
// 获取二维码
app.use('/qrCode', qrCode)
// 获取用户
app.use('/user', user)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
