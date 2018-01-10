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
var moment = require('moment-timezone');
var nowTime = new Date()
// var zhongguo1 = moment.tz("2018-01-10 12:00", "Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss');

// 每秒都触发
function scheduleCronstyle (t, callback) {
  return schedule.scheduleJob(t, function () {
    var nowTime = new Date()
    var zhongguo = moment().tz("Asia/Shanghai").format('YYYY-MM-DD HH:mm:ss');
    var result = '当前时间:' + zhongguo
    console.log('服务器时间:' + nowTime)
    callback && callback(result)
  })
}

// var r = scheduleCronstyle(type.h) // 开始定时任务

// r.cancel() // 停止定时任务

module.exports = {
  scheduleCronstyle
}
