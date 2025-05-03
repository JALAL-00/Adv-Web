import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Job, (job) => job.id)
  job: Job;

  @ManyToOne(() => User, (user) => user.applications)
  candidate: User;

  @Column({ nullable: true })
  resume: string;

  @Column({ nullable: true })
  coverLetter: string;

  @Column({ default: 'pending' })
  status: string;
}