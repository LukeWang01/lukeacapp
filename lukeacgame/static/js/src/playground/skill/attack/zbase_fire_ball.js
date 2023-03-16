class FireBall extends AcGameObject {

    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length){
        super();

        this.playground =playground;
        this.player = player;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.speed =speed;
        this.move_length = move_length;
        this.eps = 0.1;

        this.ctx = this.playground.game_map.ctx;

    }
    
    start() {


    }

    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        let moved = Math.min(this.move_length, this.speed * this.time_delta / 1000);

        this.x += moved * this.vx;
        this.y += moved * this.vy;
        this.move_length -= moved;

        this.render();
    }
    

    render() {
        
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);   // 0 to 2 pi is circle
        this.ctx.fillStyle = this.color;
        this.ctx.fill();


    }


}
