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
      if (!task) return tasks;
      try {
        task.setDescription(description);
      } catch (error) {
        console.error(error);
      }
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

  reorderTask(id: string, targetStatus: Status, beforeTaskId: string | null) {
    this._tasks.update((tasks) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return tasks;
      task.status = targetStatus;
      const remaining = tasks.filter((t) => t.id !== id);
      if (beforeTaskId === null) return [...remaining, task];
      const insertAt = remaining.findIndex((t) => t.id === beforeTaskId);
      return insertAt === -1
        ? [...remaining, task]
        : [...remaining.slice(0, insertAt), task, ...remaining.slice(insertAt)];
    });
  }

  toData() {
    return this._tasks().map((task) => task.toData());
  }
}

export type BoardData = TaskData[];
