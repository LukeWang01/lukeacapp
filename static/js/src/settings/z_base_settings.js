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
            Log in error: username or password is incorrect!
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
            Log in error: username or password is incorrect!
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
    }

    add_listening_events_register() {
        let outer = this;
        this.$register_login.click(function() {
            outer.login();
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
