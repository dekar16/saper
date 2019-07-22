import {
  Injectable
} from '@angular/core';
import {
  BehaviorSubject,
  Observable
} from 'rxjs';

import {
  Field
} from './field';

import {
  EndInterface
} from './interfaces';

@Injectable({
  providedIn: 'root'
})
export class MinefieldService {

  private minefield: Array < Array < Field >> = [];
  private minesPosition: Array < Array < number >> = [];
  private fieldsLeft: number = 0;
  private end: EndInterface = {
    isEnd: false,
    result: false
  };

  private minefieldObs: BehaviorSubject < Array < Array < Field >>> = new BehaviorSubject(this.minefield);
  private fieldsLeftObs: BehaviorSubject < number > = new BehaviorSubject(this.fieldsLeft);
  private endObs: BehaviorSubject < EndInterface > = new BehaviorSubject(this.end);

  constructor() {}

  createMinefield(mines: number, width: number, height: number): void {

    function arrayChecker(arrayOfArrays: Array < Array < number >> , arayOfNumbers: Array < number > ): boolean {
      if (arrayOfArrays.length === 0) return false;

      for (let i = 0; i < arrayOfArrays.length; i++) {
        if (arrayOfArrays[i][0] === arayOfNumbers[0] && arrayOfArrays[i][1] === arayOfNumbers[1]) return true;
      }
      return false;
    }

    function selectMinePosiiton(width: number, height: number, mines: number): Array < Array < number >> {
      let selectedFields: Array < Array < number >> = [];

      while (selectedFields.length < mines) {
        let selected: Array < number > = [ /*ROW*/ Math.floor(Math.random() * height), /*ID */ Math.floor(Math.random() * width)];
        if (!arrayChecker(selectedFields, selected)) {
          selectedFields.push(selected);
        }
      }

      return selectedFields;
    }

    function createNeighbor(row: number, id: number, width: number, height: number): Array < Array < number >> {

      let up: boolean, down: boolean, left: boolean, right: boolean;
      let neighbors: Array < Array < number >> = [];

      up = (row !== 0) ? true : false; /*false - no up line */
      down = (row !== height - 1) ? true : false; /*false - no down line */
      left = (id !== 0) ? true : false; /*false - no left line */
      right = (id !== width - 1) ? true : false; /*false - no right line */

      if (up) {
        neighbors.push([row - 1, id]);
      }
      if (down) {
        neighbors.push([row + 1, id]);
      }
      if (left) {
        neighbors.push([row, id - 1]);
      }
      if (right) {
        neighbors.push([row, id + 1]);
      }
      if (up && left) {
        neighbors.push([row - 1, id - 1]);
      }
      if (up && right) {
        neighbors.push([row - 1, id + 1]);
      }
      if (down && left) {
        neighbors.push([row + 1, id - 1]);
      }
      if (down && right) {
        neighbors.push([row + 1, id + 1]);
      }

      return neighbors;
    }

    function nearMinesCount(neighbors: Array < Array < number >> , minesPosition: Array < Array < number >> ): number {
      let counter: number = 0;

      for (let i = 0; i < minesPosition.length; i++) {
        for (let j = 0; j < neighbors.length; j++) {
          if (minesPosition[i][0] === neighbors[j][0] && minesPosition[i][1] === neighbors[j][1]) {
            counter++;
          }
        }
      }
      return counter;
    }


    /*Main function */
    if (this.minefield.length !== 0) {
      this.minefield = [];
    }
    this.minesPosition = selectMinePosiiton(width, height, mines);
    let createdMinefield: Array < Array < Field >> = [];

    for (let i = 0; i < height; i++) {
      /*ROW*/
      let row = [];
      for (let j = 0; j < width; j++) {
        /*ID*/
        let neighbors: Array < Array < number >> = createNeighbor(i, j, width, height);
        row.push(new Field(i, j, arrayChecker(this.minesPosition, [i, j]), neighbors, nearMinesCount(neighbors, this.minesPosition), false, false));
      }
      createdMinefield.push(row);
      row = [];
    }
    this.minefield = createdMinefield;
    this.minefieldObs.next(this.minefield);

    this.fieldsLeft = width * height;
    this.fieldsLeftObs.next(this.fieldsLeft);
  }


  getMinefield(): Observable < Array < Array < Field >>> {
    return this.minefieldObs.asObservable();
  }

  useFlag(row: number, id: number): void {
    let chosen = this.minefield[row][id];

    if (!chosen.revealed && !chosen.flag) {
      chosen.flag = true;
    } else if (!chosen.revealed && chosen.flag) {
      chosen.flag = false;
    }
  }

  getFieldsLeft(): Observable < number > {
    return this.fieldsLeftObs.asObservable();
  }

  uncover(row: number, id: number): void {
    let chosen = this.minefield[row][id];

    if (chosen.isMine || this.fieldsLeft === this.minesPosition.length + 1) {
      chosen.revealed = true;
      if (chosen.isMine) {
        this.end["isEnd"] = true;
        this.end["result"] = false;
        this.endObs.next(this.end);
      } else {
        this.end["isEnd"] = true;
        this.end["result"] = true;
        this.endObs.next(this.end);
      }
    } else if (chosen.nearMines !== 0 && !chosen.revealed && !chosen.flag && !chosen.isMine || chosen.isMine && !chosen.flag && !chosen.revealed) {
      chosen.revealed = true;
      this.fieldsLeft--;
      this.fieldsLeftObs.next(this.fieldsLeft);
    } else if (!chosen.revealed && !chosen.flag) {
      chosen.revealed = true;
      this.fieldsLeft--;
      this.fieldsLeftObs.next(this.fieldsLeft);
      for (let i = 0; i < chosen.neighbor.length; i++) {
        this.uncover(chosen.neighbor[i][0], chosen.neighbor[i][1]);
      }
    }
  }

  getEnd(): Observable < EndInterface > {
    return this.endObs.asObservable();
  }

  reset(): void{
    this.minefield = [];
    this.minesPosition = [];
    this.fieldsLeft = 0;
    this.end = {
    isEnd: false,
    result: false}


    this.minefieldObs.next(this.minefield);
    this.fieldsLeftObs.next(this.fieldsLeft);
    this.endObs.next(this.end);
  };
}
