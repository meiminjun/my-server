const https = require('https');
const fs = require('fs');
const cheerio = require('cheerio');
// const MongoClient = require('mongodb').MongoClient;
// const DB_CONN_STR = 'mongodb://localhost:27017/xueqiuDB';

const dataSavePath = './xueqiuData'; // 文章存放路径

const fetchLimit = process.argv[2] || 2; // 数量限制

// 创建所需文件夹
if (!fs.existsSync(dataSavePath)) {
    fs.mkdirSync(dataSavePath);
}

// 计数器
let fetched = 0;
// 当前页码
let page = 1;
// 数据index
let count = 20;
let token = '';
// 连接失败最大重连次数
let limitNum = 10;
let myDb;
// 存入数据库的数据计数
let aa = 0;


// 首次登陆时访问首页获取 token
let getToken = () => {
    return new Promise((resolve, reject) => {
        https.get('https://www.xueqiu.com', (res) => {
            if (res.statusCode === 200) {
                console.log(res.headers)
                //resolve(res.headers['set-cookie']);
                token = res.headers['set-cookie'][1].split(/;/)[0] + ';';
                resolve(token);
            } else {
                console.log('获取 token 失败，' + res.statusCode);
                reject(res.statusCode);
            }
        });
    });
};

// 获取页面上的所有用户数据
let getPage = (token) => {
    return new Promise((resolve, reject) => {
        let client = https.get({
            hostname: 'xueqiu.com',
            path: `/cubes/discover/rank/cube/list.json?market=cn&sale_flag=0&stock_positions=0&sort=best_benefit&category=12&profit=annualized_gain_rate&page=${page}&count=${count}`,
            headers: {
                'Cookie': token,
                'Referer': 'https://xueqiu.com/p/discover?action=money&market=cn&profit=annualized_gain_rate'
            }
        }, (res) => {
            if (res.statusCode === 302) {
                client.abort();
            }
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            // console.log(rawData)
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    // console.log('解析数据')
                    // console.log(parsedData);
                    resolve(parsedData.list);
                    console.log(`第 ${page} 页数据获取完成，将存入数据库`);
                    page++;
                } catch (e) {
                    console.log(`获取第 ${page} 页用户信息失败`);
                }
                fetched++;
            });
        }).on('error', (err) => {
            reject(err);
            console.log('pageError: ' + err);
        });
    });
};

// --------------------------基金详情-------------------------------
/**
 * 获取基金详情页面数据
 * @param  {[type]} token [description]
 * @param  {[type]} code  [description]
 * @param  {[type]} limit [description]
 * @return {[type]}       [description]
 */
let getFundDetailPage = async function(code) {
    var fundDetail = {};
    let pageUrl = `https://xueqiu.com/S/${code}`;
    // 获取页面数据并用 cheerio 处理
    let $ = await getData(pageUrl);
    var fundName = $('.stock-name').text().trim(); // 基金名称
    var stockCurrent = $('.stock-current').children('strong').text().trim() // 基金当前净值
    var stockChange = $('.stock-change').text().trim() // 当前涨跌幅
    var arr = []
    // console.log($('.quote-info').children('tr').eq(0).children('td'))
    $('.quote-info').children('tr').eq(0).children('td').each((index, item) => {
        var value = $(item).children('span').text()
        arr.push(value)
    })
    var oneMonth = arr[0];
    var threeMonth = arr[1];
    var sixMonth = arr[2];
    var oneYear = arr[3];
    var ratingAgencies = $('.rank-value').text().trim() // 机构评级
    Object.assign(fundDetail, {
        fundName,
        stockCurrent,
        stockChange,
        arr
    })
    // console.log(fundDetail);
    return fundDetail;
}

/**
 * 获取基金详情（图表）
 * @param  {[type]} token [description]
 * @param  {[type]} code  [description]
 * @param  {[type]} limit [description]
 * @return {[type]}       [description]
 */
let getFundDetail = async function(token, code, limit) {
    return new Promise((resolve, reject) => {
        let client = https.get({
            hostname: 'fund.xueqiu.com',
            path: `/dj/open/fund/growth/${code}.json?day=${limit}`,
            headers: {
                'Cookie': token
                // 'Referer': 'https://xueqiu.com/p/discover?action=money&market=cn&profit=annualized_gain_rate'
            }
        }, (res) => {
            if (res.statusCode === 302) {
                client.abort();
            }
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    // console.log('解析数据')
                    // console.log(parsedData);
                    resolve(parsedData);
                    // console.log(`第 ${page} 页数据获取完成，将存入数据库`);
                    // page++;
                } catch (e) {
                    // console.log(`获取第 ${page} 页用户信息失败`);
                }
                // fetched++;
            });
        })
    });
}

