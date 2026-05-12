import { Injectable } from '@angular/core';
import { Board } from '../models/board';

@Injectable()
export class BoardRepository {
  private readonly localStorageKey = 'board';

  save(board: Board) {
    localStorage.setItem(this.localStorageKey, board.toString());
  }
}
