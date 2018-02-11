const funService = require('../service/fund')
module.exports = {
    // 获取基金详情
    getFundDetail: async (ctx, next) => {
        var params = ctx.params;
        var code = params.code || '';
        if (!code) {
            ctx.response.body = '<h1>入参不正确</h1>'
            return;
        }
        var basicUrl = `https://danjuanapp.com/djapi/fund/${code}` // 基础信息请求
        var basicData = await ctx.getData(basicUrl)
        // console.log(basicData)
        ctx.send(basicData);
    },
    // 获取基金历史数据
    getFundHistory: async (ctx, next) => {
        var params = ctx.params;
        var day = params.day || '';
        var code = params.code || '';
        if (!day || !code) {
            ctx.response.body = '<h1>入参不正确</h1>'
            return;
        }
        var chartUrl = `https://danjuanapp.com/djapi/fund/nav-growth/${code}?day=${day}` // 图表数据
        var chartData = await ctx.getData(chartUrl)
        ctx.send(chartData)
    },
    // 获取基金业绩
    getFundPerformance: async (ctx, next) => {
        var params = ctx.params;
        var code = params.code || '';
        if (!code) {
            ctx.response.body = '<h1>入参不正确</h1>'
            return;
        }
        var url = `https://danjuanapp.com/djapi/fund/derived/${code}`
        var data = await ctx.getData(url)
        ctx.send(data)
    },
    // 获取基金档案
    getFundArchives: async (ctx, next) => {
        var params = ctx.params;
        var code = params.code || '';
        if (!code) {
            ctx.response.body = '<h1>入参不正确</h1>'
            return;
        }
        var url = `https://danjuanapp.com/djapi/fund/detail/${code}` // 基金档案
        var data = await ctx.getData(url)
        ctx.send(data)
    }
}
