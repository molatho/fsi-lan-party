var utils = {
  isEmpty: function (str) {
    return (!str || 0 === str.length);
  },
  isEmptyArr: function (arr) {
    if (!arr || arr.length == 0) return true;
    for (var i in arr) {
      if (utils.isEmpty(arr[i])) return true;
    }
    return false;
  }
}

module.exports = utils;