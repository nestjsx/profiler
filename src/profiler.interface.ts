import { Request, Response } from 'express';
import { Type } from '@nestjs/common';

export interface ProfilerInterface {
  request: Request;
  response: Response;
  executionContext: {
    class: Type<any>;
    handler: Function;
  };
  elipsedTime: number;
}
