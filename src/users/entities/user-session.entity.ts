import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jeereya_db.user_session')
export class UserSession {
  @PrimaryGeneratedColumn()
  user_session_id_num: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm: Date;

  @Column({ type: 'timestamptz' })
  expires_at_dtm: Date;

  @Column({ type: 'timestamptz' })
  revoked_at_dtm: Date;

  @Column({ unique: true})
  token_hash: string;
}
