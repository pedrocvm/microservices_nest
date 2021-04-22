import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IProductCart } from '../interfaces/product-cart.interface';

export class CreateCartDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsArray()
  readonly products: IProductCart[];
}
