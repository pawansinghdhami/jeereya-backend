import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_session', schema: 'jeereya_db' })
export class UserSession {
  @PrimaryGeneratedColumn()
  user_session_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @Column({ type: 'timestamptz' })
  expires_at_dtm!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revoked_at_dtm!: Date | null;

  @Column({ type: 'varchar', length: 64, unique: true })
  token_hash!: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id_num', referencedColumnName: 'user_id_num' })
  user!: User;
}
