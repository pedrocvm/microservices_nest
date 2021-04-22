import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { join } from 'path';

const logger = new Logger('MICROSERVICE');

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env.PRODUCT_URL,
        package: process.env.PRODUCT_PACKAGE_NAME,
        protoPath: join(__dirname, 'product.proto'),
      },
    },
  );

  app.listen(() =>
    logger.log(
      `Microservice ${process.env.PRODUCT_PACKAGE_NAME.toUpperCase()} is listening ✔`,
    ),
  );
}

bootstrap();
