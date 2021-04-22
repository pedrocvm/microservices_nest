import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsString } from 'class-validator';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsString()
  id?: string;

  @IsArray()
  products: IProductCart[];
}

interface IProductCart {
  productId: string;
  quantity: number;
}
