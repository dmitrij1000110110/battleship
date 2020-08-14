import { Component, OnInit } from '@angular/core';
import {Cell} from "../cell/cell.component";
import {Field} from "../field/field.component";

export class Ship{
  length: number
  shot: number = 0
  cells: Cell[] = []
  field: Field

  constructor(cells: Cell[]) {
    this.cells = cells
    this.length = cells.length
    for (let cell of this.cells) cell.ship = this
    this.field = this.cells[0].field
  }

  shoot(){
    this.shot++
    if (this.shot == this.length) this.destroy()
  }

  destroy(){
    for (let cell of this.cells) cell.destroy()
    this.field.destroyShip()
  }

}

@Component({
  selector: 'app-ship',
  templateUrl: './ship.component.html',
  styleUrls: ['./ship.component.css']
})

export class ShipComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
