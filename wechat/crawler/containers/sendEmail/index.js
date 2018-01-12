// 时间举例：https://github.com/matthewmueller/date#examples
//
var agenda = require('../../../tools/clocking/agendaScedule.js').agenda
var moment = require('moment-timezone')
var email = require('../../../tools/email/index.js')

function showTime () {
  var nowTime = new Date()
  var zhongguo = moment().tz('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
  var result = '当前时间:' + zhongguo
  console.log('服务器时间:' + nowTime)
  console.log('中国时间:' + result)
  return result
}

// 异步job
agenda.define('Async Job', function (job, done) {
  doSomelengthyTask(function (data) {
    console.log('new play Async Job')
    var nowTime = showTime()
    console.log(nowTime)
    done()
  })
})

function doSomelengthyTask (callback) {
  callback()
}

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
  console.log(sendContent)
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
  agenda.every('2 seconds', 'Async Job', {}, {timezone: 'Asia/Shanghai'})
  agenda.every('1 hours', 'sendEmail every hours', {}, {timezone: 'Asia/Shanghai'})
  agenda.every('at 9:30', 'sendEmail every day', {}, {timezone: 'Asia/Shanghai'})
  // agenda.purge((err, numRemoved) => {
  //   console.log('旧任务被移除: ', numRemoved)
  // })
  agenda.start()
})
