import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProfilerService } from './profiler.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ProfilerInterceptor implements NestInterceptor {
  constructor(private readonly service: ProfilerService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse(); // TODO move to get response from controller
    const executionContext = {
      class: context.getClass(),
      handler: context.getHandler(),
    };

    const start = Date.now();

    return next.handle().pipe(
      tap(async () => {
        await this.service.store({
          request,
          response,
          executionContext,
          elipsedTime: start - Date.now(),
        });
      }),
    );
  }
}
