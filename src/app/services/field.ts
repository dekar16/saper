export class Field{
    row: number;
    id: number;
    isMine: boolean;
    neighbor: Array<Array<number>>;
    nearMines: number;
    revealed: boolean;
    flag: boolean;


    constructor(row: number,id:number, isMine: boolean, neighbor: Array<Array<number>>, nearMines: number, revealed: boolean = false, flag: boolean = false){
        this.row = row;
        this.id = id;
        this.isMine = isMine;
        this.neighbor = neighbor;
        this.nearMines = nearMines;
        this.revealed = revealed;
        this.flag = flag;
    }
}