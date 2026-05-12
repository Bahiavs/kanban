import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BoardRepository } from '../../repositories/board.repository';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-detail',
  providers: [BoardRepository],
  template: ``,
})
export class TaskDetailComponent implements OnInit {
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id');
  private readonly board = inject(BoardRepository).get();
  protected readonly task: Task | undefined = this.board?.tasks().find((t) => t.id === this.id);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  ngOnInit() {
    const ref = this.dialog.open(TaskDetailDialogComponent, { data: this.task });
    ref.afterClosed().subscribe(() => this.router.navigate(['/board']));
  }
}

@Component({
  selector: 'app-task-detail-dialog',
  template: `
    <div>
      <div>{{ task.title }}</div>
      <div>Descrição: {{ task.description }}</div>
      <div>Prioridade: {{ task.priority }}</div>
      <div>Status: {{ task.status }}</div>
      <div>Criado em: {{ task.createdAt }}</div>
    </div>
  `,
})
export class TaskDetailDialogComponent {
  protected readonly task = inject<Task>(MAT_DIALOG_DATA);
}
