import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'product',
  versionKey: false,
  toJSON: {
    transform: (doc: DocumentType, ret) => {
      ret.productId = ret._id;
      delete ret._id;
    },
  },
})
export class ProductModel extends Document {
  @Prop({
    lowercase: true,
    required: true,
    unique: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  price: number;
}

const ProductSchema = SchemaFactory.createForClass(ProductModel);

export { ProductSchema };
