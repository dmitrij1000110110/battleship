import {Component, OnInit} from '@angular/core';
import {Ship} from "../ship/ship.component";
import {Field, FieldComponent} from "../field/field.component";

export class Cell {
  id: number
  x: number
  y: number
  shot: boolean
  containsShip: boolean = false
  ship: Ship
  player: boolean
  field: Field

  constructor(id: number, x: number, y: number, player: boolean, field: Field) {
    this.id = id
    this.x = x
    this.y = y
    this.field = field
    this.player = player
  }

  putShip() {
    this.containsShip = true
    if (this.player) document.getElementById(this.id.toString()).style.background = "blue"
  }

  removeShip() {
    this.containsShip = false
    if (this.player) document.getElementById(this.id.toString()).style.background = "\#F0F0F0"
  }

  onClick() {
    if (this.containsShip)
      this.removeShip()
    else
      this.putShip()
  }

  shoot() {
    this.shot = true
    if (this.containsShip){
      this.ship.shoot()
      document.getElementById(this.id.toString()).style.background = "red"
    } else {
      document.getElementById(this.id.toString()).style.background = "lightgray"
    }
  }

  destroy(){
    this.field.destroy(this)
  }

}

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.css']
})

export class CellComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
