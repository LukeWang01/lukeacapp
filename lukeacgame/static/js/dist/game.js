class AcGameMenu{
    
    // root is the obj let ac_game = new AcGame("ac_game_1");
    constructor(root){
        this.root = root

        // $ sign for the html obj
        this.$menu = $(`
            <div class="ac-game-menu">

            </div>
        `);
        this.root.$ac_game.append(this.$menu);

    }
}class AcGame{

    constructor(id) {
        this.id = id;
        this.$ac_game = $('#' + id);
        this.menu = new AcGameMenu(this);
    }
}
