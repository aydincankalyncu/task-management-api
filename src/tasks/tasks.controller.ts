import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task-dto';
import { GetTasksFiterDto } from './dto/get-tasks-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService){}

  @Get()
  getTasks(@Query() filterDto: GetTasksFiterDto): Promise<Task[]>{
    return this.tasksService.getTasks(filterDto);
  } 

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Promise<Task>{
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  removeTask(@Param('id') id: string): Promise<void>{
    return this.tasksService.removeTask(id);
  }

  @Patch('/:id/status')
  updateTaskStatus(@Param('id') id: string, @Body() updateTaskStatusDto: UpdateTaskStatusDto): Promise<Task>{
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
