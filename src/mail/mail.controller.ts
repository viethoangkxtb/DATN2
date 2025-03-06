import {Controller, Get} from '@nestjs/common';
import {MailService} from './mail.service';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {MailerService} from '@nestjs-modules/mailer';
import {SoftDeleteModel} from 'soft-delete-plugin-mongoose';
import {
  Subscriber,
  SubscriberDocument,
} from 'src/subscribers/schemas/subscriber.schema';
import {Job, JobDocument} from 'src/jobs/schemas/job.schema';
import {InjectModel} from '@nestjs/mongoose';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private mailerService: MailerService,

    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>,

    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>,
  ) {}

  @Get()
  @Public()
  @ResponseMessage('Test email')
  async handleTestEmail() {
    const jobs = [
      {
        name: 'abc xyz job',
        company: 'hoir dan it',
        salary: '5000',
        skills: ['React', 'Node.js'],
      },
      {
        name: 'abc xyz job 222',
        company: 'hoir dan it22',
        salary: '5000',
        skills: ['22', 'Node.js222'],
      },
    ];

    const subscribers = await this.subscriberModel.find({});
    for (const subs of subscribers) {
      const subsSkills = subs.skills;
      const jobWithMatchingSkills = await this.jobModel.find({
        skills: {$in: subsSkills},
      });
      if (jobWithMatchingSkills?.length) {
        const jobs = jobWithMatchingSkills.map(item => {
          return {
            name: item.name,
            company: item.company.name,
            salary:
              `${item.salary}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' đ',
            skills: item.skills,
          };
        });

        await this.mailerService.sendMail({
          to: 'viethoangkxtb@gmail.com',
          from: '"Support Team" <support@example.com>', // override default from
          subject: 'Welcome to Nice App! Confirm your Email',
          template: 'new-job',
          context: {
            receiver: subs.name,
            jobs: jobs,
          },
        });
      }
    }
  }
}
