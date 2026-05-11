import { Component } from '@angular/core';
import { Board } from '../../models/board';
import { Status } from '../../models/status';

@Component({
  selector: 'app-board',
  imports: [],
  template: `
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; align-items: start">
      <div style="border: 1px solid white; padding: .5rem">
        <div style="display: flex; justify-content: space-between">
          <div style="text-align: center">Todo</div>
          <div>Total: {{ board.todoTasks().length }}</div>
        </div>
        @for (task of board.todoTasks(); track task.id) {
          <div style="border: 1px solid white; padding: .5rem; margin-top: .5rem">
            <div>Title: {{ task.title }}</div>
            <div>Description: {{ task.description }}</div>
            <div>Priority: {{ task.priority }}</div>
            <div>Created at: {{ task.createdAt }}</div>
            <button (click)="board.deleteTask(task.id)">Deletar</button>
          </div>
        }
        <button (click)="board.createTask(Status.Todo)" style="margin-top: .5rem; float: right">
          Criar tarefa
        </button>
      </div>
      <div style="border: 1px solid white; padding: .5rem">
        <div style="display: flex; justify-content: space-between">
          <div style="text-align: center">Doing</div>
          <div>Total: {{ board.doingTasks().length }}</div>
        </div>
        @for (task of board.doingTasks(); track task.id) {
          <div style="border: 1px solid white; padding: .5rem; margin-top: .5rem">
            <div>Title: {{ task.title }}</div>
            <div>Description: {{ task.description }}</div>
            <div>Priority: {{ task.priority }}</div>
            <div>Created at: {{ task.createdAt }}</div>
            <button (click)="board.deleteTask(task.id)">Deletar</button>
          </div>
        }
        <button (click)="board.createTask(Status.Doing)" style="margin-top: .5rem; float: right">
          Criar tarefa
        </button>
      </div>
      <div style="border: 1px solid white; padding: .5rem">
        <div style="display: flex; justify-content: space-between">
          <div style="text-align: center">Done</div>
          <div>Total: {{ board.doneTasks().length }}</div>
        </div>
        @for (task of board.doneTasks(); track task.id) {
          <div style="border: 1px solid white; padding: .5rem; margin-top: .5rem">
            <div>Title: {{ task.title }}</div>
            <div>Description: {{ task.description }}</div>
            <div>Priority: {{ task.priority }}</div>
            <div>Created at: {{ task.createdAt }}</div>
            <button (click)="board.deleteTask(task.id)">Deletar</button>
          </div>
        }
        <button (click)="board.createTask(Status.Done)" style="margin-top: .5rem; float: right">
          Criar tarefa
        </button>
      </div>
    </div>
  `,
})
export class BoardComponent {
  protected readonly board = new Board();
  protected readonly Status = Status;
}
