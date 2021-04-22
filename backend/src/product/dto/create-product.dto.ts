import { IsNotEmpty, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;
}
