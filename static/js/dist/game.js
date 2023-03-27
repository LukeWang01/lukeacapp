class AcGameMenu {

    // root is the obj let ac_game = new AcGame("ac_game_1");
    constructor(root) {
        this.root = root;

        // $ sign for the html obj
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single">
            Single Player
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi">
            Multi-Player
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            Settings
        </div>
    </div>
</div>
`);
        this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-menu-field-item-single');
        this.$multi = this.$menu.find('.ac-game-menu-field-item-multi');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi.click(function (){
            console.log("click multi");
        });
        this.$settings.click(function (){
            console.log("click settings");
            outer.root.settings.logout_on_remote();
        });

        
    }

    show(){
        this.$menu.show();
    }

    hide(){
        this.$menu.hide();
    }

}
let AC_GAME_OBJECTS = [];

class AcGameObject {

    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;  // if run start()
        this.time_delta = 0;            // current frame time span to previous frame

    }

    start() {   // run once when create
        this.has_called_start = true;
    }

    update() {  // update every frame

    }

    on_destroy() {  // run once when deleting

    }

    destroy() { // delete the object

        this.on_destroy();

        for (let i = 0; i < AC_GAME_OBJECTS.length; i ++){
            if (AC_GAME_OBJECTS[i] === this){
                AC_GAME_OBJECTS.splice(i, 1);
                break;

            }
        }

    }

}

let last_timestamp;

let AC_GAME_ANIMATION = function (timestamp){

    for (let i = 0; i < AC_GAME_OBJECTS.length; i ++){
        let obj = AC_GAME_OBJECTS[i];
        if (!obj.has_called_start) {
            obj.start();
            obj.has_called_start = true;
        }else{
            obj.time_delta = timestamp - last_timestamp;
            obj.update();
        }

    }
    last_timestamp = timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}


// run the function 60 times per second
requestAnimationFrame(AC_GAME_ANIMATION);



class  GameMap extends AcGameObject{

    constructor(playground) {
        super();
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);
        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

    }

    start() {

    }

    update() {
        this.render();
    }

    render() {
        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.ctx.fillRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height);

    }

}

class Particle extends AcGameObject {
    
    constructor(playground, x, y, radius, vx, vy, color, speed, move_length) {
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.friction = 0.9;
        this.eps = 0.1;
        this.move_length = move_length;


    }

    start() {

    }

    update() {
        if (this.speed < this.eps * 10 || this.move_length < this.eps) {
            this.destroy();
            return false;
        }
        let moved = Math.min(this.move_length, this.speed * this.time_delta / 1000);

        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.speed *= this.friction;
        this.move_length -= moved;
        this.render();

    }
    
    render() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

}
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

        if (this.is_me) {
            this.img = new Image();
            this.img.src = this.playground.root.settings.photo;
        }

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
            // get the relative rec
            const rect = outer.ctx.canvas.getBoundingClientRect();

            if (e.which === 3) {    // 3 is the right click, 1 is left click, 2 is mid click
                // access this class function via outer, otherwise
                //outer.move_to(e.clientX, e.clientY);
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top)
            }else if (e.which === 1) {
                console.log("mouse click");
                if (outer.current_skill === "fireball") {
                    outer.attack_shoot_fireball(e.clientX - rect.left, e.clientY - rect.top);  // absolute coordinate to relative
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

        if(this.is_me) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();

        } else {

            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }
    }

    on_destroy() {
        for (let i = 0; i < this.playground.players.length; i ++) {
            if (this.playground.players[i] === this) {
                this.playground.players.splice(i, 1);
            }
        }
    }

}
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
    
    is_collision(obj) {
        let distance = this.get_dist(this.x, this.y, obj.x, obj.y)
        if (distance < this.radius + obj.radius) {
            //console.log("collision true");
            return true;
        }
        return false;
    }

    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(angle, this.damage);
        //console.log("attack player", angle, this.damage);
        this.destroy();

    }

    render() {
        
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);   // 0 to 2 pi is circle
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }


}
class AcGamePlayground {

    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground"></div>
`);

        this.hide();

        this.start();
    }

    start() {

    }

    show() {    // open playground
        this.$playground.show();
        
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));

        for (let i = 0; i < 5; i ++){
            this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, this.get_random_color(), this.height * 0.15, false));
        }

    }


    hide() {    // hide playground
        this.$playground.hide();
    }


    get_random_color() {
        let colors = ["blue", "red", "pink", "orange", "grey", "green"];
        return colors[Math.floor(Math.random() * 6)];
    }


}
class Settings {

