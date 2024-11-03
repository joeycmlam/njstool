import * as nodemailer from 'nodemailer';

export class EmailSender {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: to,
      subject: subject,
      text: body
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}