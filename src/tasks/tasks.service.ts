import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
// import { Task, TaskStatus } from './task.model';
import { CreateTaskDto } from './dtlo/create-task.dtlo';
import { GetTaskFilterDto } from './dtlo/get-tasks-flilter.dtlo';
import { TaskStatus } from './task-status-enum';
import { Task } from './task.entity';
// import { Task } from '../../dist/tasks/task.model';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }

  // get single task
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!found) {
      //
      throw new NotFoundException(`task with id ${id} not found`);
    }
    return found;
  }

  // create task

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  // delete task
  async deleteTask(id: number, user: User): Promise<void> {
    const result = await this.taskRepository.delete({ id, userId: user.id });
    if (result.affected === 0) {
      throw new NotFoundException(`task with id ${id} not found`);
    }
  }
  // // update task status
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;

    await task.save();
    return task;
  }
}
