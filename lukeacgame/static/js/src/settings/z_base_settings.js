class Settings {

    constructor(root) {
        this.root = root;
        
        // check the clinet plateform
        this.platform = "WEB";
        if (this.root.AcWingOS) this.platform = "ACAPP";

        this.username = "";
        this.photo = "";

        this.start();
    }

    start() {
         this.get_info();
    }

    login() {

    }


    register() {

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
                    outer.login();
                }
            }
        });

    }

    show() {

    }
    
    hide() {
    
    }

}
