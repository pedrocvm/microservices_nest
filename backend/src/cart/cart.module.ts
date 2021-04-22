import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  providers: [
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
export class CartModule {}
