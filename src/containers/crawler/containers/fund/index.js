var Crawler = require('crawler')

var fs = require('fs')
var path = require('path')
var mei = require('../../untils/mei.min.js')
var utils = require('../../untils')
var jsdom = require('jsdom');
var iconv = require('iconv-lite')

var json = {
  code: '000000',
  data: {
    time: '',
    shangzheng: {
      value: '3000',
      gains: '+20%'
    },
    husheng300: {
      value: '4000',
      gains: '-30%'
    },
    chuangye: {
      value: '1789.24',
      gains: '-30%'
    },
    fundRankings: [{
      fundcode: '960001',
      fundname: '腾安定投宝',
      latestNet: '0.814 ',
      yield: '+30%',
      rating: '晨星4级'
    },{
      fundcode: 'SZ150224',
      fundname: '证券B级',
      latestNet: '0.791',
      yield: '+2.51%',
      rating: '晨星4级'
    },{
      fundcode: '960001',
      fundname: '腾安定投宝',
      latestNet: '0.814 ',
      yield: '+30%',
      rating: '晨星4级'
    },{
      fundcode: '960001',
      fundname: '腾安定投宝',
      latestNet: '0.814 ',
      yield: '+30%',
      rating: '晨星4级'
    },{
      fundcode: '960001',
      fundname: '腾安定投宝',
      latestNet: '0.814 ',
      yield: '+30%',
      rating: '晨星4级'
    }]
  }
}

// var c = new Crawler({
//   maxConnections: 100,
//   forceUTF8: true,
//   callback: function (error, res, done) {
//     if (error) {
//       console.log(error)
//       return
//     }
//     var $ = res.$
//   }
// })

var c = new Crawler({
  maxConnections: 10000,
  timeout: 100000,
  // jQuery: 'cheerio',
  jQuery: 'cheerio',
  forceUTF8: true,
  incomingEncoding:'utf-8',
  callback: function (error, res, done) {
    if (error) {
      console.log(error)
      return
    }
    var $ = res.$
    console.log(res.body);
    console.log($('#dbtable tbody').html())
    // console.log($('#dbtable').html());
    // console.log(iconv.decode($.html(), 'gb2312'))
    // var html = iconv.decode(res, 'gb2312')
    // var $ = res.$.load(res.$('body'), {decodeEntities: false})
    // console.log($.html());
  }
})

var url = 'http://fund.eastmoney.com/data/fundranking.html#tzs;c0;r;szzf;pn50;ddesc;qsd20170103;qed20180103;qdii;zq;gg;gzbd;gzfs;bbzt;sfbb' // 雪球

var url = 'http://fund.eastmoney.com/data/fundranking.html#tzs;c0;r;szzf;pn50;ddesc;qsd20170103;qed20180103;qdii;zq;gg;gzbd;gzfs;bbzt;sfbb' // 晨星

function start(url){
  c.queue('');
}

start();
