import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtlo/create-task.dtlo';
import { GetTaskFilterDto } from './dtlo/get-tasks-flilter.dtlo';
import { TaskStatusValidationPipe } from './dtlo/pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status-enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user-decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @GetUser() user: User,
    @Query(ValidationPipe) fliterDto: GetTaskFilterDto,
  ): Promise<Task[]> {
    console.log(user);

    return this.tasksService.getTasks(fliterDto, user);
  }

  //
  // getTasks(filterDto:GetTaskFilterDto){

  // }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    console.log(user);

    // console.log(title, description);
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    // console.log(id);
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
