// 时间举例：https://github.com/matthewmueller/date#examples
// agenda api: https://www.npmjs.com/package/agenda
// 周期规则：https://www.npmjs.com/package/cron
var fs = require('fs')
var path = require('path')
var agenda = require('../../../tools/clocking/agendaScedule.js').agenda
var moment = require('moment-timezone')
var email = require('../../../tools/email/index.js')
var ejs = require('ejs')

var to = '13265678360@163.com'
const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email-template.ejs'), 'utf8'))

function rendHtml (data) {
  const html = template(Object.assign({
    title: 'Ejs',
    desc: '使用Ejs渲染模板'
  }, data || {}))
  return html
}

var type = {
  s: '0-59 * * * * *', // 每秒触发
  m: '0 * * * * *', // 每分钟触发
  h: '0 0 * * * *', // 每小时触发
  d: '0 30 9 * * *', // 每天的早上9点30分0秒触发
  m1: '0 30 12 25-31 * *', // 每月的25至31日12点30分0秒触发
  o: new Date(2018, 0, 9, 22, 53, 0) // 2018年的1月9日22点49分0秒触发, 注意月份要+1,执行完成后会终止进程
}

// function showTime () {
//   var nowTime = new Date()
//   var zhongguo = moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
//   var result = '当前时间:' + zhongguo
//   console.log('服务器时间:' + nowTime)
//   console.log('中国时间:' + result)
//   return result
// }

// 异步job
// agenda.define('Async Job', function (job, done) {
//   doSomelengthyTask(function (data) {
//     console.log('new play Async Job')
//     var nowTime = showTime()
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

// sendEmail every 1 hours
agenda.define('sendEmail every hour', function (job, done) {
  var data = job.attrs.data
  var nowTime = new Date()
  var _temData = Object.assign({}, data, {
    nowTime: nowTime
  })
  // console.log('每秒触发:\n')
  // console.log(_temData)
  var sendContent = {
    from: '"管理员-梅敏君" <13265678360@163.com>', // 发件箱地址
    to: data.to, // 收件箱地址
    subject: data.subject, // 主题
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: rendHtml(_temData) // html body
  }
  // sendContent.html += `<h1>${nowTime}</h1>`
  email.sendMail(sendContent, done) // 发送邮件
  console.log('每小时邮件触发成功！')
})

// 每天发送邮件
agenda.define('sendEmail every day', function (job, done) {
  var data = job.attrs.data
  var nowTime = new Date()
  var _temData = Object.assign({}, data, {
    nowTime: nowTime
  })
  var sendContent = {
    from: '"管理员-梅敏君" <13265678360@163.com>', // 发件箱地址
    to: data.to, // 收件箱地址
    subject: data.subject, // 主题
    // 发送text或者html格式
    // text: 'Hello world?', // plain text body
    html: rendHtml(_temData) // html body
  }
  email.sendMail(sendContent, done) // 发送邮件
  console.log('每天邮件触发成功！')
})

agenda.on('ready', function () {
  agenda.every(type.h, 'sendEmail every hour', {subject: '每小时触发', to: to}, {timezone: 'Asia/Shanghai'})
  agenda.every(type.d, 'sendEmail every day', {subject: '每天定点邮件', to: to}, {timezone: 'Asia/Shanghai'})
  agenda.purge((err, numRemoved) => {
    console.log('旧任务被移除: ', numRemoved)
  })
  agenda.start()
})
