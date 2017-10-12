var path = require('path');
var constants = require(path.resolve(__dirname, './constants'));
var Connection = module.exports = {
    connection: null,
    init: function(secret, con) {
        if (secret == constants.SECRET) {
            Connection.connection = con;
        }
    },
    get: function() {
        return Connection.connection;
    }
}
