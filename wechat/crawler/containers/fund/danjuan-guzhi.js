// 参考：https://danjuanapp.com/djmodule/value-center // 蛋卷基金每日估值排行
// https://danjuanapp.com/rank/index // 排行
const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');

// 获取页面dom
let getPageDom = async function(pageUrl) {
    return new Promise((resolve, reject) => {
        let client = https.get(pageUrl, (res) => {
            if (res.statusCode !== 200) {
                console.log('网页连接错误：' + res.statusCode);
                client.abort();
                reject(res.statusCode);
            }
            let html = '';
            res.setEncoding('utf-8');
            res.on('data', (chunk) => {
                html += chunk;
            });
            res.on('end', async function() {
                if (html) {
                    const $ = cheerio.load(html);
                    resolve($);
                }
            });
        }).on('error', (err) => {
            reject(err);
            console.log('获取用户数据失败: ' + err);
        });
    });
};

// 获取接口数据
let getInterfaceData = async function(url) {
  return new Promise((resolve, reject) => {
      let client = https.get(url, (res) => {
          if (res.statusCode === 302) {
              client.abort();
          }
          let rawData = '';
          res.on('data', (chunk) => {
              rawData += chunk;
          });
          console.log(rawData);
          res.on('end', () => {
              try {
                  let parsedData = JSON.parse(rawData);
                  // console.log('解析数据')
                  // console.log(parsedData);
                  resolve(parsedData);
              } catch (e) {
                  console.log(`获取接口数据失败`);
                  reject(e);
              }
          });
      })
  });
}

/**
 * 获取详情页面数据
 * @param  {[type]} token [description]
 * @param  {[type]} code  [description]
 * @param  {[type]} limit [description]
 * @return {[type]}       [description]
 */
let getPageData = async function() {
    var fundDetail = {};
    let pageUrl = 'https://danjuanapp.com/djmodule/value-center';
    // 获取页面数据并用 cheerio 处理
    let $ = await getPageDom(pageUrl);
    console.log($('body').html())
    // Object.assign(fundDetail, {
    //     fundName,
    //     stockCurrent,
    //     stockChange,
    //     arr
    // })
    // console.log(fundDetail);
    return fundDetail;
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

let start = async function() {
    // let getPageData = getPageData() // 提取页面DOM的集合数据
    // console.log(getPageData)
    let getInterface = await getInterfaceData(fundInterFace['1004']) // 提取接口数据
    console.log(getInterface)
};

start();
