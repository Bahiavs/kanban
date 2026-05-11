import { Component, computed, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Board } from '../../models/board';
import { Priority } from '../../models/priority';
import { Status } from '../../models/status';
import { Subscription } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-board',
  imports: [ReactiveFormsModule, JsonPipe],
  template: `
    <input type="text" [formControl]="filterCtrl" placeholder="Filtrar por título ou descrição" />

    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; align-items: start">
      <div style="border: 1px solid white; padding: .5rem">
        <div style="display: flex; justify-content: space-between">
          <div style="text-align: center">A Fazer</div>
          <div>Total: {{ todoTasks().length }}</div>
        </div>
        @for (task of todoTasks(); track task.id) {
          <div style="border: 1px solid white; padding: .5rem; margin-top: .5rem">
            <div>Título: <input [formControl]="titleCtrlByTaskId()[task.id]" /></div>
            <div>Descrição: <input [formControl]="descriptionCtrlByTaskId()[task.id]" /></div>
            <div>
              Prioridade:
              <select [formControl]="priorityCtrlByTaskId()[task.id]">
                @for (p of priorities; track p) {
                  <option [value]="p">{{ p }}</option>
                }
              </select>
            </div>
            <div>Criado em: {{ task.createdAt }}</div>
            <button (click)="board.deleteTask(task.id)">Deletar</button>
          </div>
        }
        <button (click)="board.createTask(Status.Todo)" style="margin-top: .5rem; float: right">
          Criar tarefa
        </button>
      </div>
      <div style="border: 1px solid white; padding: .5rem">
        <div style="display: flex; justify-content: space-between">
          <div style="text-align: center">Em Progresso</div>
          <div>Total: {{ doingTasks().length }}</div>
        </div>
        @for (task of doingTasks(); track task.id) {
          <div style="border: 1px solid white; padding: .5rem; margin-top: .5rem">
            <div>Título: <input [formControl]="titleCtrlByTaskId()[task.id]" /></div>
            <div>Descrição: <input [formControl]="descriptionCtrlByTaskId()[task.id]" /></div>
            <div>
              Prioridade:
              <select [formControl]="priorityCtrlByTaskId()[task.id]">
                @for (p of priorities; track p) {
                  <option [value]="p">{{ p }}</option>
                }
              </select>
            </div>
            <div>Criado em: {{ task.createdAt }}</div>
            <button (click)="board.deleteTask(task.id)">Deletar</button>
          </div>
        }
        <button (click)="board.createTask(Status.Doing)" style="margin-top: .5rem; float: right">
          Criar tarefa
        </button>
      </div>
      <div style="border: 1px solid white; padding: .5rem">
        <div style="display: flex; justify-content: space-between">
          <div style="text-align: center">Concluído</div>
          <div>Total: {{ doneTasks().length }}</div>
        </div>
        @for (task of doneTasks(); track task.id) {
          <div style="border: 1px solid white; padding: .5rem; margin-top: .5rem">
            <div>Título: <input [formControl]="titleCtrlByTaskId()[task.id]" /></div>
            <div>Descrição: <input [formControl]="descriptionCtrlByTaskId()[task.id]" /></div>
            <div>
              Prioridade:
              <select [formControl]="priorityCtrlByTaskId()[task.id]">
                @for (p of priorities; track p) {
                  <option [value]="p">{{ p }}</option>
                }
              </select>
            </div>
            <div>Criado em: {{ task.createdAt }}</div>
            <button (click)="board.deleteTask(task.id)">Deletar</button>
          </div>
        }
        <button (click)="board.createTask(Status.Done)" style="margin-top: .5rem; float: right">
          Criar tarefa
        </button>
      </div>
    </div>

    <pre>{{ board.tasks() | json }}</pre>
  `,
})
export class BoardComponent implements OnDestroy {
  protected readonly Status = Status;
  protected readonly priorities = Object.values(Priority);

  protected readonly board = new Board();

  protected readonly filterCtrl = new FormControl('', { nonNullable: true });
  private readonly filterValue = toSignal(this.filterCtrl.valueChanges, {
    initialValue: this.filterCtrl.value,
  });

  protected readonly filteredTasks = computed(() => {
    const query = this.filterValue().toLowerCase().trim();
    if (!query) return this.board.tasks();
    return this.board
      .tasks()
      .filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query),
      );
  });

  protected readonly todoTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === Status.Todo),
  );
  protected readonly doingTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === Status.Doing),
  );
  protected readonly doneTasks = computed(() =>
    this.filteredTasks().filter((task) => task.status === Status.Done),
  );

  private titleCtrlSubs = new Subscription();
  protected readonly titleCtrlByTaskId = computed(() => {
    const tasks = this.board.tasks();
    this.titleCtrlSubs.unsubscribe();
    this.titleCtrlSubs = new Subscription();
    const titleCtrlByTaskId: Record<string, FormControl<string>> = {};
    for (const task of tasks) {
      const ctrl = new FormControl(task.title, { nonNullable: true });
      titleCtrlByTaskId[task.id] = ctrl;
      const sub = ctrl.valueChanges.subscribe((value) => this.board.editTaskTitle(task.id, value));
      this.titleCtrlSubs.add(sub);
    }
    return titleCtrlByTaskId;
  });

  private descriptionCtrlSubs = new Subscription();
  protected readonly descriptionCtrlByTaskId = computed(() => {
    const tasks = this.board.tasks();
    this.descriptionCtrlSubs.unsubscribe();
    this.descriptionCtrlSubs = new Subscription();
    const descriptionCtrlByTaskId: Record<string, FormControl<string>> = {};
    for (const task of tasks) {
      const ctrl = new FormControl(task.description, { nonNullable: true });
      descriptionCtrlByTaskId[task.id] = ctrl;
      const sub = ctrl.valueChanges.subscribe((value) =>
        this.board.editTaskDescription(task.id, value),
      );
      this.descriptionCtrlSubs.add(sub);
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

  ngOnDestroy() {
    this.titleCtrlSubs.unsubscribe();
    this.descriptionCtrlSubs.unsubscribe();
    this.priorityCtrlSubs.unsubscribe();
  }
}
