class AcGameMenu {

    // root is the obj let ac_game = new AcGame("ac_game_1");
    constructor(root) {
        this.root = root;

        // $ sign for the html obj
        this.$menu = $(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-field-item ac-game-field-item-single">
            Single Player
        </div>
        <br>
        <div class="ac-game-field-item ac-game-field-item-multi">
            Multi-Player
        </div>
        <br>
        <div class="ac-game-field-item ac-game-field-item-settings">
            Settings
        </div>
    </div>
</div>
`);
        // this.$menu.hide();
        this.root.$ac_game.append(this.$menu);
        this.$single = this.$menu.find('.ac-game-field-item-single')
        this.$multi = this.$menu.find('.ac-game-field-item-multi')
        this.$settings = this.$menu.find('.ac-game-field-item-settings')

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;
        this.$single.click(function(){
            outer.hide();
            outer.root.$playground.show("Single Mode");
        });
        this.$multi.click(function (){
            outer.hide();
            outer.root.$playground.show("Multi Mode");
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