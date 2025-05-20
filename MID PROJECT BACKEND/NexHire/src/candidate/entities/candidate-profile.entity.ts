import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class CandidateProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.candidateProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('simple-array', { nullable: true })
  skills: string[];

  @Column({ nullable: true })
  experience: string;

  @Column('jsonb', { nullable: true })
  education: { institution: string; degree: string; year: number }[];

  @Column({ nullable: true })
  resume: string;

  @Column({ default: true })
  isVisible: boolean;
}