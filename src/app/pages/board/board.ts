import { Component } from '@angular/core';
import { Board } from '../../models/board';

@Component({
  selector: 'app-board',
  imports: [],
  template: `


    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem">
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
      </div>
    </div>
  `,
})
export class BoardComponent {
  protected readonly board = new Board();
}
