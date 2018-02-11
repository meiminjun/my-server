var mkdirp = require('mkdirp');
var path = require('path');
function mkdir (folder) {
  var dist = path.resolve(__dirname,'../dist')
  mkdirp(dist + '/' + folder, function (err) {
      if (err) console.error(err)
      else console.log('pow!')
  });
}

mkdir('i am mkdir folder')
