import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { IProductCartData } from './interfaces/cart.interface';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  shoppingCartId: string;

  @Column('uuid')
  userId: string;

  @Column({ type: 'float' })
  totalPrice: number;

  @Column()
  totalQuantity: number;

  @Column({ type: 'json' })
  products: IProductCartData[];

}
