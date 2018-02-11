const router = require('koa-router')()
const HomeController = require('./controller/home')
const Fund = require('./controller/fund')

const wechat = require('../containers/wechat/index')
const wechatConfig = require('../containers/wechat/config');//引入配置文件
var wechatApp = new wechat(wechatConfig); //实例wechat 模块


module.exports = (app) => {

  // ----------------------页面服务---------------------------------------
  router.get( '/index', HomeController.index )

  router.get('/home', HomeController.home)

  router.get('/home/:id/:name', HomeController.homeParams)

  router.get('/login', HomeController.login)

  router.post('/user/register', HomeController.register)

  // ----------------------基金服务---------------------------------------
  router.get('/getFund/:code', Fund.getFundDetail) // 获取基金详情数据

  router.get('/getFundHistory/:code/:day', Fund.getFundHistory) // 获取基金历史数据

  router.get('/getFundPerformance/:code', Fund.getFundPerformance) // 获取基金业绩

  router.get('/getFundArchives/:code', Fund.getFundArchives) // 获取基金档案

  // ----------------------公众号服务---------------------------------------
  router.get('/', wechatApp.auth())

  //用于处理所有进入 80 端口 post 的连接请求
  router.post('/', function (req, res) {
    wechatApp.handleMsg(req, res);
  })

  //用于请求获取 access_token
  router.get('/getAccessToken', function () {
    wechatApp.getAccessToken().then(function (data) {
      res.send(data);
    })
  })





  // ----------------------汇总方法---------------------------------------
  app.use(router.routes()).use(router.allowedMethods())
}
