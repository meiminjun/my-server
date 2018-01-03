var Crawler = require('crawler')

var fs = require('fs')
var path = require('path')
var mei = require('../../untils/mei.min.js')
var utils = require('../../untils')

// function write_json(book){
//   var content =  JSON.stringify(book, null, 2); // Indented 4 spaces
//   fs.writeFile(path.resolve(__dirname, './dist/book.json'), content, function (err) {
//     if (err) throw err;
//     console.log('It\'s saved!');
//   });
// }

var current_book = { }
utils.mkdir('test/0/330');
var c = new Crawler({
  jQuery: 'cheerio',
  maxConnections: 100,
  forceUTF8: true,
  // incomingEncoding: 'gb2312',
    // This will be called for each crawled page
  callback: function (error, res, done) {
    if (error) {
      console.log(error)
      return
    }
    console.log(1111);
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
    utils.write_config(current_book);
    // write_json(current_book)
    console.log(current_book)
    // done()
    var chapter = { num: '5044087', title: '第一千两百五十二章 现世！', url: '5044087.html' }
    one(chapter);
  }
})

function one(chapter){
  console.log(chapter)
  c.queue([{
    uri: 'http://www.37zw.net/0/330/' + chapter.num + '.html',
    // jQuery: jsdom,
    forceUTF8:true,
    // The global callback won't be called
    callback: function (error, res, done) {
      if (error) {
        return
      }
      var $ = res.$
      var content = $('#content').text()
      utils.write_chapter(chapter, content);
      done();
    }
  }]);
}


function start(){
  c.queue('http://www.biquku.com/0/330/');
}

start();

// c.queue([{
//   uri: 'http://www.37zw.net/0/330/' + chapter.num + '.html',
//   jQuery: 'cheerio',
//   forceUTF8: true,
//   // incomingEncoding: 'UTF-16',
//   // The global callback won't be called
//   callback: function (error, res, done) {
//     if (error) {
//       // console.log(error)
//       return
//     }
//     var $ = res.$
//     var content = $('#content').text()
//     // console.log(content)
//     done()
//   }
// }])
