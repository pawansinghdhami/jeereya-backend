import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Products } from '../../products/entities/products.entity';

@Entity({ name: 'wishlist_items', schema: 'jeereya_db' })
@Unique('uq_wishlist_items_user_product', ['user', 'product'])
export class WishListItems {
  @PrimaryGeneratedColumn({ type: 'integer' })
  wishlist_item_id_num!: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id_num', referencedColumnName: 'user_id_num' })
  user!: User;

  @ManyToOne(() => Products, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'product_id_num',
    referencedColumnName: 'product_id_num',
  })
  product!: Products;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;
}
