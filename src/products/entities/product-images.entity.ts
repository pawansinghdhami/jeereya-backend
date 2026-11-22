import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Products } from './products.entity';

@Entity({ name: 'product_images', schema: 'jeereya_db' })
export class ProductImages {
  @PrimaryGeneratedColumn({ type: 'integer' })
  product_image_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @ManyToOne(() => Products, (product) => product.images, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'product_id_num',
    referencedColumnName: 'product_id_num',
  })
  product!: Products;

  @Column({ type: 'text' })
  product_image_url!: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  product_image_alt_text!: string | null;

  @Column({
    type: 'integer',
    default: 0,
  })
  product_image_display_order!: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_primary_product_image!: boolean;
}