// --------------------------股票-------------------------------
// 获取股票详情
let getStockDetail = async function(token, code) {
    return new Promise((resolve, reject) => {
        let client = https.get({
            hostname: 'xueqiu.com',
            path: `/stock/forchart/stocklist.json?symbol=${code}&period=5d`,
            headers: {
                'Cookie': token
                // 'Referer': 'https://xueqiu.com/p/discover?action=money&market=cn&profit=annualized_gain_rate'
            }
        }, (res) => {
            if (res.statusCode === 302) {
                client.abort();
            }
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    // console.log('解析数据')
                    console.log(parsedData);
                    resolve(parsedData);
                    // console.log(`第 ${page} 页数据获取完成，将存入数据库`);
                    // page++;
                } catch (e) {
                    // console.log(`获取第 ${page} 页用户信息失败`);
                }
                // fetched++;
            });
        })
    });
}

// 获取每个用户的股票数据
let getData = async function(pageUrl) {
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
// --------------------------------------------------
// 抓取投资股票大神的股票
// let start = async function() {
//     let token = await getToken();
//     console.log('token: ' + token);
//     while (fetched < fetchLimit) {
//         let pageUrlList = await getPage(token);
//         for (let i = 0; i < pageUrlList.length; i++) {
//             let pageUrl = 'https://xueqiu.com' + '/P/' + pageUrlList[i].symbol;
//             // 获取页面数据并用 cheerio 处理
//             let $ = await getData(pageUrl);
//             await savedContent($);
//         }
//     }
//     console.log(`${fetched} 页数据获取完成`);
// };

//
let start = async function() {
    let token = await getToken();
    console.log('token: ' + token);
    // let detail = await getStockDetail(token, 'SZ150052') // 获取某个股票详情
    // let detail = await getFundDetail(token, '000950', '180') // 获取某个基金详情: 30/60/180/360
    let detailPage = await getFundDetailPage('F000950') // 获取某个基金详情页面dom
    console.log(detailPage)
};

// 打开数据集合
let openCollection = (db, collectionName) => {
    return new Promise((resolve, reject) => {
        db.collection(collectionName, {safe: true}, function(err,collection) {
            if(!err){
                resolve(collection);
            } else{
                console.log('连接数据集合失败');
                reject(-1);
            }
        });
    });
};

// 数据存入数据库
let saveDataToCollection = (data, collection) => {
    return new Promise((resolve, reject) => {
        collection.save(data, (err, result) => {
            if (err) {
                reject(err);
                console.log('数据存入集合失败');
            } else {
                resolve(result);
                aa++;
                console.log('数据存入成功' + aa);
            }
        });
    });
};

// 连接数据库
let connectDB = (dbName) => {
    return new Promise((resolve, reject) => {
        MongoClient.connect(dbName, (err, db) => {
            if (err) {
                console.log('连接数据库失败：', + err);
                return reject(-1);
            } else {
                resolve(db);
            }
        });
    });

};

// 执行插入数据的函数
let insertData = async function(data, db) {
    // 连接到表 site
    let collection = await openCollection(db, 'site');
    if (collection !== -1) {
        await saveDataToCollection(data, collection);
    } else {
        if (limitNum > 0) {
            console.log('重新连接数据集合');
            limitNum--;
            await insertData(data, db);
        } else {
            console.log('重新连接数据集合失败');
            limitNum = 10;
        }
    }
};

// 保存内容
let savedContent = async function($) {
    await $('.stock').each(async function(index, item) {
        let stockId = $(item).attr('href').substring(3);
        let stockName = $(item).children('.stock-name').children('.name').text().trim();


        let x = '   ' + stockName + '--' + stockId + '\n';
        console.log(x)
        // if (stockName && stockId) {
        //     if (!myDb) {
        //         myDb = await connectDB(DB_CONN_STR);
        //     }
        //     if (myDb !== -1) {
        //         await insertData({
        //             "股票名称": stockName,
        //             "股票代码": stockId,
        //         }, myDb);
        //     }
        // }
    });
};

console.log(`即将抓取 ${fetchLimit} 页数据`);

start();
