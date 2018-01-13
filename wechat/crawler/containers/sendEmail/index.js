// 时间举例：https://github.com/matthewmueller/date#examples
// agenda api: https://www.npmjs.com/package/agenda
//
var agenda = require('../../../tools/clocking/agendaScedule.js').agenda
var moment = require('moment-timezone')
var email = require('../../../tools/email/index.js')

var type = {
  s: '0-59 * * * * *', // 每秒触发
  m: '0 * * * * *', // 每分钟触发
  h: '0 0 * * * *', // 每小时触发
  d: '0 10 12 * * *', // 每天的早上9点30分0秒触发
  m1: '0 30 12 25-31 * *', // 每月的25至31日12点30分0秒触发
  o: new Date(2018, 0, 9, 22, 53, 0) // 2018年的1月9日22点49分0秒触发, 注意月份要+1,执行完成后会终止进程
}

function showTime () {
  var nowTime = new Date()
  var zhongguo = moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
  var result = '当前时间:' + zhongguo
  console.log('服务器时间:' + nowTime)
  console.log('中国时间:' + result)
  return result
}

// 异步job
// agenda.define('Async Job', function (job, done) {
//   doSomelengthyTask(function (data) {
//     console.log('new play Async Job')
//     var nowTime = showTime()
//     console.log(nowTime)
//     done()
//   })
// })

// function doSomelengthyTask (callback) {
//   callback()
// }

// 同步方法
// agenda.define('Sync Job', function (job) {
//   var nowTime = new Date()
//   console.log('sendEmail')
//   console.log(nowTime)
// })

// sendEmail every hour
agenda.define('sendEmail every hours', function (job, done) {
  var nowTime = showTime()
  var sendContent = {
    from: '"管理员-梅敏君" <13265678360@163.com>', // 发件箱地址
    to: '251222845@qq.com', // 收件箱地址
    subject: '每小时触发', // 主题
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: '<h1>Hello world?</h1>' // html body
  }
  sendContent.html += `<h1>${nowTime}</h1>`
  email.sendMail(sendContent, done) // 发送邮件
  console.log('每小时邮件触发成功！')
})

// 每天发送邮件
agenda.define('sendEmail every day', function (job, done) {
  var nowTime = showTime()
  var sendContent = {
    from: '"管理员-梅敏君" <13265678360@163.com>', // 发件箱地址
    to: '251222845@qq.com', // 收件箱地址
    subject: '每天的早上9点30分0秒触发', // 主题
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: '<h1>Hello world?</h1>' // html body
  }
  sendContent.html += `<h1>${nowTime}</h1>`
  email.sendMail(sendContent, done) // 发送邮件
  console.log('每天邮件触发成功！')
})

agenda.on('ready', function () {
  var everyHours = agenda.create('sendEmail every hours', {to: 'another-guy@example.com'})
  var everyDay = agenda.create('sendEmail every day', {to: 'another-guy@example.com'})
  // everyDay.repeatAt('10:30am', {timezone: 'Asia/Shanghai'}).save()
  everyDay.repeatAt('2:10pm', {timezone: 'Asia/Shanghai'}).save()
  everyHours.repeatEvery(type.m, {
    timezone: 'Asia/Shanghai'
  }).save()
  agenda.purge((err, numRemoved) => {
    console.log('旧任务被移除: ', numRemoved)
  })
  agenda.start()
})
