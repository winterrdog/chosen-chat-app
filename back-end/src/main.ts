import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async function () {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log' /* 'debug', 'verbose' */],
  });
  await app.listen(3000);
})();
