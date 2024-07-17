import { AcGameObject } from "./AcGameObjects"; // 如果是export default，那么可以不用加花括号
import { Wall } from "./Wall";
import { Snake } from "./Snake";

export class GameMap extends AcGameObject {
    constructor(ctx, parent, store) {
        super();
        
        this.ctx = ctx; // 画布
        this.parent = parent; // 父元素
        this.L = 0; // 单位距离

        this.rows = 13; // 行数,方便调试
        this.cols = 14; // 列数

        this.inner_walls_count = 20; // 内部墙的数量
        this.walls = []; // 墙

        this.store = store;

        this.snakes = [
            new Snake({ id: 0, color: "#4876EC", r: this.rows - 2, c: 1 }, this),
            new Snake({ id: 1, color: "#F94848", r: 1, c: this.cols - 2 }, this),
        ];
    }

   
    create_walls_online() { // 通过后端生成的数据创建地图
        const g = this.store.state.pk.game_map;
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
              if (g[r][c]) {
                this.walls.push(new Wall(r, c, this));
              }
            }
        }
    }

    add_listening_events() {
        this.ctx.canvas.focus();

        this.ctx.canvas.addEventListener("keydown", e => {
            let d = -1;
            if (e.key === "ArrowUp") d = 0;
            else if (e.key === "ArrowRight") d = 1;
            else if (e.key === "ArrowDown") d = 2;
            else if (e.key === "ArrowLeft") d = 3;
            
            if (d >= 0) {
                this.store.state.pk.socket.send(JSON.stringify({ 
                    event: "move", 
                    direction: d, 
                }));
            }

        });
    }

    start() {
        // for (let i = 0; i < 1000; i ++)
        //     if (this.create_walls())
        //         break;
        this.create_walls_online();
        this.add_listening_events();
    }

    update_size(){
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }

    check_ready(){ // 判断两条蛇是否都准备好下一回合了
        for (const snake of this.snakes) {
            if (snake.status !== "idle") return false;
            if (snake.direction === -1) return false;
        }
        return true;
    }

    check_valid(cell) { // 检测目标位置是否合法，没有撞到两条蛇的身体和障碍物
        for (const wall of this.walls) {
            if (wall.r === cell.r && wall.c === cell.c) return false;
        }

        for (const snake of this.snakes) {
            let k = snake.cells.length;
            if (!snake.check_tail_increasing()) { // 当蛇尾会前进时，尾巴不判断
                k --;
            }
            for (let i = 0; i < k; i ++ ) {
                if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) 
                    return false;
            }
        }
        return true;
    }

    next_step() { // 让两条蛇进入下一回合
        for (const snake of this.snakes) {
            snake.next_step();
        }
    }


    update() {
        this.update_size();
        if (this.check_ready()) {
            this.next_step();
        }
        this.render();
    }

    render() { // 渲染
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                if ((r + c) % 2 == 0) {
                    this.ctx.fillStyle = color_even;
                } else {
                    this.ctx.fillStyle = color_odd;
                }
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L); // canvas的x轴是水平的，y轴是竖直的
            }
        }
    }
}