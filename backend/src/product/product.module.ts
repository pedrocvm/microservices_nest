import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
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
  ],
})
export class ProductModule {}
