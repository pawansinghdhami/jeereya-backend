import {
  Check,
  Unique,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product_categories', schema: 'jeereya_db' })
@Unique('uq_product_categories_slug', ['product_category_slug'])
@Check(
  'chk_product_categories_display_order_nonnegative',
  '"display_product_order" >= 0',
)
export class ProductCategories {
  @PrimaryGeneratedColumn({ type: 'integer' })
  product_category_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @ManyToOne(() => ProductCategories, (category) => category.children, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'parent_category_id_num',
    referencedColumnName: 'product_category_id_num',
  })
  parentCategory!: ProductCategories | null;

  @OneToMany(() => ProductCategories, (category) => category.parentCategory)
  children!: ProductCategories[];

  @Column({ type: 'varchar', length: 100, nullable: false })
  product_category_name!: string;

  @Column({ type: 'varchar', length: 120, nullable: false })
  product_category_slug!: string;

  @Column({ type: 'boolean', default: true })
  is_product_category_active!: boolean;

  @Column({ type: 'integer', default: 0 })
  display_product_order!: number;
}
