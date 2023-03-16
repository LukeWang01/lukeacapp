class FireBall extends AcGameObject {

    constructor(playground, player, x, y, radius, vx, vy, color, speed, move_length, damage){
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
        this.damage = damage;

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

        for (let i = 0; i < this.playground.players.length; i ++) {
            let player = this.playground.players[i];
            if (this.player !== player && this.is_collision(player)) {
                this.attack(player);
            }
        }
        this.render();
    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    is_collision(player) {
        let distance = this.get_dist(this.x, this.y, player.x, player.y)
        if (distance < this.radius + player.radius) {
            console.log("collision true");
            return true;
        }
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        console.log("attack player", angle, this.damage);
        this.destroy();

    }

    render() {
        
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);   // 0 to 2 pi is circle
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


}
