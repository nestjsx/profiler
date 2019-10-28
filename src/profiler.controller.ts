import { Controller, Get, Query } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import * as path from 'path';
import { ProfilerService } from './profiler.service';

@Controller()
export class ProfilerController {
  constructor(private readonly service: ProfilerService) {
    nunjucks.configure(path.resolve(__dirname, 'views'), { autoescape: true });
  }
  @Get()
  async profiler(@Query('page') page: number = 1): Promise<string> {
    const entries = await this.service.paginate(1);

    const content: string = nunjucks.render('profiler.html', {
      entries,
    });

    return content;
  }
}
