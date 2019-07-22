import {
  Component,
  OnInit
} from '@angular/core';

import {
  Field
} from '../services/field'
import { MinefieldService } from '../services/minefield.service';
import { EndInterface } from '../services/interfaces'

@Component({
  selector: 'app-minefield',
  templateUrl: './minefield.component.html',
  styleUrls: ['./minefield.component.css']
})
export class MinefieldComponent {

  minefield: Array<Array<Field>> = [];
  end: EndInterface = {isEnd: false, result: false};

  constructor(private MinefieldService: MinefieldService) {
    this.MinefieldService.getMinefield().subscribe((data: Array < Array < Field >>) => {
      this.minefield = data;
    });
    this.MinefieldService.getEnd().subscribe((data: EndInterface) => {
      this.end.isEnd = data.isEnd;
      this.end.result = data.result;
    })
  }

  ngOnInit() {}

  uncover(row: number, id: number): void{
    this.MinefieldService.uncover(row, id);
  }

  rightClick(row: number, id: number): void{
    this.MinefieldService.useFlag(row, id);
  }

}
