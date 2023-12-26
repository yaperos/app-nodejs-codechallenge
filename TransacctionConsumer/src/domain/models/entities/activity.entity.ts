import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * @author RRG
 */
@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('integer')
  visitor_profile_id: number;

  @Column('integer')
  user_profile_id: number;

  @Column('integer')
  community_id: number;

  @Column('integer')
  gate_id: number;

  @Column('text')
  img: string;

  @Column('varchar', { length: 255 })
  plate: string;

  @Column('text')
  reason: string;

  @Column('varchar', { length: 255 })
  methods: string;

  @Column('varchar', { length: 255 })
  events: string;

  @Column('boolean')
  process_is_valid: boolean;

  @Column('text')
  log_desc: string;

  @Column('bigint')
  date: number;

  @Column('timestamp without time zone')
  created_at: Date;

  @Column('timestamp without time zone')
  updated_at: Date;
}
