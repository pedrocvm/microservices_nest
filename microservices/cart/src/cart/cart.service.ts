import {
  BadRequestException,
  Controller,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductController } from 'src/product/product.controller';
import { Repository } from 'typeorm';
import { CartEntity } from './cart.entity';
import { CreateCartDto, UpdateCartDto } from './dto';
import { IProduct } from '../product/interfaces/product.interface';
import { ICart } from './interfaces/cart.interface';
import { GrpcMethod } from '@nestjs/microservices';

@Controller()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    private productService: ProductController,
  ) {}

  @GrpcMethod('CartService', 'FindAll')
  async findAll(): Promise<any> {
    try {
      const carts = await this.cartRepository.find();

      return {
        total: carts.length,
        carts,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @GrpcMethod('CartService', 'FindById')
  async findById(filter: { id: string }): Promise<CartEntity> {
    try {
      const { id } = filter;
      const cart = await this.cartRepository.findOne(id);

      if (!cart) {
        throw new NotFoundException(`Cart #${id} not found`);
      }

      return cart;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @GrpcMethod('CartService', 'Create')
  async create(data: CreateCartDto): Promise<any> {
    try {
      let newCart: ICart = await this.setCartItems(data);
      
      newCart.userId = data.userId;

      newCart = this.cartRepository.create(newCart);

      return this.cartRepository.save(newCart);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @GrpcMethod('CartService', 'Update')
  async update(data: UpdateCartDto): Promise<any> {
    try {
      const { id } = data;
      const cart = await this.findById({ id });

      if (!cart) {
        throw new NotFoundException(`Cart #${id} not found`);
      }

      let updatedCart = {
        ...cart,
        ...data,
      };

      let updatedProducts = await this.setCartItems(updatedCart);

      updatedCart = {
        ...updatedCart,
        ...updatedProducts,
      };

      return this.cartRepository.save(updatedCart);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @GrpcMethod('CartService', 'Delete')
  async delete(filter: { id: string }): Promise<{ message: string }> {
    try {
      const { id } = filter;
      const cart = await this.findById({ id });

      if (!cart) {
        throw new NotFoundException(`Cart #${id} not found`);
      }

      await this.cartRepository.remove(cart);

      return {
        message: `Cart #${id} successfully deleted`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  private async getAllProducts(): Promise<IProduct[]> {
    return (await this.productService.findAll().toPromise()).products;
  }

  private async setCartItems(data: CreateCartDto) {
    const newCart: ICart = {
      totalPrice: 0,
      totalQuantity: 0,
      products: [],
    };

    const allProducts = await this.getAllProducts();

    data.products.forEach((item) => {
      const products = allProducts.filter(
        (product) => product.productId === item.productId,
      );

      products.forEach((prod) => {
        newCart.products.push({
          productId: prod.productId,
          description: prod.description,
          price: prod.price,
          quantity: item.quantity,
        });
      });
    });

    newCart.totalQuantity = newCart.products.reduce((acc, curr) => {
      return acc + curr.quantity;
    }, 0);

    for (let i = 0; i < newCart.products.length; i++) {
      newCart.totalPrice += +(
        newCart.products[i].price * newCart.products[i].quantity
      ).toFixed(2);
    }

    return newCart;
  }
}
