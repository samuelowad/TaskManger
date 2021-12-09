import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { GetTaskFilterDto } from './dtlo/get-tasks-flilter.dtlo';
import { TaskStatus } from './task-status-enum';
import { TaskRepository } from './task.repository';
import { TasksService } from './tasks.service';

// mock user
const mockUser = { id: 12, username: 'user' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  deleteTask: jest.fn(),
});

describe('tasksService', () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('get all task', async () => {
      taskRepository.getTasks.mockResolvedValue('value');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTaskFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: '',
      };
      //   call task service
      const result = await tasksService.getTasks(filters, mockUser);
      //   console.log(result);

      //   expect taskRepository.getTasks().toHaveBeenCalled
      expect(taskRepository.getTasks).toHaveBeenCalled();

      expect(result).toEqual('value');
    });
  });

  describe('get task by Id', () => {
    it('calls taskRepository findone and returns task', async () => {
      const mockTask = {
        title: 'testets',
        description: 'test dec',
      };
      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('throws error task not found', async () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('should create task', async () => {
      const mockTask = { title: 'task', description: 'task description' };
      taskRepository.createTask.mockResolvedValue('value');
      const result = await tasksService.createTask(mockTask, mockUser);
      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockTask,
        mockUser,
      );
      expect(result).toEqual('value');
    });
  });

  describe('deleteTask', () => {
    it('should call deleteTask task', async () => {
      taskRepository.deleteTask.mockResolvedValue({ affected: 1 });
      expect(taskRepository.deleteTask).not.toHaveBeenCalled();
      await tasksService.deleteTask(1, mockUser);
      expect(taskRepository.deleteTask).toHaveBeenCalled();
    });

    it('throws error when task not found', async () => {});
  });
});
