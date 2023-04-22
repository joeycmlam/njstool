import * as log4js from 'log4js';
import MaskedLogger from '../../../src/app/app-mask/jl-log4js';

jest.mock('log4js');

const createLoggerMock = (): jest.Mocked<log4js.Logger> => {
    const loggerMock: Partial<log4js.Logger> = {
        info: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        level: '',
        isLevelEnabled: jest.fn(),
        isTraceEnabled: jest.fn(),
        isDebugEnabled: jest.fn(),
        isInfoEnabled: jest.fn(),
        isWarnEnabled: jest.fn(),
        isErrorEnabled: jest.fn(),
        isFatalEnabled: jest.fn(),
        trace: jest.fn(),
        fatal: jest.fn(),
        log: jest.fn(),
        addContext: jest.fn(),
        removeContext: jest.fn(),
        clearContext: jest.fn(),
        setParseCallStackFunction: jest.fn(),
        mark: jest.fn(),
        category: '',
    };

    return loggerMock as jest.Mocked<log4js.Logger>;
};
describe('MaskedLogger', () => {
    let loggerMock: jest.Mocked<log4js.Logger>;
    let maskedLogger: MaskedLogger;

    beforeEach(() => {
        loggerMock = createLoggerMock();
        (log4js.getLogger as jest.Mock).mockReturnValue(loggerMock);

        maskedLogger = new MaskedLogger('testCategory');
    });

    it('should log redacted info message', () => {
        maskedLogger.info('This is a test info message with sensitive data: myemail@xxx.com');
        expect(loggerMock.info).toHaveBeenCalledWith(
            'This is a test info message with sensitive data: ******'
        );
    });

    it('should log debug message', () => {
        maskedLogger.debug('This is a test info message with sensitive data: myemail@xxx.com');
        expect(loggerMock.debug).toHaveBeenCalledWith('This is a test info message with sensitive data: myemail@xxx.com');
    });

    it('should log redacted warn message', () => {
        maskedLogger.warn('This is a test warn message with sensitive data: secret123');
        expect(loggerMock.warn).toHaveBeenCalledWith(
            'This is a test warn message with sensitive data: secret123'
        );
    });

    it('should log redacted error message', () => {
        maskedLogger.error('This is a test error message with sensitive data: secret123');
        expect(loggerMock.error).toHaveBeenCalledWith(
            'This is a test error message with sensitive data: secret123'
        );
    });
});
