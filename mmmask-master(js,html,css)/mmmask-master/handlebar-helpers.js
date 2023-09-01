module.exports = {
    // If two parameters equal return true else false
    ifeq: function (a, b, options) {
        if (a === b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    // If two parameters NOT equal return true else false
    ifneq: function (a, b, options) {
        if (a !== b) {
            return options.fn(this)
        }
        return options.inverse(this)
    },
    // If parameter 1 = true return 2nd parameter
    ifelse: function (a, b) {
        return a ? a : b
    }
}
