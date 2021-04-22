import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './users/user.controller';
import { ProductModule } from './product/product.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ProductController } from './product/product.controller';
import { CartModule } from './cart/cart.module';
import { CartController } from './cart/cart.controller';

const controllers = [
  UserController,
  AuthController,
  ProductController,
  CartController,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      keepConnectionAlive: true,
    }),
    UserModule,
    AuthModule,
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
            url: process.env.PRODUCT_URL,
            package: process.env.PRODUCT_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'src/product/product.proto'),
          },
        });
      },
    },
    {
      provide: 'CART_PACKAGE',
      useFactory: () => {
        return ClientProxyFactory.create({
          transport: Transport.GRPC,
          options: {
            url: process.env.CART_URL,
            package: process.env.CART_PACKAGE_NAME,
            protoPath: join(process.cwd(), 'src/cart/cart.proto'),
          },
        });
      },
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/api/auth/login', method: RequestMethod.POST },
        { path: '/api/user', method: RequestMethod.POST },
      )
      .forRoutes(...controllers);
  }
}
