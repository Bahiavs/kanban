import { Component, computed, effect, inject, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Board } from '../../models/board';
import { Priority } from '../../models/priority';
import { Status } from '../../models/status';
import { Task } from '../../models/task';
import { Subscription } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { BoardRepository } from '../../repositories/board.repository';

@Component({
  selector: 'app-board',
  imports: [ReactiveFormsModule, JsonPipe, CdkDropList, CdkDrag],
  template: `
    <input type="text" [formControl]="filterCtrl" placeholder="Filtrar por título ou descrição" />

    <select [formControl]="filterPriorityCtrl">
      <option value="">Todas as prioridades</option>
      @for (p of priorities; track p) {
        <option [value]="p">{{ p }}</option>
      }
    </select>

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; align-items: start">
      @for (col of columns; track col.status) {
        <div
          cdkDropList
          [id]="col.status"
          [cdkDropListData]="col.status"
          [cdkDropListConnectedTo]="connectedTo(col.status)"
          (cdkDropListDropped)="onDrop($event)"
          style="border: 1px solid white; padding: .5rem"
        >
          <div style="display: flex; justify-content: space-between">
            <div style="text-align: center">{{ col.label }}</div>
            <div>Total: {{ tasksByStatus()[col.status]?.length ?? 0 }}</div>
          </div>
          @for (task of tasksByStatus()[col.status] ?? []; track task.id) {
            <div
              style="border: 1px solid white; padding: .5rem; margin-top: .5rem; cursor: grab"
              cdkDrag
              [cdkDragData]="task"
            >
              <div>
                <div>
                  Título:
                  <input
                    [formControl]="titleCtrlByTaskId()[task.id]"
                    (blur)="onTitleBlur(task.id, task)"
                  />
                </div>
                <div style="font-size: 0.875rem">
                  {{ titleCtrlByTaskId()[task.id].value.length }} caracteres
                  @if (titleCtrlByTaskId()[task.id].hasError('minlength')) {
                    <span style="color: red">
                      (mínimo
                      {{ titleCtrlByTaskId()[task.id].getError('minlength')?.requiredLength }})
                    </span>
                  }
                </div>
              </div>
              <div>
                <div>
                  Descrição:
                  <input
                    [formControl]="descriptionCtrlByTaskId()[task.id]"
                    [maxlength]="maxDescriptionChar"
                    (blur)="onDescriptionBlur(task.id, task)"
                  />
                </div>
                <span style="font-size: 0.875rem"
                  >{{ descriptionCtrlByTaskId()[task.id].value.length }}/{{
                    maxDescriptionChar
                  }}</span
                >
              </div>
              <div>
                Prioridade:
                <select [formControl]="priorityCtrlByTaskId()[task.id]">
                  @for (p of priorities; track p) {
                    <option [value]="p">{{ p }}</option>
                  }
                </select>
              </div>
              <div>Criado em: {{ task.createdAt }}</div>
              <button (click)="onViewTask(task.id)">Ver Detalhes</button>
              <button (click)="onDeleteTask(task.id)">Deletar</button>
            </div>
          }
          <button (click)="board.createTask(col.status)" style="margin-top: .5rem; float: right">
            Criar tarefa
          </button>
        </div>
      }
    </div>

    <pre>{{ board.tasks() | json }}</pre>
  `,
  providers: [BoardRepository],
})
export class BoardComponent implements OnDestroy {
  private readonly boardRepository = inject(BoardRepository);
  private readonly router = inject(Router);
  protected readonly board = this.boardRepository.get() ?? new Board([]);
  protected readonly priorities = Object.values(Priority);

  protected readonly maxDescriptionChar = Task.maxDescriptionChar;
  protected readonly columns = [
    { status: Status.Todo, label: 'A Fazer' },
    { status: Status.Doing, label: 'Em Progresso' },
    { status: Status.Done, label: 'Concluído' },
  ];

  protected readonly filterCtrl = new FormControl('', { nonNullable: true });
  private readonly filterValue = toSignal(this.filterCtrl.valueChanges, {
    initialValue: this.filterCtrl.value,
  });

