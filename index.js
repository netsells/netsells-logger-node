'use strict';

const SimpleLogger = require('simple-node-logger');
const os = require('os');

class NetsellsLogger {
   /**
   * @constructor
   */
  constructor(projectName) {

    if (!projectName) {
      throw new Error("Project name is required for the Netsells Logger.");
    }

    this.manager = new SimpleLogger();
    this.loggerType = 'file';

    this.project = projectName;
    this.component = 'frontend';
    this.subComponent = 'node';

    this.levels = ['debug', 'info', 'warn', 'error', 'critical'];

    this.fileOpts = {
      errorEventName:'error',
      logDirectory: 'logs',
      fileNamePattern: 'node-<DATE>.log',
      dateFormat: 'YYYY-MM-DD',
      levels: this.levels,
    };

    this.consoleOpts = {
      levels: this.levels,
    };
  }

  setProjectName(projectName) {
    this.project = projectName;

    return this;
  }

  setComponent(component) {
    this.component = component;

    return this;
  }

  setSubComponent(subComponent) {
    this.subComponent = subComponent;

    return this;
  }

  setFileOpts(options) {
    this.fileOpts = {...options, ...this.fileOpts};
  }

  setConsoleOpts(options) {
    this.consoleOpts = {...options, ...this.consoleOpts};
  }

  useConsoleLogger() {
    this.loggerType = 'console';

    return this;
  }

  useFileLogger() {
    this.loggerType = 'file';

    return this;
  }

  run() {
    let appender;

    if (this.loggerType == 'file') {
      appender = this.manager.createRollingFileAppender(this.fileOpts);
    } else {
      appender = this.manager.createConsoleAppender(this.consoleOpts);
    }

    appender.formatter = function (entry) {
      let fields = appender.formatEntry(entry);
    
      return JSON.stringify(fields) + '\n';
    };

    let that = this;

    appender.formatEntry = function (entry, thisArg) {
      const apdr = thisArg || appender;
  
      const fields = {};
  
      fields.app = {
        hostname: os.hostname(),
        project: that.project,
        component: that.component,
        "sub-component": that.subComponent,
      };

      fields.event = {
        created: new Date(entry.ts).toISOString(),
        type: 'log',
      };

      fields.request = {
        id: null, // TODO:
        client_id: null, // TODO
        uri: 'console', // TODO
      };

      fields.level = apdr.formatLevel(entry.level);
      fields.message = apdr.formatMessage(entry.msg);
  
      return fields;
    };

    this.logger = this.manager.createLogger({
      levels: this.levels,
    });
  }

  critical(message) {
    this.logger.log("critical", message);
  }

  error(message) {
    this.logger.log("error", message);
  }

  warn(message) {
    this.logger.log("warn", message);
  }

  info(message) {
    this.logger.log("info", message);
  }

  debug(message) {
    this.logger.log("debug", message);
  }

}

module.exports = NetsellsLogger;