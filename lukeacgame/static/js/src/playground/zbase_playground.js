class AcGamePlayground {

    constructor(root) {
        this.root = root;
        this.$playground = $(`
<div class="ac-game-playground"></div>
`);

        this.hide();

        
        this.root.$ac_game.append(this.$playground);

        this.start();
    }

    start() {

    }

    resize() {
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        

    }


    show() {    // open playground
        this.$playground.show();
        
        //this.root.$ac_game.append(this.$playground);
        
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
