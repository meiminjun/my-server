const wechat = require('./server/index'),
       config = require('./config');//引入配置文件
const koa = require('koa')
const router = require('./koaserver/router')
const bodyParser = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
const path = require('path')
// 引入 koa-static
const staticFiles = require('koa-static')

const app = new koa();
// 指定 public目录为静态资源目录，用来存放 js css images 等
app.use(staticFiles(path.resolve(__dirname, "./koaserver/public")))

app.use(nunjucks({
  ext: 'html',
  path: path.join(__dirname, 'koaserver/views'), // 指定视图目录
  nunjucksConfig: {
    trimBlocks: true // 开启转义 防Xss
  }
}))

app.use(bodyParser())
router(app)
//监听3000端口
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})
