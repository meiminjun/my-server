// 时间举例：https://github.com/matthewmueller/date#examples
// agenda api: https://www.npmjs.com/package/agenda
// 周期规则：https://www.npmjs.com/package/cron
var fs = require('fs')
var path = require('path')
var agenda = require('../../../tools/clocking/agendaScedule.js').agenda
var moment = require('moment-timezone')
var email = require('../../../tools/email/index.js')
var ejs = require('ejs')

var jindong = require('../fund/jindong.js')

var to = '13265678360@163.com'
const template = ejs.compile(fs.readFileSync(path.resolve(__dirname, 'email-template.ejs'), 'utf8'))

function rendHtml (data) {
  const html = template(Object.assign({}, data))
  return html
}

var type = {
  s: '0-59 * * * * *', // 每秒触发
  m: '0 * * * * *', // 每分钟触发
  h: '0 0 * * * *', // 每小时触发
  d: '00 30 12 * * *', // 每天的早上9点30分0秒触发
  d1: '00 30 12 * * 1-5', // 每天的早上9点30分0秒触发,除了周六、周日
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
//     done()
//   })
// })

function doSomelengthyTask (callback) {
  callback()
}

// 同步方法
// agenda.define('Sync Job', function (job) {
//   var nowTime = new Date()
//   console.log('sendEmail')
//   console.log(nowTime)
// })

// sendEmail every 1 hours
// agenda.define('sendEmail every hour', function (job, done) {
//   var data = job.attrs.data
//   var now = moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
//   console.log(data)
//   var _temData = Object.assign({}, data, {
//     nowTime: now
//   })
//   var sendContent = {
//     from: '"管理员-梅敏君" <13265678360@163.com>', // 发件箱地址
//     to: data.to, // 收件箱地址
//     subject: data.subject + '-' + now, // 主题
//     html: rendHtml(_temData) // html body
//   }
//   email.sendMail(sendContent, done) // 发送邮件
//   console.log('测试邮件发送成功！')
// })

// 每天发送邮件
agenda.define('sendEmail every day', function (job, done) {
  var data = job.attrs.data
  var now = moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
  console.log(data)
  var _temData = Object.assign({}, data, {
    nowTime: now
  })
  var sendContent = {
    from: '"管理员-梅敏君" <13265678360@163.com>', // 发件箱地址
    to: data.to, // 收件箱地址
    subject: data.subject + '-' + now, // 主题
    html: rendHtml(_temData) // html body
  }
  email.sendMail(sendContent, done) // 发送邮件
  console.log('每天邮件触发成功！')
})

agenda.on('ready', async function () {
  agenda.purge((err, numRemoved) => {
    console.log('旧任务被移除: ', numRemoved)
  })
  var contentData = await jindong.getdata()
  // console.log('测试数据')
  // console.log(contentData)
  // agenda.every(type.s, 'sendEmail every hour', {subject: '测试触发', to: to, contentData: contentData}, {timezone: 'Asia/Shanghai'}) // 必须连接本地数据库测试
  // agenda.every(type.h, 'sendEmail every hour', {subject: '每天小时出发', to: to, contentData: contentData}, {timezone: 'Asia/Shanghai'})
  agenda.every(type.d, 'sendEmail every day', {subject: '每日投资邮件', to: to, contentData: contentData}, {timezone: 'Asia/Shanghai'})
  agenda.start()
})
