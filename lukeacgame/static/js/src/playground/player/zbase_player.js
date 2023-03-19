class Player extends AcGameObject {
    
    constructor (playground, x, y, radius, color, speed, is_me) {

        super();
        
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.x = x;
        this.vx = 0;
        this.y = y;
        this.vy = 0;

        this.damage_x = 0;
        this.damage_y = 0;
        this.damge_speed = 0;
        this.friction = 0.9;
        
        this.move_length = 0;

        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        
        this.current_skill = null;

        this.spent_time = 0;

    }

    start() {
        if (this.is_me){
            this.add_listening_events();
        } else {
            let to_x = Math.random() * this.playground.width;   // random return 0 to 1
            let to_y = Math.random() * this.playground.height;
            this.move_to(to_x, to_y);
        }

    }


    add_listening_events(){

        let outer = this;   // save this as outer

        this.playground.game_map.$canvas.on("contextmenu", function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e) {
            if (e.which === 3) {    // 3 is the right click, 1 is left click, 2 is mid click
                // access this class function via outer, otherwise
                outer.move_to(e.clientX, e.clientY);
            }else if (e.which === 1) {
                console.log("mouse click");
                if (outer.current_skill === "fireball") {
                    outer.attack_shoot_fireball(e.clientX, e.clientY);
                }
                outer.current_skill = null;
            }
        });

        $(window).keydown(function(e){
            if (e.which === 81) {   // q key pressed
                outer.current_skill = "fireball";
                return false;
            }
        });
    }

    attack_shoot_fireball(to_x, to_y) {
        let x = this.x;
        let y = this.y;
        let radius = this.playground.height * 0.01;
        let angle = Math.atan2(to_y - y, to_x - x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let color = "orange";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1;
        //let damage = this.playground.height * 0.01;

        new FireBall(this.playground, this, x, y, radius, vx, vy, color, speed, move_length, this.playground.height * 0.01);

    }

    is_attacked(angle, damage) {

        for (let i = 0; i < 10 + Math.random() * 20; i ++) { // between 10 - 15
            let x = this.x;
            let y = this.y;
            let radius = this.radius * Math.random() * 0.2;
            let angle = Math.PI * 2 * Math.random();    // directions should be random
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed = this.speed * 10;
            let move_length = this.radius * Math.random() * 5;
            new Particle(this.playground, x, y, radius, vx, vy, color, speed, move_length);
        }

        
        //console.log("player is attacked");
        this.radius -= damage;
        //console.log("player radius", this.radius);
        //console.log("damage", damage);
        if (this.radius < 10) {
            //console.log("des");
            this.destroy();
            return false;
        }
        this.damge_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage * 50;

        // release particles:
        

    }


    move_to(to_x, to_y){
        
        this.move_length = this.get_dist(this.x, this.y, to_x, to_y);
        let angle = Math.atan2(to_y - this.y, to_x - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);

    }

    get_dist(x1, y1, x2, y2) {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }


    update() {
        this.spent_time += this.time_delta / 1000;

        if (Math.random() < 1 / 300.0 && this.spent_time > 5 && !this.is_me) {
            // attack random players:
            // let player_0 = this.playground.players[math.random() * this.playground.players.length]
            
            // attack player:
            let player_0 = this.playground.players[0];
            //let x = player_0.x;
            //let y = player_0.y;

            // add pre-calculate location:
            let x = player_0.x + player_0.speed * this.vx * this.time_delta / 1000 * 0.5;
            let y = player_0.y + player_0.speed * this.vy * this.time_delta / 1000 * 0.5;

            this.attack_shoot_fireball(x, y);

        }


        if (this.damage_speed > this.eps * 100) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.time_delta / 1000;
            this.y += this.damage_y * this.damage_speed * this.time_delta / 1000;
            this.damage_speed *= this.friction;
            console.log("damage move x and y", this.x, this.y, this.damage_speed);
        } else {

            if (this.move_length < this.eps){
                this.move_length = 0;
                this.vx = 0;
                this.vy = 0;
                if (!this.is_me) {
                    let to_x = Math.random() * this.playground.width;
                    let to_y = Math.random() * this.playground.height;
                    this.move_to(to_x, to_y);
                }
            }else {
                let moved = Math.min(this.move_length, this.speed * this.time_delta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }
        this.render();
    }

    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i ++) {
            if (this.playground.players[i] === this) {
                    this.playground.players.splice(i, 1);
            }
        }
    }

}
