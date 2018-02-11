const wechat = require('../server/index')
const config = require('../config') //引入配置文件
const koa = require('koa')
const router = require('../koaserver/router')

const middleware = require('../koaserver/middleware')
const app = new koa();
middleware(app)

router(app)
//监听80端口
app.listen(80, () => {
  console.log('server is running at http://localhost:80')
})
