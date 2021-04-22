import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateCartDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsString()
  id?: string;
}
