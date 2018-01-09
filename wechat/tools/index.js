// 定时任务+发邮件demo 测试

var clocking = require('./clocking/index.js')
var email = require('./email/index.js')
var type = {
  s: '0-59 * * * * *', // 每秒触发
  m: '0 * * * * *', // 每分钟触发
  h: '0 0 * * * *', // 每小时触发
  d: '0 30 9 * * *', // 每天的早上9点30分0秒触发
  m1: '0 30 12 25-31 * *', // 每月的25至31日12点30分0秒触发
  o: new Date(2018, 0, 9, 22, 53, 0) // 2018年的1月9日22点49分0秒触发, 注意月份要+1,执行完成后会终止进程
}

var config = {
  type
}

var sendContent = {
  from: '"管理员-梅敏君" <13265678360@163.com>', // 发件箱地址
  to: '251222845@qq.com', // 收件箱地址
  subject: 'Hello', // 主题
  // 发送text或者html格式
  // text: 'Hello world?', // plain text body
  html: '<h1>Hello world?</h1>' // html body
}

console.log('开始执行!')
// 每小时邮件触发
clocking.scheduleCronstyle(config.type.h, function (nowTime) {
  sendContent.subject = '每小时触发'
  sendContent.html += `<h1>${nowTime}</h1>`
  email.sendMail(sendContent) // 发送邮件
  console.log('每小时邮件触发成功！')
})

// 每天邮件触发
clocking.scheduleCronstyle(config.type.d, function (nowTime) {
  sendContent.subject = '每天的早上9点30分0秒触发'
  sendContent.html += `<h1>${nowTime}</h1>`
  email.sendMail(sendContent) // 发送邮件
  console.log('每天邮件触发成功！')
})
