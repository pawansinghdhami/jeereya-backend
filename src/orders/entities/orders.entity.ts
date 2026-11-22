import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity({ name: 'orders', schema: 'jeereya_db' })
export class Orders {
  @PrimaryGeneratedColumn({ name: 'order_id_num' })
  order_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id_num', referencedColumnName: 'user_id_num' })
  user!: User;

  @Column({ type: 'varchar', length: 40 })
  order_number!: string;

  @Column({ type: 'varchar', length: 30 })
  order_status!: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  order_subtotal_amount!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  order_shipping_amount!: number;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  order_total_amount!: number;

  @Column({ type: 'varchar', length: 120 })
  order_shipping_name!: string;

  @Column({ type: 'varchar', length: 16 })
  order_shipping_mobile_num!: string;

  @Column({ type: 'varchar', length: 200 })
  order_shipping_address_line1!: string;

  @Column({ type: 'varchar', length: 200 })
  order_shipping_address_line2!: string;

  @Column({ type: 'varchar', length: 100 })
  order_shipping_city!: string;

  @Column({ type: 'varchar', length: 100 })
  order_shipping_state!: string;

  @Column({ type: 'varchar', length: 12 })
  order_shipping_pincode!: string;
}
