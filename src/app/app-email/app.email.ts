import Config from "./Config";
import {EmailSender} from "./EmailSender";

const config = new Config('config.json');
const emailConfig = config.getEmailConfig();

const emailSender = new EmailSender();
emailSender.sendEmail(emailConfig.to, emailConfig.subject, emailConfig.body);