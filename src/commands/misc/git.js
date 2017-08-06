/**
 * Created by Julian/Wolke on 07.11.2016.
 */
let Command = require('../../structures/command');

class Git extends Command {
    constructor({ t }) {
        super();
        this.cmd = 'git';
        this.cat = 'misc';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.aliases = ['sourcecode'];
    }

    run(msg) {
        msg.channel.createMessage('https://github.com/rem-bot-industries/rem-v2');
    }
}

module.exports = Git;