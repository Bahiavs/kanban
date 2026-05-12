import { Priority } from './priority';
import { Status } from './status';

export class Task {
  static fromTaskData(taskData: TaskData) {
    return new Task(
      taskData.title,
      taskData.description,
      taskData.priority,
      taskData.status,
      taskData.id,
      new Date(taskData.createdAt)
    )
  }

  constructor(
    public title: string,
    public description: string,
    public priority: Priority,
    public status: Status,
    readonly id: string = crypto.randomUUID(),
    readonly createdAt = new Date()
  ) {}

  toData(): TaskData {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
    };
  }
}

export type TaskData = {
  id: string;
  createdAt: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
};
