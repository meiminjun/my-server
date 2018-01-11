// 参考：https://cnodejs.org/topic/5982791728607f916122dc1d
// 参考：http://www.sohu.com/a/129614807_575744

const Agenda = require('agenda')
var moment = require('moment-timezone')

const connectionoptions = {
  db: {
    address: 'mongodb://127.0.0.1:27017/agenda',
    collection: 'agendaJobs',
    options: { server: { auto_reconnect: true } }
  }
}
// 初始化agenda
let agenda = new Agenda(connectionoptions)
agenda
  .name('AGENDA TEST - ' + process.pid)
  .defaultConcurrency(5)
  .defaultLockLifetime(10000)
// // 定义任务
// agenda.define('updateCampaignTimeout', { priority: 'high', concurrency: 3 }, (job, done) => {
//   console.log(job)

//   done()
// })
// // 配置任务(需要在ready事件中完成)
// agenda.on('ready', () => {
//   // agenda.every('00 09 18 * * *', 'updateCampaignTimeout', {}, {timezone: 'Asia/Shanghai'})
//   agenda.every('2 seconds', 'updateCampaignTimeout', {}, {timezone: 'Asia/Shanghai'})
//   agenda.every('30 seconds', 'updateCampaignOverBudget')
//   agenda.every('1 minutes', 'synchronizeBudget')
//   console.log('agenda测试开始，启动完毕')
//   agenda.start()
// })
//

agenda.define('start new play', function (job, done) {
  console.log('new play agenda')
  var nowTime = new Date()
  var zhongguo = moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
  var result = '当前时间:' + zhongguo
  console.log('服务器时间:' + nowTime)
  console.log('中国时间:' + result)
})

agenda.on('ready', function () {
  // agenda.every('2 seconds', 'start new play', {}, {timezone: 'Asia/Shanghai'})
  agenda.schedule('0-59 * * * * *', 'start new play')
  agenda.purge((err, numRemoved) => {
    console.log('旧任务被移除: ', numRemoved)
  })
  agenda.start()
})

// 设置监听
agenda.on('start', (job) => {
  console.log('检测到job启动: ', job.attrs.name)
})

agenda.on('complete', (job) => {
  console.log('检测到job完成: ', job.attrs.name)
})

agenda.on('success', (job) => {
  console.log('检测到job成功: ', job.attrs.name)
})

agenda.on('fail', (job) => {
  console.log('检测到job失败: ', job.attrs.name)
  console.log('失败时间: ', job.attrs.failedAt)
  console.log('失败原因: ', job.attrs.failReason)
  agenda.stop()
})
// 最后，优雅的退出方案
function graceful () {
  agenda.stop(() => {
    console.log('检测到退出')
    process.exit(0)
  })
}

process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)
