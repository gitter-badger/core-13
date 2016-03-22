

class CMD {
    constructor(options = {
        respond: (text) => console.warn('No respond function has been set.'),
        storage: (cmdObj) => console.warn('No storage function has been set.'),
        update: (cmdObj) => console.warn('No update function has been set.')
    }) {
        this.money = 0;
        this.increment = 1;
        this.autoIncrement = 0;
        this.historyBufferEnabled = true;
        this.historyBuffer = [];
        this.historyBufferCurrentIdx = -1;
        this.historyLastDirection = null;
        this.unit = "byte";
        this.dataShow = 0;
        this.data = 0;
        this.counter = 0;

        this.respondFunc = options.respond;
        this.storageFunc = options.storage;
        this.updateFunc = options.update;

        this._commands = {
            help: {
                func: (toHelp) => {
                    if (toHelp) {
                        let { desc, usage } = this._commands[toHelp];
                        desc = (typeof desc === "function" ? desc() : desc);
                        usage = (typeof usage === "function" ? usage() : usage);
                        this.respond(`${toHelp}:`, desc);
                        this.respond("To use:", `${toHelp},`, usage);
                    } else {
                        var availableCommands = [];
                        for (var cmdName of cmdNames) {
                            var cmd = this._commands[cmdName];
                            if (cmd.unlocked) {
                                availableCommands.push(cmdName);
                            }
                        }
                        // var cmdList = availableCommands.join("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                        var cmdList = availableCommands.join("\n\t");
                        this.respond("########################################");
                        this.respond('List of commands:');
                        this.respond(cmdList);
                        this.respond(" ");
                        this.respond("For specific command help type 'help [command]'");
                        this.respond("########################################");
                    }
                },
                desc: "Gives list of commands or specific instructions for commands.",
                usage: "help [command]",
                unlocked: true
            },

        };
    }

    gameLoop() {
        return setInterval(() => {
            this.counter++;
            if (this.counter % 10 === 0) {
                this.commands("save", false);
            }
        }, 1000);
    }

    command(str = "") {
        if (cmd !== "") {
            this.runCommand(str);
            if (this.historyBufferEnabled) {
                if (this.historyBuffer[0] !== str) {
                    this.historyBuffer.unshift(str);
                }
                if (this.historyBuffer.length > 10) {
                    this.historyBuffer.pop();
                }
            }
        }
    }

    runCommand(cmd) {
        if (cmd.indexOf(" ") !== -1 && cmd[cmd.indexOf(" ") + 1] === undefined) {
            this.respond("Command not found.");
            console.log('Command not found.');
        } else {
            var cmdWArgs = cmd.split(" ");
            if (this.commandList.indexOf(cmdWArgs[0]) === -1) {
                this.respond("Command not found.");
            } else {
                console.log(cmdWArgs);
                var cmdIndex = this.commandList.indexOf(cmdWArgs[0]);
                if (this.commandUnlocked[cmdIndex]) {
                    this.commands(...cmdWArgs);
                } else {
                    this.respond("Command locked. Use buyCommand to unlock new commands.");
                }
            }
        }
    }

    update() {
        this.updateFunc(this);
    }

    addData(amt) {
        this.data += amt;
        this.update();
    }

    addMoney(amt) {
        this.money += amt;
        this.update();
    }



    // commands(cmdName, ...params) {
    //     return {
    //         help: (toHelp) => {
    //             if (toHelp) {
    //                 switch (toHelp) {
    //                     case "help":
    //                         this.respond(toHelp+": Gives list of commands or specific instructions for commands.");
    //                         this.respond("To use: help, help [command]");
    //                 }
    //             }
    //         }
    //     }[cmdName](...params);
    // }
}
