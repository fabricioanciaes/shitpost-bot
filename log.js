var fs = require('fs');

function writeToLog(message) {
    fs.appendFile("store/log.txt", message + '\n', (err) => {
        if (err) {
            return console.log(err);
        }
        console.log("saved!");
    });
}