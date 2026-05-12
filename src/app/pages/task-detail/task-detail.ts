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
  protected readonly task: Task | undefined;

  constructor() {
    const route = inject(ActivatedRoute);
    const repo = inject(BoardRepository);
    const id = route.snapshot.paramMap.get('id');
    const board = repo.get();
    this.task = board?.tasks().find((t) => t.id === id);
  }
}
