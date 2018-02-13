// const wechat = require('../containers/wechat/index')
// const config = require('../containers/wechat/config') //引入配置文件
const koa = require('koa')
const router = require('../koaserver/router')

const middleware = require('../koaserver/middleware')
const app = new koa();
middleware(app)

router(app)
//监听80端口
app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
})