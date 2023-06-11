import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFiterDto } from './dto/get-tasks-filter-dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService){}

  @Get()
  getTasks(@Query() filterDto: GetTasksFiterDto): Task[]{
    // If we have filters defined, call tasksService.getTasksWithFilters, if not call getAllTasks

    if(Object.keys(filterDto).length){
      return this.tasksService.getTasksWithFilters(filterDto);
    }else{
      return this.tasksService.getAllTasks();
    }
  } 

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task{
    return this.tasksService.getTaskById(id)
  }

  @Delete('/:id')
  removeTask(@Param('id') id: string): Task[]{
    return this.tasksService.removeTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id: string, @Body('status') status: TaskStatus): Task{
    return this.tasksService.updateTaskStatus(id, status);
  }
}
