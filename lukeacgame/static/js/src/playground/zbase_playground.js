class AcGamePlayground {

    constructor(root) {
        this.root = root;
        this.$playground = $(`<div>Playground</div>`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
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