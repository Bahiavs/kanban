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
      new Date(taskData.createdAt),
    );
  }

  static readonly minTitleChar = 3;
  static readonly maxDescriptionChar = 500;

  constructor(
    public title: string,
    public description: string,
    public priority: Priority,
    public status: Status,
    readonly id: string = crypto.randomUUID(),
    readonly createdAt = new Date(),
  ) {
    if (title.length < Task.minTitleChar)
      throw `title must have at leas ${Task.minTitleChar} chars`;
  }

  setTitle(title: string) {
    if (title.length < Task.minTitleChar)
      throw `title must have at least ${Task.minTitleChar} chars`;
    this.title = title;
  }

  setDescription(description: string) {
    if (description.length > Task.maxDescriptionChar)
      throw `description must have at most ${Task.maxDescriptionChar} chars`;
    this.description = description;
  }

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
