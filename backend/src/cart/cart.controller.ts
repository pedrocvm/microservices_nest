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
import CartService from './cart.service';
import { CreateCartDto, UpdateCartDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user.decorator';

@Controller('cart')
@UseGuards(AuthGuard('jwt'))
export class CartController implements OnModuleInit {
  cartService: CartService;

  constructor(@Inject('CART_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.cartService = this.client.getService<CartService>('CartService');
  }

  @Get()
  async findAll() {
    return await this.cartService.findAll({});
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.cartService.findById({ id });
  }

  @Post()
  async create(@User('id') userId: string, @Body() data: CreateCartDto) {
    const { products } = data;
    return await this.cartService.create({ userId, products });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: UpdateCartDto) {
    const { products } = data;
    return await this.cartService.update({ id, products });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.cartService.delete({ id });
  }
}
