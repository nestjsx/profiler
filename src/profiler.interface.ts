import { Type } from '@nestjs/common';

export interface ProfilerInterface {
  request: {
    body: any,
    headers: {[s: string]: string},
    method: 'GET' | 'POST' | 'OPTIONS' | 'PATCH' | 'DELETE' | 'PUT';
    uri: string;
  };
  response: {
    status: number;
    statusText: string;
    json: object;
    headers: {[s: string]: string};
  };
  executionContext: {
    class: Type<any>;
    handler: Function;
  };
  elipsedTime: number;
}
