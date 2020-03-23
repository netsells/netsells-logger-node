'use strict';

const SimpleLogger = require('simple-node-logger');
const os = require('os');

class NetsellsLogger {
    /**
     * @constructor
     */
    constructor(projectName) {
        if (!projectName) {
            throw new Error('Project name is required for the Netsells Logger.');
        }

        this.manager = new SimpleLogger();
        this.loggerType = 'file';

        this.project = projectName;
        this.component = 'frontend';
        this.subComponent = 'node';
        this.environment = 'local';

        this.levels = ['debug', 'info', 'warn', 'error', 'critical'];

        this.fileOpts = {
            errorEventName: 'error',
            logDirectory: 'logs',
            fileNamePattern: 'node-json-<DATE>.log',
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

    setEnvironment(environment) {
        this.environment = environment;

        return this;
    }

    setFileOpts(options) {
        this.fileOpts = { ...this.fileOpts, ...options };

        return this;
    }

    setConsoleOpts(options) {
        this.consoleOpts = { ...this.consoleOpts, ...options };

        return this;
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

        if (this.loggerType === 'file') {
            appender = this.manager.createRollingFileAppender(this.fileOpts);
        } else {
            appender = this.manager.createConsoleAppender(this.consoleOpts);
        }

        appender.formatter = function(entry) {
            const fields = appender.formatEntry(entry);

            return JSON.stringify(fields) + '\n';
        };

        appender.formatEntry = (entry, thisArg) => {
            let data = entry.msg;

            if (typeof data === 'string') {
                data = {
                    message: entry,
                };
            }

            const apdr = thisArg || appender;

            const fields = {
                ...data,
            };

            fields.app = {
                hostname: os.hostname(),
                project: this.project,
                component: this.component,
                'sub-component': this.subComponent,
                environment: this.environment,
            };

            fields.event = {
                created: new Date(entry.ts).toISOString(),
                type: 'log',
            };

            fields.request = {
                id: null, // TODO:
                client_id: null, // TODO
                uri: 'console', // TODO
                ...data.request || {},
            };

            fields.level = apdr.formatLevel(entry.level);
            fields.message = apdr.formatMessage(data.message);

            return fields;
        };

        this.logger = this.manager.createLogger({
            levels: this.levels,
        });
    }

    critical(data) {
        this.logger.log('critical', data);
    }

    error(data) {
        this.logger.log('error', data);
    }

    warn(data) {
        this.logger.log('warn', data);
    }

    info(data) {
        this.logger.log('info', data);
    }

    debug(data) {
        this.logger.log('debug', data);
    }
}

module.exports = NetsellsLogger;
