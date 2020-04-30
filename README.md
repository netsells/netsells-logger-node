# Netsells Logger - Node

A log formatter for use with Node.

## Usage:

```js
const NetsellsLogger = require('netsells-logger-node');
const logger = new NetsellsLogger('Project Name Here');

// Only use one of the below options
logger.useFileLogger({
    logDirectory: '/var/logs', // Specify the log directory for docker, default is 'logs' in the project dir
});

// Optional setting of component and sub-component
// Defaults are shown in example below
logger
    .setComponent('frontend')
    .setSubComponent('node');

// run() must be called last and is required before any logs are made
logger.run();

// The different types of logs below.
logger.debug('A debug message here.');
logger.info('A info message here.');
logger.warn('A warn message here.');
logger.error('A error message here.');
logger.critical('A critical message here.');
```

Logs can also be written in an object format to pass through all options in the format outlined in the [Logging Docs](https://netsells.atlassian.net/wiki/spaces/NS/pages/1014136840/Application+Logging#The-log-format).

```js
logger.error({
    message: 'A error message here.',
    request: {
        id: '',
        client_ip: '',
        uri: '',
    },
    // Etc
});
```
