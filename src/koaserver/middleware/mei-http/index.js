const https = require('https')

module.exports = () => {
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

    let getPageDom = function async(pageUrl) {
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

    return async (ctx, next) => {
        ctx.getData = getInterfaceData;
        ctx.getDom = getPageDom;
        // 调用ctx上的log方法下的error方法打印日志
        ctx.log.error('ikcamp');
        await next()
    }
}
