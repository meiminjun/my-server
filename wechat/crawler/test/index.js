var Crawler = require('crawler')
// var jsdom = require('jsdom')

var fs = require('fs')
var path = require('path')
var mei = require('../untils/mei.js')

console.log(mei)

function write_json(book){
  var content =  JSON.stringify(book, null, 2); // Indented 4 spaces
  fs.writeFile(path.resolve(__dirname, './dist/book.json'), content, function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}

var current_book = { }

var c = new Crawler({
  jQuery: 'cheerio',
  maxConnections: 100,
  forceUTF8: true,
  // incomingEncoding: 'gb2312',
    // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      // console.log(error)
      return
    }
    var $ = res.$
    var urls = $('#list a')
    // console.log(urls)
    current_book.title = $('#maininfo h1').text()
    current_book.author = $('#info p').eq(0).text()
    current_book.update_time = $('#info p').eq(2).text()
    current_book.latest_chapter = $('#info p').eq(3).html()
    current_book.intro = $('#intro').html()
    current_book.chapters = []

    for (var i = 0; i < urls.length; i++) {
      var url = urls[i]
      var _url = $(url).attr('href') + ''
      var num = _url.replace('.html', '')
      var title = $(url).text()
      current_book.chapters.push({
        num: num,
        title: title,
        url: _url
      })
    }
    write_json(current_book)
    // console.log(current_book)
    done()
  }
})

c.queue('http://www.biquku.com/0/330/')

var chapter = { num: '5044087', title: '第一千两百五十二章 现世！', url: '5044087.html' }

c.queue([{
  uri: 'http://www.37zw.net/0/330/' + chapter.num + '.html',
  jQuery: 'cheerio',
  forceUTF8: true,
  // incomingEncoding: 'UTF-16',
  // The global callback won't be called
  callback: function (error, res, done) {
    if (error) {
      // console.log(error)
      return
    }
    var $ = res.$
    var content = $('#content').text()
    console.log(content)
    done()
  }
}])
