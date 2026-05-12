import { Routes } from '@angular/router';
import { BoardComponent } from './pages/board/board';
import { TaskDetailComponent } from './pages/task-detail/task-detail';

export const routes: Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'board', component: BoardComponent },
  {
    path: 'task/:id',
    component: BoardComponent,
    children: [{ path: '', component: TaskDetailComponent }],
  },
];
