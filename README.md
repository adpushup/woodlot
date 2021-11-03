<img src="https://raw.githubusercontent.com/adpushup/woodlot/master/icon.png" width="250" height="auto" alt="woodlot icon"/>

# woodlot [![npm version](https://badge.fury.io/js/woodlot.svg)](https://badge.fury.io/js/woodlot) [![NPM Downloads](https://img.shields.io/npm/dm/woodlot.svg?style=flat-square)](https://www.npmjs.com/package/woodlot) <span class="badge-patreon"><a href="https://www.patreon.com/arunmichaeldsouza" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-blue.svg" alt="Patreon donate button" /></a></span>

**WARNING:** This is my personal fork of woodlot and NOT the original.  This fork (1) updates the dependencies, (2) makes the steams optional if console is enabled, and (3) adds typescript definitions.  The badges above point to the original and not this fork.

An all-in-one JSON logging utility that supports ExpressJS HTTP logging, custom logging, provides multi-format output and an easy to use events API.

> * Works as an HTTP logging middleware with ``ExpressJS``
> * Support for custom logging with different logging levels
> * Provides log output in ``json`` format with request body/query params, headers and cookies
> * Support for Apache ``common`` and ``combined`` log formats as output
> * Multiple file stream support for log aggregation
> * Simple to use events API
> * Requires node >= ``0.10``

<br/>

## Installation

#### Using ``npm``

```javascript
npm install woodlot --save
```

#### Using ``yarn``

```javascript
yarn add woodlot
```

<br/>

## Usage

### As an ExpressJS middleware

The woodlot ``middlewareLogger`` can be hooked into the existing ``ExpressJS`` middleware chain and can be used to log all ``HTTP`` requests.

Example -

```javascript
var express = require('express');
var app = express();
var woodlot = require('woodlot').middlewareLogger;

app.use(woodlot({
    streams: ['./logs/app.log'],
    stdout: false,
    routes: {
        whitelist: ['/api', '/dashboard'],
        strictChecking: false
    },
    userAnalytics: {
        platform: true,
        country: true
    },
    format: {
        type: 'json',
        options: {
            cookies: true,
            headers: true,
            spacing: 4,
            separator: '\n'
        }
    }
}));
```

#### Options

#### ``streams {array} | required``
This is a required option that specifies the file stream endpoints where the generated logs will be saved. You can specify multiple streams using this option.

#### ``stdout {boolean} | Default: true``
It specifies whether the generated log entry should be logged to the standard output stream i.e. ``process.stdout`` or not.

#### ``routes {object}``
This option is used with the woodlot ``middlewareLogger``. It specifies all the routes (with checking mode) for which logging is to be enabled. By default, log entry is generated for all the routes.

##### ``whitelist {array}``
This option is used with the ``routes`` option to specify the route whitelist.

##### ``strictChecking {boolean} | Default: false``
This option is used with the ``routes`` option to specify the checking mode for the route whitelist.

```javascript
routes: {
    whitelist: ['/api'],
    strictChecking: false
}
```

For the above example, setting it to ``false`` will enable logging for all routes that have ``api`` in them. Example - ``/api``, ``/api/getUser``, ``/api/getUser/all``, ``/userapi`` etc.

Whereas, setting it to ``true`` will only enable logging for the ``/api`` route.

#### ``userAnalytics {object}``
Use this option to add user details to your logs.

##### ``platform {boolean} | Default: false``
Use this option with `userAnalytics`, to specify whether to include user `platform` info in the logs or not i.e. `browser`, `browserVersion`, `os`, and `osVersion`.

##### ``country {boolean} | Default: false``
Use this option with `userAnalytics`, to specify whether to include user `country` info in the logs or not i.e. `name` and `isoCode`.

The `userAnalytics` option will add the following info to your logs -

```javascript
"userAnalytics": {
    "browser": "Chrome",
    "browserVersion": "60.0.3112.90",
    "os": "Mac OS",
    "osVersion": "10.11.6",
    "country": {
        "name": "India",
        "isoCode": "IN"
    }
}
```

