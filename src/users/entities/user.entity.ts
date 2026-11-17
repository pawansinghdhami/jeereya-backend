import { InjectRepository } from '@nestjs/typeorm';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Repository,
} from 'typeorm';
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    user_id_num: number;

    @CreateDateColumn({ type: 'timestamptz' })
    row_created_dtm: Date

    @UpdateDateColumn({ type: 'timestamptz' })
    row_updated_dtm: Date

    @Column({length:100})
    user_name: string;

    @Column({unique: true})
    user_email: string;
}
