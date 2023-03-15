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

        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-menu-field-item-single')
        this.$multi = this.$menu.find('.ac-game-menu-field-item-multi')
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings')

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

class Player extends AcGameObject {
    
    constructor (playground, x, y, radius, color, speed, is_me) {

        super();
        
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;

        this.x = x;
        this.vx = 0;
        this.y = y;
        this.vy = 0;
        
        this.move_length = 0;

        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        
        this.current_skill = null;

    }

    start() {
        if (this.is_me){
            this.add_listening_events();
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
                    outer.attack_fireball(e.clientX, e.clientY);
                }
            }
        });

        $(window).keydown(function(e){
            if (e.which === 81) {   // q key pressed
                outer.current_skill = "fireball";
                return false;
            }

        });
    
    }

    attack_fireball(to_x, to_y) {
        console.log("fire ball", to_x, to_y);
    }

    move_to(to_x, to_y){
        
        this.move_length = this.get_dist(this.x, this.y, to_x, to_y);
        let angle = Math.atan2(to_y - this.y, to_x - this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);

    }

    get_dist(x1, x2, y1, y2){

        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);
    }



    update(){
        if (this.move_length < this.eps){

            this.move_length = 0;
            this.vx = this.vy = 0;
        }else{
            let moved = Math.min(this.move_length, this.speed * this.time_delta / 1000);
            
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;

        }
        
        this.render();

    }

    render() {
        
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();

    }


}
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
class AcGamePlayground {

    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground"></div>


`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height()
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this, this.width / 2, this.height / 2, this.height * 0.05, "white", this.height * 0.15, true));


        this.start();
    }

    start() {

    }

    show() {    // open playground
        this.$playground.show();
    }

    hide() {    // hide playground
        this.$playground.hide();
    }

}
export class AcGame{

    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
        this.playground = new AcGamePlayground(this);

        this.start();

    }

    start(){

    }

}
