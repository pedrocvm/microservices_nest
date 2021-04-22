import { CreateProductDto, UpdateProductDto } from './dto';

export default interface ProductService {
  findAll({}): Promise<any>;
  findById(param: { id: string }): Promise<any>;
  create(data: CreateProductDto): Promise<any>;
  update(data: UpdateProductDto): Promise<any>;
  delete(param: { id: string }): Promise<any>;
}
