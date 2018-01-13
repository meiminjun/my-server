// 参考：http://www.lovebxm.com/2017/07/21/node-mail/
// https://juejin.im/post/5a21f89d51882561a20a47b5 // 掘金
'use strict'

const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  // host: 'smtp.163.com',
  // service: '163', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  // port: 465, // SMTP 端口
  // secureConnection: true, // 使用了 SSL
  service: '163',
  // service: 'qq',
  auth: {
    user: '13265678360@163.com', // 管理员账号
    // user: '251222845@qq.com', // 管理员账号
    // 这里密码不是密码，是你设置的smtp授权码
    // pass: 'mrjjjvoprbpccaaf' // qq 的授权密码
    pass: 'meiminjun1991' // 网易邮箱
  }
})

function sendMail (options, callback) {
  // send mail with defined transport object
  transporter.sendMail(options, (error, info) => {
    if (error) {
      return console.log(error)
    }
    console.log('Message sent: %s', info.messageId)
    callback()
    // Message sent: <04ec7731-cc68-1ef6-303c-61b0f796b78f@qq.com>
  })
}

module.exports = {
  sendMail
}
