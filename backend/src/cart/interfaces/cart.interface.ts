export interface ICart {
  userId?: string;
  totalPrice: number;
  totalQuantity: number;
  products: IProductCartData[];
}

export interface IProductCartData {
  productId: string;
  description: string;
  price: number;
  quantity: number;
}