/**
 * Created by Julian/Wolke on 27.11.2016.
 */
let Manager = require('../../structures/manager');
let Clever = require('better-cleverbot-io');

let re = /<@[0-9].*>/g;
let cleverbotKey = remConfig.cleverbot_api_key;
let cleverbotUser = remConfig.cleverbot_api_user;

class CleverBotManager extends Manager {
    constructor() {
        super();
        this.cleverbots = {};
    }


    talk(msg) {
        if (this.cleverbots[msg.channel.guild.id]) {
            this.cleverbots[msg.channel.guild.id].talk(msg, (err, reply) => {
                if (err) {
                    console.error(err);
                    return msg.channel.createMessage(':x: An error with cleverbot occured!');
                }
                msg.channel.createMessage(':pencil: ' + reply);
            });
        } else {
            this.cleverbots[msg.channel.guild.id] = new CleverBot(cleverbotUser, cleverbotKey, `wolke_rem_discordbot_${msg.channel.guild.id}`);
            this.cleverbots[msg.channel.guild.id].createSession(msg.channel.guild.id, (err) => {
                if (err) {
                    console.error(err);
                    return msg.channel.createMessage(':x: An error with cleverbot occured!');
                }
                this.cleverbots[msg.channel.guild.id].talk(msg, (err, reply) => {
                    if (err) {
                        console.error(err);
                        return msg.channel.createMessage(':x: An error with cleverbot occured!');
                    }
                    msg.channel.createMessage(':pencil: ' + reply);
                });
            });

        }
    }
}

class CleverBot {
    constructor(cleverbotUser, cleverbotKey, nick) {
        this.clever = new Clever({ user: cleverbotUser, key: cleverbotKey, nick });
    }

    talk(msg, cb) {
        let msgClean = msg.content.replace(re, '');
        this.clever.setNick(`wolke_rem_discordbot_${msg.channel.guild.id}`);
        try {
            this.clever.askLegacy(msgClean, (err, res) => {
                if (err) return cb(err);
                cb(null, res);
            });
        } catch (e) {
            return cb(e);
        }
    }

    createSession(name, cb) {
        this.clever.setNick(`wolke_rem_discordbot_${name}`);
        try {
            this.clever.createLegacy((err, session) => { // eslint-disable-line no-unused-vars
                if (err) return cb(err);
                cb();
            });
        } catch (e) {
            return cb(e);
        }
    }
}

module.exports = { class: CleverBotManager, deps: [], async: false, shortcode: 'cm' };