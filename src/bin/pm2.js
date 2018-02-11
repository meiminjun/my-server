var pm2 = require('pm2');
// var shell = require('shelljs')

// var logDir = './logs/'
// shell.rm('-f', logDir);

pm2.connect(function (err) {
    if (err) {
        /* eslint-disable no-console */
        console.error(err);
        process.exit(2);
        /* eslint-enable no-console */
    }

    pm2.start('process.json', function (err, apps) {
        pm2.disconnect();   // Disconnect from PM2
        if (err) throw err;
    });
});