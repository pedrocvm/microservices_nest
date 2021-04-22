import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { IProductCart } from '../interfaces/product-cart.interface';

export class CreateCartDto {
  readonly userId: string;

  @IsNotEmpty()
  @IsArray()
  readonly products: IProductCart[];
}
