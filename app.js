const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path')
const fs = require('fs')
const logger = require('morgan');
const { expressjwt: expressJWT } = require('express-jwt');
const FileStreamRotator = require('file-stream-rotator')

const authRouter = require('./router/auth');


const app = express();

app.use(express.json()); // 自动解析json格式的请求体
app.use(cookieParser()); // 解析cookie，设置读取cookie
app.use(express.urlencoded({ extended: false })); // 解析urlencoded格式的请求体
app.use(express.static(path.join(__dirname, 'public'))); // 设置静态资源目录

/**
 * 设置日志输出
 */
logger.token('cookie', function (req) {
  return req.cookies && req.cookies.token;
})
logger.format('dev', '[:date[iso]] [token :cookie] :method :url :status :response-time ms - :res[content-length]');
var logDirectory = path.join(__dirname, 'log')
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})
app.use(logger('dev', { stream: accessLogStream }))

/**
 * 校验token
 */
app.use(expressJWT({
  secret: 'minibook',
  algorithms: ['HS256'], //express-jwt 6.0 需要添加加密方式
}).unless({
  path: ['/', '/api/auth', '/api/auth/login', /^\/public\/.*/] //不需要token验证的请求
}))



app.use('/api/auth', authRouter)
app.get('/', (req, res) => {
  res.send('Hello World!');
})


// 注册一个函数中间件，检查token是否有效
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
})