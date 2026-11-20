import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'otp_challenges', schema: 'jeereya_db' })
export class OtpChallenge {
  @PrimaryGeneratedColumn()
  otp_challenge_id_num!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  row_created_dtm!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  row_updated_dtm!: Date;

  @Column({ type: 'timestamptz' })
  expires_at_dtm!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  consumed_at_dtm!: Date | null;

  @Column({ type: 'varchar', length: 16 })
  user_mobile_num!: string;

  @Column({ type: 'varchar', length: 64 })
  otp_hash!: string;

  @Column({ type: 'integer', default: 0 })
  attempts!: number;
}
