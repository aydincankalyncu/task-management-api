import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFiterDto } from './dto/get-tasks-filter-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, Task as TaskEntity } from './task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {

  constructor(@InjectRepository(TaskEntity) private tasksRepository: Repository<TaskEntity>){}

  async getTaskById(id: string): Promise<Task>{
    const found = await this.tasksRepository.findOneBy({id: id});
    if(!found){
      throw new NotFoundException(`Task with ID "${id}" not found.`)
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task>{
    const {title, description} = createTaskDto;

    const task = this.tasksRepository.create({
      title: title,
      description: description,
      status: TaskStatus.OPEN
    });

    await this.tasksRepository.save(task);
    return task;
  }

  async removeTask(id: string): Promise<void>{
    const result = this.tasksRepository.delete(id);
    if((await result).affected === 0){
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task>{
    const task = await this.getTaskById(id);
    task.status = status;

    await this.tasksRepository.save(task);
    
    return task;
  }
 
  async getTasks(filterDto: GetTasksFiterDto): Promise<Task[]>{

    const {status, search} = filterDto;
    
    const query = this.tasksRepository.createQueryBuilder('task');
    
    if(status){
      query.andWhere('task.status = :status', {status});
    }

    if(search){
      query.andWhere('task.title LIKE :search OR task.description LIKE :search', {search: `%${search}%`});
    }
    const tasks = await query.getMany();

    return tasks;

  }
}
