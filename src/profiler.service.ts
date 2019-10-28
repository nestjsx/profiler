import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ProfilerInterface } from './profiler.interface';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProfilerService implements OnModuleInit, OnModuleDestroy {
  private dirName: string = path.resolve(__dirname, 'profiler');

  async onModuleInit(): Promise<void> {
    await new Promise(
      async (resolve, reject) =>
        await fs.mkdir(this.dirName, err => {
          if (err) reject(err);
          resolve();
        }),
    );
  }

  async onModuleDestroy(): Promise<void> {
    await new Promise(
      async (resolve, reject) =>
        await fs.rmdir(this.dirName, err => {
          if (err) reject(err);
          resolve();
        }),
    );
  }

  async store(profile: ProfilerInterface): Promise<void> {
    await new Promise(
      async (resolve, reject) =>
        await fs.writeFile(
          path.resolve(
            this.dirName,
            `${new Date().toISOString()}-${uuid()}.json`,
          ),
          JSON.stringify(profile),
          err => {
            if (err) reject(err);
            resolve();
          },
        ),
    );
  }

  async paginate(page: number = 1): Promise<ProfilerInterface[]> {
    const fileList: string[] = await new Promise(
      async (resolve, reject) =>
        await fs.readdir(this.dirName, (err, files) => {
          if (!err) reject(err);
          resolve(files);
        }),
    );

    const resolveDate = (name: string): number => {
      const dateString = name.split('.').shift();
      return new Date(dateString).getTime();
    };

    fileList.sort((a: string, b: string) => resolveDate(a) - resolveDate(b));

    const choosen = fileList.slice(page * 10 - 10, (page + 1) * 10);

    return Promise.all(
      choosen.map(
        (fileName: string) =>
          new Promise((resolve, reject) =>
            fs.readFile(fileName, (err, data) => {
              if (err) reject(err);
              resolve(JSON.parse(data.toString()) as ProfilerInterface);
            }),
          ),
      ),
    );
  }
}