  protected readonly filterPriorityCtrl = new FormControl<Priority | ''>('', { nonNullable: true });
  private readonly filterPriority = toSignal(this.filterPriorityCtrl.valueChanges, {
    initialValue: this.filterPriorityCtrl.value,
  });

  protected readonly filteredTasks = computed(() => {
    const query = this.filterValue().toLowerCase().trim();
    const priority = this.filterPriority();
    return this.board
      .tasks()
      .filter(
        (task) =>
          (!query ||
            task.title.toLowerCase().includes(query) ||
            task.description.toLowerCase().includes(query)) &&
          (!priority || task.priority === priority),
      );
  });

  protected readonly tasksByStatus = computed(() => {
    const grouped: Partial<Record<Status, Task[]>> = {};
    for (const task of this.filteredTasks()) {
      (grouped[task.status] ??= []).push(task);
    }
    return grouped;
  });

  protected readonly titleCtrlByTaskId = computed(() => {
    const tasks = this.board.tasks();
    const titleCtrlByTaskId: Record<string, FormControl<string>> = {};
    for (const task of tasks) {
      const ctrl = new FormControl(task.title, {
        nonNullable: true,
        validators: Validators.minLength(Task.minTitleChar),
      });
      titleCtrlByTaskId[task.id] = ctrl;
    }
    return titleCtrlByTaskId;
  });

  protected readonly descriptionCtrlByTaskId = computed(() => {
    const tasks = this.board.tasks();
    const descriptionCtrlByTaskId: Record<string, FormControl<string>> = {};
    for (const task of tasks) {
      const ctrl = new FormControl(task.description, {
        nonNullable: true,
        validators: Validators.maxLength(Task.maxDescriptionChar),
      });
      descriptionCtrlByTaskId[task.id] = ctrl;
    }
    return descriptionCtrlByTaskId;
  });

  private priorityCtrlSubs = new Subscription();
  protected readonly priorityCtrlByTaskId = computed(() => {
    const tasks = this.board.tasks();
    this.priorityCtrlSubs.unsubscribe();
    this.priorityCtrlSubs = new Subscription();
    const priorityCtrlByTaskId: Record<string, FormControl<Priority>> = {};
    for (const task of tasks) {
      const ctrl = new FormControl(task.priority, { nonNullable: true });
      priorityCtrlByTaskId[task.id] = ctrl;
      const sub = ctrl.valueChanges.subscribe((value) =>
        this.board.editTaskPriority(task.id, value),
      );
      this.priorityCtrlSubs.add(sub);
    }
    return priorityCtrlByTaskId;
  });

  private readonly boardPersister = effect(() => {
    const tasks = this.board.tasks();
    this.boardRepository.save(this.board);
  });

  ngOnDestroy() {
    this.priorityCtrlSubs.unsubscribe();
  }

  connectedTo(status: Status): Status[] {
    return Object.values(Status).filter((s) => s !== status);
  }

  onDrop(event: CdkDragDrop<Status, Status, Task>) {
    const task = event.item.data;
    const targetStatus = event.container.data;
    const sameColumn = event.previousContainer === event.container;
    const tasksInTarget = this.tasksByStatus()[targetStatus] ?? [];
    const tasksForIndexing = sameColumn
      ? tasksInTarget.filter((t) => t.id !== task.id)
      : tasksInTarget;
    const beforeTask = tasksForIndexing[event.currentIndex] ?? null;
    this.board.reorderTask(task.id, targetStatus, beforeTask?.id ?? null);
  }

  onViewTask(taskId: string) {
    this.router.navigate(['/task', taskId]);
  }

  onDeleteTask(taskId: string) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;
    this.board.deleteTask(taskId);
  }

  onTitleBlur(taskId: string, task: Task) {
    const ctrl = this.titleCtrlByTaskId()[taskId];
    if (ctrl.valid) this.board.editTaskTitle(taskId, ctrl.value);
    else ctrl.reset(task.title);
  }

  onDescriptionBlur(taskId: string, task: Task) {
    const ctrl = this.descriptionCtrlByTaskId()[taskId];
    if (ctrl.valid) this.board.editTaskDescription(taskId, ctrl.value);
    else ctrl.reset(task.description);
  }
}
