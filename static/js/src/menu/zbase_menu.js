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
        });
    }

    show(){
        this.$menu.show();
    }

    hide(){
        this.$menu.hide();
    }

}
