const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

var utils = {
    isEmpty: function isEmpty(str) {
        return (!str || 0 === str.length);
    },
    makeid: function(length) {
        var text = "";
        for (var i = 0; i < length; i++)
          text += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
        return text;
      }

}

module.exports = utils;