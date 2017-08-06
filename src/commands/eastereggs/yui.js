/**
 * Created by Julian/Wolke on 07.11.2016.
 */
let Command = require('../../structures/command');

class Yui extends Command {
    constructor({ t }) {
        super();
        this.cmd = 'yui';
        this.cat = 'eastereggs';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.hidden = true;
    }

    run(msg) {
        msg.channel.createMessage('https://cdn.ram.moe/rkL9kPXNl.gif');
    }
}

module.exports = Yui;
