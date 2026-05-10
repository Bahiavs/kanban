import { Routes } from '@angular/router';
import { BoardComponent } from './pages/board/board';

export const routes: Routes = [
  { path: '', redirectTo: 'board', pathMatch: 'full' },
  { path: 'board', component: BoardComponent },
];
