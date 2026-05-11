import { computed, signal } from '@angular/core';
import { Priority } from './priority';
import { Status } from './status';
import { Task } from './task';

export class Board {
  private readonly _tasks = signal<Task[]>([
    new Task('Design wireframes', 'Create low-fidelity wireframes for the new dashboard', Priority.High, Status.Todo),
    new Task('Write unit tests', 'Add coverage for the authentication module', Priority.Medium, Status.Todo),
    new Task('Update README', 'Document the new setup steps for local development', Priority.Low, Status.Todo),
    new Task('Implement login page', 'Build the login form with validation and error handling', Priority.High, Status.Doing),
    new Task('Refactor API service', 'Extract HTTP calls into a dedicated service layer', Priority.Medium, Status.Doing),
    new Task('Fix navbar overflow', 'Resolve the horizontal scroll issue on mobile viewports', Priority.Low, Status.Doing),
    new Task('Set up CI pipeline', 'Configure GitHub Actions for automated builds and tests', Priority.High, Status.Done),
    new Task('Create color tokens', 'Define the design system color variables in the theme file', Priority.Medium, Status.Done),
    new Task('Add loading spinner', 'Show a spinner while async data is being fetched', Priority.Low, Status.Done),
  ])
  readonly tasks = this._tasks.asReadonly()

  createTask(status: Status) {
    const task = new Task('Nova Tarefa', '', Priority.Low, status)
    this._tasks.update((tasks) => [...tasks, task]);
  }

  editTaskTitle(id: string, title: string) {
    this._tasks.update(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) task.title = title;
      return [...tasks];
    });
  }

  editTaskDescription(id: string, description: string) {
    this._tasks.update(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) task.description = description;
      return [...tasks];
    });
  }

  editTaskPriority(id: string, priority: Priority) {
    this._tasks.update(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) task.priority = priority;
      return [...tasks];
    });
  }

  deleteTask(id: string) {
    this._tasks.update(tasks => tasks.filter((task) => task.id !== id))
  }

  changeTaskStatus(id: string, status: Status) {
    this._tasks.update(tasks => {
      const task = tasks.find(t => t.id === id);
      if (task) task.status = status;
      return [...tasks];
    });
  }

  searchByTitleOrDescription() {
    // todo
  }

  filterByPriority() {
    // todo
  }
}
