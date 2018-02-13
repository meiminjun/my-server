var shell = require('shelljs')
var env = process.env.NAME

console.log('环境变量' + env)

if (env === 'wechat') {
    shell.exec('nodemon ./containers/example/index.js')
    console.log('启动wechat成功')
} else if (env === 'koa') {
    shell.exec('nodemon ./koaserver/index.js')
    console.log('启动koa成功')
}

// var logDir = './logs/'
// shell.rm('-f', logDir);