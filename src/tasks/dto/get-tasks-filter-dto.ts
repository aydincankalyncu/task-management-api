import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../task-status.enum";

export class GetTasksFiterDto{
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;


  @IsString()
  @IsOptional()
  search?: string;
}