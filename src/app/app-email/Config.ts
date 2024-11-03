import * as fs from 'fs';

export class Config {
  private config: any;

  constructor(configPath: string) {
    this.config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }

  getEmailConfig() {
    return this.config.email;
  }
}