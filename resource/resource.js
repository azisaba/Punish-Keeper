/*
created by huda0209
Punish Keeper

resource.js
 
ran by node.js
2021-9-5
*/

/*
DON'T TOUCH!!
*/

module.exports =  {
    "setting.json" : {
        pass : "./config/setting.json",
        keys : {
            NAME : {
                canEmpty : false,
                replace : false,
                default : ""
            },
            MAIN_TOKEN : {
                canEmpty : false,
                replace : false,
                default : ""
            },
            DIV_TOKEN : {
                canEmpty : true,
                replace : false,
                default : ""
            },
            VERSION : {
                canEmpty : false,
                replace : false,
                default : ""
            },
            PREFIX : {
                canEmpty : false,
                replace : false,
                default : ""
            },
            COMMAND : {
                canEmpty : false,
                replace : false,
                default : ""
            }
        }
    },

    "guildData.json" : {
        pass : "./config/guildData.json",
        keys : {
            MuteRoles : {
                canEmpty : true,
                replace : false,
                default : ""
            },
            MuteUser : {
                canEmpty : true,
                replace : false,
                default : ""
            }
        }
    }
}