    constructor(root) {
        this.root = root;
        
        // check the clinet plateform
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";

        this.username = "";
        this.photo = "";

        this.$settings = $(`
<div class="ac-game-settings">
    <div class="ac-game-settings-login">
        <div class="ac-game-settings-title">
            Log In
        </div>

        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="User Name" name="username">
            </div>
        </div>

        <div class="ac-game-settings-password">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="Password">
            </div>
        </div>

        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button> Confirm </button>
            </div>
        </div>

        <div class="ac-game-settings-error-message">
            
        </div>
        
        <br>
        
        <div class="ac-game-settings-option-register">
            Register
        </div>
        
        <br>

        <div class="ac-game-settings-acwing">
            <div class="ac-game-settings-acwing-loginwith">
                Log in With
            </div>
            <br>
            <img width="30" src="https://app5069.acapp.acwing.com.cn/static/image/settings/ac_logo.png">
        </div>

    </div>

    <div class="ac-game-settings-register">
        <div class="ac-game-settings-title">
            Register
        </div>

        <div class="ac-game-settings-username">
            <div class="ac-game-settings-item">
                <input type="text" placeholder="User Name" name="username">
            </div>
        </div>

        <div class="ac-game-settings-password ac-game-settings-password-first">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="Password">
            </div>
        </div>

        <div class="ac-game-settings-password ac-game-settings-password-second">
            <div class="ac-game-settings-item">
                <input type="password" placeholder="Reenter Password">
            </div>
        </div>

        <div class="ac-game-settings-submit">
            <div class="ac-game-settings-item">
                <button> Confirm </button>
            </div>
        </div>

        <div class="ac-game-settings-error-message">
            
        </div>
        
        <br>
        
        <div class="ac-game-settings-option-register">
            Log In
        </div>
        
        <br>

        <div class="ac-game-settings-acwing">
            <div class="ac-game-settings-acwing-loginwith">
                Log in With
            </div>
            <br>
            <img width="30" src="https://app5069.acapp.acwing.com.cn/static/image/settings/ac_logo.png">
        </div>

    </div>


</div>
            `);
        this.$login = this.$settings.find(".ac-game-settings-login");
        this.$login_username = this.$login.find(".ac-game-settings-username input");
        this.$login_password = this.$login.find(".ac-game-settings-password input");
        this.$login_submit = this.$login.find(".ac-game-settings-submit button");
        this.$login_error_message = this.$login.find(".ac-game-settings-error-message");
        this.$login_register = this.$login.find(".ac-game-settings-option-register");

        this.$login.hide();

        this.$register =this.$settings.find(".ac-game-settings-register");
        this.$register_username = this.$register.find(".ac-game-settings-username input");
        this.$register_password = this.$register.find(".ac-game-settings-password-first input");
        this.$register_password_confirm = this.$register.find(".ac-game-settings-password-second input");
        this.$register_submit = this.$register.find(".ac-game-settings-submit button");
        this.$register_error_message = this.$register.find(".ac-game-settings-error-message");
        this.$register_login = this.$register.find(".ac-game-settings-option-register");

        this.$register.hide();

        this.root.$ac_game.append(this.$settings);

        this.start();
    }

    start() {
        this.get_info();
        this.add_listening_events();
    }

    add_listening_events() {
        this.add_listening_events_login();
        this.add_listening_events_register();

    }

    add_listening_events_login() {
        let outer = this;

        this.$login_register.click(function() {
            outer.register();
        });
        
        this.$login_submit.click(function() {
            outer.login_on_remote();
        });

    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
        });

        this.$register_submit.click(function() {
            outer.register_on_remote();
        });

    }


    login_on_remote() {
        let username = this.$login_username.val();
        let password = this.$login_password.val();
        this.$login_error_message.empty();
        let outer = this;

        $.ajax({
            url: "https://app5069.acapp.acwing.com.cn/settings/login/",
            type: "GET",
            data: {
                username: username,
                password: password,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                } else {
                    outer.$login_error_message.html(resp.result);
                }
            }
        });
    }

    register_on_remote() {
        let outer = this;
        let username = this.$register_username.val();
        let password = this.$register_password.val();
        let password_confirm = this.$register_password_confirm.val();
        console.log(password, password_confirm);

        this.$register_error_message.empty();

        $.ajax({
            url: "https://app5069.acapp.acwing.com.cn/settings/register",
            type: "GET",
            data: {
                username: username,
                password: password,
                password_confirm: password_confirm,
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    console.log("page reload, register on remote");
                    location.reload();
                } else {
                    outer.$register_error_message.html(resp.result);
                }
            },
        });

    }

    logout_on_remote() {
        if (this.platform === "ACAPP") return false;
        console.log("logout remote");
        $.ajax({
            url: "https://app5069.acapp.acwing.com.cn/settings/logout/",
            type: "GET",
            data: {},
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    location.reload();
                }
            },
        });
    }


    login() {
        this.$register.hide();
        this.$login.show();
    }


    register() {
        this.$login.hide();
        this.$register.show();
    }


    get_info() {
        let outer = this;
        $.ajax({
            url:"https://app5069.acapp.acwing.com.cn/settings/getinfo/",
            type:"GET",
            data:{
                platform: outer.platform
            },
            success: function(resp) {
                console.log(resp);
                if (resp.result === "success") {
                    outer.username = resp.username;
                    outer.photo = resp.photo;
                    outer.hide();
                    outer.root.menu.show();
                } else {
                    // open lonin by default
                    outer.login();
					//outer.register();
                }
            }
        });

    }

    show() {
        this.$settings.show();
    }
    
    hide() {
        this.$settings.hide();
    }

}
export class AcGame{

    constructor(id, AcWingOS) {
        this.id = id;
        this.$ac_game = $('#' + id);

        this.settings = new Settings(this);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);
        this.AcWingOS = AcWingOS;

        this.start();

    }

    start(){

    }

}
