import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PluginCategory, PluginStatus, PluginConfig } from '../registry/PluginInterface';

@Entity('plugins')
export class PluginEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  version: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  author?: string;

  @Column({
    type: 'enum',
    enum: PluginCategory,
  })
  category: PluginCategory;

  @Column('simple-array')
  capabilities: string[];

  @Column('simple-array')
  dependencies: string[];

  @Column('jsonb')
  config: PluginConfig;

  @Column({
    type: 'enum',
    enum: PluginStatus,
    default: PluginStatus.REGISTERED,
  })
  status: PluginStatus;

  @Column({ default: true })
  enabled: boolean;

  @Column({ nullable: true })
  checksum?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
