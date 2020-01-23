# Netsells Logger - Node

A log formatter for use with Node. 

## TODO:
* Generate and persist a request id
* Determine location and set client IP or console in uri
* Catch and handle exceptions according to the [NS standards](https://netsells.atlassian.net/wiki/spaces/NS/pages/1014136840/Application+Logging)
* Add support for context

## Usage:
```javascript
const NetsellsLogger = require('netsells-logger-node');
const logger = new NetsellsLogger("Project Name Here");

// Only use one of the below options
logger
    .useConsoleLogger() // Output logs to the console (for use in docker)
    .useFileLogger(); // Output logs to a rotating log file in logs/

// Optional setting of component and sub-component
// Defaults are shown in example below
logger.
    .setComponent('frontend')
    .setSubComponent('node');

// run() must be called last and is required before any logs are made
logger.run();

// The different types of logs below.
logger.debug("A debug message here.");
logger.info("A info message here.");
logger.warn("A warn message here.");
logger.error("A error message here.");
logger.critical("A critical message here.");
```