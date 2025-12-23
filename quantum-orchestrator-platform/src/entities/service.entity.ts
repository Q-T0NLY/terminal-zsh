import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { ServiceProtocol, ServiceStatus, ServiceHealth } from '../mesh/MeshInterface';

@Entity('services')
export class ServiceEntity {
  @PrimaryColumn()
    id!: string;

  @Column()
    name!: string;

  @Column()
    version!: string;

  @Column({ nullable: true })
    description?: string;

  @Column({
    type: 'enum',
    enum: ServiceProtocol,
    default: ServiceProtocol.HTTP
  })
    protocol!: ServiceProtocol;

  @Column()
    host!: string;

  @Column()
    port!: number;

  @Column('simple-array')
    endpoints!: string[];

  @Column('simple-array')
    dependencies!: string[];

  @Column('jsonb')
    health!: ServiceHealth;

  @Column({ nullable: true })
    apiKey?: string;

  @Column({ default: 100 })
    rateLimit!: number;

  @CreateDateColumn()
    createdAt!: Date;

  @UpdateDateColumn()
    updatedAt!: Date;
}
