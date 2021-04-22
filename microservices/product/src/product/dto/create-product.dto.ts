import {
  IsDecimal,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @MaxLength(30)
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsPositive()
  @IsDecimal()
  readonly price: number;
}
