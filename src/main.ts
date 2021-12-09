import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as config from 'config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const serverCong = config.get('server');
  // console.log(typeof serverCong);

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  const port = process.env.PORT || 3000;

  app.enableCors();
  await app.listen(port);
  // Logger
  logger.log(`started on port ${port}`);
}
bootstrap();
