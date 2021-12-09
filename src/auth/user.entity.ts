import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Task } from 'src/tasks/task.entity';

@Entity()
// @Unique(['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  //   @Unique()
  username: string;

  @Column()
  password: string;
  @Column()
  salt: string;

  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  task: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    // console.log(await bcrypt.compare(password, this.password));
    return hash === this.password;
  }
}
