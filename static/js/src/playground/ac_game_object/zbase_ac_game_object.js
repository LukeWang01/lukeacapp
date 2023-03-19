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



