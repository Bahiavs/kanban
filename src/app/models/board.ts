import { computed, signal } from '@angular/core';
import { Priority } from './priority';
import { Status } from './status';
import { Task, TaskData } from './task';

export class Board {
  private readonly _tasks = signal<Task[]>([]);
  readonly tasks = this._tasks.asReadonly();

  constructor(boardData: TaskData[]) {
    this._tasks.set(boardData.map((taskData) => Task.fromTaskData(taskData)));
  }

  createTask(status: Status) {
    const task = new Task('Nova Tarefa', '', Priority.Low, status);
    this._tasks.update((tasks) => [...tasks, task]);
  }

  editTaskTitle(id: string, title: string) {
    this._tasks.update((tasks) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return tasks;
      try {
        task.setTitle(title);
      } catch (error) {
        console.error(error);
      }
      return [...tasks];
    });
  }

  editTaskDescription(id: string, description: string) {
    this._tasks.update((tasks) => {
      const task = tasks.find((t) => t.id === id);
      if (task) task.description = description;
      return [...tasks];
    });
  }

  editTaskPriority(id: string, priority: Priority) {
    this._tasks.update((tasks) => {
      const task = tasks.find((t) => t.id === id);
      if (task) task.priority = priority;
      return [...tasks];
    });
  }

  deleteTask(id: string) {
    this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));
  }

  changeTaskStatus(id: string, status: Status) {
    this._tasks.update((tasks) => {
      const task = tasks.find((t) => t.id === id);
      if (task) task.status = status;
      return [...tasks];
    });
  }

  toData() {
    return this._tasks().map((task) => task.toData());
  }
}

export type BoardData = TaskData[];