#### ``format {object}``
This option sets the log output format and other settings related to that particular format.

##### ``type {string} | Default: 'json'``
The default output format is ``json``. The ``middlewareLogger`` supports two more formats - [common](http://httpd.apache.org/docs/current/logs.html#common) and [combined](http://httpd.apache.org/docs/current/logs.html#combined), which are Apache's access log formats.

The generated output log for each format is as follows -

##### json

```javascript
{
    "responseTime": "4ms",
    "method": "GET",
    "url": "/api",
    "ip": "127.0.01",
    "body": {},
    "params": {},
    "query": {},
    "httpVersion": "1.1",
    "statusCode": 200,
    "timeStamp": "23/Apr/2017:20:46:01 +0000",
    "contentType": "text/html; charset=utf-8",
    "contentLength": "4",
    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36",
    "referrer": null,
    "userAnalytics": {
        "browser": "Chrome",
        "browserVersion": "60.0.3112.90",
        "os": "Mac OS",
        "osVersion": "10.11.6",
        "country": {
            "name": "India",
            "isoCode": "IN"
        }
    },
    "headers": {
        "host": "localhost:8000",
        "connection": "keep-alive",
        "accept-encoding": "gzip, deflate, sdch, br",
        "accept-language": "en-US,en;q=0.8,la;q=0.6"
    },
    "cookies": {
        "userId": "zasd-167279192-asknbke-0684"
    }
}
```

> ``json`` format supports logging of ``body`` params and ``cookies``. If you wish to log them, please make sure to enable the ``bodyParser`` and ``cookieParser`` middlewares before woodlot.

##### common

```javascript
127.0.01 - - [23/Apr/2017:20:47:28 +0000] "GET /api HTTP/1.1" 200 4
```

##### combined

```javascript
127.0.01 - - [23/Apr/2017:20:48:10 +0000] "GET /api HTTP/1.1" 200 4 "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
```

> The timestamp generated in all logs is in ``ISO`` format.

#### ``options {object}``

##### ``cookies {boolean} | Default: false``
This option is to be used with the ``json`` format. It specifies whether you want to log request ``cookies`` or not.

> Please make sure that the ``cookieParser`` middleware is enabled before woodlot, if this option is to be used.

##### ``headers {boolean} | Default: true``
This option is to be used with the ``json`` format. It specifies whether you want to log request ``headers`` or not.

##### ``compact {boolean} | Default: false``
This option is to be used with the ``json`` format. It specifies whether you want to log json as one line compact string.

**NOTE** ``spacing`` option will be ignored if this option is set to true.

##### ``spacing {string|number} | Default: \t``
This option is to be used with the ``json`` format. It specifies the indentation for the generated log entry. You can specify a tab ``\t`` or numeric values ``4``, ``8`` for spaces.

##### ``separator {string} | Default: \n``
This option can be used with any of the supported formats. It specfies the separator between two log entires. You can add a newline character ``\n``, a ``whitespace`` or any other valid character.

<br/>

### Custom logging

The woodlot ``customLogger`` can be used to perform custom logging with different logging levels.

Example -

```javascript
var express = require('express');
var app = express();
var woodlotCustomLogger = require('woodlot').customLogger;

var woodlot = new woodlotCustomLogger({
    streams: ['./logs/custom.log'],
    stdout: false,
    format: {
        type: 'json',
        options: {
            spacing: 4,
            separator: '\n'
        }
    }
});

app.get('/', function(req, res) {
    var id = 4533;
    woodlot.info('User id ' + id + ' accessed');
    return res.status(200).send({ userId: id });
});
```

#### Log levels

##### info
```javascript
woodlot.info('Data sent successfully');
```

##### debug
```javascript
woodlot.debug('Debugging main function');
```

##### warn
```javascript
woodlot.warn('User Id is required');
```

##### err
```javascript
woodlot.err('Server error occurred');
```

#### Options

#### ``streams {array} | required``
See [here](https://github.com/adpushup/woodlot#streams-array--required).

#### ``stdout {boolean} | Default: true``
See [here](https://github.com/adpushup/woodlot#stdout-boolean--default-true).

#### ``format {object}``
See [here](https://github.com/adpushup/woodlot#format-object).

##### ``type {string} | Default: 'json'``
The default output format is ``json``. The ``customLogger`` supports one more format - ``text``.

The generated output log for each format is as follows -

##### json

```javascript
{
    "timeStamp": "23/Apr/2017:17:02:33 +0000",
    "message": "Data sent successfully",
    "level": "INFO"
}
```

##### text

```javascript
INFO [23/Apr/2017:17:02:33 +0000]: "Data sent successfully"
```

#### ``options {object}``

##### ``compact {boolean} | Default: false``
This option is to be used with the ``json`` format. It specifies whether you want to log json as one line compact string.

**NOTE** ``spacing`` option will be ignored if this option is set to true.

##### ``spacing {string|number} | Default: \t``
This option is to be used with the ``json`` format. It specifies the indentation for the generated log entry. You can specify a tab ``\t`` or numeric values ``4``, ``8`` for spaces.

##### ``separator {string} | Default: \n``
This option can be used with any of the supported formats. It specfies the separator between two log entires. You can add a newline character ``\n``, a ``whitespace`` or any other valid character.

<br/>

## Events

Woodlot emits events at various operations that can be used to track critical data.

Example -

```javascript
var woodlotEvents = require('woodlot').events;

woodlotEvents.on('reqLog', function(log) {
     console.log('New log generated');
});
```

The returned log entry from each event will be of the same format as the one defined in the woodlot configuration.

### middlewareLogger events

#### ``reqLog``

This event is fired whenever a log entry is generated.

```javascript
woodlotEvents.on('reqLog', function(log) {
    console.log('The following log entry was added - \n' + log);
});
```

#### ``:statusCode``

This event is fired whenever a specific status code is returned from the request.

```javascript
woodlotEvents.on('200', function(log) {
    console.log('Success!')
});
```

```javascript
woodlotEvents.on('403', function(log) {
    console.log('Request forbidden!')
});
```

### ``reqErr``

This event is fired whenever an error is returned from the request.

All requests returning a status code of ``>=400`` are considered to be errored. Please refer to the HTTP status codes [guide](http://www.restapitutorial.com/httpstatuscodes.html) for more info.

```javascript
woodlotEvents.on('reqErr', function(log) {
    console.log('Errored!')
});
```

### customLogger events

#### ``info``

This event is fired whenever an ``info`` level log entry is generated.

```javascript
woodlotEvents.on('info', function(log) {
    console.log('Info log - ' + log);
});
```

#### ``debug``

This event is fired whenever a ``debug`` level log entry is generated.

```javascript
woodlotEvents.on('debug', function(log) {
    console.log('Debug log - ' + log);
});
```

#### ``warn``

This event is fired whenever a ``warn`` level log entry is generated.

```javascript
woodlotEvents.on('warn', function(log) {
    console.log('Warn log - ' + log);
});
```

#### ``err``

This event is fired whenever an ``err`` level log entry is generated.

```javascript
woodlotEvents.on('err', function(log) {
    console.log('Error log - ' + log);
});
```

<br/>

## Contributors

| [<img src="https://avatars3.githubusercontent.com/u/4924614" width="100px;"/><br /><sub><b>Arun Michael Dsouza</b></sub>](https://github.com/ArunMichaelDsouza)<br />| [<img src="https://avatars2.githubusercontent.com/u/10044846" width="100px;"/><br /><sub><b>Dhiraj Singh</b></sub>](https://github.com/DhirajAdPushup)<br />| [<img src="https://avatars1.githubusercontent.com/u/6550699" width="100px;"/><br /><sub><b>Chen Li</b></sub>](https://github.com/sirius226)<br />|
| :---: | :---: | :---: |

<br/>

## Support

If you'd like to help support the development of the project, please consider backing me on Patreon -

[<img src="https://arunmichaeldsouza.com/img/patreon.png" width="180px;"/>](https://www.patreon.com/bePatron?u=8841116)

<br/>

## License

MIT License

Copyright (c) 2017 AdPushup Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.









































