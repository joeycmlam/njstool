import { Before, Given, Then, When } from '@cucumber/cucumber';
import * as assert from "assert";
import MaskedLogger from '../../src/jl-log4js';

let logger: MaskedLogger;
let loggedMessages: string[];

import { LoggingEvent , configure, addLayout, Configuration, shutdown } from 'log4js';

class TestAppender {
    public type = 'testAppender';

    constructor(private messages: string[]) {}

    public append(loggingEvent: LoggingEvent): void {
        this.messages.push(loggingEvent.data.join(' '));
    }
}

Before(() => {
    loggedMessages = [];

    addLayout('testAppender', () => (logEvent: LoggingEvent) => {
        return logEvent.data.join(' ');
    });

    const configuration: Configuration = {
        appenders: {
            testAppender: { type: 'testAppender', messages: loggedMessages },
        },
        categories: {
            default: { appenders: ['testAppender'], level: 'info' },
        },
    };

    configure(configuration);
    shutdown(() => {});
});

Given('the logger level is set to {string}', (level: string) => {
    logger = new MaskedLogger(level);
});

When('I log an info message containing sensitive information', () => {
    logger.info('User email: user@example.com');
});

Then('the logged message should have sensitive information masked', () => {

    assert.equal(loggedMessages.length, 1);
    assert.equal(loggedMessages[0], /User email: .+@REDACTED\.com/);
});
