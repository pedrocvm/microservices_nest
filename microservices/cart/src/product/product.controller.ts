import {
  Controller,
  Get,
  Inject,
  Injectable,
  OnModuleInit,
  Param,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IProduct } from './interfaces/product.interface';
import ProductService from './product.service';

@Controller('product')
@Injectable()
export class ProductController implements OnModuleInit {
  productService: ProductService;

  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>(
      'ProductService',
    );
  }

  @Get()
  findAll(): Observable<{ total: number; products: IProduct[] }> {
    return this.productService.findAll({});
  }

  @Get(':id')
  findById(@Param('id') id: string): Observable<IProduct> {
    return this.productService.findById({ id });
  }
}
