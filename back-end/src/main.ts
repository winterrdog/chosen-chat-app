import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 3000;
(async function () {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log' /* 'debug', 'verbose' */],
  });
  await app.listen(port, '0.0.0.0');
})();
