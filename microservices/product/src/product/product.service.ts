import {
  BadRequestException,
  Controller,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductModel } from './product.model';

@Controller()
export class ProductService {
  constructor(
    @InjectModel(ProductModel.name)
    private readonly productModel: Model<ProductModel>,
  ) {}

  @GrpcMethod('ProductService', 'FindAll')
  public async findAll(): Promise<{ total: number; products: ProductModel[] }> {
    try {
      const products = await this.productModel.find();

      products.forEach((product) => {
        product['productId'] = product['_id'];
      });

      return {
        total: products.length,
        products,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @GrpcMethod('ProductService', 'FindById')
  public async findById(filter: { id: string }): Promise<any> {
    try {
      const { id } = filter;

      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw new HttpException(`ID #${id} is not a valid _ID.`, 400);
      }

      const currentProduct = await this.productModel.findOne({ _id: id });
      if (!currentProduct) {
        return {
          _id: null,
          description: null,
          price: null,
        };
      }

      currentProduct['productId'] = currentProduct['_id'];

      return currentProduct;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @GrpcMethod('ProductService', 'Create')
  public async create(data: CreateProductDto): Promise<CreateProductDto> {
    try {
      const newProduct = await this.productModel.create(data);

      return newProduct.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @GrpcMethod('ProductService', 'Update')
  public async update(data: UpdateProductDto): Promise<UpdateProductDto> {
    try {
      const { id } = data;
      const currentProduct = await this.productModel.findByIdAndUpdate(
        { _id: id },
        data,
      );

      if (!currentProduct) {
        throw new NotFoundException(`Product #${id} not found`);
      }

      return await this.findById({ id });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @GrpcMethod('ProductService', 'Delete')
  public async delete(filter: { id: string }): Promise<any> {
    try {
      const { id } = filter;
      const currentProduct = await this.productModel.findByIdAndRemove(id);

      if (!currentProduct) {
        throw new NotFoundException(`Product #${id} not found`);
      }

      return {
        message: `Product #${id} successfully deleted`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
