import {Component, Injectable, OnInit} from '@angular/core';
import {Cell} from "../cell/cell.component";
import {Ship} from "../ship/ship.component";

@Injectable()
export class Field {

  cells: Cell[][] = []
  ships: Ship[] = []
  player: boolean
  shipsLeft: number = 10
  correct: boolean = false
  fieldComponent: FieldComponent

  constructor(player: boolean, fieldComponent: FieldComponent) {
    this.fieldComponent = fieldComponent
    this.player = player
    for (let i = 0; i < 10; ++i) {
      this.cells.push([])
      for (let j = 0; j < 10; ++j) {
        var add = 0
        if (player === false) add = 100
        this.cells[i].push(new Cell(i * 10 + j + add, i, j, this.player, this))
      }
    }
  }

  onClick(cell: Cell) {
    if (this.player) {
      cell.onClick()
      const start = document.getElementById("start")
      if (this.correctPlacement()) {
        this.correct = true
        start.innerText = "Начать игру"
      } else {
        this.correct = false
        start.innerText = "Расставьте корабли"
      }
    } else {
      cell.shoot()
      if (!cell.containsShip) this.fieldComponent.onClick()
    }
  }

  correctPlacement(): boolean {
    while (this.ships.length > 0) this.ships.pop()
    for (let i = 0; i < 10; ++i) {
      for (let j = 0; j < 10; ++j) {
        if (this.cells[i][j].containsShip) {
          let flag = true
          if (i > 0 && this.cells[i - 1][j].containsShip) flag = false
          if (i < 9 && this.cells[i + 1][j].containsShip) flag = false
          if (j > 0 && this.cells[i][j - 1].containsShip) flag = false
          if (j < 9 && this.cells[i][j + 1].containsShip) flag = false
          if (flag) this.ships.push(new Ship([this.cells[i][j]]))
        }
        for (let l = 2; l <= 4; ++l) {
          if (i + l <= 10) {
            let flag = true
            let shipCells = []
            for (let k = 0; k < l; ++k) {
              if (!this.cells[i + k][j].containsShip) flag = false
              shipCells.push(this.cells[i + k][j])
            }
            if (flag && (i + l == 10 || !this.cells[i + l][j].containsShip) && (i == 0 || !this.cells[i - 1][j].containsShip)) this.ships.push(new Ship(shipCells))
          }
          if (j + l <= 10) {
            let flag = true
            let shipCells = []
            for (let k = 0; k < l; ++k) {
              if (!this.cells[i][j + k].containsShip) flag = false
              shipCells.push(this.cells[i][j + k])
            }
            if (flag && (j + l == 10 || !this.cells[i][j + l].containsShip) && (j == 0 || !this.cells[i][j - 1].containsShip)) this.ships.push(new Ship(shipCells))
          }
        }
      }
    }
    if (this.ships.length != 10) return false
    for (let i = 0; i < 10; ++i) {
      for (let j = i + 1; j < 10; ++j) {
        for (let cell1 of this.ships[i].cells) {
          for (let cell2 of this.ships[j].cells) {
            const dx = Math.abs(cell1.x - cell2.x)
            const dy = Math.abs(cell1.y - cell2.y)
            if (dx <= 1 && dy <= 1) return false
          }
        }
      }
    }
    const cnt = [0, 0, 0, 0]
    for (let ship of this.ships) {
      cnt[ship.length - 1]++
    }
    for (let i = 0; i < 4; ++i) {
      if (i + cnt[i] != 4) return false
    }
    return true
  }

  putShips() {
    const cells = []
    for (let l of [4, 3, 3, 2, 2, 2, 1, 1, 1, 1]) {
      let flag = false
      while (true) {
        const shipCells: Cell[] = []
        if (Math.floor(Math.random() * 1000000) % 2) {
          const i = Math.floor(Math.random() * 1000000) % 10
          const j = Math.floor(Math.random() * 1000000) % (11 - l)
          for (let k = 0; k < l; ++k) {
            shipCells.push(this.cells[i][j + k])
          }
        } else {
          const i = Math.floor(Math.random() * 1000000) % (11 - l)
          const j = Math.floor(Math.random() * 1000000) % 10
          for (let k = 0; k < l; ++k) {
            shipCells.push(this.cells[i + k][j])
          }
        }
        let flag = true
        for (let cell1 of shipCells) {
          for (let cell2 of cells) {
            const dx = Math.abs(cell1.x - cell2.x)
            const dy = Math.abs(cell1.y - cell2.y)
            if (dx <= 1 && dy <= 1) flag = false
          }
        }
        if (flag) {
          this.ships.push(new Ship(shipCells))
          for (let cell of shipCells) {
            cell.putShip()
            cells.push(cell)
          }
          break
        }
      }
    }
  }

  destroy(cell: Cell) {
    for (let dx = -1; dx <= 1; ++dx) {
      for (let dy = -1; dy <= 1; ++dy) {
        const x = cell.x + dx
        const y = cell.y + dy
        if (x >= 0 && y >= 0 && x < 10 && y < 10) {
          if (!this.cells[x][y].shot) this.cells[x][y].shoot()
        }
      }
    }
  }

  destroyShip() {
    this.shipsLeft--
    if (this.shipsLeft === 0) {
      this.fieldComponent.endOfGame(this.player)
    }
  }

  destroyAllShips(){
    this.shipsLeft = 0
    while (this.ships.length > 0) this.ships.pop()
  }
}

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})

export class FieldComponent implements OnInit {

  myField: Field
  enemyField: Field
  mode: number = 0

  constructor() {
  }

  ngOnInit(): void {
    this.myField = new Field(true, this)
    this.enemyField = new Field(false, this)
  }

  startGame() {
    if (this.mode === 0) {
      this.mode = 1
      this.enemyField.putShips()
      document.getElementById("start").style.display = "none"
    } else {
      this.mode = 0
      this.myField = new Field(true, this)
      this.enemyField = new Field(false, this)
    }
  }

  onClick(){
    while (true) {
      var cells: Cell[] = []
      for (let i = 0; i < 10; ++i) {
        for (let cell of this.myField.cells[i]) cells.push(cell)
      }
      cells = cells.filter(cell => !cell.shot)
      const cell = cells[Math.floor(Math.random() * cells.length)]
      cell.shoot()
      if (!cell.containsShip) break
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async endOfGame(player: boolean) {
    await this.delay(10)
    if (!player)
      alert("Вы победили!")
    else
      alert("Вы проиграли!")
    this.mode = 2
    document.getElementById("start").style.display = "block"
    document.getElementById("start").innerText = "начать новую игру"
  }

}
