import { Module } from '@nestjs/common';
import { ProfilerInterceptor } from './profiler.interceptor';
import { ProfilerService } from './profiler.service';
import { ProfilerController } from './profiler.controller';

@Module({
  providers: [ProfilerInterceptor, ProfilerService],
  controllers: [ProfilerController],
  exports: [ProfilerService],
})
export class ProfilerModule {}
