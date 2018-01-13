// 参考：https://danjuanapp.com/djmodule/value-center // 蛋卷基金每日估值排行
// https://danjuanapp.com/rank/index // 排行
const https = require('https')
// const fs = require('fs')
const cheerio = require('cheerio')
const connectDB = require('./store/mongo.js').connectDB

const DBNAME = 'mongodb://localhost:27017/Fund'

var myDb
var aa = 0
var itemsLen = 0
// 获取页面dom
let getPageDom = async function (pageUrl) {
  return new Promise((resolve, reject) => {
    let client = https.get(pageUrl, (res) => {
      if (res.statusCode !== 200) {
        console.log('网页连接错误：' + res.statusCode)
        client.abort()
        reject(res.statusCode)
      }
      let html = ''
      res.setEncoding('utf-8')
      res.on('data', (chunk) => {
        html += chunk
      })
      res.on('end', async function () {
        if (html) {
          const $ = cheerio.load(html)
          resolve($)
        }
      })
    }).on('error', (err) => {
      reject(err)
      console.log('获取用户数据失败: ' + err)
    })
  })
}

// 获取接口数据
let getInterfaceData = async function (url) {
  return new Promise((resolve, reject) => {
    let client = https.get(url, (res) => {
      if (res.statusCode === 302) {
        client.abort()
      }
      let rawData = ''
      res.on('data', (chunk) => {
        rawData += chunk
      })
      res.on('end', () => {
        try {
          let parsedData = JSON.parse(rawData)
          resolve(parsedData)
        } catch (e) {
          console.log(`获取接口数据失败`)
          reject(e)
        }
      })
    })
  })
}

var fundDetailData = async function (code) {
  if (!code) return false
  var code = code
  var basicUrl = `https://danjuanapp.com/djapi/fund/${code}` // 基础信息请求
  var yejibiaoxian = `https://danjuanapp.com/djapi/fund/derived/${code}` // 业绩表现请求
  var dangan = `https://danjuanapp.com/djapi/fund/detail/${code}` // 基金档案
  var chart = `https://danjuanapp.com/djapi/fund/nav-growth/${code}?day=360` // 图表数据
  var basicData = await getInterfaceData(basicUrl)
  var yejibiaoxian = await getInterfaceData(yejibiaoxian)
  var dangan = await getInterfaceData(dangan)
  var chart = await getInterfaceData(chart)

  return Promise.resolve({
    basicData,
    yejibiaoxian,
    dangan,
    chart
  })
}

/**
 * 获取详情页面数据
 * @param  {[type]} token [description]
 * @param  {[type]} code  [description]
 * @param  {[type]} limit [description]
 * @return {[type]}       [description]
 */
let getPageData = async function () {
  var fundDetail = {}
  let pageUrl = 'https://danjuanapp.com/djmodule/value-center'
    // 获取页面数据并用 cheerio 处理
  let $ = await getPageDom(pageUrl)
  console.log($('body').html())
    // Object.assign(fundDetail, {
    //     fundName,
    //     stockCurrent,
    //     stockChange,
    //     arr
    // })
    // console.log(fundDetail);
  return fundDetail
}

var fundInterFace = {
  // 免费指数
  '1001': 'https://danjuanapp.com/djapi/v3/filter/fund?type=1001&order_by=td&size=20&page=1',
  // 宽基指数
  '1002': 'https://danjuanapp.com/djapi/v3/filter/fund?type=1002&order_by=td&size=20&page=1',
   // 指数增强
  '1003': 'https://danjuanapp.com/djapi/v3/filter/fund?type=1003&order_by=td&size=20&page=1',
  // 行业指数
  '1004': 'https://danjuanapp.com/djapi/v3/filter/fund?type=1004&order_by=td&size=20&page=1',
  // 海外指数
  '1005': 'https://danjuanapp.com/djapi/v3/filter/fund?type=1005&order_by=td&size=20&page=1'
}

// 遍历数据
var eachFun = async function () {
  let getInterface = await getInterfaceData(fundInterFace['1004']) // 提取接口数据
  // console.log(getInterface.data.items)
  var items = getInterface.data.items
  itemsLen = items.length
  console.log('基金总数为:' + itemsLen)
  items.forEach(async (item, index) => {
    console.log(item.fd_name) // 基金名称
    console.log(item.fd_code) // 基金代码
    let detail = await fundDetailData(item.fd_code) // 获取单个基金详情数据
    // console.log(detail)
    if (!myDb) {
      myDb = await connectDB(DBNAME)
    }
    if (myDb !== -1) {
      await insertData({
        '基金代码': item.fd_code,
        '基金名称': item.fd_name
      }, myDb, 'fund_zhishu_paimin')
    }
  })
}

// 打开数据集合
let openCollection = (db, collectionName) => {
  return new Promise((resolve, reject) => {
    db.collection(collectionName, {safe: true}, function (err, collection) {
      if (!err) {
        resolve(collection)
      } else {
        console.log('连接数据集合失败')
        reject(-1)
      }
    })
  })
}

// 数据存入数据库
let saveDataToCollection = (data, collection) => {
  return new Promise((resolve, reject) => {
    collection.save(data, (err, result) => {
      if (err) {
        reject(err)
        console.log('数据存入集合失败')
      } else {
        resolve(result)
        aa++
        console.log('数据存入成功' + aa)
        if (aa === itemsLen) {
          console.log('数据存入完成！')
          process.exit(0)
        }
      }
    })
  })
}

// 执行插入数据的函数
let insertData = async function (data, db, siteName) {
    // 连接到表 site
  let collection = await openCollection(db, siteName)
  if (collection !== -1) {
    await saveDataToCollection(data, collection)
  } else {
    console.log('连接集合失败!')
  }
}

let start = async function () {
    // let getPageData = getPageData() // 提取页面DOM的集合数据
    // console.log(getPageData)
    // let getInterface = await getInterfaceData(fundInterFace['1004']) // 提取接口数据
    // let detail = await fundDetailData('160717'); // 详情数据整合
    // console.log(detail);
  eachFun()
}

start()
