import JsonHelper from '../../../app/app-json/jsonHelper';
import * as fs from 'fs/promises';
import { Workbook } from 'exceljs';
import * as mockFs from 'mock-fs';

// Mock fs.promises
jest.mock('fs/promises');

describe('JsonHelper', () => {
    let jsonHelper: JsonHelper;

    beforeEach(() => {
        jsonHelper = new JsonHelper();
    });

    afterEach(() => {
        mockFs.restore();
    });


    it.skip('should process a JSON file', async () => {
        const mockFileName = 'test.json';
        const mockData = [{ key: 'value' }];

        // Mock fs.readFile to return JSON string
        (fs.readFile as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockData));

        await jsonHelper.processJsonfile(mockFileName);

        expect(fs.readFile).toHaveBeenCalledWith(mockFileName, 'utf8');
    });

    it.skip('empty json', async () => {
        const mockSheetName = 'Sheet1';
        const mockOutputFile = 'output.xlsx';

        // Set up the JsonHelper instance with data
        jsonHelper['data'] = [];

        // Mock Workbook methods and Xlsx.writeFile
        const mockWorkbook = new Workbook();
        const addWorksheetSpy = jest.spyOn(mockWorkbook, 'addWorksheet');
        const writeFileSpy = jest.spyOn(mockWorkbook.xlsx, 'writeFile');
        jsonHelper['workbook'] = mockWorkbook;

        // Set up mock file system
        // mockFs({});

        await jsonHelper.write2excel(mockOutputFile, mockSheetName);

        expect(addWorksheetSpy).toHaveBeenCalledWith(mockSheetName);
        expect(writeFileSpy).toHaveBeenCalledWith(mockOutputFile);
    });
});
