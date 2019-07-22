import { Component, OnInit } from '@angular/core';

import {MinefieldService} from '../services/minefield.service';
import {EndInterface} from '../services/interfaces';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  private flags: number;
  private FieldsLeft: number;
  private end: EndInterface;

  constructor(private MinefieldService: MinefieldService) { 
    this.MinefieldService.getEnd().subscribe((data: EndInterface) => this.end = data);
    this.MinefieldService.getFieldsLeft().subscribe((data:number) => this.FieldsLeft = data);
  }

  ngOnInit() {
  }

  makeField(mines: number, width: number, height: number): void{
    this.MinefieldService.createMinefield(mines, width, height);
  }

  reset(): void{
    this.MinefieldService.reset();
  }
}
