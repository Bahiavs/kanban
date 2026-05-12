import { Injectable } from '@angular/core';
import { Board, BoardData } from '../models/board';

@Injectable()
export class BoardRepository {
  private readonly localStorageKey = 'board';

  save(board: Board) {
    localStorage.setItem(this.localStorageKey, JSON.stringify(board.toData()));
  }

  get() {
    const boardJSON = localStorage.getItem(this.localStorageKey);
    if (!boardJSON) return null
    const boardData = JSON.parse(boardJSON) as BoardData;
    return new Board(boardData);
  }
}
