import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BoardRepository } from '../../repositories/board.repository';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-detail',
  imports: [RouterLink],
  providers: [BoardRepository],
  template: `
    @if (task) {
      <div>
        <div>{{ task.title }}</div>
        <div>Descrição: {{ task.description || '—' }}</div>
        <div>Prioridade: {{ task.priority }}</div>
        <div>Status: {{ task.status }}</div>
        <div>Criado em: {{ task.createdAt }}</div>
        <a routerLink="/board">Voltar</a>
      </div>
    } @else {
      <div>Tarefa não encontrada.</div>
      <a routerLink="/board">Voltar</a>
    }
  `,
})
export class TaskDetailComponent {
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  private readonly board = inject(BoardRepository).get();
  protected readonly task: Task | undefined = this.board?.tasks().find((t) => t.id === this.id);
}
