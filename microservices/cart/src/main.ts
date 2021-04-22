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
        url: process.env.CART_URL,
        package: process.env.CART_PACKAGE_NAME,
        protoPath: join(process.cwd(), 'src/cart.proto'),
      },
    },
  );

  app.listen(() =>
    logger.log(
      `Microservice ${process.env.CART_PACKAGE_NAME.toUpperCase()} is listening ✔`,
    ),
  );
}

bootstrap();
