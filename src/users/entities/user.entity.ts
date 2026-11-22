import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserStatus } from '../enums/user-status.enum';

@Entity({ name: 'users', schema: 'jeereya_db' })
export class User {
  @PrimaryGeneratedColumn()
  user_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  user_name!: string | null;

  @Column({ type: 'varchar', length: 254, nullable: true, unique: true })
  user_email!: string | null;

  @Column({ type: 'varchar', length: 16, unique: true })
  user_mobile_num!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  user_password_hash!: string;

  @Column({ type: 'boolean', default: false })
  is_user_verified!: boolean;

  @Column({
    type: 'enum',
    default: UserStatus.ACTIVE,
    enum: UserStatus,
    enumName: 'user_status',
  })
  user_status: UserStatus;
}
