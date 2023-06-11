import { TaskStatus } from "../tasks.model";

export class GetTasksFiterDto{
  status?: TaskStatus;
  search?: string;
}