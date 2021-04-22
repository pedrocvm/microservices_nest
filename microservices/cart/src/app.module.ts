import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

import { CartModule } from './cart/cart.module';
import { ProductController } from './product/product.controller';
import { ProductModule } from './product/product.module';
const controllers = [ProductController, CartModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
    }),

    ProductModule,
    CartModule,
  ],
  controllers: controllers,
  providers: [
    {
      provide: 'PRODUCT_PACKAGE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            package: process.env.PRODUCT_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'src/product/product.proto'),
            url: process.env.PRODUCT_URL,
          },
        });
      },
    },
  ],
})
export class AppModule {}
