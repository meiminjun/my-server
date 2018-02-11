# 大数据服务

参考: `https://cnodejs.org/topic/57c529cf9b447b634391c814`

## 量化投资软件

* 获取数据源
* 添加定时发送邮箱
* 解决服务器时区问题
* 添加邮箱模板和html渲染引擎
  * `https://github.com/leemunroe/responsive-html-email-template`
  * `https://foundation.zurb.com/emails/docs/css-guide.html`

### 京东大数据热度表

> db.jindong_redu.find().pretty()

### 雪球网

### 蛋卷基金

## 相关文档

### moment

* api: `http://momentjs.cn/docs/#/parsing/utc/`
* 国际时间转换：`https://tpu.thinkpower.com.tw/tpu/File/html/201711/20171120111236_f.html?f=3dj6j8kd38895ksgtdddd93865jhr9sn3rqkh`

``` bash
 * moment(),获取当前时间
 * moment(string)把字符串变成moment时间格式
 * moment().format("YYYY-MM-DD HH:mm:ss"):规定时间格式为YYYY-MM-DD HH:mm:ss
 * moment().format("YYYY-MM-DD"):只获取年月日
 * moment().format("HH:mm:ss")：只获取时间
 * moment().add(days, 'day')加days天
 * moment().subtract(days, 'day') 见days天
 * moment().add(month, 'month')加month月
 * moment().add(1, 'minutes'加1分钟
 * 設定Default時區用法：moment.tz.setDefault("Asia/Shanghai")
 * moment.tz("Asia/Jakarta").format("YYYY/MM/DD HH:mm")  UTC時間轉為當地時間用法
 * moment.utc().format("YYYY/MM/DD HH:mmZ") 取得UTC時間用法
```

### 发邮件和周期规则

// 周期规则：`https://www.npmjs.com/package/cron`
// agenda api: `https://www.npmjs.com/package/agenda`
// 时间举例：`https://github.com/matthewmueller/date#examples`
