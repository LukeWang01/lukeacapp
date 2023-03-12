class AcGameMenu{
    
    // root is the obj let ac_game = new AcGame("ac_game_1");
    constructor(root){
        this.root = root

        // $ sign for the html obj
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-field">
                    <div class="ac-game-field-">

                    </div>
                </div>
            </div>
        `);
        this.root.$ac_game.append(this.$menu);

    }
}