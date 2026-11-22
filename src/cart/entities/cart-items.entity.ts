import {
  Check,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ProductVariants } from '../../products/entities/product-variants.entity';

@Entity({ name: 'cart_items', schema: 'jeereya_db' })
@Unique('uq_cart_items_user_variant', ['user', 'productVariant'])
@Check('chk_cart_items_quantity_positive', '"cart_items_quantity" > 0')
export class CartItems {
  @PrimaryGeneratedColumn({ type: 'integer' })
  cart_item_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id_num', referencedColumnName: 'user_id_num' })
  user!: User;

  @ManyToOne(() => ProductVariants, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'product_variant_id_num',
    referencedColumnName: 'product_variant_id_num',
  })
  productVariant!: ProductVariants;

  @Column({ type: 'integer' })
  cart_items_quantity!: number;
}
