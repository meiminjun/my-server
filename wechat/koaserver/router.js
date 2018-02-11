const router = require('koa-router')()
const HomeController = require('./controller/home')
const Fund = require('./controller/fund')

module.exports = (app) => {

  router.get( '/', HomeController.index )

  router.get('/home', HomeController.home)

  router.get('/home/:id/:name', HomeController.homeParams)

  router.get('/login', HomeController.login)

  router.post('/user/register', HomeController.register)

  // ----------------------基金服务---------------------------------------
  router.get('/getFund/:code', Fund.getFundDetail) // 获取基金详情数据

  router.get('/getFundHistory/:code/:day', Fund.getFundHistory) // 获取基金历史数据

  router.get('/getFundPerformance/:code', Fund.getFundPerformance) // 获取基金业绩

  router.get('/getFundArchives/:code', Fund.getFundArchives) // 获取基金档案

  app.use(router.routes()).use(router.allowedMethods())
}
