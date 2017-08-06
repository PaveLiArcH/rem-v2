/**
 * Created by Julian/Wolke on 07.11.2016.
 */
let Command = require('../../structures/command');

class Choose extends Command {
    constructor({ t }) {
        super();
        this.cmd = 'choose';
        this.cat = 'fun';
        this.needGuild = false;
        this.t = t;
        this.accessLevel = 0;
        this.help = {
            short: 'help.choose.short',
            usage: 'help.choose.usage',
            example: 'help.choose.example'
        };
    }

    run(msg) {
        let chooseString = msg.content.split(' ').splice(1).join(' ').trim();
        if (chooseString === '') return msg.channel.createMessage(this.t('choose.empty-choose', { lngs: msg.lang }));
        if (chooseString.endsWith(';')) {
            chooseString = chooseString.substring(0, chooseString.length - 1);
        }
        let msgSplit = chooseString.split(';');
        for (let i = 0; i < msgSplit.length; i++) {
            msgSplit[i] = msgSplit[i].trim();
        }
        let result = msgSplit[Math.floor(Math.random() * msgSplit.length)];
        msg.channel.createMessage(this.t('choose.success', { lngs: msg.lang, choice: result }));
    }
}

module.exports = Choose;