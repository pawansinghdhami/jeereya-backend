import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ProductCategories } from './product-categories.entity';
import { ProductImages } from './product-images.entity';

@Entity({ name: 'products', schema: 'jeereya_db' })
@Unique('uq_products_slug', ['product_slug'])
@Check('chk_products_mrp_positive', '"product_mrp_price" > 0')
@Check('chk_products_selling_price_positive', '"product_selling_price" > 0')
@Check(
  'chk_products_selling_lte_mrp',
  '"product_selling_price" <= "product_mrp_price"',
)
export class Products {
  @PrimaryGeneratedColumn({ type: 'integer' })
  product_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @ManyToOne(() => ProductCategories, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({
    name: 'product_category_id_num',
    referencedColumnName: 'product_category_id_num',
  })
  category!: ProductCategories;

  @OneToMany(() => ProductImages, (image) => image.product)
  images!: ProductImages[];

  @Column({ type: 'varchar', length: 180 })
  product_name!: string;

  @Column({ type: 'varchar', length: 200 })
  product_slug!: string;

  @Column({ type: 'text', nullable: true })
  product_description!: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  product_brand_name!: string | null;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  product_mrp_price!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  product_selling_price!: string;

  @Column({ type: 'boolean', default: true })
  is_product_active!: boolean;
}
