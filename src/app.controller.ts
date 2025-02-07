import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Render('home')
  handleHomepage() {
    console.log('>> check port = ', this.configService.get<string>('PORT'));

    const message1 = this.appService.getHello();

    // return this.appService.getHello();
    return {
      message: message1,
    };
  }
}
