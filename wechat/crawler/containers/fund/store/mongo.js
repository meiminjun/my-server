const MongoClient = require('mongodb').MongoClient
// const DB_CONN_STR = 'mongodb://localhost:27017/'

let connectDB = (dbName) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(dbName, (err, db) => {
      if (err) {
        console.log('连接数据库失败：', +err)
        reject(-1)
      } else {
        resolve(db)
      }
    })
  })
}

module.exports = {
  connectDB
}
