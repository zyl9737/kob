import { AcGameObject } from "./AcGameObjects"; // 如果是export default，那么可以不用加花括号
import { Wall } from "./Wall";
export class GameMap extends AcGameObject {
    constructor(ctx, parent) {
        super();
        this.ctx = ctx; // 画布
        this.parent = parent; // 父元素
        this.L = 0; // 单位距离

        this.rows = 13; // 行数,方便调试
        this.cols = 13; // 列数

        this.inner_walls_count = 20; // 内部墙的数量
        this.walls = []; // 墙
    }

    check_connectivity(g, sx, sy, tx, ty) {
        if (sx === tx && sy === ty) return true;
        g[sx][sy] = true;
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        for (let i = 0; i < 4; i++) {
            let x = sx + dx[i], y = sy + dy[i];
            if (!g[x][y] && this.check_connectivity(g, x, y, tx, ty)) return true;
        }
        return false;
    }
    create_walls() {
        const g = [];
        for (let r = 0; r < this.rows; r ++ ) {
            g[r] = [];
            for (let c = 0; c < this.cols; c ++ ) {
                g[r][c] = false;
            }
        }
        
        // 给四周加上墙
        for (let r = 0; r < this.rows; r ++ ) {
            g[r][0] = true;
            g[r][this.cols - 1] = true;
        }
        for (let c = 0; c < this.cols; c ++ ) {
            g[0][c] = true;
            g[this.rows - 1][c] = true;
        }
        // 创建随机墙
        for (let i = 0; i < this.inner_walls_count / 2; i ++ ) {
            for (let j = 0; j < 1000; j ++) {
                let r = parseInt(Math.random() * this.rows);
                let c = parseInt(Math.random() * this.cols);
                if (g[r][c] || g[c][r]) continue;
                if (r == this.rows - 2 && c == 1 || r == 1 && c == this.cols - 2) continue;

                g[r][c] = g[c][r] = true;
                break;
            }
        }
        const copy_g = JSON.parse(JSON.stringify(g));
        if(!this.check_connectivity(copy_g, this.rows - 2, 1, 1, this.cols - 2)) return false;

        for (let r = 0; r < this.rows; r ++ ) {
            for ( let c = 0; c < this.cols; c ++ ) {
                if (g[r][c]) {
                    this.walls.push(new Wall(r, c, this));
                }
            }
        }
        return true;
    }
    start() {
        for (let i = 0; i < 1000; i ++)
            if (this.create_walls())
                break;
    }
    update_size(){
        this.L = parseInt(Math.min(this.parent.clientWidth / this.cols, this.parent.clientHeight / this.rows));
        this.ctx.canvas.width = this.L * this.cols;
        this.ctx.canvas.height = this.L * this.rows;
    }
    update() {
        this.update_size();
        this.render();
    }
    render() { // 渲染
        const color_even = "#AAD751", color_odd = "#A2D149";
        for (let r = 0; r < this.rows; r ++ ) {
            for (let c = 0; c < this.cols; c ++ ) {
                const color = (r + c) % 2 === 0 ? color_even : color_odd;
                this.ctx.fillStyle = color;
                this.ctx.fillRect(c * this.L, r * this.L, this.L, this.L); // canvas的x轴是水平的，y轴是竖直的
            }
        }
    }
}