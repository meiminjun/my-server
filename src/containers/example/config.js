var path = require('path')
var accessTokenFilePath = path.join(__dirname,'./static/access_token.json')

console.log(accessTokenFilePath);

module.exports = {
	"port": '80',
	"token": "wechat",
	"appID": "wx8225dac2e5ace4ba",
	"appSecret": "d135c9043c4522c86e3091d5f41b63da",
	"encodingAESKey": "SSNBctpE6wNWj25qxMWqenououodCdJJQAxvgM0VMLM",
	"apiDomain": "https://api.weixin.qq.com/",
	"accessTokenFilePath": accessTokenFilePath,
	// 图灵ApiKey
	"tulingApiKey": "65f46644fcc945eeb0c3ef55bf75b799",
	// 是否开启图灵机器人：1为开启，0为关闭
	"tulingActive": 1,
	// 管理员的openid todo
	"administrator": []
}