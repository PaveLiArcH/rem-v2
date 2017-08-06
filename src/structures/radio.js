/**
 * Created by Julian/Wolke on 06.01.2017.
 */
let Song = require('./song.js');
let websocket = require('ws');
let icy = require('icy');
let devnull = require('dev-null');

class Radio extends Song {
    constructor(options) {
        super(options);
        this.options = options;
        this.ws = null;
        this.icyRequest = null;
        this.ended = false;
        this.toJSON = function () {
            var result = {};
            for (var x in this) {
                if (x !== "icyRequest" && x !== 'ws') {
                    result[x] = this[x];
                }
            }
            return result;
        };
    }

    updateTitle(title) {
        this.title = title;
    }

    connect() {
        this.ended = false;
        if (this.options.wsUrl) {
            console.error('ws-ing');
            this.ws = new websocket(this.options.wsUrl);
            this.ws.on('open', () => {
                this.connectionAttempts = 1;
            });
            this.ws.on('message', (msg, flags) => {
                this.onMessage(msg, flags);
            });
            this.ws.on('error', (err) => this.onError(err));
            this.ws.on('close', (code, number) => this.onDisconnect(code, number));
        } else {
            console.error('icy-ing');
            var radio = this;

            // connect to the remote stream
            this.icyRequest = icy.get(this.options.streamUrl, function (res) {
                // log the HTTP response headers
                //console.error(res.headers);

                // log any "metadata" events that happen
                res.on('metadata', function (metadata) {
                    var parsed = icy.parse(metadata);
                    if (parsed.StreamTitle) {
                        console.error(parsed);
                        radio.updateTitle(`${parsed.StreamTitle} (${radio.options.radio})`);
                    }
                });

                res.pipe(devnull());
            });
        }
    }


    onError(err) {
        console.error(err);
        console.log(`ws error!`);
        // this.reconnect();
    }

    end() {
        this.ended = true;
        try {
            if (this.ws) {
                console.error(`trying to stop ws ${this.options.streamUrl}`);
                this.ws.close(4000, 'not needed anymore');
                console.error(`stopped ws ${this.options.streamUrl}`);
            } else {
                if (this.icyRequest) {
                    console.error(`trying to stop ${this.options.streamUrl}`);
                    this.icyRequest.abort();
                    console.error(`stopped ${this.options.streamUrl}`);
                }
            }
        } catch (e) { // eslint-disable-line empty-block

        }
        this.ws = null;
        this.icyRequest = null;
    }

    onDisconnect(code, number) {
        console.error(code);
        console.error(number);
        if (!this.ended) {
            this.connect();
        }
    }

    onMessage(msg, flags) { // eslint-disable-line no-unused-vars
        try {
            let actualMessage = JSON.parse(msg);
            if (actualMessage.song_name && actualMessage.artist_name) {
                this.updateTitle(`${actualMessage.artist_name} - ${actualMessage.song_name} (${this.options.radio})`);
            }
        } catch (e) {
            if (msg !== '') {
                console.error(e);
            }
        }
    }
}

module.exports = Radio;