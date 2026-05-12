import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardRepository } from '../../repositories/board.repository';
import { Task } from '../../models/task';
import { Status } from '../../models/status';

const statusLabel: Record<Status, string> = {
  [Status.Todo]: 'A Fazer',
  [Status.Doing]: 'Em Progresso',
  [Status.Done]: 'Concluído',
};

@Component({
  selector: 'app-task-detail',
  providers: [BoardRepository],
  template: ``,
})
export class TaskDetailComponent implements OnInit {
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  private readonly board = inject(BoardRepository).get();
  private readonly task: Task | undefined = this.board?.tasks().find((t) => t.id === this.id);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  ngOnInit() {
    const ref = this.dialog.open(TaskDetailDialogComponent, { data: this.task });
    ref.afterClosed().subscribe(() => this.router.navigate(['/board']));
  }
}

@Component({
  selector: 'app-task-detail-dialog',
  imports: [DatePipe],
  template: `
    <article>
      <h2>{{ task.title }}</h2>
      <div class="row">
        <span class="label">Descrição</span>
        <span class="description-value">{{ task.description || '—' }}</span>
      </div>
      <div class="row">
        <span class="label">Prioridade</span>
        <span>{{ task.priority }}</span>
      </div>
      <div class="row">
        <span class="label">Status</span>
        <span>{{ statusLabel[task.status] }}</span>
      </div>
      <div class="row">
        <span class="label">Criado em</span>
        <time>{{ task.createdAt | date:'fullDate':'':'pt' }}</time>
      </div>
    </article>
  `,
  styles: [`
    :host {
      display: block;
      background: black;
      color: white;
      padding: 1rem;
      min-width: 320px;
      border: 2px solid rgb(255 255 255 / 0.8);
      border-radius: inherit;
    }

    h2 {
      margin: 0 0 1rem;
      font-size: 1.2rem;
    }

    .row {
      display: flex;
      gap: 1em;
      margin-top: 1rem;
    }

    .label {
      color: rgb(255 255 255 / 0.6);
      white-space: nowrap;
    }

    .description-value {
      overflow-wrap: break-word;
      min-width: 0;
    }
  `]
})
export class TaskDetailDialogComponent {
  protected readonly task = inject<Task>(MAT_DIALOG_DATA);
  protected readonly statusLabel = statusLabel;
}
