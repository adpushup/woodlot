# woodlot
An ExpressJS HTTP logging middleware that provides JSON output and asynchronous events.

## Usage 

### JSON format (default)

```javascript
app.use(woodlot({
    streams: ['./logs/api-logs.log'],
    stdOut: false,
	format: {
        type: 'json',
        options: {
            spacing: '\t',
            headers: false,
            cookies: true,
            separator: '\n'
        }
	},
    routeWhitelist: ['/api']
}));
```

### APACHE format (common/combined)

```javascript
app.use(woodlot({
    streams: ['./logs/all-logs.log'],
    stdOut: true,
	format: {
        type: 'common',
        options: {
            separator: '\n'
        }
	},
    routeWhitelist: ['/']
}));
```
