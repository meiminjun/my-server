// 参考：https://fundh5.jd.com/static/platformtrade/fund/smartReport/views/heat.html?utm_source=Android&utm_term=wxfriends  // 京东金融

const connectDB = require('./store/mongo.js').connectDB
const request = require('../../untils/request.js')
// var utils = require('../../untils')
const DBNAME = 'mongodb://localhost:27017/Fund'
// const DBNAME = 'mongodb://65.49.197.35:27017/Fund'

// var moment = require('moment')
var moment = require('moment-timezone')

var timezone = 'Asia/Shanghai'
// moment.tz.setDefault('Asia/Shanghai')

var myDb
var collection

var getData = async function () {
  var basicUrl = 'https://ms.jr.jd.com/gw/generic/pc_jj/h5/m/getDegreeInfo?reqData={"source":"smartH5"}' // 基础信息请求
  // var yesterday = moment().subtract('1', 'day').tz(timezone).format('YYYY.MM.DD')
  // console.log(yesterday)
  var res = await request.getInterfaceData(basicUrl)
  if (res.resultCode === 0 && res.resultData.status === 'SUCCESS') {
    var datas = res.resultData.datas
    if (!myDb) {
      myDb = await connectDB(DBNAME)
    }
    if (myDb !== -1) {
      let collection = await openCollection(myDb, 'jindong_redu')
      if (collection !== -1) {
        var items = await findData(collection, { 'degreeDate': datas.degreeDate })
        if (items.length > 0) {
          myDb.close()
          console.log('已存在')
          return Promise.resolve(datas)
        } else {
          await insertData(collection, datas) // 京东热度表
          return Promise.resolve(datas)
          myDb.close()
        }
      } else {
        return Promise.reject('表连接失败！')
      }
    } else {
      return Promise.reject('数据库连接失败！')
    }
  }
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
let saveDataToCollection = (collection, data) => {
  return new Promise((resolve, reject) => {
    collection.save(data, (err, result) => {
      if (err) {
        reject(err)
        console.log('数据存入集合失败')
      } else {
        resolve(result)
        console.log('数据存入成功')
      }
    })
  })
}

// 查询数据
let findCollection = function (collection, data, query) {
  return new Promise((resolve, reject) => {
    collection.find(data || {}, query).toArray(function (err, docs) {
      if (err) {
        console.log(err)
        reject(err)
      }
      // console.log('Found the following records')
      resolve(docs)
    })
    // if (result) {
    //   // console.log(result)
    //   // console.log('获取成功')
    //   resolve(result)
    // } else {

    // }
    // var result = typeof data !== 'undefined' ? collection.find(data) : collection.find()
    // console.log(result);
    // if (require)
  })
}

// 执行插入数据的函数
let insertData = async function (collection, data) {
  return await saveDataToCollection(collection, data)
}

let findData = async function (collection, data, query) {
  return await findCollection(collection, data, query)
}

// let start = async function () {

//   // getData().then((data) => {
//   //   // console.log(data)
//   //   return data
//   // }) // 详情数据整合
// }

// exports function async start () {
//   var data = await getData()
//   return data;
// }

var start = async function () {
  var data = await getData()
  return data;
}

module.exports = {
  getdata: start
}

// start().then((res) => {
//   console.log(res)
// })
