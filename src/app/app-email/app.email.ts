import { Config } from './Config';
import { EmailSender } from './EmailSender';

const config = new Config('src/app/app-email/config/test.json');
const emailConfig = config.getEmailConfig();

const emailSender = new EmailSender();
emailSender.sendEmail(emailConfig.to, emailConfig.subject, emailConfig.body);