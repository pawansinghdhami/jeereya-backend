import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Orders } from './orders.entity';
import { Products } from '../../products/entities/products.entity';
import { ProductVariants } from '../../products/entities/product-variants.entity';

@Entity({ name: 'order_items', schema: 'jeereya_db' })
export class OrderItems {
  @PrimaryGeneratedColumn({ type: 'integer' })
  order_item_id_num!: number;

  @ManyToOne(() => Orders, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id_num', referencedColumnName: 'order_id_num' })
  orders!: Orders;

  @ManyToOne(() => Products, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'product_id_num',
    referencedColumnName: 'product_id_num',
  })
  products!: Products;

  @ManyToOne(() => ProductVariants, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'product_variant_id_num',
    referencedColumnName: 'product_variants_id_num',
  })
  productVariants!: ProductVariants;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @Column({ type: 'varchar', length: 180 })
  order_item_product_name_snapshot!: string;

  @Column({ type: 'varchar', length: 80 })
  order_item_sku_snapshot!: string;

  @Column({ type: 'varchar', length: 30 })
  order_item_size_snapshot!: string;

  @Column({ type: 'varchar', length: 30 })
  order_item_color_snapshot!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  order_item_unit_price!: number;

  @Column({ type: 'integer' })
  order_item_quantity!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  order_item_line_total!: number;
}
