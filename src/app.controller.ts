import {Controller, Get, Render} from '@nestjs/common';
import {AppService} from './app.service';
import {ConfigService} from '@nestjs/config';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Get()
  @Render('home')
  handleHomepage() {
    const message1 = this.appService.getHello();

    // return this.appService.getHello();
    return {
      message: message1,
    };
  }
}
