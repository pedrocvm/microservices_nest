import { CreateCartDto, UpdateCartDto } from './dto';

export default interface CartService {
  findAll({}): Promise<any>;
  findById(param: { id: string }): Promise<any>;
  create(data: CreateCartDto): Promise<any>;
  update(data: UpdateCartDto): Promise<any>;
  delete(param: { id: string }): Promise<any>;
}
