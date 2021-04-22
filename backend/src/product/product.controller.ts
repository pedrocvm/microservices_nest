import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import ProductService from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('product')
@UseGuards(AuthGuard('jwt'))
export class ProductController implements OnModuleInit {
  productService: ProductService;

  constructor(@Inject('PRODUCT_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.productService = this.client.getService<ProductService>(
      'ProductService',
    );
  }

  @Get()
  async findAll() {
    return await this.productService.findAll({});
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.productService.findById({ id });
  }

  @Post()
  async create(@Body() data: CreateProductDto) {
    const { description, price } = data;
    return await this.productService.create({ description, price });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    const { description, price } = data;
    return await this.productService.update({ id, description, price });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.productService.delete({ id });
  }
}
