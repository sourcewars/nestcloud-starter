import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { defaults } from '@nestcloud/schedule';
import { NestLogger } from '@nestcloud/logger';
import { NestCloud } from '@nestcloud/core';
import { context, filename } from './config';

// https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const logger = defaults.logger = new NestLogger({ path: context, filename });

async function bootstrap() {
  const app = NestCloud.create(await NestFactory.create(AppModule, { logger }));

  process.on('SIGINT', async () => {
    setTimeout(() => process.exit(1), 5000);
    await app.close();
    process.exit(0);
  });

  // kill -15
  process.on('SIGTERM', async () => {
    setTimeout(() => process.exit(1), 5000);
    await app.close();
    process.exit(0);
  });

  await app.listen(NestCloud.global.boot.get('consul.service.port', 8081));
}

bootstrap();
