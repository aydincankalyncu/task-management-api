import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFiterDto } from './dto/get-tasks-filter-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task{
    return this.tasks.find(t => t.id == id);
  }

  removeTask(id: string): Task[]{
    this.tasks = this.tasks.filter(t => t.id !== id);
    return this.tasks;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task{
    const task = this.getTaskById(id);
    task.status = status;
    return task;
  }

  getTasksWithFilters(filterDto: GetTasksFiterDto): Task[]{
    const {status, search} = filterDto;

    let tasks = this.getAllTasks();

    if(status){
      tasks = tasks.filter(t => t.status === status);
    }

    if(search){
      tasks = tasks.filter((task) => {
        if(task.title.includes(search) || task.description.includes(search)){
          return true;
        }
        return false;
      });
    }

    return tasks;
  }
}
