import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../tasks.model";

export class GetTasksFiterDto{
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;


  @IsString()
  @IsOptional()
  search?: string;
}