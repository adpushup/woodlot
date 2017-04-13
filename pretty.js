//console.log('\x1b[33m%s\x1b[0m', 'test');


// var clc = require('cli-color');
// console.log(clc.red('Text in red'));

// var chalk = require('chalk');
 
// // style a string 
// var a = chalk.blue('Hello world!');
// console.log(a);

// const style = require('ansi-styles');

// console.log(`${style.green.open}Hello world!${style.green.close}`);



var testjson = JSON.stringify({"responseTime":"13ms","method":"GET","url":"/","ip":"::1","params":{},"query":{},"httpVersion":"1.1","statusCode":200,"timeStamp":"2017-04-13T13:45:38.036Z","contentType":"text/html; charset=utf-8","contentLength":"4","userAgent":"curl/7.43.0","referrer":null,"headers":{"host":"localhost:8000","user-agent":"curl/7.43.0","accept":"*/*"}}, null, 4);

//var test = 'test';
//var a = '\x1b[33m'+test+'\x1b[0m';

//console.log(testjson.substr(testjson.search('"statusCode"') + 14, 3));

var statusCodeIndex = testjson.match(/"statusCode": \d+/).index + 14;
console.log(testjson.substr(statusCodeIndex, 3));

//var a = testjson.replace(/"statusCode": \d+/, '"statusCode": \x1b[33m200\x1b[0m');
//console.log(a);

//console.log("{'a':'\u001b[33mtest\u001b[0m'}");







