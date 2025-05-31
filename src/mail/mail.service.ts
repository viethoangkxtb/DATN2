import {Injectable} from '@nestjs/common';
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendInterviewEmail(data: {
    to: string;
    from: string;
    companyName: string;
    name: string;
    jobTitle: string;
    interviewTime: string;
    interviewType: string;
    interviewLocation: string;
    jobLink: string;
    senderName: string;
    senderTitle: string;
    senderPhone: string;
    senderEmail: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: data.to,
        from: data.from, // Thay bằng email của công ty
        subject: `Thông báo kết quả tuyển dụng – ${data.companyName}`,
        template: 'approve-resume', // Tên template (interview.hbs)
        context: {
          companyName: data.companyName,
          name: data.name,
          jobTitle: data.jobTitle,
          interviewTime: data.interviewTime,
          interviewType: data.interviewType,
          interviewLocation: data.interviewLocation,
          jobLink: data.jobLink,
          senderName: data.senderName,
          senderTitle: data.senderTitle,
          senderPhone: data.senderPhone,
          senderEmail: data.senderEmail,
        },
      });
      // console.log(`Email sent to ${data.to}`);
    } catch (error) {
      console.error(`Failed to send email to ${data.to}:`, error);
      throw new Error('Failed to send email');
    }
  }

  async sendRejectEmail(data: {
    to: string;
    from: string;
    companyName: string;
    name: string;
    jobTitle: string;
    senderName: string;
    senderTitle: string;
    senderPhone: string;
    senderEmail: string;
    customMessage: string;
  }) {
    try {
      await this.mailerService.sendMail({
        to: data.to,
        from: data.from,
        subject: `Thông báo kết quả tuyển dụng – ${data.companyName}`,
        template: 'reject-resume', // Tên file template (không cần .hbs nếu dùng Handlebars)
        context: {
          companyName: data.companyName,
          name: data.name,
          jobTitle: data.jobTitle,
          senderName: data.senderName,
          senderTitle: data.senderTitle,
          senderPhone: data.senderPhone,
          senderEmail: data.senderEmail,
          customMessage: data.customMessage || '',
        },
      });
    } catch (error) {
      console.error(`Failed to send reject email to ${data.to}:`, error);
      throw new Error('Failed to send reject email');
    }
  }
}
