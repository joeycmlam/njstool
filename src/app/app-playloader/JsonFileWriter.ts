import { writeFileSync } from 'fs';
import { injectable } from 'inversify';


@injectable()
export default class JsonFileWriter {
  public write(outputPath: string, data: any): void {
    writeFileSync(outputPath, JSON.stringify(data, null, 2));
  }
}
