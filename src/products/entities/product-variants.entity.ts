import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from './products.entity';

@Entity({ name: 'product_variants', schema: 'jeereya_db' })
@Unique('uq_product_variants_sku', ['product_variant_sku'])
@Unique('uq_product_variants_product_size_color', [
  'product',
  'product_variant_size_label',
  'product_variant_color_name',
])
@Check(
  'chk_product_variants_stock_nonnegative',
  '"product_variant_stock_quantity" >= 0',
)
export class ProductVariants {
  @PrimaryGeneratedColumn({ type: 'integer' })
  product_variant_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @ManyToOne(() => Products, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'product_id_num',
    referencedColumnName: 'product_id_num',
  })
  product!: Products;

  @Column({ type: 'varchar', length: 80 })
  product_variant_sku!: string;

  @Column({ type: 'varchar', length: 30 })
  product_variant_size_label!: string;

  @Column({ type: 'varchar', length: 50 })
  product_variant_color_name!: string;

  @Column({ type: 'integer', default: 0 })
  product_variant_stock_quantity!: number;

  @Column({ type: 'boolean', default: true })
  product_variant_is_active!: boolean;
}
