/**
 * Created by Julian/Wolke on 07.11.2016.
 */
/**
 * The base command class
 *
 */
class Command {
    constructor() {
        this.aliases = [];
    }

    /**
     * The main function of the command
     * @param {Object} msg
     */
    run(msg) {       // eslint-disable-line no-unused-vars

    }
}

module.exports = Command;