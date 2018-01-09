// *  *  *  *  *  *
// ┬ ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │  |
// │ │ │ │ │ └ day of week (0 - 7) (0 or 7 is Sun)
// │ │ │ │ └───── month (1 - 12)
// │ │ │ └────────── day of month (1 - 31)
// │ │ └─────────────── hour (0 - 23)
// │ └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

var schedule = require('node-schedule') // 定时任务模块

// var type = {
//   s: '0-59 * * * * *', // 每秒触发
//   m: '0 * * * * *', // 每分钟触发
//   h: '0 0 * * * *', // 每小时触发
//   d: '0 30 9 * * *', // 每天的早上9点30分0秒触发
//   m1: '0 30 12 25-31 * *', // 每月的25至31日12点30分0秒触发
//   o: new Date(2018, 0, 9, 22, 53, 0) // 2018年的1月9日22点49分0秒触发, 注意月份要+1,执行完成后会终止进程
// }

// 每秒都触发
function scheduleCronstyle (t, callback) {
  return schedule.scheduleJob(t, function () {
    var nowTime = new Date()
    console.log('scheduleCronstyle:' + nowTime)
    callback && callback(nowTime)
  })
}

// var r = scheduleCronstyle(type.h) // 开始定时任务

// r.cancel() // 停止定时任务

module.exports = {
  scheduleCronstyle
}
